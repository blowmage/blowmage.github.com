---
title:  Announcing minitest-rails
layout: post
desc:   The one that announces minitest-rails, a library that enables you to test your Rails 3 apps using minitest.
---

Yesterday I released version 0.1 of [minitest-rails](https://github.com/blowmage/minitest-rails), a library that enables you to test your Rails 3 apps using [minitest](https://github.com/seattlerb/minitest).

## Getting Started

<div class="video-player widescreen">
<iframe width="704" height="424" src="http://www.youtube.com/embed/xA2f2zBNvsc?rel=0" frameborder="0" allowfullscreen></iframe>
</div>

## Installing

The minitest-rails gem is intended to work side-by-side with Test::Unit and/or Rspec. But if you are starting a new project and only want to use minitest-rails, you can create a new rails app without a testing framework:

    rails new MyApp --skip-test-unit

Once you have a Rails app all you need to do is add minitest-rails to the `test` and `development` groups in your Gemfile:

```ruby
group :test, :development do
  gem 'minitest-rails'
end
```

Next run the installation generator to add the `test/minitest_helper.rb` file:

    rails generate mini_test:install

That's it! You are ready to write some tests.

## Basic Usage

You can generate tests, or you can write your own. Let's assume you have the following model:

```ruby
class User < ActiveRecord::Base
  attr_accessible :name
  validates_presence_of :name
end
```

Testing this object is very easy. The only differences between Test::Unit and minitest are the different helper in the `require`, and the TestCase being namespaced under `MiniTest::Rails`.

```ruby
require "minitest_helper"

class UserTest < MiniTest::Rails::ActiveSupport::TestCase
  def test_valid
    user = User.new name: "Ryan Davis"
    assert user.valid?, "valid with a name"
  end

  def test_invalid
    user = User.new
    refute user.valid?, "invalid without a name"
  end
end
```

## Using the Spec DSL

The feature that most seem to be excited by is the ability to use the Spec DSL in your tests.

```ruby
require "minitest_helper"

describe User do
  it "can be valid" do
    user = User.new name: "Ryan Davis"
    user.valid?.must_equal true
  end

  it "can be invalid" do
    user = User.new
    user.valid?.wont_equal true
  end
end
```

You can even tell the generators to output tests using the Spec DSL by providing the `--spec` option:

    rails generate model User --spec

Or you can set the Spec DSL to be the default by configuring it in your `config/application.rb` file:

```ruby
config.generators do |g|
  g.test_framework :mini_test, :spec => true
end
```

Of course, you can mix and match between the Unit and Spec styles. I prefer to use the Spec DSL blocks with Unit's assertions.

```ruby
require "minitest_helper"

describe User do
  it "can be valid" do
    user = User.new name: "Ryan Davis"
    assert user.valid?, "valid with a name"
  end

  it "can be invalid" do
    user = User.new
    refute user.valid?, "invalid without a name"
  end
end
```

But however you use it is up to you.

## Test Locations

One of the biggest changes from Test::Unit is the default location of the tests. Like Rspec, minitest-rails organizes the tests by subject and not the type of test that is performed. Its possible to perform integration tests on models. (Rails unfortunately calls these functional tests.) Just as it is possible to perform unit tests on controllers. So the following locations are used:

|           | `Test::Unit`                                      | `MiniTest::Rails`                              |
|-----------|---------------------------------------------------|------------------------------------------------|
| Models    | `test/unit/widget_test.rb`                        | `test/models/widget_test.rb`                   |
| Helpers   | `test/unit/helpers/widget_helper_test.rb`          | `test/helpers/widget_helper_test.rb`            |
| Controller| `test/functional/widgets_controller_test.rb`       | `test/controllers/widgets_controller_test.rb`   |
| Mailer    | `test/functional/notifications_test.rb`            | `test/mailers/notifications_test.rb`            |
| Acceptance| `test/integration/user_can_login_test.rb`          | `test/acceptance/user_can_login_test.rb`        |

## Overriding Test::Unit

If you want to use minitest in your current tests, you can inject minitest-rails by adding the following to your `test_helper.rb` file:

```ruby
require "minitest/rails"
MiniTest::Rails.override_testunit!
```

## Contribute

This is still a young project and needs lots of help. Give it a try and give some feedback. Or a patch. :)

- [code](https://github.com/blowmage/minitest-rails)
- [docs](https://blowmage.com/minitest-rails/)
- [mailing list](https://groups.google.com/group/minitest-rails)
