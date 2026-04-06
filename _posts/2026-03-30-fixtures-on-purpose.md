---
layout: post
date: 2026-03-30 08:00:00
title: "Fixtures on Purpose: From Accident to Artifact"
desc: "The one where I realize nobody, including me, was designing their test data."
---

I've been writing Rails tests for a long time.
I've argued about assertion styles and test structure, mocking strategies and naming conventions, and whether `def test_` or `test "..."` is the One True Way.
(It's `def test_`. Obviously.)

But the thing that changed my testing the most wasn't any of that.
It was realizing that nobody, including me, was designing their test data.

## Every Test Builds Its Own Universe

Here's what most Rails tests look like:

```ruby
def test_creates_order
  user = User.create! name:  "Test User",
                      email: "test@example.com"
  store = Store.create! name:  "Test Store",
                        owner: user
  product = Product.create! store:       store,
                            title:       "Widget",
                            price_cents: 999

  creator = OrderCreator.new store: store
  result = creator.create member: user,
                          items:  [{ product:  product, quantity: 1 }]

  assert result.success?
end
```

Every test builds its own universe.
"Test User" buys a "Widget" from "Test Store."
The names are meaningless.
The data exists only to satisfy foreign keys.

Now multiply that by 500 tests.
You have 500 disposable universes, each with its own "Test User" and "Test Store" and "Widget." Each universe is born, used once, and thrown away.
The test suite as a whole teaches you nothing about your domain.
It's a pile of isolated assertions against throwaway data.

## Can't See the Test for the Setup

There's a deeper problem with per-test data creation.
It drowns the signal in noise.

When every test builds its own world from scratch, the reader has to parse six lines of setup to figure out which part actually matters.
Is the user's name significant? Does the store need to be called "Test Store" or would any name work? Is the price of 999 cents meaningful or arbitrary?

You can't tell without reading the assertions, then going back to the setup, then reading the assertions again.
(Sound fun? It's not.)

And it gets worse over time.
A test that used to need a user and a product now needs a user, a store, a membership, a product, a variant, an inventory level, a payment method, and a shipping configuration.
Each `create!` call is another line of noise between you and the thing you're actually testing.

So here's the question: do you design your test data, or do you just create it on the fly? Is everything important visible in the test, or hidden behind layers of setup?

## What if the Data Was Already There?

Rails has had fixtures since the beginning.
YAML files in `test/fixtures/`, loaded once at the start of the test run, wrapped in a transaction for each test.
Every test starts with the same known dataset.

Most teams abandoned them years ago, and honestly, I understand why.
The default experience was bad.
Fixture files full of anonymous records, no obvious organization, no story.
When your fixtures are `users.yml` with `:one` and `:two`, there's nothing there to love.

But that's a design problem, not a tool problem.

What if your fixtures told a coherent story about your domain? A small cast of named characters with realistic relationships and states that mirror production? What if opening `test/fixtures/customers.yml` taught you more about the business than reading a requirements doc?

What if every test stopped building its own disposable universe and just... inhabited a shared one?

I think we can do better.
I know we can, because I've done it.
This series is about treating your test data as a design artifact.

## The Series

This is the first post in a series about designing test data for Rails.
I'll update this list as new posts go up.

1. [The Combinatorial Trap](/2026/03/30/the-combinatorial-trap/).
    Why you can't create a fixture for every possible state, and why the math is worse than you think.
2. [Fixture Personas](/2026/04/01/fixture-personas/).
    How UX designers solved the archetype problem in 1999, and what it looks like applied to test data.
3. [Telling Stories With Data](/2026/04/03/telling-stories-with-data/).
    Designing a persona's fixtures end-to-end so the YAML files read like a setup chapter.
4. [Mining Production for Personas](/2026/04/06/mining-production-for-personas/).
    How to discover your personas in production data instead of making them up.
