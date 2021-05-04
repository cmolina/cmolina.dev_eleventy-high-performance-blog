---
title: "Migrating away from hey.com"
description: "How to leave a product you love when you can't ignore politics"
date: 2021-05-04
layout: layouts/post.njk
---

I really like the Hey email client. I am a customer since July 2020 and after onboarding, I've experienced less time managing my emails and more time doing things I love.

I will not expand in this post why I can't trust Basecamp anymore (the company that builds Hey) as it has already been said multiple times by so many people.

What I will do is to explain how I stopped using Hey, and what is my new email configuration (which is mimicking Hey to a certain extent). Let's get started.


## High level overview
I chose [Protonmail](https://protonmail.com/) as my email provider, together with a single rule filter, 3 custom folders, and the built-in contacts and mark as spam features.

I am also using a custom domain that I already own. Protonmail paid accounts support this feature; my legacy email is cmolina@hey.com; the new one is hi@cmolina.dev. One less character ❤️

The new Inbox looks like this:
![A screenshot of the Protonmail web client](/img/2021/05/protonmail-screenshot.png)

Did you notice the Paper trail, Screening and The Feed folders?

Still interested? Let's jump to the details.

### Sign up for a Protonmail account
I was looking for an email provider which:
- I could mimic Hey screening
- I could believe in their mission and I wouldn't have to run away from
- I could keep my email in the case of the provider becoming evil

Protonmail is an open source product, with a focus on privacy and to protect civil liberties online. It is free to use, but you can buy the [Plus plan, currently €48.00 a year](https://protonmail.com/pricing) to follow this tutorial as "contact groups" is a paid feature. Paid accounts can also unlock **custom domains** so you can move your email across providers.

First [I had to create](https://protonmail.com/signup) a protonmail.com account. The process is super straightforward, and you can create a free account and upgrade when needed.

After I had my new account created, I proceeded to replicate the screening experience.

### Replicating the Screening
Let's configure Protonmail by following 3 steps.

1. Go to [Folder/Labels link](https://mail.protonmail.com/labels) and create 3 folders: "Screening", "Paper trail", and "The Feed".

    I decided to on purpose not creating an "Imbox" folder and use the existing "Inbox" feature (finally I am not reading that typo anymore!).

1. Go to [Contacts](https://mail.protonmail.com/contacts) and create 3 contact groups: "InboxGroup", "TheFeedGroup", and "PaperTrailGroup".

    The idea here is every time you get an email from an unknown sender, you can accept new messages by adding the sender to one of those contact groups; and to screen off you use the "Mark as spam" feature.

1. Go to [Settings > Filters](https://mail.protonmail.com/filters) and click "Add Sieve filter".

    Create a new Sieve filter named "Mimic the Screening" with the following script:

    ``` c
    require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "extlists", "fileinto", "imap4flags"];

    # Generated: Do not run this script on spam messages
    if allof (environment :matches "vnd.proton.spam-threshold" "*", 
    spamtest :value "ge" :comparator "i;ascii-numeric" "${1}")
    {
        return;
    }

    # Ignore messages sent by myself: they will be stored in `Sent`
    if header :list "from" ":addrbook:myself"
    {
        return;
    }

    # Mimicking the Screening
    if header :list "from" ":addrbook:personal?label=InboxGroup"
    {
        fileinto "Inbox";
    }
    elsif header :list "from" ":addrbook:personal?label=TheFeedGroup"
    {
        addflag "\\Seen";
        fileinto "The feed";
    }
    elsif header :list "from" ":addrbook:personal?label=PaperTrailGroup"
    {
        fileinto "Paper trail";
    }
    else {
        fileinto "Screening";
    }
    ```

    The code is pretty much self-explanatory: known senders will be moved to the corresponding folder, otherwise it will go to Screening. I also decided to mark every email under "The Feed" as seen. To learn more about the syntax you can read the [Sieve filter guide](https://protonmail.com/support/knowledge-base/sieve-advanced-custom-filters/).

After this, the only pending step is to instruct Hey to forward the emails to the new email.

### Enabling email forwarding in Hey
In app.hey.com, go to "Me" > "Account Setup" > "Forwarding & SMTP Setup" > "Forward email out of HEY".

Write your new email address. You will receive an email in Protonmail to confirm the operation.

Since I was there, I also went to "Account Setup" > "Billing & Invoices" in order to cancel my subscription.


## Wrapping up
Once I completed the setup and have tried it for a few days, let's talk about the whole experience.

### The good
- Is it possible to enjoy your email without Basecamp? Yes, the Screening filter works as expected
- Is it possible to keep your new email address? Yes, and depending on the domain you choose it can be even shorter
- Will be less expensive? Yes, as of today it will be at least $41 cheaper, a hefty 40% discount

### The bad
- As of today, classifying new emails into Inbox/The Feed/Paper trail is cumbersome. It involves 3 manual steps: create a contact, add the contact to one of the contact groups, and go back to the email to manually move it to its corresponding folder. And this is "good experience" for the desktop web client; for the Android mobile app it is actually harder to achieve the same goal

For the web I am pretty confident someone can write an userscript to perform the classification with a single click. For the mobile… I am not so sure on how to proceed.

### The ugly
- Apparently [there is a limit of 100 contacts](https://protonmail.com/support/knowledge-base/contact-groups/) that a single contact group can handle

I imagine a workaround where I can keep creating contact groups while I update the Sieve filter, but I'd prefer not to.

I will contact Protonmail developers to understand what are my options and will keep this post up to date.
