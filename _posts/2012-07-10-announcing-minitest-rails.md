---
title:  Announcing minitest-rails
layout: post
desc:   The one that announces minitest-rails, a library that enables you to test your Rails 3 apps using minitest.
reddit: true
hackernews: true
---
Yesterday I released version 0.1 of [minitest-rails](https://github.com/blowmage/minitest-rails), a library that enables you to test your Rails 3 apps using [minitest](https://github.com/seattlerb/minitest).

Installing
----------

The minitest-rails gem is intended to work side-by-side with Test::Unit and/or Rspec. But if you are starting a new project and only want to use minitest-rails, you can create a new rails app without a testing framework:

    rails new MyApp --skip-test-unit

Once you have a Rails app all you need to do is add minitest-rails to the `:test` and `:development` groups in your Gemfile:

{% highlight ruby %}
group :test, :development do
  gem 'minitest-rails'
end
{% endhighlight %}

Next run the installation generator to add the `test/minitest_helper.rb` file:

    rails generate mini_test:install

That's it! You are ready to write some tests.

Basic Usage
-----------

You can generate tests, or you can write your own. Let's assume you have the following model:

{% highlight ruby %}
class User < ActiveRecord::Base
  attr_accessible :name
  validates_presence_of :name
end
{% endhighlight %}

Testing this object is very easy. The only differences between Test::Unit and minitest are the different helper in the `require`, and the TestCase being namespaced under `MiniTest::Rails`.

{% highlight ruby %}
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
{% endhighlight %}

Using the Spec DSL
------------------

The feature that most seem to be excited by is the ability to use the Spec DSL in your tests.

{% highlight ruby %}
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
{% endhighlight %}

You can even tell the generators to output tests using the Spec DSL by providing the `--spec` option:

    rails generate model User --spec

Or you can set the Spec DSL to be the default by configuring it in your `config/application.rb` file:

{% highlight ruby %}
config.generators do |g|
  g.test_framework :mini_test, :spec => true
end
{% endhighlight %}

Of course, you can mix and match between the Unit and Spec styles. I prefer to use the Spec DSL blocks with Unit's assertions.

{% highlight ruby %}
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
{% endhighlight %}

But however you use it is up to you.

Test Locations
--------------

One of the biggest changes from Test::Unit is the default location of the tests. Like Rspec, minitest-rails organizes the tests by subject and not the type of test that is performed. Its possible to perform integration tests on models. (Rails unfortunately calls these functional tests.) Just as it is possible to perform unit tests on controllers. So the following locations are used:

<table>
  <tr>
    <th></th>
    <th><code>Test::Unit</code></th>
    <th><code>MiniTest::Rails</code></th>
  </tr>
  <tr>
    <td>Models</td>
    <td><code>test/unit/widget_test.rb</code></td>
    <td><code>test/models/widget_test.rb</code></td>
  </tr>
  <tr>
    <td>Helpers</td>
    <td><code>test/unit/helpers/widget_helper_test.rb</code></td>
    <td><code>test/helpers/widget_helper_test.rb</code></td>
  </tr>
  <tr>
    <td>Controller</td>
    <td><code>test/functional/widgets_controller_test.rb</code></td>
    <td><code>test/controllers/widgets_controller_test.rb</code></td>
  </tr>
  <tr>
    <td>Mailer</td>
    <td><code>test/functional/notifications_test.rb</code></td>
    <td><code>test/mailers/notifications_test.rb</code></td>
  </tr>
  <tr>
    <td>Acceptance</td>
    <td><code>test/integration/user_can_login_test.rb</code></td>
    <td><code>test/acceptance/user_can_login_test.rb</code></td>
  </tr>
</table>

Overriding Test::Unit
---------------------

If you want to use minitest in your current tests, you can inject minitest-rails by adding the following to your `test_helper.rb` file:

{% highlight ruby %}
require "minitest/rails"
MiniTest::Rails.override_testunit!
{% endhighlight %}

Contribute
----------

This is still a young project and needs lots of help. Give it a try and give some feedback. Or a patch. :)

* [code](https://github.com/blowmage/minitest-rails)
* [docs](http://blowmage.com/minitest-rails/)
* [mailing list](https://groups.google.com/group/minitest-rails)
