---
title: "From JavaScript to Clojure(Script): Writing a webshop, again"
template: post.html
date: 2017-12-22
author: Jakub Holý
tags: nettbutikk, b2b, clojurescript
---

In which I explain why Norway's second largest mobile operator is experimenting with using Clojure and ClojureScript instead of Node and JavaScript for its new webshop and what the experience has been so far.

_Aside - about us: [Telia Norge](https://telia.no) is Norway's second largest mobile operator. Our team is responsible for serving its customers who want to buy subscriptions or hardware (phones, tablets, routers, and accessories) without attending a physical shop._

## Background

Three years ago, a small team of experienced developers with an agile and rebellious mindset has been hired for an experiment. The hypothesis was that such a team, sitting together with the business, could increase conversion rates and profitability of the company webshop by enabling rapid development and implementation of business ideas/hypotheses/experiments, tailoring the webshop for what customers needed and wanted. Replacing a webshop from scratch is no simple task but we proceeded one page at a time and the experiment concluded as a glaring success earlier than planned, turning over to a regular product development. A year and something later, we could finally pull the plug on the old webshop.

We have originally picked JavaScript and React for the frontend and Node.js for the backend, and we have never regretted the choice. Though two of us three had minimal previous experience with these technologies and language, we managed to learn quickly.

Fast forward to the present. We now have a full-featured, mature webshop that has been recently evaluated as [the third best customer-oriented webshop in Norway](http://digitalleaders.bearingpoint.com/media/1031/digital-leaders-in-norway-2018-web.pdf) (the first place being taken by the only alcohol-selling state company, Vinmonopolet). There is a never-ending stream of work to be done to improve the customer experience, [cleanup aged code](/blog/today-we-write-the-legacy-code-of-tomorrow/), and support new business and marketing ideas but we are quite happy with what we have.

## Why Clojure(Script)?

It has been now decided to give some love also to our long sidelined business customers and create a dedicated webshop tuned to their needs. The webshops for end-customers (B2C) and businesses and organizations (B2B) are likely to differ significantly so it makes sense to start the new webshop from scratch, while finding ways of reusing what makes sense to reuse (though beware the [economics of reuse](http://johannesbrodwall.com/2014/03/24/the-economics-of-reuse/)). When starting a project from scratch, why not also take a (careful) look at the technologies invovled?

Introducing a new technology is obviously a very serious decision, with a non-negligible cost. Yet the gain is sometimes worth it. Let's look at our evaluation of ES6 on Node / browser vs. Clojure and ClojureScript. We want to use the (almost) same language on frontend and backend as we have a positive experience with that from the current project. And we prefer Clojure on JVM over ClojureScript on Node because it is more mature and we prefer the JVM.

Let's look first at a brief overview of the pros and cons, ordered by importance:

Pros:

1. productivity
1. economy (and fun)
1. hiring
1. skillset
1. powerful language - immutable data and data manipulation library, macros, much more "good parts" than "bad parts", less code - fewer bugs
1. JVM

Cons:

1. learning curve (language, tools, best practices)
1. hiring
1. troubleshooting
1. setup from scratch
1. Dev Tools for React/Redux more mature

### Pros & cons in detail

#### Pros

**Productivity** was our absolute \#1 reason for selecting Clojure(Script). We have been sold on the language since we have seen Bruce Hauman's [Interactive programming Flappy Bird in ClojureScript](https://www.youtube.com/watch?v=KZjFVdU8VLI) years ago. Clojure(Script) gives you a REPL connected to your live application so that you can run code in its context, against its current state, and develop the application as it is running. You can continually evaluate snippets of code as you develop it, just one shortcut away from a feedback on the code you have just modified. I missed that terribly in Node, having to wait for babel to transpile the code and the application to restart and re-fetch the data it needed, providing feedback loop of 10-20 sec at minimum. (We were on our way to cutting that to 1 or few seconds but still it wouldn't be instant - and the application would still lose all local state at every code change.)

**Economy (and fun)** There are very few Clojure jobs in Oslo yet the Clojure meetups are packed by tens of passionate developers. By using Clojure we ensure that people will stay longer on the team because they have nowhere to go and because they will have fun working with it. Fun is an underrated aspect. A developer that deeply enjoys working with the language, technology, and ecosystem he or she uses at work is happy and thus more productive. He or she is more likely to put in an extra effort, and will probably brag about it, thus attracting more talent. And we get to keep the developer or two that are always looking for an opportunity where they could use Clojure at work.

**Hiring** capable developers is difficult. Being able to provide something few others have is thus a great advantage. Yes, there are far fewer Clojure(Script) then for instance Java developers, but given the disproportion of supply-demand in both cases, [it is comparatively much easier to hire the former](https://blog.iterate.no/2013/04/18/economies-of-scala/). As mentioned above, there are many more Clojure enthusiast than Clojure jobs in Oslo. And a developer to be hired doesn't need to know the language as long as he is attracted by it and willing to learn. Many people have managed transitioning from Ruby, Java, or JavaScript to Clojure(Script) quite easily (including a teammate). We can also assume that [people that learn a non-mainstream, Lisp language are more passionate and likely better developers](http://www.paulgraham.com/avg.html).

**Skillset** Our team is somewhat unique - half of it, and soon more than that, has experience with Clojure or ClojureScript (and desire to use it). That is more than we could say about JavaScript when we started using that.

**Powerful language - immutable data, data manipulation, macros, great design** are some of the often highlighted strengths of Clojure(Script). We already use seamless-immutable to decrease defect likelihood, however imperfect it is by definition, being added to a deeply mutable language, and we use Lodash extensively when processing data. Clojure gives us a much better alternatives to both. We can limit boilerplate through the all-powerful macros (that, hopefully, somebody else has written :-)). And, last but not least, Clojure is a language with a very well thought-through design, whose pieces generally fit very well together. It is not perfect, but few have got closer to perfection so far. That is contrary to JavaScript, whose design - despite some great ideas - is somewhat messy and that keeps growing somewhat organically. [Clojure codebases reportedly tend to be visibly smaller](https://medium.freecodecamp.org/a-real-world-comparison-of-front-end-frameworks-with-benchmarks-e1cb62fd526c) than those in Java or JavaScript, and code size is one of the key factors determining the amount of defects, so we can hope we will get a lower defect rate.

**JVM** Personally, I believe that JVM has superior monitoring and observability capabilities to Node, though I am obviously biased by me experience. So I prefer to have that on the server-side.

#### Cons

**Learning curve** Using a new language and framework requires time to learn. Some may find ClojureScript more difficult since, being a Lisp, it differs from the familiar C/Java/JavaScript. On the other hand, we all already know it - and are thus in a better position than when we started the B2C webshop. Most of our current developers had no or little JavaScript knowledge when they started on the project so we have some experience with learning on the job. Our junior developer who is new to Clojure has been doing very well so far.

**Hiring** is theoretically more difficult as there are far fewer Clojure(Script) programmers than JavaScript ones. On the other hand, as explained above, it might actually be easier.

**Troubleshooting** of runtime errors is more difficult. Clojure is infamous for its long stack traces and not all that useful error messages such as "java.lang.Long cannot be cast to clojure.lang.IFn" (especially compared to the awesome Elm). We have experienced a few but were lucky to solve them quickly. I guess the antidote is to really adopt REPL-driven development, where we incrementally build tiny, working pieces of code (that are so small that they are trivial to troubleshoot), an occasional use of spec and pre-/postconditions, and careful reading of the code we have written. One of the errors - re-frame complaining about being passed a function because we mistakenly invoked a two-argument version of it - could just as well happen in an equally dynamically typed JavaScript.

**Setup from scratch** - it will be necessary to set up all integration and plumbing (error reporting, logging, metrics, etc.) anew, while we already have these concerns solved in our current Node.js setup. That is unfortunate, but it is just a one-time, and hopefully relatively low cost. And there are typically quite mature and high-quality libraries.

**Dev Tools for React/Redux more mature** - especially the Redux Dev Tools are more mature at useful than re-frisk we use with re-frame. We are working further away from the browser's native language so using its built-in and quite evolved tools isn't always that helpful. We need cljs-devtools with custom formatters etc. to get what JavaScript developers get out of the box. On the other hand, they have nothing like the REPL so in total we are on the winning side :-)

#### Aside: What makes the JS -> Clj transition easier

Transitioning from JavaScript to Clojure(Script) is easier than from Java, especially in this team, for a couple of reasons:

- We rarely use a debugger for Node so we won't miss it. (Though e.g. Cursive's debugger is available and possibly as good as Node's?)
- JS is dynamically typed so that is nothing new to us.
- We already structure code in modules with pure function, using very little object-oriented programming.
- We are already used to destructuring from ES6.
- We already transpile (and webpack) our JavaScript so using ClojureScript that needs transpilation doesn't really add a new step.

## Our experiences so far

Plus:

- Hot reloading works AND preserves state
- You can bring the app into any desired state easily from the REPL without clicking around
- You can interact with and explore the live app in its current state from the REPL
- We get useful warnings from re-frame when we are missing a handler or a query
- See also our [Experience: Awesome productivity with ClojureScript's REPL](https://techblog.telia.no/blog/experience-awesome-productivity-with-clojurescript-s-repl/)

Minus:

- Redux DevTools are better; in re-frisk we could only see the current, not past states (NOTE: That has been fixed in the latest version of re-frisk)
- Errors in the browser are often more difficult to troubleshoot (despite working source maps ;)). Positive: it often names the failing component.

### Summary

Our team is in a unique position as we have multiple people - possibly 100% of the team - that have Clojure and/or ClojureScript experience. Therefore it makes sense to leverage the increased productivity of Clojure(Script). At the same time, the developers will be more happy, work harder, and less likely to leave. And we might have a unique opportunity to overcome our chronic hiring challenges by offering something few others do.

So far, the past few weeks, has our experience been very positive.

## Appendix: Our stack

We have selected Reagent (react wrapper) and re-frame (change+state handling, derived state). This combination is battle-tested, mature, and popular. Reagent is attractive because it requires zero boilerplate, you just write functions with Hiccup data to create components, so it is much easier to sell to developers than Om. Re-frame is also quite close to Redux and thus easier to understand for a team used to Redux. The main disadvantage is that there is no native server-side rendering (which might be important for us); people solve it by running the code on the JVM's JavaScript engine or by running it on Node.js. There are also rough edges around usage with DevCards due to the reliance on global state.

We have also considered Om Next, as it is nicely "decomplected," has nice features such as undo and optimistic changes, and supports server-side rendering natively. But it is more verbose (you need to define a class with a `render` function) and has steeper learning curve and is thus more difficult to "sell". (I would actually consider [Falcro](https://fulcrologic.github.io/fulcro/vsom-next.html) instead; it provides less freedom but is easier to set up and provides some features Om Next cannot.)

_(You might want to read other posts from [our rebellious product development series](/tags/nettbutikk))_
