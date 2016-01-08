---
title: "Why we practice fronted-first design (instead of API-first)"
template: post.html
date: 2015-12-05
author: Jakub Holý
tags: nettbutikk, design
---
Alex has introduced us to the idea of front-end first design: You start by creating the front-end (browser) code. As you discover data or API calls that you need, you mock them. When the UI stabilizes, you use the mocked APIs and data to create the backend with exactly the functionality and exactly the data needed by the UI. The end result is a simpler application.

*A part of the [series Nettbutikk Team's Experiences and Experiments](/tags/nettbutikk)*

We are trying to adopt this as our approach because it is so sensible. Whenever we work with an API that wasn’t designed with the actual client needs in mind, we experience unnecessary friction and have to do various workarounds and adaptations so front-end-first absolutely makes sense to us. (E.g. when working with a REST API designed in line with REST principles – but not with our needs, resulting in a too chatty communication and more complex code.)

Of course there are same limitations. It is more challenging when you need to support different clients. And you need to take into account not just what the UI wants but also what is reasonably possible in the constraints of the existing system. You want to avoid a big gap between the two – we still remember the pain of integrating OOP and relational databases and the complexity of pitfalls of Object-Relational Mappers such as Hibernate, that try to bridge the two.

### Conclusion

Fronted-first design rocks (for us). Try it too and see whether you too get a simpler application code and shorter time to market.
