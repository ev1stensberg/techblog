---
title: "Today we write the legacy code of tomorrow"
template: post.html
date: 2016-07-20
author: Jakub Holý
tags: nettbutikk, clean code
---
Our code is a mess. And that is the way it should be.

No matter how good code we write today, it will need to be fixed tomorrow. Our understanding of the business domain evolves, the business processes and needs themselves evolve, the technical tools (language, framework, libraries) and non-functional requirements evolve. Thus our code will inevitably become outdated.

*A part of the [series Nettbutikk Team's Experiences and Experiments](/tags/nettbutikk)*

For the purpose of this post, contrary to [other popular definitions](https://theholyjava.wordpress.com/2011/04/18/what-do-i-mean-by-a-legacy-code/), I define _legacy code_ as _code that we would have written differently today (and might thus need to update)_. The main point is that code is a like a living system: either it evolves - or it rots. You have to constantly come back to the old code and - much more importantly - old design and update it to keep up to date with the current needs and ways of doing things. Otherwise the code base becomes so much of a mess, that it will be really hard to change.

In an ideal world, we would always keep all the code and designs up to date. In a real world, that is not possible. Our resources are limited and we need to maintain a dynamic balance (swaying once more on the one then the other side) between the business needs to keep (future) changes quick and cheap (maintainability, adaptability) and keeping up to date with the market (implementing fixed-date changes, adding new functionality). If you need wood to survive the winter, you can't spend the whole autumn sharpening your axe - but without sharpening it, you won't be able to cut enough trees.

### Examples from our webshop

There are quite a few things that have become outdated and we are improving or plan to improve eventually:

* We have a hack featuring a "fake phone" to enable customers to buy only a SIM card because the original design assumed that the customer will always be buying a phone and we needed to add support for this quickly
* The data that we pass to the frontend is difficult to use (we need multiple lookups and data combination to show the UI)
* The logging and error reporting code became too complex. We need a new, simple API tailored to our needs.
* The same thing has different name in different contexts (e.g. "phone", "phoneNumber", "number").
* We use a dead React Flux library
* We have a mix of ES5 and ES6 code
* We have a mix of old and new style of React components
* We have a few ways of passing data to React components - using props, fetching them from the Store, ... - not one unified way (as our understanding of the best way to do this in our context has evolved a lot)
* Etc. etc. etc.

Fortunately there are also many things that we have already improved. As always, this is an ongoing process.

### Conclusion

No matter what you do, parts of your code will "rot" and get outdated while you are trying to keep up with the always changing environment. That is inevitable. You don't have the infinite resources necessary to prevent it - but you can (and must) use some time to keep the rot in check and to fight it back. Accept that it will happen, don't get too in love with your code since you will eventually need to change or replace it anyway, and try to maintain a good, ever-shifting balance between new development and updating the existing code and design.
