---
layout: post
title: "Fixtures on Purpose: Mining Production for Personas"
desc: "The one where production data tells you what your fixture personas should be."
---

*Part 4 of [Fixtures on Purpose](/2026/03/30/fixtures-on-purpose/#the-series), a series about designing test data for Rails.*

I've been making a case for fixture personas.
Named archetypes like "Riverside Health" (full-featured) and "Corner Shop" (simple retail) that represent clusters of real-world configurations.
But I glossed over the hardest part: how do you know what the archetypes should be?

You can guess.
I've done that.
You sit in a room, think about what kinds of customers you have, and sketch some personas on a whiteboard.
It works okay.

But there's a better way.
Your production database already has the answer.

## Your Database Already Knows

Your production data contains the real shapes of your domain.
Not what you *think* the schema allows, but what *actually exists*.
And the two are always different in ways that surprise you.

When I look at production data, even anonymized, I see patterns I never would have imagined at a whiteboard.
Configuration combinations that always appear together.
Optional fields that are always populated for active accounts and always null for inactive ones.
State distributions that are wildly uneven: 85% of orders are completed, 10% are pending, and the remaining 5% are split across four other states.

Those patterns *are* your personas.
You just haven't named them yet.

## Dump It to YAML

Before you can mine production for patterns, you need to get the data out.
I've used a variation of this rake task at multiple companies over the years.
It walks your models, dumps each table to a YAML fixture file, and strips out default values so the output is clean:

```ruby
# lib/tasks/db_fixtures_dump.rake

namespace :db do
  namespace :fixtures do
    desc "Dump the database to fixture files"
    task dump: :environment do
      Rails.application.eager_load!

      fixtures_dir = ENV.fetch "FIXTURES_PATH", "test/fixtures"
      models = ApplicationRecord.descendants.reject(&:abstract_class?)

      # Optionally filter to specific models
      if ENV["FIXTURES"].present?
        names = ENV["FIXTURES"].split(",")
        models = models.select { |m| names.include? m.name.underscore.pluralize }
      end

      models.each do |model|
        records = model.order(model.primary_key)
        next if records.none?

        defaults = model.new.attributes

        fixture_data = records.map do |record|
          key = "#{model.name.demodulize.underscore}_#{record[model.primary_key]}"
          attrs = record.attributes
            .slice(*model.column_names)
            .except("created_at", "updated_at")
          # Remove attributes that match the default value
          attrs = (attrs.to_a - defaults.to_a).to_h

          [key, attrs]
        end

        path = Rails.root.join fixtures_dir, "#{model.name.underscore.pluralize}.yml"
        FileUtils.mkdir_p File.dirname(path)
        File.write path, fixture_data.to_h.to_yaml.delete_prefix("---\n")

        puts "#{model.name}: #{records.size} records"
      end
    end
  end
end
```

Run it against a read replica or a staging database.
Never against production directly, for obvious reasons.

```bash
RAILS_ENV=staging FIXTURES_PATH=tmp/fixtures bin/rails db:fixtures:dump
```

Now you've got YAML files that mirror your production data.
They're not test fixtures yet.
They're raw material.
The next step is to look at them and find the patterns.

## From Raw Dump to Designed Personas

Here's how I turn that raw dump into fixture personas.

**Step 1: Anonymize.** The dump has real data in it.
Strip the PII before it goes anywhere useful.
Names become Faker names.
Emails become `@example.test`.
Passwords get regenerated.
Tokens get rotated.
Domain names become `.test`.
Remove anything business-sensitive.
(Revenue figures, pricing tiers, anything you don't want in a repo.)

The key: replace the *values* but preserve the *shapes*.
Same relationship structure, same cardinality distributions, same state profiles.
You're mining for patterns, not copying records.

**Step 2: Group by configuration.** Look at your customers.
Not individually, but in clusters.
Which ones have similar configurations? Which feature flags tend to appear together? Which plan tiers correlate with which usage patterns?

You'll find that most customers fall into a small number of archetypes.
The power user with everything turned on.
The simple setup that uses three features.
The brand-new account with almost nothing configured.
Maybe you have something domain-specific.
The international seller, the subscription-heavy store, the marketplace vendor.

These clusters are your candidate personas.
Three to five is usually enough.

**Step 3: Look at relationship cardinalities.** How many products does a typical store have? How many orders? What's the product-to-variant ratio? How many staff members per store?

This matters because your fixtures should reflect reality.
If production shows most stores have 15-40 products with 1-3 variants each, your persona should have a catalog in that range.
Not 2 products (too minimal to test real behavior) and not 500 (too heavy for a fixture dataset).

When I first did this, I was surprised by how many single-variant products there are in production.
I had been designing fixtures with multiple variants on every product, because that's where the interesting logic is.
But production says most products are one-and-done.
So my main persona has mostly single-variant products, with a few multi-variant products for testing variant logic.
Realistic distributions, not aspirational ones.

**Step 4: Look at state distributions.** What percentage of orders are completed? Pending? Refunded? What fraction of members are active?

This directly informs your fixture defaults.
If 85% of orders are completed, your default order fixture should be completed.
The common state is the default.
Pending, refunded, canceled: those are mutations, not defaults.
A test that needs a pending order starts with the default and calls `update! state: "pending"`.
The mutation is visible and intentional.

**Step 5: Look for implicit invariants.** This is the most valuable part.
Production data reveals rules that the schema doesn't enforce.

Maybe every active store has at least one admin, at least one product, and a configured payment method.
The schema allows a store with zero products and no payment method, but production doesn't have any.
That's an implicit invariant, and your fixture personas should maintain it.

Or maybe every store with a "premium" plan has at least one configured payment gateway and at least one published product.
The `stores` table doesn't enforce that, but the onboarding flow does, and production reflects it.
If your premium store fixture has no payment gateway, that's a fixture that can never exist in production.
You're testing against a phantom.

The gap between what the schema allows and what production contains is where the most valuable fixture design insights live.

**Step 6: Name the clusters.** Give each archetype a memorable name.
Not "Store Type A." Something with personality.
Riverside Health.
Corner Shop.
Fresh Start.
The name should be:

- Distinct enough that it's immediately clear which archetype you mean
- Evocative of the archetype (a health company name for the full-featured store, a small shop name for the simple retailer)
- Easy to use as a prefix (`riverside_vip`, `corner_shop_owner`)

This name becomes part of your team's vocabulary.
It's worth spending five minutes picking a good one.

## The Schema Lies. Production Doesn't.

This is worth dwelling on, because it's the part that changed my thinking the most.

Your schema tells you what's *possible*.
A member can have any status.
An order can be in any state.
A store can have any configuration.
The schema is permissive by design.
It encodes constraints, not conventions.

Production tells you what's *real*.
Which configurations actually occur together.
Which states are transient (orders are "pending" for minutes) versus stable (orders are "completed" for months).
Which optional fields are effectively required.
Which associations are always present even though the foreign key is nullable.

When you design fixtures from schema knowledge alone, you get technically valid data that doesn't look like anything in production.
When you design fixtures from production knowledge, you get data that represents how the application actually works.
The second kind is better for testing because it catches the bugs that actually happen.

## Three Clusters Walk Into a Database

Say you run an e-commerce platform.
You pull an anonymized snapshot and look at your stores.
You find three clusters:

**Cluster 1 (40% of stores):** Full-featured.
20-50 products.
Multiple payment methods.
Subscriptions enabled.
Multiple staff roles.
Active for 2+ years.
Heavy order volume.

**Cluster 2 (45% of stores):** Simple.
5-15 products.
One payment method.
No subscriptions.
Flat membership.
Active for 6 months to 2 years.
Moderate order volume.

**Cluster 3 (15% of stores):** New.
0-5 products.
Payment method may not be configured.
No orders yet.
Created in the last 30 days.

Those are your personas.
Name them, design their fixture sets, and you've captured the shape of your production data in a form that fits in a test suite.

## You Won't Get It Right the First Time

Let's be honest: you won't get your personas right the first time.
I certainly didn't.
The initial set was based on intuition, and it was close but not quite.
After a few months of writing tests, I noticed patterns.
Places where I was constantly mutating the same fixture in the same way.
Reaching for `Model.create!` because no persona quite fit.

That's feedback.
When you find yourself writing the same mutation in five tests, that's a signal that your persona's default state might be wrong, or that you need a new fixture in the persona's dataset.
When you can't find a persona that fits, that might be a signal for a new persona.

Or it might mean you should mutate harder.

The personas evolve.
That's fine.
The point is having intentional archetypes at all, not getting them perfect on day one.

Next up: A practical threshold for deciding when to add a new fixture versus mutate an existing one.
