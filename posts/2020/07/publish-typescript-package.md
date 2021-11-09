---
title: "Publish a TypeScript package in npm"
description: "Write once, re-use everywhere, by publishing your code in npm!"
date: 2020-07-11
update: 2021-11-09
layout: layouts/post.njk
---

Would you like to reuse that fancy function from a previous project? I do. All the time. And what I always do is to copy and paste it, and call it a day. But… wouldn't it be nice to _import_ the function?

The advantages are:
- Don't Repeat Yourself (DRY)
- Fixes fixed in one place get propagated everywhere
- New features are just an `npm update` away

So, I'll proceed with 3 steps:
1. Create a TypeScript package
1. Write some code
1. Publish the module in NPM

Let's see exactly how to do this. FYI, I am following these instructions on the current NodeJS LTS, version 16.


## 1. Create a TypeScript package
I will be creating a new directory, to then set it up as an npm package and TypeScript project. All these changes will be tracked with git.

### 1.1 Initialize an npm package
Create a directory for your package and start a npm package in it
``` bash
mkdir <your-package-name> && cd <your-package-name>
npm init -y
```

Ensure your new `package.json` file contains at least this configuration (remember to update `name`, `description`, `author` and `license`):

<div class="code-filename">package.json</div>

``` json
{
    "name": "your-package-name",
    "version": "0.1.0",
    "description": "What does this package do?",
    "files": ["dist"],
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
        "prepublishOnly": "tsc",
        "test": "mocha test/**/*.spec.ts"
    },
    "author": "You <you@email.com> (https://you.com/)",
    "license": "MIT"
}
```

If you are curious on the meaning of these properties, checkout the [excellent documentation for package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) from npm.

This is also a good time to install your dependencies. There are 2 types:
- `devDependencies`, i.e. packages needed during development to build and test your library, and
- `dependencies`, i.e. packages that _need to be deployed alongside your library_.

For this example, I will require the following `devDependencies` for:
- transpiling TypeScript files for production and testing, `typescript` and `ts-node`;
- my favorite test framework and assertion library, `mocha` and `chai`;
- their types annotations (`@types`), for a better TypeScript experience.

``` bash
npm i -D \
    typescript ts-node \
    mocha chai \
    @types/chai @types/mocha
```


### 1.2 Initialize a TypeScript project
Let's initialize a TypeScript project by creating a new file, named `tsconfig.json`, that contains at least this configuration:

<div class="code-filename">tsconfig.json</div>

``` json
{
    "include": ["src/**/*"],
    "ts-node": {
        "transpileOnly": true   /* Skips type checking for faster unit testing */
    },
    "compilerOptions": {
        "declaration": true,    /* Generates corresponding '.d.ts' file. */
        "outDir": "./dist/",    /* Redirect output structure to the directory. */
    }
}
```


### 1.3 Configure mocha
Before running the tests, let's configure mocha so it understands TypeScript files. Create a new `.mocharc.jsonc` file with this configuration:

<div class="code-filename">.mocharc.jsonc</div>

``` json
{
    "require": "ts-node/register",
    "extension": "ts"
}
```

Without this file, trying to run the unit tests will fail with the following message:

``` bash
SyntaxError: Cannot use import statement outside a module
```


### 1.4 Track changes with git
First, initialize a git repository in the root of the package:
``` bash
git init
```

Then, create a new file named `.gitignore` to instruct git to ignore two directories, `node_modules` and `dist` for the dependencies and compiled files, respectively.

<div class="code-filename">.gitignore</div>

``` text
node_modules
dist
```

Make sure to keep track of these changes with git: `git add . && git commit -m "New npm package"`.


## 2. Write some code
At this point, we can start writing code and its tests. About time!

Create a new file, `src/index.ts`, and write some code. For example, export a function that sums two numbers:

<div class="code-filename">src/index.ts</div>

``` typescript
export function sum(a: number, b: number): number {
    return a + b;
}
```

For the tests, you can create a spec under the `test` directory, one `.spec.ts` file for each source code file.

<div class="code-filename">test/index.spec.ts</div>

``` typescript
import { expect } from 'chai';
import { sum } from '../src/index';

describe('sum', () => {
    it('should return the sum of 2 positive numbers', () => {
        expect(sum(1, 2)).to.equal(3);
    });
});
```

Now you are ready to run `npm test` and see your test passing. If everything went well make a new commit: `git add . && git commit -m "Initial code, unit test passing"`.


## 3. Publish a module in NPM
You will need to log in with your npm account (and create one if you don't have it yet), ensure everything looks good, and finally publishing your package.


### 3.1 Login to npm CLI
If you do not already have an npm account, go to https://www.npmjs.com/signup and fill the form.

In a terminal run `npm login` and fill with your username and password when requested.


### 3.2 Update your package name (optional, recommended)
Every time a package is published in npm it goes directly into the global scope. And because every package needs to have a unique name, it can be challenging to find an available name for your new package.

To avoid this problem I recommend publishing your package under your username scope (or an org scope if you belong to one). To do this, go back to your `package.json` and change the `name` property,

<div class="code-filename">package.json</div>

``` diff
{
-    "name": "<your-package-name>",
+    "name": "@<your-username>/<your-package-name>",
    // ...
}
```


### 3.3 Ensure you have correctly emitted types
Now that you have your code written and tested, it is time to publish it. To see if everything is in order,

1. run `npm link` to make your unpublished package available locally
1. in another directory, run `npm link @<your-username>/<your-package-name>`
1. create an `index.ts` file, and try to import the functions from your package

If everything went well, you will see the editor consuming the types you had specified 😁


### 3.4 Add a tag
People usually add tags to their git commits associated with a new version of a package so it can be easily referenced later: `git tag v0.1.0`


### 3.5 Publish it!
Run `npm publish --access public`. This `access` parameter indicates you will publish your package for everyone with access to npm.

If no errors were published in the terminal, you should be able to see your package listed under `https://www.npmjs.com/package/@<your-username>/<your-package-name>`.

For example, I followed the instructions from this post to publish a logging library mentioned in [a previous post](/posts/logging-functions/) and this is the URL of the package: https://www.npmjs.com/package/@cmolina/log


### 3.6 Publish an update
After publishing the first version of the package you may be wondering how to send an update. Well, you have to commit your changes, ensure every test is passing, compiling, bumping the version, adding a tag… it is pretty easy to forget a step.

Good news we have `np`, an npm package for publishing to npm.

After committing your changes, run `npx np` and answer the questions. The first time I run it I had to update `npm` and made me have a remote repository as well (I chose GitHub).

## Conclusion
You learned how to create a TypeScript library from scratch, how to manually publishing a new npm package, and to keep it up to date.

Happy publishing!
