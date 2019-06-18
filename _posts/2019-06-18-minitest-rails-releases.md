---
title:  New minitest-rails releases (5.0, 5.1, 5.2, 6.0.0.rc1)
layout: post
desc:   The one where I finally release new minitest-rails versions.
---
Rails 6.0 is just almost here, and new features means more things to test and more ways to test them! Did someone say ["parallel testing"](https://github.com/rails/rails/pull/31900)? Because of this I've taken the opportunity to make some changes to how [minitest-rails](https://blowmage.com/minitest-rails/) is structured.

## New Versions!

The first thing you'll notice is a bunch of new releases. The previous releases was [3.0.0](https://blowmage.com/minitest-rails/v3.0.0), but now there are new [5.0.0](https://rubygems.org/gems/minitest-rails/versions/5.0.0), [5.1.0](https://rubygems.org/gems/minitest-rails/versions/5.1.0), [5.2.0](https://rubygems.org/gems/minitest-rails/versions/5.2.0), and a [6.0.0.rc1](https://rubygems.org/gems/minitest-rails/versions/6.0.0.rc1) releases. What is going on here?

Well, one issue most every gem that plays in the Rails ecosystem has is managing compatibility between releases. Rails [does not strictly follow SemVer](https://guides.rubyonrails.org/maintenance_policy.html), so it can become difficult to manage this complexity. What can you do? Well, after dealing with this for many years I eventually decided to punt and start using Rails' shifted SemVer. This means that a Rails 5.2 app is going to use minitest-rails 5.2. And a Rails 5.1 app is going to use minitest-rails 5.1. With this change new gems have been released for all 5.x versions of Rails, as well as a pre-release gem for Rails 6.0.0.rc1. This means we will be able to narrow our runtime dependencies and respond quicker when issues arise.

## Minor Compatibility Issues

The move from Rails 4 to Rails 5 was a big step for tests. Several features such as `ActionController::TestCase` and DOM assertions were deprecated. The minitest-rails 3.x release tried to balance between supporting working tests and supporting the new standards. But for the 5.x releases we are not as worried about the old ways. So some minor changes have been made.

The signature for the expectation `must_change` has changed from earlier versions of minitest-rails. This is because the expectation used to refer to the `assert_difference` assertion, but has been changed to reference the `assert_changes` assertion added in Rails 5.1. Starting with minitest-rails 5.1 the expectation for the `assert_difference` assertion is now `must_differ`. Although it is very likely this change is backwards compatible.

In minitest-rails 3.x the `describe` block could be passed the subject of the test as a string instead of using the actual Ruby constant. Now you should only pass the Ruby constant. This works:

```ruby
describe WidgetsController do
```

But this does not:

```ruby
describe "WidgetsController" do
```

If you want to pass a string, then you must provide an additional description to tell the Spec DSL what test class to use:

```ruby
describe "WidgetsController", :controller do
```

I chose not to update [minitest-rails-capybara](https://blowmage.com/minitest-rails-capybara/) at this time. This is due to Rails 5.1 adding System Tests, which are very similar to, if not better than, the Capybara tests. So, if you need to remain on Rails 5.0 and really want Capybara tests, you should continue to use minitest-rails 3.0.

## Towards the Future!

Exciting things are coming. Rails 6.0. ([minitest-rails 6.0.0.rc1](https://rubygems.org/gems/minitest-rails/versions/6.0.0.rc1) is already here!) After that Minitest 6.0 is going to eventually be released. And who knows what else? Perhaps a book on Minitest and Rails? Until then, if you have any problems or questions with minitest-rails please [open an issue](https://github.com/blowmage/minitest-rails/issues/new).
