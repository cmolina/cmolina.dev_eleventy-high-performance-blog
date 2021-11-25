---
title: "My terminal configuration"
description: "How much time do you spend in your terminal? You better be having a good time there. Learn how to customize it"
date: 2021-11-25
layout: layouts/post.njk
---

Software developers can spend long periods of time in the terminal: installing dependencies, reading logs, exploring the file system and running build commands to name a few examples. For this reason, I wrote a compilation of programs that have made my life easier, by either 
- making easier to install the packages for my development needs,
- providing a custom experience (like custom fonts and syntax highlight), or
- typing less (with autocomplete and informative prompt).

Most of these programs are one of the first things I install when using a new laptop, like the _terminal emulator_ and _package manager_; others, like the _ruby version manager_, stay pending installation a bit longer until I actually require them.

Currently, I am using a MacBook Air 2020 (M1 chip); however, most of these programs are either cross-platform, or they have an alternative in different OSs. Without further ado, here is my terminal configuration!


## Terminal emulator: iTerm2
![](/img/2021/11/iTerm2-screenshot.png)

I love its minimal UI, but at the same time it has lots of features and is very customizable. Particularly, I like to 
- split the screen (<kbd>Cmd</kbd> + <kbd>D</kbd>), 
- open new tabs (<kbd>Cmd</kbd> + <kbd>T</kbd>), and 
- set a profile for "Hotkey Window" (or always-available Guake-style terminal).

Get it from https://iterm2.com/.


## Package manager: Homebrew
![](/img/2021/11/brew-screenshot.png)

Package managers are so handy for code development. While I enjoyed them while using Linux, for some reason Mac and Windows don't come with one by default. And Homebrew is not perfect —it breaks from time to time, but it has a big community, and you can probably find a fix for your problem in Stack Overflow.

I've been curious on trying [pkgsrc](http://pkgsrc.joyent.com/) in the past, but I keep deprioritizing it, as it is not as popular as Homebrew and I don't feel like _living in the edge_ so much these days.

I list Homebrew at the top of my list since it is the tool I use for installing the majority of the rest of the programs presented in this blog post.

Get it from https://brew.sh/.


## Prompt: Starship
<video autoplay loop playsinline><source src="/img/2021/11/starship-demo.webm" type="video/webm"></video>

While Starship is supposed to be fully customizable and cross-OS compatible, what I really love about this prompt is that it just works out of the box, particularly `git` and `nodejs` integrations. And it is fast —nobody likes to wait for the new terminal to be ready.

I use it with [FiraCode Nerd Font](https://www.nerdfonts.com/), which provide icons for different languages, and it looks awesome. I use the [bracketed segment preset](https://starship.rs/presets/#bracketed-segments) as well.

Get it from Homebrew, and read the docs at https://starship.rs/.


## Replacements
Some tools within a UNIX-like system are _ancient_, and for compatibility or codebase reasons they can't improve and keep themselves modern. However, new programs do not have these limitations. Here I list a couple of alternatives to classic terminal programs.


### bat: a `cat` alternative
![](/img/2021/11/bat-screenshot.png)

What if you could read files with syntax highlight directly from your terminal? I've always used `cat` to read files, however it is hard to read code with no colors and no scroll. (Maybe `vim` users can already do this, but I still have no idea how to exit that program 🥲).

This is why I like `bat` so much. However, since I am already used to type `cat`, I made an _alias_ to use `bat` instead:

<div class="code-filename">~/.zshrc</div>

``` bash
alias cat="bat"
```

Get it from Homebrew, and read the docs at https://github.com/sharkdp/bat.


### exa: a `ls` alternative
![](/img/2021/11/exa-screenshot.png)

`exa` is way easier to read for me than `ls`. Period. I also added an alias to replace `ls`.

Get it from Homebrew, and read the docs at https://github.com/ogham/exa.


## Other utilities
I just I don't know how to classify these, so I will just put them together until a better order comes up.

### Fuzzy finder: fzf
{% asciinema "yrkIY8pZ655d4xQ2KI2q01esV", "fzf demo" %}

This utility is kind of hard to explain until you actually use it; in essence, it allows me to stop  hitting the "up" key for navigating my command history. I use it for autocompleting based on
- my previous commands, by pressing <kbd>Ctrl</kbd> + <kbd>R</kbd>
- existing files and directories, by typing `the/path/I/remember/` + `**` + <kbd>TAB</kbd>

Get it from Homebrew, and read the docs at https://github.com/junegunn/fzf.


### hyperfine: running benchmarks
{% asciinema "fwZEY9kp4VIcpGxsT8lw9jl6J", "hyperfine demo" %}

In my spare time (i.e. when I am waiting for `npm install && npm run build` to complete) I'd like to understand if I can make scripts to run faster: `hyperfine` helps me measure how fast a proposed change compares to the initial state.

(Fun fact: I once reduced the build time of a big NodeJS library in 30%, thanks `hyperfine`!).

Get it from Homebrew, and read the docs at https://github.com/sharkdp/hyperfine.


### Version managers
If you work with multiple projects, and they all use the same dependency but with different versions, version manager can become quite handy. The ones that I've used in the past are:
- `rvm`: ruby version manager https://rvm.io/rvm/install#installation
- `nvm`: node version manager https://github.com/nvm-sh/nvm#installing-and-updating


## Wrapping up
These are the tools that I keep installing over and over in my Mac laptops. Do you have your favorites ones as well?
