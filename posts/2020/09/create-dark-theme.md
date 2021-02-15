---
title: "Create a dark theme"
description: "Learnings from adding support to dark mode to my website"
date: 2020-09-30
layout: layouts/post.njk
---

I've been interested in implementing a dark theme for my blog. I like websites that respect the user preference of using dark themes and was feeling sorry that my blog was always so bright.

Even when I use the [DarkReader extension](https://darkreader.org/) for those pages that don't include a dark mode, which makes a marvelous job by the way— some edge cases made my blog look odd and hard to read. That's why I decided to document the steps to share my learning.

I implemented a dark mode in 3 steps,
1. Define my colors in a single place
2. Redefine my colors for the dark theme
3. Test for accessibility


## 1. Define my colors in a single place
In the beginning, the colors were defined and redefined all over my CSS. Before implementing my dark theme, I collected the colors used in my _light_ theme, defined new CSS variables for the `:root` element, and used these variables instead of hardcoded values.

The reason for doing this change is that is going to make it easier later to identify which colors belong to the default/light theme, and which overrides are necessary for the dark theme.

At the beginning of your stylesheet, you can write something like this

``` css
/* default colors are defined here */
:root {
    --background: #fff;
    --color: #000;
}

/* and then can be referenced using `var(--custom-color)` */
body {
    background: var(--background);
    color: var(--color);
}
```


## 2. Redefine my colors for the dark theme
Now that all the colors are defined in a single place, add a media query for `prefers-color-scheme: dark` where you redefine the variables as needed.

``` css
/* default colors are defined here */
:root {
    --background: #fff;
    --color: #000;
}

/* dark theme overrides */
@media (prefers-color-scheme: dark) {
    :root {
        --background: #333;
        --color: #fff;
    }
}
```

To see the changes in your browser you need to [enable dark mode](https://www.theverge.com/2019/3/22/18270975/how-to-dark-mode-iphone-android-mac-windows-xbox-ps4-nintendo-switch) for the device you are working on.

As I don't have formal studies in design it was hard for me to choose all the colors from scratch; I ended up using the suggested colors given by DarkReader and then manually tweak them until I was happy with the results.

There are excellent guides on how to choose the colors for a dark theme. I recommend reading the [Material Design guide](https://material.io/design/color/dark-theme.html) and [Apple's Dark mode guide](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode). I learned from them that it was wise to set the background with gray instead of black, as very high contrast colors can negatively affect the readability; and that you can use increasingly lighter colors for the background to reflect elevated layers. Check them out.


## 3. Test for accessibility
Once you are happy with the light and dark colors you have chosen, now it is time to ensure they have enough contrast so all users can read your website.

The main suggestion here is to ensure the contrast between background and foreground color is visible enough, for both the light and the dark theme. The WCAG 2.0 level AA recommends a contrast of **4.5** : 1. I personally like to check the contrast by using the [WebAIM's contrast checker tool](https://webaim.org/resources/contrastchecker/) for individual colors or to scan the whole website with the [Accessibility Inspector included in Firefox DevTools](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector).


### Focus indicator
On my first dark theme implementation, I totally forgot about ensuring the focus indicators were actually visible. The one that is provided by browsers is not always visible enough (_I am talking about you, Firefox_), and it could be hard to detect depending on the theme of your website. You can define your custom focus indicator like this:

``` css
:focus {
    outline: thick solid var(--primary-color);  /* ensure the color works for both themes */
    outline-offset: .3rem;
}
```

### Conclusion
In this article I presented a technique to keep your website theme to respect the customer preference of either light or dark theme, being careful of choosing colors that all people can read. Did you notice the new dark theme from the blog? Are there any other things you should be thinking of?