---
title: "Optimizing GitHub Actions: 7 Strategies for Faster and Cost-Effective CI pipelines"
description: "Reduce build times by dropping unnecessary steps, leveraging concurrency, caching dependencies, and smart Dependabot tricks"
date: 2023-12-16
layout: layouts/post.njk
templateEngineOverride: md
---

From time to time, I need to change my focus from working on new features to ensure build times (and build costs) are reasonable.

In this guide I will share some ideas on how I've reduced the time and money spent in GitHub Actions, a CI managed service; these ideas may translate to other continuous integration services as well.

## Measure _before_ and _after_ each change
This step is crucial when trying to optimize a process, we need to determine whether a change was beneficial, had no discernable impact, or had a performance hit compared to the _status quo_.

Since GitHub Action runners are virtual machines over shared hosts, their performance change based on how busy the real machines are. For example I've seen identical jobs to have different complete times that vary up to 10%, depending on the time and day of the week when these jobs are run.

To rule out differences in performance due to these external factors:
- I compare the times between a recently published PR, with the times against a job without these changes that **run immediately after**
- I aim to keep only those PRs that make the build to run **at least 10% faster**

Now, let's explore the ideas that'd worked for my team in the past.


## 1. Drop unnecessary work
This may seem obvious but sometimes it is easy to forget: the faster way to complete a job is to remove all its unnecessary steps.

Take a look at a runner logs and see if there is any step that shouldn't be there. Things to look for:
- **deprecated services** you are not using anymore
- **duplicated commands**. Sometimes a first CLI command will call a second CLI command, so you can drop one of those calls from the `*.yml` definition
- **unnecessary commands**. I recently found out that in one of our apps I was _building the app_ before running its unit tests, an unnecessary step which was only making the build step slower.


## 2. Enable concurrency's cancel-in-progress
What is the point of running a job once a new commit is in the HEAD of a branch, and a new job has just started? We are going to be spending money in a job that will be ignored, as it was superseded by the latest job.

You can use the [`concurrency` property](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#concurrency) so every time anyone in your team pushes a new commit to a branch, _any existing running jobs related to that branch will be cancelled_. For example:

``` yml
concurrency:
  group: ${{ github.ref }}
  cancel-in-progress: ${{ github.ref_name != 'main' }}
```

The only exception here is for new commits added to the `main` branch, as I'd like to detect whether merging a PR breaks the build as soon as it happens.


## 3. Cache dependencies
Your program will probably use dependencies, and installing them each time from an empty cache can be time-consuming. And when you use CI, you will be installing the same dependencies over and over again; so there is an opportunity to keep a copy of your dependencies across jobs to reduce build times.

For this reason popular languages actions provide some _caching_ feature, to save and reuse these dependencies across runs.

Here there are a couple of examples of actions with caching enabled, for both ruby gems and npm packages:

``` yml
- uses: ruby/setup-ruby@v1
  with:
    bundler-cache: true

- uses: actions/setup-node@v3
  with:
    node-version-file: package.json
    cache: yarn
```

Sometimes there are dependencies which are not automatically stored by these actions. For that case you can leverage the `actions/cache` action, and manually cache and restore these dependencies yourself.

Here there is an example for caching Playwright's dependencies and browsers:

``` yml
# caching Playwright's dependencies and browsers; notice it has 3 steps
- name: Save the installed Playwright version
  run: echo "PLAYWRIGHT_VERSION=$(yarn list --pattern="@playwright/test" --json | jq '.data.trees[0].name' -r | sed 's/.*@//')" >> $GITHUB_ENV

- name: Restore Playwright dependencies and browsers from the cache
  uses: actions/cache@v3
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ env.PLAYWRIGHT_VERSION }}
    restore-keys: ${{ runner.os }}-playwright-

- name: Download Playwright dependencies and browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: yarn playwright install --with-deps chromium
```


## 4. Enable parallelism in your framework
The runners provided by GitHub Actions can run multiple threads; however there are times the frameworks may fail to detect how much parallelization can be done. The larger your project, the more tests you will have, and the more your project can take advantage of splitting the work across all the threads your runner supports, reducing your build times.

In the following example, I am setting the `PARALLEL_WORKERS` env var so `minitest` knows how many workers it can actually use:

``` yml
- name: Set parallel workers env variable
  run: echo "PARALLEL_WORKERS=$(nproc)" >> $GITHUB_ENV

- name: Run Ruby and Rails tests
  env:
    RAILS_ENV: test
  run: bundle exec rails test
```


## 5. Optimize Dependabot
Here I've found 2 tricks that have saved me money:

1. Enable [`groups`](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#groups), to reduce the number of open PRs for each day

For example, we can have a single PR that bumps the versions of all `bundler`-related dependencies at the same time, except the `rubocop` ones, which will be updated in a separate PR:

<div class="code-filename">.github/dependabot.yml</div>

``` yml
- package-ecosystem: "bundler"
  groups:
    development-dependencies:
      dependency-type: "development"
      exclude-patterns:
        - "rubocop*"
    rubocop:
      patterns:
        - "rubocop*"
```

Beware: the grouping will have a bigger impact when dependencies are updated once a week; for daily updates groups doesn't make a lot of sense.

2. Use `commit-message` for customizing the commit message **and its PR title**, so I can skip other services

I configured my dependabot PRs to be automatically merged once all jobs are passing. And since there is no human involved in these PRs, I want to avoid triggering deployments for manually testing the changes.

For example, I can avoid running [Render.com's preview environments](https://render.com/docs/preview-environments), which can become particularly expensive, by adding a particular prefix to the PR title:

<div class="code-filename">.github/dependabot.yml</div>

``` yml
- package-ecosystem: "bundler"
  commit-message:
    prefix: "[skip render]"
```

And with less preview enviroments, the smaller the Render.com's bill 😁


## 6. Use larger runners
The default runners provided by GitHub are potatoes connected to the internet. If you want to use a modern browser to run system tests you may run out of memory, the tests may run very slowly, or probably both.

The easiest solution is to have faster builds is to opt-in to better runners. You can use [the larger runners provided by GitHub](https://docs.github.com/en/actions/using-github-hosted-runners/about-larger-runners), which you first need to enable for your org, and then set the `run-on` property, for example:

``` yml
jobs:
  system-tests:
    runs-on: ubuntu-latest-16-cores
```

However, **using these hosts can become pretty expensive, very quickly**. I saw my GitHub bill to grow up to 3 times after a few months using larger runners, so be careful when using this setting and keep track of your monthly charges.

Instead, I would recommend to use larger runners from a third party provider. There are services like [Warp Build](https://www.warpbuild.com/) and [GitRunners](https://gitrunners.com/) that allows you to enjoy faster machines at a fraction of the cost when compared to GitHub.

Using larger runners will make your jobs be faster and more expensive. In this case I think it is cheaper than having developers waiting for their changes to go live.


## 7. Split the work with multiple runners
Let's say you have a `N` system tests. If you run them all in a single runner, and the last test fails, you will still need to wait for all `N` tests to complete.

What if we split the load, let's say between 5 hosts?

So now, if the last test fails, we will know it in about 1/5 of the original time, making it 80% faster!

We can leverage the `strategy` and `matrix` properties, for example we can split the following Playwright tests by setting the [shard option](https://playwright.dev/docs/test-sharding):

``` yml
system-tests:
  name: System tests
  strategy:
    fail-fast: false
    matrix:
      shard: [1, 2, 3, 4, 5]
  env:
    SHARD: ${{ matrix.shard }}/${{ strategy.job-total }} # for example: 1/5, 2/2, ..., 5/5
  steps:
    # other setup steps...

    - name: Run Playwright system tests
      run: yarn playwright test --project=chromium --shard=$SHARD
```

Unfortunately, as of today, rails doesn't support sharding in their tests. [I wrote a small rake task](https://gist.github.com/cmolina/a50f54848529a55965fb2d0eec64a1fe) that is equivalent to running rails' system tests in shards, like Playwright.

If you want some extra savings, you can toggle `fail-fast: true` so you cancel other jobs from the matrix at the first error; however I prefer to keep it off so I know all the system tests that needs to be fixed.


## Conclusion
Well, here are 7 ideas on how to have faster and cheaper CI with GitHub Actions. I will probably find some new ideas in the future, but for now I am enjoying the faster integrations.
