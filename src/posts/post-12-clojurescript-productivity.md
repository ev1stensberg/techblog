---
title: "Experience: Awesome productivity with ClojureScript's REPL"
template: post.html
date: 2017-12-18
author: Jakub Holý
tags: nettbutikk, b2b, clojurescript, clojure
---

What's the deal with ClojureScript? How can you justify picking such a "niche" language? I have recently experienced a "wow" session, demonstrating the productivity gains of ClojureScript and the interactive development it enables thanks to its REPL. I would like to share the experience with you. (If you have never heard about it before - it is a modern, very well designed Lisp that compiles to JavaScript for frontend and backend development. It comes with a REPL that makes it possible to reload code changes and run code in the context of your live application, developing it while it is running.)

_Aside - about us: [Telia Norge](https://telia.no) is Norway's second largest mobile operator. Our team has spent the past three years with Node.js, React, and (eventually) Redux creating a great webshop (for hardware and subscriptions) to replace an off-the-shelf one, with a great success. Now we set out to make also the lives of our business customers much better - and we picked Clojure and ClojureScript for that._

The short story. I was adding an Ajax call, massaging data into the format it needed, triggering it from the UI, and handling its result or failure - a classical plumbing work. Being able to run any code from my IDE against the live, running application, accessing and changing its state at will, testing tiny code changes - all that resulted in a super quick feedback loop, enabling me to convert quickly on to working code.

One troublesome part of the code was the function formatting the application state into the form that the backend `submit-order` required. From a backend error about missing data, I was able to quickly go to running the formatting function against the actual application state, easily comparing the state and formatting output, never leaving my IDE and beloved keyboard shortcuts. As needed, replicating local variables and running parts of the function to zoom in on a particular part, fixing mistakes, and re-running, until all worked.

_In JavaScript/Redux I would have used the Redux DevTools to explore the state, code hot reloading to update the formatting function, and the debugger to explore the output and find the bugs. I would have likely hardcoded the data so as not to loose them upon code reload and commented out the remote call itself. And I would click a button to trigger the functionality._

Another case in point was the display of an error message when the Ajax call failed. As usually, the code did not work at first. Using the REPL, bypassing the UI and browser, I was able to run the "subscription" that should have fetched the error message from the application state and supply it to the Reagent/React component, discovering the wrong data path, and go on to interactively develop the component (watching the magic of the browser updating at the command of my fingers).

_In JavaScript/Redux I could have used the React and Redux DevTools to look at the actual data. But I don't know of a good way to debug the `connect` function extracting the relevant part of the state. (Well, I could - but never did - try to use the debugger. Typically I would add a few `console.log` to it.) Interactively developing the component would work just as well, as long as I would do something not to loose the state upon reload._

Having direct access to the application state, I was able to effortlessly simulate all the possible cases (resubmission, call in progress, success and error response) and ensure they were correctly handled by the UI.

## Comparison with vanilla JavaScript and Redux

The React and Redux Dev Tools are very good. Hot code reloading works - when it works. The debugger is your good friend. I have been told that the application should have been able to preserve its state even as the code is hot reloaded, though that has not been my experience. (But that was perhaps because of local component state, not the global app state?) You can simulate the user by sending supported actions from the Redux Dev Tools.

I believe that some people might have managed to get close to the ClojureScript experience even with JavaScript and Redux. But I have never been able to match that. I have had pages that denied to be hot-reloaded despite my best efforts, state that was reset, and changes being ignored (because I mistakenly mutated data, oh the horror). The out of the box experience of ClojureScript is much better because it has been designed around immutability and explicit state management. And it has the magic of REPL that enables me to interact with the live, running application - the ultimate development tool.

## Conclusion

My experience is that the cycle of problem discovery - troubleshooting - fix is much shorter in Clojure and ClojureScript thanks to the REPL. And when you really adopt REPL-driven development, you actually have to deal with troubleshooting problems much less since you produce small, working code changes.

To be frank, there are also some downsides. You can read about the reasons for picking Clojure(Script) and the benefits and drawbacks we have considered and experienced in [From JavaScript to Clojure(Script): Writing a webshop, again](/blog/from-javascript-to-clojure-script-writing-a-webshop-again/).

_(You might want to read other posts from [our rebellious product development series](/tags/nettbutikk))_
