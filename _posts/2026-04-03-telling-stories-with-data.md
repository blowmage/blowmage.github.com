---
layout: post
title: "Fixtures on Purpose: Telling Stories With Data"
desc: "The one where fixture files start reading like the setup chapter of a novel."
---

*Part 3 of [Fixtures on Purpose](/2026/03/30/fixtures-on-purpose/#the-series), a series about designing test data for Rails.*

In the [last post](/2026/04/01/fixture-personas/) we applied user personas to how we design fixtures.
Named, archetypal organizations in your test dataset that represent clusters of real-world configurations.
Riverside Health is the full-featured store.
Corner Shop is the simple retailer.
Fresh Start is the empty canvas.

But I only showed the member fixtures.
A persona isn't just users.
It's the whole world.
Products, orders, payments, configurations, the works.
Designing that world so it tells a coherent story is the craft part.

This is the part I enjoy the most.

## `riverside_vip` Has a Life Story. `customer_2` Does Not.

The best fixture files read like the setup chapter of a novel.
They introduce characters and establish relationships.
They create a world that the tests inhabit.

The difference between `customer_2` and `riverside_vip` isn't just aesthetics.
It's the difference between a row in a table and a character in a story.
When I read `riverside_vip` I know who this person is, what they do, and why they exist in the test data.
They're a wholesale customer at an established supplements company.
They get tier pricing.
They have order history.

`customer_2` tells me nothing.
I have to go read the YAML file, and even then I might not understand *why* this record exists or which tests depend on it.

So how do you design a persona's story? I think of it in layers.

## Layer 1: The Archetype

Start with a sentence.
What kind of business is this persona?

- **Riverside Health:** "An established supplements company with multiple warehouses, international markets, and a wholesale program."
- **Corner Shop:** "A small online store that sells a few products domestically."
- **Fresh Start:** "A store that was created yesterday."

That sentence drives everything.
Every fixture you add should fit the sentence.
If you're adding international shipping configurations to Corner Shop, stop.
That doesn't fit the archetype.

## Layer 2: The Cast

Who are the characters in this persona's story? Not "how many records do I need," but "who are these people and what do they do?"

For Riverside Health, the cast might be:

| Character | Role | Story |
|---|---|---|
| `riverside_owner` | Owner | Runs the business. Full admin access. |
| `riverside_manager` | Manager | Day-to-day operations. Limited admin. |
| `riverside_customer` | Customer | Regular retail buyer. Has order history. |
| `riverside_vip` | VIP/Wholesale | Wholesale account. Gets tier pricing. |

Four users.
That's enough to test role-based access control, pricing tiers, and customer management flows.
You don't need 15 users.
You need enough to tell the story.

For Corner Shop:

| Character | Role | Story |
|---|---|---|
| `corner_shop_owner` | Owner | The one person running the show.
|

One user.
That's the story.
Simple retail, one owner.
The absence of other users *is* the story.
There's no staff to manage, no wholesale accounts to configure.

## Layer 3: Relationships

Now connect the characters.
How do they relate to each other, and how does that connect across your domain models?

For Riverside, the relationships span multiple models and multiple fixture files:

```
riverside_owner (user, admin access)
riverside_customer (user, placed orders)
  └── riverside_order_one (order, placed by customer)
        └── riverside_order_item (order item, Omega-3 product)
              └── riverside_payment (payment, Visa card)
riverside_vip (user, wholesale pricing)
  └── riverside_wholesale_order (order, tier-priced)
```

Each level in this chain is a separate fixture file.
`users.yml`, `orders.yml`, `order_items.yml`, `payments.yml`.
But they tell one continuous story.
The customer placed an order for Omega-3, paid with Visa.
The VIP placed a wholesale order at tier pricing.
The fixtures reference each other by name, and the names make the chain readable.

## Layer 4: The Product World

Products deserve special attention because they're where the "realistic but minimal" balance is trickiest.

I aim for a product catalog that's large enough to test real behavior but small enough that every fixture has a name and a purpose:

**Riverside Health products:**
| Product | Variants | Why It Exists |
|---|---|---|
| Omega-3 Plus | 4 (default, 30ct, 60ct, 120ct) | Flagship. Multi-variant. Used in most order fixtures. |
| Daily Moisturizer | 3 (default, 1oz, 2oz) | Second product with variants. Size-based options. |
| Probiotic Complex | 1 (default) | Single-variant product. The common case. |
| Vitamin D3 | 1 (default) | Budget product. Different price point. |
| Draft Product | 1 (default) | `status: draft`. For publish/unpublish workflow tests. |

Most real products have one variant.
A few have 2-4.
Almost none have 20.
The fixture catalog should reflect that distribution.
Riverside has a handful of multi-variant products for testing variant logic, and a bunch of single-variant products for everything else.

**Corner Shop products:**
| Product | Variants | Why It Exists |
|---|---|---|
| Omega-3 Fish Oil | 1 (default) | Featured product. |
| Whey Protein | 1 (default) | Second product. That's enough. |

Two products.
Simple store.
The catalog matches the archetype.

## Layer 5: Default to Success

Every fixture should represent the happy path.
Active users, completed orders, valid payment methods.
This is important because it makes mutations obvious.

```yaml
riverside_order_one:
  store: riverside
  customer: riverside_customer
  order_number: "RH-10001"
  status: completed
  financial_status: paid
  fulfillment_status: fulfilled
  total_cents: 5998
```

When a test needs a pending order, the mutation is visible and intentional:

```ruby
def test_cannot_fulfill_unpaid_order
  order = orders :riverside_order_one
  order.update! financial_status:   "pending",
                fulfillment_status: "unfulfilled"

  processor = FulfillmentProcessor.new store: stores(:riverside)
  result = processor.fulfill order: order

  assert_not result.success?
end
```

The reader can see at a glance: we started with Riverside's default order (completed, paid, fulfilled) and changed two things.
The changes *are* the test's preconditions.
If the fixture were already in the pending state, you'd have to go read the YAML to understand the starting point.
But with happy-path defaults, the persona implies the starting point and the deviations are right there in the test.

## `riverside_` Everywhere

Every fixture in a persona's story uses the persona name as a prefix:

```ruby
stores :riverside
customers :riverside_vip
orders :riverside_order_one
products :riverside_omega
variants :riverside_omega_default
```

The prefix creates instant context.
When you're reading a test and see `riverside_` everywhere, you know this is the full-featured world.
When you see `corner_shop_`, you know it's the simple retail world.

Reference data (countries, currencies, languages) doesn't get a prefix.
It's the shared backdrop:

```yaml
# currencies.yml
usd:
  code: USD
  name: US Dollar
```

Reference data is the scenery.
Persona data is the cast.

## No Scrolling. No Guessing.

I said in [the first post](/2026/03/30/fixtures-on-purpose/) that I want everything important visible in the test method.
No scrolling up 60 lines to find a `subject` definition.
No chasing `let` chains through nested contexts.
No guessing.

What I'm really talking about is [Arrange, Act, Assert](https://wiki.c2.com/?ArrangeActAssert).
It's one of the oldest patterns in testing, and I end up teaching it over and over because so much test tooling actively works against it.
A good test should show you three things, in order, in one place:

1. **Arrange.** What's the world look like before we do anything?
2. **Act.** What are we doing?
3. **Assert.** What should be true now?

That's it.
If you can read a test method top to bottom and clearly see all three, the test is doing its job.
If you have to scroll up 80 lines to find the Arrange, or chase three `let` chains to reconstruct the Act, the test has failed as communication.
It might still pass green.
But nobody can read it.

Fixture personas make clean Arrange-Act-Assert possible in a way that neither factories nor shared RSpec contexts do.
The persona name *is* the Arrange.
`customers(:riverside_vip)` tells you the world.
A mutation like `update! loyalty_tier: "standard"` tells you what's different from the default.
Everything the test needs to communicate is local and in order.
(That's the whole trick, honestly.)

Compare that to a typical RSpec file:

```ruby
# 80 lines up...
let(:customer) { create(:customer, :vip, store: store) }
let(:store) { create(:store, :with_wholesale) }
subject { described_class.new(store: store).calculate(order: order) }

# ... 80 lines of other contexts ...

it "applies wholesale pricing" do
  expect(subject.total_cents).to eq(4499)
end
```

Where's the Arrange? Scattered across `let` blocks 80 lines above.
Where's the Act? Hidden inside `subject`.
Where's the Assert? That's the only part you can actually see.
This isn't Arrange-Act-Assert.
It's Hunt-Guess-Assert.

With fixtures:

```ruby
def test_vip_gets_wholesale_pricing
  # Arrange
  vip = customers :riverside_vip
  product = products :riverside_omega

  # Act
  calculator = PriceCalculator.new store: stores(:riverside)
  result = calculator.calculate customer: vip, product: product

  # Assert
  assert result.success?
  assert_equal 4499, result.total_cents
end
```

All three.
One method.
Top to bottom.
The persona provides the Arrange, the service call is the Act, and the assertions are the Assert.
No scrolling.
No guessing.

## The Accidental Documentation

Something nice happens when your fixture files tell coherent stories.
A new developer can open `test/fixtures/customers.yml` and understand the business.
They can see the roles and loyalty tiers, the relationships between users and stores.
They can open `products.yml` and see what a realistic catalog looks like.

The YAML files become a map of the domain.
I didn't set out to write documentation.
I set out to write good test data.
(Turns out they're the same thing.)

Next up: How to discover your personas in production data instead of making them up.
