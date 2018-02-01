---
template: post.html
title: "Pains with Terraform (perhaps use Sceptre next time?)"
description: >
    Experiences from implementing infrastructure-as-code with Terraform and why I would rather try Sceptre the next time
date: 2018-02-01
author: Jakub Holy
tags: DevOps
excerpt_separator: <!--more-->
---

We use Amazon Web Services (AWS) heavily and are in the process of migrating towards infrastructure-as-code, i.e. creating a textual description of the desired infrastructure in a <abbr title="Domain-Specific Language">DSL</abbr> and letting the tool create and update the infrastructure.

We are lucky enough to have some of the leading Terraform experts in our organisation so they lay out the path and we follow it. We are at an initial stage and everything is thus "work in progress" and far from perfect, therefore it is important to judge leniently. Yet I think I have gain enough experience trying to apply Terraform both now and in the past to speak about some of the (current?) limitations and disadvantages and to consider alternatives.

<!--more-->

It is important to say that, despite its limitations, Terraform is an awesome tool, and likely the best solution if you use multiple IaaS/cloud services, not just AWS.

## Limitations and cons of Terraform

The main problem I have experienced is limited support for logic in the configuration, which makes it hard to create flexible and reusable modules. I understand that sometimes there are good reasons to limit how much decision-making you can make (a well-known example are templating engines such as [handlebars](http://handlebarsjs.com/)) but here it seems to me that the pain overweights the gain. You can read more about this in the Gruntwork's post [Terraform tips & tricks: loops, if-statements, and gotchas](https://blog.gruntwork.io/terraform-tips-tricks-loops-if-statements-and-gotchas-f739bbae55f9) (10/2016).

Here are the main obstacles I have encountered (worth mentioning that some of them may be intrinsic problems that cannot be solved by any tool):

1. No direct support for logic and loops makes reusable and configurable modules harder. There are ugly hacks that allow some configurability, such as using `count` of 0 or 1 on a resource instead of (a desired) `create = true|false` (and then `"${element(..., 0)}"` to get back the single element instead of an array).
2. There is no way to skip a `module`, i.e. to simulate a `create` flag on it since the aforementioned `count` parameter is not available on modules. (Unless the module author was thoughtful enough to add a `create` flag of his own.)
3. Limited reusability: the recently added local variables (`locals`) can only refer to  attributes not whole resources so you have to to repeat the same expression for every attribute that you need. For example `codedeploy_bucket_arn = "${element(compact(concat(aws_s3_bucket.codedeploy_bucket.*.arn, data.aws_s3_bucket.codedeploy_bucket.*.arn)), 0)}"` and `codedeploy_bucket_name = "${element(compact(concat(aws_s3_bucket.codedeploy_bucket.*.id, data.aws_s3_bucket.codedeploy_bucket.*.arn)), 0)}"`. Ugly, right?
4. In some cases it is not possible to have configuration depending on a yet-to-be-created infrastructure, e.g. creating a security group that should allow access from another security group in the same config (see the [sec. group issue #16](https://github.com/terraform-aws-modules/terraform-aws-security-group/issues/16)).
5. Support for modules and reusability is limited. [Terragrunt](https://github.com/gruntwork-io/terragrunt) tries to mitigate some of these issues, allowing you to define e.g. remote state storage only once, yet it is still unnecessarily verbose. To me that means there is an underlying issue with the design.
6. Interpolation (i.e. using variables) is not allowed at some places, e.g. in a `.tfvars` file used extensively with Terragrunt modules, which is quite inconvenient.
7. Eventual consistency - Terraform does not always know to wait for a resource creation and full propagation and you might get weird errors and need to rerun it a few times. (Can perhaps be solved by specifying `depends_on` or adding some sleep time.)
8. Terragrunt's `apply-all` did not really work for me, failing randomly and forcing me to manually unlock state and execute individual modules. Perhaps it is a problem with how we use it but this should be simple enough to work out of the box. (However `plan-all` worked nicely so I used that to find out which modules I need to apply manually. `validate-all` works well too.)

The [Introducing Sceptre a new tool to drive CloudFormation](https://amp.reddit.com/r/aws/comments/5rfmoq/introducing_sceptre_a_new_tool_to_drive/) thread at Reddit has also some insightful comments, such as ocsi01's (who is certainly biased, as the lead developer of Sceptre) (2/2017):

> My issues with Terraform: https://github.com/hashicorp/terraform/issues/6045 Which is an example of it's reliability and maturity. (Along with the rest of the bugs and issues seen on github, some of them are really old.)

> Furthermore it's not supporting the description of a big, multi environment system following best practices like DRY. ( Mostly because of the lack of support for complex, structured properties like lists of maps, maps of maps, etc.) (They are developing it but the feature is not there yet, its not mature.)

> So my reasons to change:

> -Sceptre based on CloudFormation which is officially supported by AWS.

> -Sceptre using Troposphere, which gives you the potential to use python as a mature language. ( Compare to Terraform, where you cannot use custom code snippets, if it's not implemented/supported by TF.)

> -This makes easy to create and reuse highly generic templates.

> -Great support for using the exact same codebase for highly configured environments ( like dev, test, prod).

> -Supports change-sets, which was the only big selling point of Terraform a year ago.

## Some pros of Terraform (as compared to CloudFormation)

Terraform has quite a few advantages over raw CloudFormation (though Sceptre/Troposphere mitigate most if not all of these.) From Piotr Gospodarek's [CloudFormation vs Terraform](https://medium.com/@piotrgospodarek/cloudformation-vs-terraform-990318d6a7de) (10/2017):

- Can see the changes to be performed before execution
- Far less verbose than CF's YAML
- Far better validity checks than CF
- Integrate other providers (Fastly, Firebase,,,.)
- Can use `data` to fetch info from AWS/state/...

(You might also want to check out the Reddit thread [Who prefers CloudFormation to Terraform?](https://www.reddit.com/r/devops/comments/6avi5t/who_prefers_cloudformation_to_terraform/))

## Alternatives: Sceptre + Troposphere

I agree with Piotr above that CloudFormation templates are good for machines but bad for people. Yet they are a good base to built upon. The best alternative, provided that you use exclusively AWS, seems to me (after a non-exhaustive search) to be Sceptre + Troposphere + Awacs. ([stacker](https://github.com/remind101/stacker) is a - reportedly more heavy-weight - alternative to Sceptre). These provide essentially native access to declaring AWS infrastructure pieces with the full power of a general purpose programming language (Python) when you need it.

* [Sceptre](https://sceptre.cloudreach.com/latest/) - a tool to drive Cloudformation. Sceptre manages the creating, updating and deletion of stacks, and provides meta commands to allow users to get information about their stacks.
* [Troposphere](https://github.com/cloudtools/troposphere/) - Python DSL for creating CloudFormation descriptions (templates) - thus similar to a little more verbose Terraform but much more powerful
* [Awacs](https://github.com/cloudtools/awacs) - Python library for AWS Access Policy Language creation (similar to Terraform's [aws_iam_policy_document](https://www.terraform.io/docs/providers/aws/d/iam_policy_document.html))

What does Sceptre provide:

* "User Variables" (a.k.a. Sceptre User Data) in addition to CF's native Parameters; contrary to those, User Variables may change the templates and thus enable conditional creation of a resource or creating a configurable number of resources
* Connect Stacks (i.e. modules) together, chaining Outputs from some as Parameters to others
* Show what is going to be changed before changing is, just as Tf's `plan`, using CF's Change Sets
* Source Parameters from external files etc. or anywhere else with a custom resolver (i.e. similar to Tf Data Sources)
* Configure hooks to run when Sceptre actions occur
* Allow CF template creation using CF JSON/YAML, Jinja2 (YAML/JSON) templates, or Python (Troposphere & Co.)
* Easy support for working with role assumes or in multiple accounts

### Possible disadvantages of Spectre & Co.

A colleague of mine has kindly shared his experiences with tooling similar to Spectre, namely Ansible + Troposphere + Jinja2 + CF. Here are some of his comments regarding a steeper learning curve etc.:

> I would say CloudFormation is harder to learn then terraform, also its really easy for files to become massive in CloudFormation since there is no easy way to split them except for using  nested stacks which is tricky. We also made heavy use of Jinja2 for loops etc which made it harder to for beginners since they needed to learn both CF and Jinja2

> Troposphere is really nice and we used that for some stuff but since that generates a cloudformation you still need to understand what they generate so most of the times we skipped it and just went directly to CF/Jinja2

Terraform modules are reportedly more flexible than CF Stacks. For example they support versioning so you can lock down what version your code use and not be affected by its development.

## Conclusion

The next time when creating infrastructure-as-code, I would definitely love to try Sceptre & friends instead of Terraform. On the other hand, if I needed to support something else beside AWS, I would stick with Terraform. But everything keeps evolving and the future is bright :-)
