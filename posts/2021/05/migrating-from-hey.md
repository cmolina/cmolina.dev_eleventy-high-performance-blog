---
title: "Migrating away from hey.com"
description: "How to leave a product you love when you can't ignore politics"
date: 2021-05-04
layout: layouts/post.njk
---

I really like the Hey email client. I am a customer since July 2020 and after onboarding, I've experienced less time managing my emails and more time doing things I love.

I will not expand in this post why I can't trust Basecamp anymore (the company that builds Hey) as it has already been said [multiple times](https://marker.medium.com/basecamp-is-failing-its-own-future-d487bed43155) by [so](https://breen.tech/post/cringe-camp/) [many](https://internet-work.co/my-answer-to-the-ceo-of-basecamp-about-the-ban-on-political-talks/) [people](https://usefathom.com/podcast/basecamp).

What I will do is to explain how I stopped using Hey, and what is my new email configuration (which is mimicking Hey to a certain extent). Let's get started.


## High level overview
I chose [Protonmail](https://protonmail.com/) as my new email provider, together with a custom domain, a single rule filter for replicating the screening, 3 custom folders, and the built-in contacts and mark as spam features.

The new Inbox looks like this:
![A screenshot of the Protonmail web client](/img/2021/05/protonmail-screenshot.png)

Did you notice the "Paper trail", "Screening" and "The Feed" folders?

Still interested? Let's jump to the details.

## 1. Sign up for a Protonmail account
I was looking for an email provider which:
- I could mimic Hey screening
- I could believe in their mission and I wouldn't have to run away from
- I could keep my email in the case of the provider becoming evil

Protonmail is an open source product, with a focus on privacy and to protect civil liberties online. It is free to use, but this guide assumes you buy the [Plus plan, starting at €48.00 a year](https://protonmail.com/pricing), as I will be using paid features.

First [I had to create](https://protonmail.com/signup) a protonmail.com account. The process is super straightforward, and you can create a free account and upgrade later when needed.

After I had my new account created, I proceeded to get a cool email alias with a custom domain.

## 2. Get an email with a custom domain (optional)
One of the nice things of Hey was the possibility of choosing a short email address.

Since Protonmail supports custom domains for paid accounts —and I already have a domain for my blog— I decided to replicate this feature; I replaced my legacy email `cmolina@hey.com` with the new `hi@cmolina.dev`. One less character to write!

The instructions to [configure a custom domain are here](https://protonmail.com/support/knowledge-base/set-up-a-custom-domain/). You will need to set some DNS settings, which sounds hard but the ProtonMail documentation has instructions for the most common domain registrars.

Notice that the changes in DNS may take hours or even days to complete; meanwhile I recommend you to keep going with this guide.

## 2. Replicating the Screening
Let's configure Protonmail to emulate the Screening feature by following 3 steps.

1. Go to [Folder/Labels link](https://mail.protonmail.com/labels) and create 3 folders: "Screening", "Paper trail", and "The Feed".

    I decided to on purpose not to create an "Imbox" folder and use the existing "Inbox" (finally I am not reading that typo anymore!).

1. Go to [Contacts](https://mail.protonmail.com/contacts) and create 3 contact groups: "InboxGroup", "TheFeedGroup", and "PaperTrailGroup".

    The idea here is every time you get an email from an unknown sender, you can accept new messages by adding the sender to one of those contact groups; and to screen off you use the "Mark as spam" feature.

1. Go to [Settings > Filters](https://mail.protonmail.com/filters) and click "Add Sieve filter".

    Create a new Sieve filter named "Mimic the Screening" with the following script:

    ``` c
    require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "extlists", "fileinto", "imap4flags"];

    # Generated: Do not run this script on spam messages
    if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "${1}") {
        return;
    }

    # Ignore messages sent by myself: they will be stored in `Sent`
    if header :list "from" ":addrbook:myself" {
        return;
    }

    # Mimicking the Screening
    if header :list "from" ":addrbook:personal?label=InboxGroup" {
        fileinto "Inbox";
    }
    elsif header :list "from" ":addrbook:personal?label=TheFeedGroup" {
        addflag "\\Seen";
        fileinto "The feed";
    }
    elsif header :list "from" ":addrbook:personal?label=PaperTrailGroup" {
        fileinto "Paper trail";
    }
    else {
        fileinto "Screening";
    }
    ```

    The code is pretty much self-explanatory: known senders will be moved to the corresponding folder, otherwise it will go to Screening. I also decided to mark every email under "The Feed" as seen. To learn more about the syntax you can read the [Sieve filter guide](https://protonmail.com/support/knowledge-base/sieve-advanced-custom-filters/).

After this, the only pending step is to instruct Hey to forward the emails to the new email.

## 3. Enabling email forwarding in Hey
Eventually, I will have to change every account linked to my previous @hey.com account. But for now, I need to instruct Hey to forward every new message to my new address.

In app.hey.com, go to "Me" > "Account Setup" > "Forwarding & SMTP Setup" > "Forward email out of HEY".

Write your new email address. You will receive an email in Protonmail to confirm the operation.

## 4. Importing the emails from Hey
You probably want to be able to access all your emails from an unique account. The good news is that you can bring all your emails from Hey —and the search engine is way better!

To export your emails, in app.hey.com, go to "Me" > "Account Setup" > "Export your data" > "Export my emails". In a few minutes you will receive an email with a MBOX file.

To import the MBOX file to Protonmail, install their [Import Export app](https://protonmail.com/import-export). You can read the [detailed instructions here](https://protonmail.com/support/knowledge-base/how-to-import-emails-to-your-protonmail-account/).


## 5. Canceling your Hey subscription
Canceling a Hey account allows you to stop paying the service, but you still can read emails, export emails and contacts, and update the forwarding configuration (at least until Basecamp discontinues the service).

In app.hey.com, go to "Me" > "Account Setup" > "Billing & Invoices" in order to cancel your subscription.


## Wrapping up
I've been using this configuration for a month now and I can truly say I am having a great time with my emails.

An unexpected benefit of going to Protonmail is the ability to _archive_ emails: I don't need to keep my Inbox full of already read emails, but only of unread and _reply later_ messages.


### The good
- _Is it possible to enjoy your email without supporting Basecamp?_ Yes. The most valuable feature of Hey, the Screening, works as expected
- _Is it possible to keep your new email address across providers?_ Yes, I still receive emails from my legacy Hey account, and my new email address won't change if I ever decide to migrate from Protonmail
- _Will be less expensive?_ Yes, as of today it will be at least $41 cheaper, a hefty 40% discount

### The bad
- As of today, classifying new emails into Inbox/The Feed/Paper trail is somewhat cumbersome. It involves 4 manual steps: 
    1. create a contact,
    1. add the contact to one of the contact groups,
    1. go back to the email, and
    1. manually move the message to its corresponding folder.

### The ugly
- Apparently [there is a limit of 100 contacts](https://protonmail.com/support/knowledge-base/contact-groups/) that a single contact group can handle

I imagine a workaround where I can keep creating contact groups while I update the Sieve filter, but I'd prefer not to. Anyway, I am not close to reach the limit yet.

I [commented on an existing issue](https://github.com/ProtonMail/WebClient/issues/190) to understand what are my options but the developers haven't answered yet. I will keep this post up-to-date.
