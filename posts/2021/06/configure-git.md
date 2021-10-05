---
title: "Configuring git for the first time"
description: "Do you have a new development laptop and you need to configure git? I got you covered"
date: 2021-06-14
layout: layouts/post.njk
---

Hey, do you have a new development laptop and do you need to configure git? I always need to run the same commands, but I do it so rarely that I always forget how to do it properly.

This article is a guide for my Future Me. _You are welcome, Future Carlos!_

## Set my name and email
This is the minimum you need to get started with git. Go ahead and execute it with your information:

``` bash
git config --global user.name "My Name"
git config --global user.email "me@example.com"
```

## Enable autocorrect typos
Did you know git can automatically correct your misspelled commands for you? By enabling this feature with:

``` bash
git config --global help.autocorrect 10 # time to delay, unit is 1/10th of a second
```

you will **receive a suggestion with a correction** that will automatically execute after 1 second, unless you hit <kbd>Ctrl</kbd> + <kbd>C</kbd> —for example running `git sttus` will print:

``` bash
WARNING: You called a Git command named 'sttus', which does not exist.
Continuing in 1.0 seconds, assuming that you meant 'status'.
```

## Use nano as the default editor
Someday I will learn how to use `vim` (without rebooting my laptop because I didn't know how to close it). In the meantime I will use `nano` instead:

``` bash
git config --global core.editor "nano"
```

## Use Visual Studio Code for squashing
So there is one disadvantage of using `nano` as the default editor: when running `git rebase -i` it can be pretty time-consuming to squash several commits, as I don't know how to replace multiple words yet.

I prefer to use `vscode` with the [GitLens extension](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens); it can be setup with:


``` bash
git config --global sequence.editor "code --wait"
```

which will open a convenient rebase interactive tab when needed, like the one of the next screenshot:

![Screenshot of GitLen's interactive rebase editor](/img/2021/06/interactive-rebase-editor.png)

## Change your default branch name
The current version of git shows a warning when initializing a new repository with `git init`, as they are moving away from `master`. Since I prefer to use `main`, I made the message disappear by running the following command:

``` bash
git config --global init.defaultBranch main
```

## Choose a default strategy for `git pull`
I am lazy, and when I want to ensure I have the latest changes from a remote repo I just type `git pull` —instead of `git pull --ff-only` command which will bring any commits from origin with a fast-forward. However, this is what git outputs by default:

``` text
Pulling without specifying how to reconcile divergent branches is
discouraged. You can squelch this message by running one of the following
commands sometime before your next pull:

git config pull.rebase false  # merge (the default strategy)
git config pull.rebase true   # rebase
git config pull.ff only       # fast-forward only
```

I use the third option, but feel free to pick your poison.

``` bash
git config --global pull.ff only
```

## Use a global .gitignore file (optional)
I only had to use this feature once: when I was using a particular tool that generates files to be ignored, but because I was the only coworker using the tool _I was not supposed to modify the committed `.gitignore` file_ 😒🤷🏽‍♂️🤨.

I am sure this technique may be useful in other situations as well; to use it, run:

``` bash
git config --global core.excludesfile "~/.gitignore"
```

And create `~/.gitignore` with your favorite editor.

## Conclusion
Hopefully you learned or rediscovered some cool things you can do with git 😄