---
title:  Naming Rails Tests Right
layout: post
desc:   The one where I argue that Rails names its tests wrong and propose minitest-rails as a possible solution.
reddit: true
hackernews: true
published: false
---
One of the things that had bothered me about Rails since the beginning has been how it names tests. Rails puts model tests in `test/unit`, controller tests in `test/functional`, and acceptance tests in `test/integration`. But the names of those locations isn't quite right.

The big three types of tests are [Unit](http://c2.com/cgi/wiki?UnitTest), [Integration](http://c2.com/cgi/wiki?IntegrationTest), and [Acceptance](http://c2.com/cgi/wiki?AcceptanceTest). Unit tests work on an isolated units of code, exercising a single method or object. Integration tests work on a subsystem within an app, exercising the dependencies within the subsystem. Acceptance tests (previously [functional tests](http://c2.com/cgi/wiki?FunctionalTest)) work on the application as a whole to determine if it performs according to the customer's acceptance criteria. I encourage you to follow those links if you want to read more about the differences between these three types of tests. 

Rails puts model tests under `test/unit`, but are they always unit tests? It is common to perform unit *and* integration tests on models, depending on how they are designed. In my experience, most Rails apps have a problem overloading the User object with too many responsibilities and dependencies. And those tests are by definition integration tests. The location of those tests tell me that they are unit tests, and I always feel dirty when writing integration tests.

This is more than a pedantic exercise. These names have meanings outside of the Rails community and this has caused much confusion over the years. My opinion is that this naming confusion has contributed to the adoption of Rpsec over Rails' default tests using Test::Unit, because Rspec names their tests according to what is being tested and not the type of tests being performed.

A Chance to Change
------------------

When I [started minitest-rails](http://blowmage.com/2012/07/10/announcing-minitest-rails) I saw an opportunity to correct this. So when using minitest-rails model tests to in `test/models`, controller tests go in `test/controllers`, helper tests go in `test/helpers`, mailer tests go in `test/mailers`, and acceptance tests go in `test/acceptance`. Like Rpsec the locations are based on what is being tested.

Now my model, helper, controller, and mailer tests can live where I consider is logical. I also find this layout more discoverable. For instance, I don't have to explain the layout when introducing Rails or testing to new developers.

All this said, minitest-rails is a young effort and it has much room to improve. Acceptance tests are in `test/acceptance`, but the generator is still named `integration_test`. I think we can to better. If you want to help jump on the [mailing list](https://groups.google.com/group/minitest-rails) and help make it better.
