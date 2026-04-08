---
layout: post
title: "Fixtures on Purpose: Fixtures as Documentation"
desc: "The one where an unplanned side effect turns out to be the whole point."
---

*Part 6 of [Fixtures on Purpose](/2026/03/30/fixtures-on-purpose/#the-series), a series about designing test data for Rails.*

I want to tell you something that happened by accident.

I spent months designing fixture personas, naming characters, building coherent stories across YAML files.
I did it to make my tests faster and more readable.
That worked.
But something else happened that I didn't plan for.

The fixtures became the best documentation of the domain model we had.

## "Just Read the Fixtures"

A new developer joined the team.
They needed to understand how the commerce pipeline worked.
How orders flow from cart to payment to fulfillment.
How subscriptions relate to customers.
How warehouses and shipping zones connect.
We had docs.
The docs were fine.
They were also six months out of date, because docs always are.

So they read the fixtures instead.

They opened `test/fixtures/customers.yml` and found a story.
An owner with full access, a manager with limited permissions, a regular customer with order history, a VIP with wholesale pricing.
The roles and relationships were right there.

They opened `test/fixtures/orders.yml` and found two orders for Riverside (one completed, one pending) and one for Corner Shop.
They opened `test/fixtures/products.yml` and found a realistic catalog with variant structures that matched what they'd seen in production.

Within an hour, they had a mental model of the domain that was more accurate than the docs.
Because the fixtures are tested.
They run.
If they're wrong, the tests fail.
Docs don't have that property.

## Parts List vs. Photograph

This distinction matters.

A FactoryBot definition documents what's *required* to create a valid record.
The minimum viable object.
Which fields are mandatory, what the defaults are, which associations must exist:

```ruby
factory :order do
  store
  member
  sequence(:order_number) { |n| "ORD-#{n}" }
  status { "pending" }
  total_cents { 0 }
end
```

This tells you that an order needs a store, a member, and an order number.
Useful, but narrow.
It's the schema's perspective.
What's structurally required.

A fixture persona documents what's *real*.
What a complete, realistic order looks like in the context of an actual business:

```yaml
riverside_order_one:
  store: riverside
  member: riverside_customer
  order_number: "RH-10001"
  status: completed
  financial_status: paid
  fulfillment_status: fulfilled
  total_cents: 5998
  currency_code: USD
```

This tells you that a real order has a meaningful order number prefix, a currency, financial and fulfillment statuses that go together (paid + fulfilled = completed), and a total that looks like a real purchase.
It tells you what "normal" looks like.

Factory definitions are a parts list.
Fixture personas are a photograph.

## Oh Right, They're Also Fast

I should talk about performance, because I've been mostly ignoring it and it's one of the biggest reasons to use fixtures.

Fixtures are loaded once at the start of the test run via bulk `INSERT` statements.
Each test runs inside a database transaction that rolls back when the test finishes.
The 500th test pays the same data cost as the first: zero.
The data is already there.

With per-test creation, whether that's `Model.create!` or FactoryBot, every test pays its own insertion cost.
And that cost grows as your model graph deepens.
An order needs a store, a member, a membership type, a product, a variant, possibly an inventory level, a payment method, and a payment gateway.
That's 8+ inserts before you've written a single assertion.

Justin Searls has [written about this extensively](https://testdouble.com/insights/how-test-data-speeds-up-rails-tests).
Per-test data creation is the primary scaling bottleneck in large Rails test suites.
It's not the assertions that are slow.
It's the setup.

At 100 tests, the difference is a few seconds.
You probably don't notice.
At 1,000 tests, it's minutes.
At 5,000, it's the difference between a suite you run constantly and a suite you push to CI and hope for the best.

I like running my tests constantly.
So I use fixtures.

## From Accident to Artifact

I started this series with a provocation: [your test data is an accident](/2026/03/30/fixtures-on-purpose/).
Most teams don't design it.
They generate it on the fly, 500 disposable universes that teach you nothing about the domain.

I know we can do better.
I've done better.
And this matters enough to share.

The alternative I've been building toward is straightforward: treat your test data as a first-class design artifact.
Give it named archetypes ([personas](/2026/04/01/fixture-personas/)).
Design those archetypes from production data ([mining](/2026/04/06/mining-production-for-personas/)).
Set the defaults to the happy path and let tests mutate for edge cases ([mutations](/2026/04/03/telling-stories-with-data/)).
Use a threshold to decide when to extract new fixtures ([rule of four](/2026/04/07/the-rule-of-four/)).
Make the whole thing tell a coherent story ([storytelling](/2026/04/03/telling-stories-with-data/)).

When you do this, three things happen:

**Your tests get faster.** Dramatically.
The data is loaded once.
No per-test insertion cost.
Your suite stays fast as the app grows.

**Your tests get more readable.** `customers(:riverside_vip)` communicates more in two words than six lines of factory overrides.
The persona name carries the context.
The mutations carry the edge case.
The test body is just the action and the assertion.

**Your fixtures become documentation.** Not because you set out to document anything, but because coherent, production-informed, story-driven fixture data is inherently a map of the domain.
It's the best kind of documentation: the kind that breaks when it's wrong.

## Okay, Fine, Here's What I Really Think

I've been even-handed for six posts.
Let me be direct for a minute.

I think the Rails community's default to FactoryBot and RSpec has made our test suites worse on net.
Not because the tools are bad.
They're well-made.
But because they optimize for the wrong things.

FactoryBot optimizes for convenient record creation.
But your application already has a way to create records.
Your domain services, your controllers, your business logic.
That's the real definition of how things come into existence.
FactoryBot creates a second definition that looks similar but doesn't enforce the same rules.
Over time, the factory and the app drift apart.
The factory creates records your app never would.
It skips validations.
It ignores side effects.
The convenience becomes a liability.

RSpec optimizes for removing duplication in test code.
But the rules for evaluating test code should be different from the rules for evaluating application code.
In application code, duplication is a smell.
In test code, duplication is clarity.

When every test method contains its own setup, you can read one method and understand the whole scenario.
When the setup is scattered across `let` blocks, `before` hooks, shared contexts, and a `subject` defined 80 lines above the assertion, you're reassembling the test in your head every time you read it.

Both tools prioritize the writer's convenience over the reader's comprehension.
And tests are read far more often than they're written.

Fixtures and Minitest push in the other direction.
Fixtures say: the data is a known world, designed once, loaded for every test.
The test body contains only what's specific to this scenario.
Minitest says: a test is a method.
Everything it needs is in the method body.
No indirection, no scrolling, no reassembly.

Is that a trade-off? Sure.
You give up some flexibility.
You give up some cleverness.
But what you get back is tests that a stranger can read cold and understand immediately.
I think that's worth it.

## Go Try It

I'll tell you the real reason I wrote this series.
I've been having the same conversation about test data for years.
In pairing sessions, in code reviews, in Slack threads that go on too long.
I keep explaining the same ideas, drawing the same diagrams, making the same case.
At some point I realized I should just write it all down so I could hand someone a link instead of starting from scratch every time.

So here it is.
Everything I know about designing test fixtures, in one place.
I hope it's useful.
I hope you send it to someone who needs it.
That's the whole point.

I don't expect this series to convince everyone.
The fixtures-vs-factories debate has been going on longer than I've been doing Rails, and it'll continue after I stop.
But I hope I've made a case that the interesting question isn't which tool to use.
It's whether you're designing your test data at all.

If you take one thing from these posts, let it be this: your test data is either an accident or an artifact.
Accidents are slow and fragile.
Artifacts are fast and they teach you something.
The difference isn't the tool.
It's the intention.

Stop building disposable universes.
Design a world worth inhabiting.

Have fun.
