---
title: Upgrade or not to upgrade? The eternal dilemma
template: post.html
date: 2015-10-20
description: The pain of upgrading project dependencies vs. not upgrading
author: Jakub Holý
tags: nettbutikk, experience, development, learning
---

*A part of the [series Nettbutikk Team's Experiences and Experiments](/tags/nettbutikk)*

Handling dependencies is one of important challenges in any software project -
and especially in the fast-moving JavaScript world. Our
[Nettbutikk](nettbutikk.netcom.no) team just had a heated discussion about
handling upgrades of our dependencies that continuous our learning journey lined
with failures (or rather "experiments that generated new knowledge" :-)).

## Failed attempt one: Let tools do it

Originally we let `npm` automatically
do minor upgrades but that turned out to be problematic as even minor version
changes can introduce bugs and having potentially different (minor) versions on
our different machines and in production makes troubleshooting difficult.

Also, this only takes care about minor version changes. When we decided to do
the bigger updates, we had a lot of work and testing to do, making sure all the
new versions work together. Troubleshooting of upgrade problems was difficult
since many libraries were changed at once so pinpointing the source of a new
defect was nontrivial.

## Failed attempt two: Let a human do it

Next we decided to freeze the library versions completely and let the one of us
that had the operations role that week run `npm outdated`, update all
dependencies, and verify everything still worked.

Thus we ensured that we were almost always up-to-date and that we typically had
only a small job to do, with just a small potential for problems. However it
wasn't frictionless either. It might require one or few hours (for proper
testing and occasional troubleshooting) every week, a time we would have rather
used on creating new value. And sometimes the upgrade did introduce problems -
some spot and fixed immediately, but some taking more time to discover and fix.
Once it took two weeks to find out that something broke due to a `Reflux` upgrade -
and finding out that the cause was the upgrade wasn't easy.

## New experiment: Upgrade as-needed

Our reliable though-challenger Alex pointed out that upgrades give us typically
little value at a relatively high cost. So we have decided to try not upgrading
libraries unless we would have a good reason to do it (such as a known security
problem or a new functionality we want). It is obviously not optimal and the
upgrades might be big and painful but we will try it for a while and evaluate
how it works for us.

## Conclusion

Handling and upgrading dependencies is difficult and costly. It's important to
evaluate the cost-benefit ration and experiment to find the "least bad" approach and
balance for a particular team. Development is fun.
