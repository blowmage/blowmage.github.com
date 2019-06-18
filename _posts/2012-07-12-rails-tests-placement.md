---
title:  Where to Put Tests in Rails
layout: post
desc:   The one where I argue that Rails places its tests wrong and propose minitest-rails as a solution.
---
One of the things that bothers me when developing Rails apps is where tests are placed by default. Rails puts model tests in `test/unit`, controller tests in `test/functional`, and acceptance tests in `test/integration`. But the names of those locations doesn't always match what those tests do.

The three main types of tests we typically write in Rails apps are [Unit](http://c2.com/cgi/wiki?UnitTest), [Integration](http://c2.com/cgi/wiki?IntegrationTest), and [Acceptance](http://c2.com/cgi/wiki?AcceptanceTest). Unit tests work on an isolated units of code, exercising a single method or object. Integration tests work on a subsystem within an app, exercising the dependencies within the subsystem. Acceptance tests (previously known as [functional tests](http://c2.com/cgi/wiki?FunctionalTest)) work on the application as a whole to determine if it performs according to the customer's acceptance criteria. I encourage you to follow those links if you want to read more about the definitions and differences between these three types of tests.

Rails puts model tests under `test/unit`, but are they always unit tests? It is common to perform unit *and* integration tests on models, depending on what the model is responsible for and how it is designed. In my experience, many Rails apps have a problem overloading the User object with too many responsibilities and dependencies. And the tests for those dependencies are by definition integration tests. However, the location of those tests tell us that they are unit tests.

This is more than a pedantic exercise. These test names have meanings outside of the Rails community and this has caused much confusion over the years. My opinion is that this naming confusion has contributed to the adoption of Rspec over Rails' default tests using Test::Unit, because Rspec names their tests according to what is being tested and not the type of tests being performed.

Part of the reason I [started minitest-rails](https://blowmage.com/2012/07/10/announcing-minitest-rails) was to correct this. This is why minitest-rails places model tests in `test/models`, controller tests in `test/controllers`, helper tests in `test/helpers`, mailer tests in `test/mailers`, and acceptance tests in `test/acceptance`. Now my model, helper, controller, and mailer tests are located where I consider logical. I also find this layout more discoverable. For instance, I don't have to explain the layout when introducing Rails or testing to new developers.

All this said, minitest-rails is a young effort and it has much room to improve. Acceptance tests are in `test/acceptance`, but the generator is still named `integration_test`. I think we can to better. If you want to help, jump on the [mailing list](https://groups.google.com/group/minitest-rails) and help make it better.
