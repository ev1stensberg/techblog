---
title: Introducing the Series Nettbutikk Team's Experiences and Experiments
template: post.html
date: 2015-11-01
author: Jakub Holý
tags: nettbutikk, product development, lean
---

*A part of the [series Nettbutikk Team's Experiences and Experiments](/tech-blog/tags/nettbutikk)*

We are starting a new blog series tracking the experiences and (process)
experiments of the team behind [nettbutikk.netcom.no](https://nettbutikk.netcom.no).
This is the best product development process and team I have ever been to and
it has been called "extreme" for couple of reasons. We are quite excited about it
and would like to share our experiences, successes, and failures for the amusement
and inspiration of our readers.

When asked why we think this team and product development were so great, this
was my answer:

> Full stack & full control: frontend, backend, ops. Great people & ideally
> small team. Very pragmatic, minimalistic and evolutionary approach to the
> dev process. Working closely with the business and seeing the app actually
> matters to them and influences real people every day.

## What is the project about?

The project started as an experiment. It grew out of the pain with the old
huge and inflexible webshop rented from a third party. The business wanted
something that would fit their needs, that could evolve, enable them to experiment.
Something, where the time from an idea to production would be days or hours, not
months.

So they have decided to get a small team of highly skilled developers, sitting
and working together with the business, and write their own, better webshop.
The hypothesis was that even with expensive skilled Norwegian developers, it
would pay off thanks to more satisfied customers that would more easily find
what they wanted.

## Why is considered "extreme"?

There multiple things considered "extreme" about this team. We have released to
production, to real customers, only in a few weeks, including just a single
product page. We deploy whenever we want to, and do our own operations, using
the cloud instead of the enterprise infrastructure. Our development process is
minimalistic, we don't follow a methodology, we create (and re-create) our own,
using only a physical Kanban board instead of Jira. And we run on Node.js instead
of the standard JVM. We have ditched e-mail and started using Slack instead.

## A little of history

The project started in February 2015 as an experiment. The first release - a
single page for one variant of one phone - came after 7 weeks (though the
optimists hoped for 2). Then it steadily grew and a month ahead of the planned
experiment end it was deemed successful. By summer, the whole webshop with the
exception of checkout was in the new system, and it was better and more
performant then the old one. That enabled a large re-design for a summer campaign.
The business started with A/B experiments and there was a steady flow of new
features and improvements, with focus shifting gradually towards implementing
checkout directly in the new webshop. When the newest iPhone arrived, the system
handled the increased load formidably (contrary to some backend systems, sadly).

## Meet the team

The core team that started the journey consists of:

* Alex York, master of all things CSS and JS with a .NET background, love of TDD,
    and ultimate judge of code quality and understandability
* Jakob Lind, the get-things-done guy, an Emacs and functional programming enthusiast,
    always on lookout for better ways to do things
* Jakub Holý, the operations and data specialist and Clojre(Script) evangelist
* Ketil Jensen, our "agile coach," and a shield and liaison between us and the rest of the organization
* Magnus Indregard, our primary business representative

All of the developers are very capable, they all are very pragmatic and favour
the lean way. Yet they have different background and approaches. The similarities
give us a strong push towards minimalism and getting stuff out, while the
differences spark valuable discussions and lead to a much better process and code.
