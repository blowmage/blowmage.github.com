---
layout: post
title: "Fixtures on Purpose: Fixture Personas"
desc: "The one where UX design from 1999 solves the fixture archetype problem."
---

*Part 2 of [Fixtures on Purpose](/2026/03/30/fixtures-on-purpose/#the-series), a series about designing test data for Rails.*

In the [last post](/2026/03/30/the-combinatorial-trap/) I made the case that you can't create a fixture for every combination of data states.
The math doesn't work.
What you need instead are a small number of well-chosen archetypes that tests can mutate into edge cases.

But how do you choose the archetypes? How do you decide which configurations deserve a permanent place in your fixture dataset and which should be reached through mutation?

Turns out, UX designers solved this problem in 1999.

## Fixtures That Don't Make Us Crazy

Alan Cooper introduced personas in *[The Inmates Are Running the Asylum](https://www.amazon.com/Inmates-Are-Running-Asylum-Products-ebook/dp/B000OZ0N62?tag=blowmage-20)*.
(Great title. Also a fair description of most test suites.)
His problem was the same as ours, just in a different domain.
Too many users.
Too many configurations.
Too many workflows.
You can't design a UI that works for every possible combination of user background and experience level.
The attempt produces something that works for nobody.

Cooper's solution was to observe that real users cluster.
They don't distribute uniformly across every possible combination of attributes.
They clump into a small number of recognizable types.
The freelancer who uses the product weekly.
The enterprise admin who lives in it daily.
The new user on day one.

Give each cluster a name.
Give it a face.
Make it memorable.
Now instead of designing for an abstract "user," you're designing for Fiona the Freelancer and Ed the Enterprise Admin.
The name carries implicit context.
Say "Fiona" and your whole team knows what you mean.
Her technical level, her goals.
Without restating it every time.

I read Cooper's book years ago and it changed how I thought about product design.
At some point I realized it also applies to test data.

## Fixture Personas

A fixture persona is a named organization (or user, or account) in your test data that represents a recognizable cluster of real-world configurations.

Instead of this:

```yaml
# What cluster does this represent? Who knows.
store_1:
  name: Test Store
  plan: premium
  country: US

store_2:
  name: Another Store
  plan: basic
  country: CA
```

You have this:

```yaml
riverside:
  name: Riverside Health
  plan: premium
  country: US
  # Established supplements company.
  # Multiple warehouses, international markets,
  # wholesale pricing, subscriptions.

corner_shop:
  name: Corner Shop
  plan: basic
  country: US
  # Simple online store. Domestic only.
  # Small catalog, one warehouse.

fresh_start:
  name: Fresh Start
  plan: starter
  country: US
  # Brand new store. Almost empty.
  # Just signed up. Testing onboarding and zero-state.
```

Three personas.
Three stories.
Each represents a different cluster of real customers.

## `:member_2` Is Not a Name

This isn't cosmetic.
The names do real work.

When you read `customers(:riverside_vip)` in a test, you immediately know the context.
Riverside is the full-featured store.
A VIP is a loyalty program member with order history and wholesale pricing.
You don't need to look up the fixture file.
You don't need to read six lines of setup.
The name is a cognitive handle that compresses the entire archetype into a single word.

Compare that to `customers(:customer_2)`.
What does `:customer_2` tell you? Nothing.
Is this a retail buyer or a wholesale account? What store? What configuration? You have to go look it up, and when you get there, you still might not know *why* this specific customer was chosen for this specific test.

Good fixture names carry implicit context the same way Cooper's personas do.
Say "Riverside" and you know it's the complex store.
Say "Corner Shop" and you know it's the simple one.
Say "Fresh Start" and you know it's empty.
The name does the work that six lines of comments would otherwise have to do.

## Three to Five. That's It.

Here's how I think about it.
You need enough personas to cover the major behavioral archetypes, and not one more.
For most Rails apps, that's 3-5.

Each persona should be:

**Distinct.** If two personas would produce the same behavior in most tests, merge them.
The point of having multiple personas is that they exercise different code paths.
If your "Gold Plan" and "Silver Plan" personas behave identically for 95% of your tests, you only need one.

**Minimal.** A persona should include only what its archetype genuinely needs.
The simple retail store doesn't need wholesale pricing fixtures or international shipping configurations.
The empty store doesn't need a product catalog.
The *absence* of data is part of the story.

**Coherent.** The attributes should tell a believable story.
A brand-new store has one admin, no order history, and maybe a couple of products.
An established business has multiple staff members, a full catalog, warehouses, payment methods, and a subscription program.
When the attributes hang together logically, you can *infer* unstated attributes from the archetype.
You don't need to check every field.
The story fills in the gaps.

**Named.** Memorable, consistent, used everywhere.
The name becomes part of your team's vocabulary.
"Use the Riverside fixtures for that test" is a sentence that means something.

## Okay, Show Me

Say you're building an e-commerce platform where merchants set up stores and sell products.
Your personas might be:

| Persona | Archetype | Story |
|---|---|---|
| **Riverside Health** | Full-featured store | Established supplements company. 20+ products, multiple warehouses, international markets, wholesale pricing, subscriptions. The "everything" persona. |
| **Corner Shop** | Simple retail | Small business selling a few products online. One warehouse, domestic shipping, basic catalog. The "just commerce" persona. |
| **Fresh Start** | New/empty store | Just signed up. One admin. Almost no data. The "zero state" persona. |

Riverside's fixtures tell a story about a real business:

```yaml
riverside_owner:
  store: riverside
  email: owner@riverside.test
  role: owner
  # Runs the business. Full admin access.

riverside_manager:
  store: riverside
  email: manager@riverside.test
  role: manager
  # Manages day-to-day. Limited admin access.

riverside_customer:
  store: riverside
  email: shopper@riverside.test
  role: customer
  # Regular retail buyer with order history.

riverside_vip:
  store: riverside
  email: vip@riverside.test
  role: customer
  loyalty_tier: wholesale
  # Wholesale customer. Gets tier pricing.
```

Corner Shop's fixtures tell a simpler story:

```yaml
corner_shop_owner:
  store: corner_shop
  email: owner@cornershop.test
  role: owner
  # Just the owner. Small operation.
```

Fresh Start's fixtures are deliberately sparse:

```yaml
fresh_start_admin:
  store: fresh_start
  email: admin@freshstart.test
  role: owner
  # The only user. That's the point.
```

When a test needs to verify wholesale pricing, it uses Riverside.
When it needs basic commerce, it uses Corner Shop.
When it needs to test what happens on an empty store, it uses Fresh Start.
No fixture proliferation.
Pick the archetype, mutate if needed.

## "But Doesn't That Reduce Coverage?"

Everyone expects this to cause more problems than it's worth.
Using the persona approach must result in a trade-off, right? Less coverage for less complexity.

It doesn't.

Well-designed personas with mutation actually cover *more* ground than 200 ad-hoc fixtures, because the mutations are precise and visible in the test body.
With 200 ad-hoc fixtures, each captures one exact state.
With 3 personas and `update!`, each persona is a starting point for hundreds of states.
And the test documents exactly which mutation matters for the behavior under test, right there where you can see it.

Fewer fixtures.
More expressiveness.
Not a compromise.

## A Shared Vocabulary

There's one more benefit I didn't expect.
Personas give your team a shared language for talking about test data.

Before personas, conversations about test setup were painful.
"Which user fixture do I use for this?" "The one with the admin role, not the other one, the one that has orders." "Which one has orders?" Nobody could remember.
The fixtures were anonymous and interchangeable.

After personas, the conversation changes.
"Use Riverside for that, it has the full catalog." "Corner Shop is enough, you don't need wholesale pricing." "That's a zero-state test, use Fresh Start." Everyone knows what those names mean.
The personas become a shorthand that works everywhere.
Code reviews, Slack, pairing sessions.

UX personas do this for product teams.
They give everyone a shared reference point.
"Would this work for Fiona?" is a faster conversation than "Would this work for a non-technical freelancer on the free plan who uses the product weekly?" Fixture personas do the same thing for engineering teams.
The names carry the context so you don't have to.

Next up: How to design a persona's fixtures end-to-end so the YAML files read like a setup chapter.
