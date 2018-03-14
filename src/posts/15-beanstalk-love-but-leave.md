---
template: post.html
title: "Why we love AWS Beanstalk but are leaving it anyway"
description: >
    Our experience with the numerous advantages of AWS Elastic Beanstalk and a few disadvantages.
date: 2018-02-01
author: Jakub Holy
tags: DevOps, AWS
excerpt_separator: <!--more-->
---

We have had our mission-critical webapp running on [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) for three years and have been extremely happy with it. However we have now outgrown it and move to a manually managed infrastructure and CodeDeploy.

AWS Beanstalk provides you with lot of bang for the buck and enables you to get up and running in no time:

* Simple, no-downtime deployment and automatic roll-back based on user-provided health-check (either one subset of nodes at a time or blue-green deployment)
* Autoscaling
* Managed updates - security fixes and other improvements installed automatically
* Built-in HTTP Proxy with caching in front of your application
* Monitoring dashboard with alerting and access to logs without the need for SSH
* A list of past versions & ability to roll-back
* Support for many runtimes (Java, Node.js, Docker to name just a few)

So if you need a solid, state-of-the-art infrastructure for a [web-scale](https://www.youtube.com/watch?v=b2F-DItXtZs) application and you don't have lot of time and/or skill to build one on AWS on your own, I absolutely recommend Beanstalk.

<!--more-->

We have of course also experienced some downsides - it took quite a while for Amazon to upgrade from Node 4 to 6 (though now it is far ahead of us), there is a lot going on during a deployment and it can sometimes fail mysteriously, and you are rather limited to what it provides. But the main reason that we are moving away from it is that we are implementing infrastructure-as-code and want to be able to describe our infrastructure in a textual configuration with history, checked into a version control system. Lot of beanstalk configuration is done through the AWS Console and thus it is impossible to see its evolution over time. (It is possible to configure something in a `.ebextensions/` directory of your application, but it requires quite some knowledge and may be at odds with changes in the Console.)
