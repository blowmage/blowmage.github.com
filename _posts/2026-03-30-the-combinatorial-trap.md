---
layout: post
date: 2026-03-30 09:00:00
title: "Fixtures on Purpose: The Combinatorial Trap"
desc: "The one where I do the math on why you can't create a fixture for every possible state."
---

*Part 1 of [Fixtures on Purpose](/2026/03/30/fixtures-on-purpose/#the-series), a series about designing test data for Rails.*

I've seen teams with 300 fixture records and climbing.
Every new feature gets a handful of new fixtures.
Every bug fix adds another special-case record.
The YAML files grow and nobody can explain what half the records are for.

I've also seen teams with 30 fixture records that cover more ground.
Not because they test less.
Because they design better.

The difference is math.

## 59,049 Reasons You Can't Win

JB Rainsberger laid this out years ago in his ["Integrated Tests Are a Scam"](https://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam) series.
(Worth reading in full if you haven't. He's been refining the argument for over a decade.)
His core observation is about code paths.
A system with 10 layers and an average of 3 branch points per layer has:

```
3^10 = 59,049 unique code paths
```

That's a modest web app.
Bump it to 4 branches per layer and you're over a million.
The growth is exponential.
You can't test every path.
You definitely can't write a fixture for every path.

I've been thinking about this math in terms of test paths for years.
But at some point I realized it applies just as directly to fixture data, and that reframing it as a *data design* problem, not just a test count problem, changes what you do about it.

## Now Apply That to Your Fixtures

Every dimension of your data is a branch point.
Member status, order state, payment type, shipping configuration, subscription tier.
Each one multiplies the matrix:

```
member status (active, suspended, pending)       = 3
order state (pending, paid, refunded, canceled)  = 4
payment type (card, bank, wallet)                = 3
shipping config (domestic, international, none)  = 3
subscription (monthly, annual, none)             = 3
```

That's 3 x 4 x 3 x 3 x 3 = **324 combinations**.
For five dimensions.
A real app has dozens.

So what do teams do? They create fixtures for the important combinations.
`suspended_member_with_pending_order` goes into the YAML.
Then `active_member_with_refunded_order_international`.
Before long you're maintaining 150 fixture records, most of which exist for a single test.
Nobody can remember which is which.
(Sound familiar?)

## The Vortex of Doom (for Data)

Rainsberger describes a cycle he calls the "vortex of doom" for integrated tests.
It applies perfectly to fixture proliferation:

1. Tests need specific data states, so you add fixtures
2. More fixtures mean more maintenance. Rename a column, update 40 YAML files
3. Fixtures break in confusing ways because they depend on each other
4. Developers lose trust in the fixtures and start creating records inline
5. Inline records are slow and duplicated, so someone adds more fixtures
6. Go to step 1

The thing that feels like it's helping is actually making the problem worse.
More fixtures create more maintenance, which creates less trust, which creates more fixtures.
It feeds itself.

## You Paid for One Path Out of Thousands

Here's the uncomfortable truth about `suspended_member_with_pending_order_and_declined_payment`: you've covered one path.
Out of thousands.
And you've paid for it with a fixture record that makes the whole dataset harder to understand.

But what if you took a happy-path fixture and just... changed it?

```ruby
def test_suspended_customer_cannot_checkout
  customer = customers :riverside_vip
  customer.update! status: "suspended"

  order = orders :riverside_order
  order.update! state: "pending"

  processor = CheckoutProcessor.new store: stores(:riverside)
  result = processor.process customer: customer, order: order

  assert_not result.success?
  assert_equal "customer_suspended", result.error
end
```

Two `update!` calls.
The fixture stays clean.
The test documents exactly what's different about this scenario.
The edge case is visible right there in the test body, not buried in a YAML file that you'd have to go find.

## Stop Multiplying, Start Adding

I know we can do better than 324 fixture records.
Here's how to think about it:

**Multiplicative approach:** one fixture per combination.
Grows as dimensions multiply.
3 x 4 x 3 x 3 x 3 = 324 fixtures for five dimensions.
Add a sixth dimension with 4 options and you're at 1,296.

**Additive approach:** one fixture per archetype, plus mutations per test.
Grows as dimensions are added.
4 archetypes + any edge case you can reach with `update!`.
Add a sixth dimension and you add nothing to the fixture count.

The multiplicative approach can't scale.
The additive approach can.
But the additive approach requires something the multiplicative approach doesn't: you have to *choose your archetypes well*.

Better tools won't save you here.
No gem, no library, or clever DSL will solve a multiplicative problem with a multiplicative approach.
The thing that actually helps is thinking differently about what your fixture data is for.
It's not a pile of rows that satisfies foreign keys.
It's a small number of well-chosen archetypes that represent the real shapes of your domain.

The hard part isn't the YAML.
The hard part is deciding which archetypes matter.
And it turns out, UX designers figured that out decades ago.

Next up: how UX designers figured out the archetype problem decades ago, and what it looks like when you borrow their methodology for test data.
