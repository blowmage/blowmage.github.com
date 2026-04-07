---
layout: post
title: "Fixtures on Purpose: The Rule of Four"
desc: "The one where four is the magic number for tolerating duplicated test setup."
---

*Part 5 of [Fixtures on Purpose](/2026/03/30/fixtures-on-purpose/#the-series), a series about designing test data for Rails.*

If you've made it this far in the series, congratulations.
You now know more about my opinions on test data than most people who've worked with me.
(They usually find out the hard way.) The case so far: fixture personas.
Named archetypes that represent clusters of real-world data, with tests mutating them for edge cases instead of creating new fixtures for every scenario.

But that raises a practical question: when *do* you add a new fixture?

If you never add fixtures, your personas ossify.
Tests get littered with `update!` calls and `Model.create!` blocks that obscure what's being tested.
If you always add fixtures, you're back to the proliferation problem.

You need a threshold.

## The Rule

I use the rule of four: tolerate inline data duplication up to four times.
When a fifth test needs the same pattern, extract it to a fixture.

That's it.
It's simple.
It's not subtle.
That's the point.

**1 test** needs a suspended member? Mutate the fixture inline.

```ruby
def test_suspended_customer_cannot_checkout
  customer = customers :riverside_vip
  customer.update! status: "suspended"
  # ...
end
```

**2-3 tests** need a suspended member? Still fine inline.
Each test is self-contained, and the duplication is actually a feature.
The reader can see the precondition right there without looking anything up.

**4 tests** need a suspended member? Starting to feel repetitive, but still tolerable.
This might be a localized cluster of related tests.

**5 tests** need a suspended member? Now we have a pattern.
Time to add `riverside_suspended_member` to the fixtures.
The pattern has proven itself.
It represents a genuine shared base state, not a one-off edge case.

## Why Four and Not Three (or Five)

"But four? Shouldn't we extract after two? Three at most?" I see you reaching for the DRY principle.
Put it back.
Tests are the one place where a little duplication is actually doing you a favor.
Four tests with the same two-line setup means four tests you can read independently without chasing shared helpers.
That's not a code smell.
That's readability.

(I realize I'm asking you to tolerate duplicated code and trust that it's fine.
I know how that sounds.
Try it for a month and see if your tests get harder to read.
They won't.)

Four isn't magic.
It's a Goldilocks number for my experience.

At three, you're often looking at a cluster of related tests that happen to share setup.
The tests are in the same file, testing the same feature.
The duplication is local and manageable.

At five, the pattern has appeared in multiple test files, multiple features.
It's not local anymore.
The same setup keeps showing up in places you didn't expect.
That's when the cost of duplication exceeds the cost of a new fixture.

If this feels arbitrary, it is, a little.
You could use three, or five, or "whenever it bugs me." The important thing isn't the number.
The important thing is having a threshold at all.
Without one, fixtures either grow forever or never grow, and both are bad.

## Don't You Dare Make a Fixture for One Test

The rule of four has an equally important corollary: **if you're tempted to create a fixture for a single test, don't.**

This comes up more than you'd think.
You're writing a test for a complex edge case.
Say, a customer whose subscription expired while they had a pending international order with a payment that requires 3D Secure.
You think: "I should create a fixture for this specific state."

Don't.
That fixture will exist in your dataset forever, making every test slightly slower to load, making the YAML files slightly harder to read, and serving exactly one test.
It's a premature abstraction.

Instead, start with the closest persona and mutate:

```ruby
def test_handles_expired_sub_during_period_close
  customer = customers :riverside_vip
  sub = subscriptions :riverside_monthly
  sub.update! status:     "expired",
              expired_at: 2.days.ago

  order = orders :riverside_pending
  order.update! shipping_market: "eu"

  payment = payments :riverside_pending_payment
  payment.update! status: "requires_action"

  finalizer = OrderFinalizer.new store: stores(:riverside)
  result = finalizer.finalize order: order

  assert_not result.success?
  assert_equal "subscription_expired", result.error
end
```

Is that a lot of setup? Yes.
But it's *visible* setup.
Every precondition is right there in the test body.
A reader doesn't need to go find a YAML file to understand what makes this test special.
And when this test is the only test that needs this exact combination, inline setup is the right call.

## Use `update!` and Let It Scream

A quick note on the mechanics, since this comes up constantly.

Always use `update!` for fixture mutations.
Not `update`.
Not `update_column`.
The bang method.

Why? Two reasons.
First, you want to know if the mutation fails.
If you're setting up a precondition and it silently doesn't work, your test is lying to you.
`update!` raises on failure.
That's what you want.

Second, `update_column` bypasses validations and callbacks, and Rubocop will rightfully flag it.
`update!` runs through the normal Active Record lifecycle, which is what you want.
If your validations prevent you from setting up a test state, that's feedback.
Maybe your validations are too strict.
Maybe that state really can't happen and you don't need that test.

Either way, the validation telling you "no" is more useful than silently sneaking around it.
(And if you have business logic in callbacks that's getting in your way during test setup, that's a different kind of feedback.
Business logic belongs in service objects, not callbacks.)

If you genuinely need to put a record into an invalid state for a test, assign the attributes and call `save!(validate: false)`.
It's explicit about what you're doing and why.
It doesn't hide in a method name that looks like a normal update.

```ruby
# Good. Will raise if something is wrong.
customer.update! status: "suspended"

# Good. Multiple attributes at once.
order.update! financial_status:   "pending",
              fulfillment_status: "unfulfilled"
```

## When Two Things Break at Once

Some edge cases require changing multiple records together.
Keep these inline in the test.
They document the preconditions as a group:

```ruby
def test_rejects_fulfillment_when_payment_declined
  order = orders :riverside_order_one
  order.update! fulfillment_status: "unfulfilled"

  payment = payments :riverside_order_one_payment
  payment.update! status: "declined"

  processor = FulfillmentProcessor.new store: stores(:riverside)
  result = processor.fulfill order: order

  assert_not result.success?
  assert_equal "payment_not_captured", result.error
end
```

Two mutations that go together.
The order is unfulfilled *and* the payment is declined.
Inlining them makes it obvious that both preconditions matter.
If you extracted these to a fixture called `riverside_declined_unfulfilled_order`, you'd lose that visibility.

## Listen to the Pain

The rule of four creates a natural feedback loop with your fixture design.

When you find yourself writing the same mutation in five tests, that's your fixtures telling you something.
Maybe the persona's default state is wrong.
If "suspended" appears in more tests than "active," maybe your fixture should be suspended by default.
(Unlikely, but possible.) More often, it means a second fixture within the persona has earned its place.

When you find yourself reaching for `Model.create!` regularly, that's a different signal.
Maybe you need a new persona.
Or maybe the existing personas need richer fixture sets.

When the mutations feel easy and obvious, that's the feedback loop telling you your fixture design is working.
The happy-path defaults are good bases.
The personas are the right archetypes.

The goal isn't to eliminate all inline data creation.
It's to have a threshold that prevents both extremes: fixture proliferation and fixture starvation.

Next up: How your test data accidentally becomes the best map of your domain.
