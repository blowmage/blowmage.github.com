---
title:  Adding Minitest Spec in Rails 4
layout: post
desc:   The one where I show how easy it is to add the Minitest spec DSL to a Rails 4 application, without using minitest-rails.
reddit: true
hackernews: true
---
Rails 4 is out, and among its many improvements is upgrading the default testing library from Test::Unit to Minitest. And although Minitest has some surprisingly interesting features, the most discussed addition is its spec DSL. It is designed as a subset of RSpec's DSL, though I'll leave to others any direct comparisons to RSpec. Suffice it to say it its focus is to give you a friendly syntax to generate the test classes, methods, and assertions you'd normally write in plain Ruby.

It'll take a little configuration, and yes, [there's a gem for that](http://blowmage.com/minitest-rails/), but the DIY approach takes surprisingly little elbow grease and will teach you a couple of cool Minitest features. Let's dive in!

Step 1: Setting the Minitest Dependency
---------------------------------------

Rails 4 sets the dependency on Minitest to "~> 4.2". This means that it will use any Minitest 4.x release that is 4.2 or above. This also means that we can't use the newly released Minitest 5, or the older 4.1. Since we want the spec DSL, we need to set the dependency to "~> 4.7". To do that, let's set the dependency in the Gemfile:

    group :test do
      gem "minitest", "~> 4.7"
    end

Step 2: Extending MiniTest::Spec::DSL
-------------------------------------

Minitest 4.7 introduced the MiniTest::Spec::DSL module. To add the spec DSL to our Rails tests, we'll add this to the `test/test_helper.rb` file.

Let's require the source file just after the `rails/test_help` require:

    ENV["RAILS_ENV"] ||= "test"
    require File.expand_path('../../config/environment', __FILE__)
    require 'rails/test_help'
    require "minitest/spec"

The second change is to extend MiniTest::Spec::DSL in ActiveSupport::TestClass. Luckily for us, there is already a place in the helper for us to make these changes:

    class ActiveSupport::TestCase
      ActiveRecord::Migration.check_pending!

      # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
      #
      # Note: You'll currently still have to declare fixtures explicitly in integration tests
      # -- they do not yet inherit this setting
      fixtures :all

      # Add more helper methods to be used by all tests here...
      extend MiniTest::Spec::DSL
    end

**Cool Minitest trick #1: `register_spec_type`**

The last change is to tell MiniTest::Spec to use ActiveSupport::TestCase when describing an ActiveRecord model. We do this by calling Minitest's [register_spec_type](http://rubydoc.info/gems/minitest/4.7.5/MiniTest/Spec/DSL#register_spec_type-instance_method) method.

    class ActiveSupport::TestCase
      ActiveRecord::Migration.check_pending!

      # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
      #
      # Note: You'll currently still have to declare fixtures explicitly in integration tests
      # -- they do not yet inherit this setting
      fixtures :all

      # Add more helper methods to be used by all tests here...
      extend MiniTest::Spec::DSL

      register_spec_type self do |desc|
        desc < ActiveRecord::Base if desc.is_a? Class
      end
    end

Step 3: Writing Specs
---------------------

Now that we've configured the spec DSL, let's use it! Let's assume we have the following test in `test/models/user_test.rb`:

    require "test_helper"

    class UserTest < ActiveSupport::TestCase

      def valid_params 
        { name: "John Doe", email: "john@example.com" }
      end

      def test_valid
        user = User.new valid_params

        assert user.valid?, "Can't create with valid params: #{user.errors.messages}"
      end

      def test_invalid_without_email
        params = valid_params.clone
        params.delete :email
        user = User.new params

        refute user.valid?, "Can't be valid without email"
        assert user.errors[:email], "Missing error when without email"
      end
    
    end

We can convert this test to the spec DSL one section at a time. Let's start with replacing the class with a `describe` block:

    require "test_helper"

    describe User do

      def valid_params 
        { name: "John Doe", email: "john@example.com" }
      end

We can bypass the need to explicitly define a class inheriting from `ActiveSupport::TestCase` because User inherits from ActiveRecord and we registered the spec type in the previous step.

Next we can replace the test methods with `it` blocks:

    def valid_params 
      { name: "John Doe", email: "john@example.com" }
    end

    it "is valid with valid params" do
      user = User.new valid_params

      assert user.valid?, "Can't create with valid params: #{user.errors.messages}"
    end

    it "is invalid without an email" do
      params = valid_params.clone
      params.delete :email
      user = User.new params

      refute user.valid?, "Can't be valid without email"
      assert user.errors[:email], "Missing error when without email"
    end

Now let's replace the calls to the assertions with Minitest's expectations. In the first test block, we are passing `user.valid?` to `assert`. The spec DSL provides many assertions as expectations, and in this case we can write this test using the `must_be` expectation. That would look like this:

    it "is valid with valid params" do
      user = User.new valid_params

      user.must_be :valid? # Must create with valid params
    end  

In the next test block, we are refuting that the user is valid. We can use the `wont_be` expectation for that. And then we are asserting that there are errors on the email attribute. We can use a combination of the `must_be` expectation and the `present?` method Rails adds to clean that up a bit:

    it "is invalid without an email" do
      params = valid_params.clone
      params.delete :email
      user = User.new params

      user.wont_be :valid? #Must not be valid without email
      user.errors[:email].must_be :present? # Must have error for missing email
    end

We can also move some helper methods to `let` blocks. In the end, here is what the test can look like using the spec DSL:

    require "test_helper"

    describe User do

      let(:user_params) { { name: "John Doe", email: "john@example.com" } }
      let(:user) { User.new user_params }

      it "is valid with valid params" do
        user.must_be :valid? # Must create with valid params
      end

      it "is invalid without an email" do
        # Delete email before user let is called
        user_params.delete :email

        user.wont_be :valid? # Must not be valid without email
        user.errors[:email].must_be :present? # Must have error for missing email
      end

    end

Step 4: Smoothing The Rough Edges
---------------------------------

The Minitest spec DSL does not support nested `context` blocks, but it does support nested `describe` blocks. *Except...* ActiveSupport::TestCase also defines a `describe` method, which stomps on the spec DSL. Oh no!

But wait, this is Ruby! To use nested `describe` blocks in your tests, we just need to remove the method from ActiveSupport::TestCase. To do this, add a call to `remove_method` just before MiniTest::Spec::DSL is added in the test helper:

    class ActiveSupport::TestCase
      ActiveRecord::Migration.check_pending!

      # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
      #
      # Note: You'll currently still have to declare fixtures explicitly in integration tests
      # -- they do not yet inherit this setting
      fixtures :all

      # Add more helper methods to be used by all tests here...
      class << self
        remove_method :describe
      end

      extend MiniTest::Spec::DSL

      register_spec_type self do |desc|
        desc < ActiveRecord::Base if desc.is_a? Class
      end
    end

If you prefer expectations to assertions, we'll need to add expectations for the several assertions that Rails provides, such as `assert_response`, `assert_redirected_to`, and `assert_difference`. We can do all this in the test helper file.

**Cool Minitest trick #2: `infect_an_assertion`**

First, create a new module and use the method [infect_an_assertion](http://rubydoc.info/gems/minitest/4.7.5/Module#infect_an_assertion-instance_method) that Minitest provides:

    module MyApp::Expectations
      infect_an_assertion :assert_difference, :must_change
      infect_an_assertion :assert_no_difference, :wont_change
    end

Then we can include that module in Object so that those expectations are available everywhere:

    class Object
      include MyApp::Expectations
    end

Now we can use these expectations in our tests. Yay!

    it "is able to be saved when valid" do
      lambda { user.save }.must_change "User.count", +1
    end

That's a Wrap!
--------------

As you can see, Minitest and Rails go hand in hand. I would even go so far as to say [they are BFFs, like I did in this presentation](http://blowmage.com/2013/05/29/minitest-rails-bffs). I hope you give Minitest a shot. Don't let its size fool you. It may be small, but it's a surprisingly powerful, full-featured testing library.

If this seems like too much configuration to manage on your own, that's okay! Feel free to check out the [minitest-rails](http://blowmage.com/minitest-rails/) gem, which does all this for you, includes some handy rake tasks, and lets you generate tests using the spec DSL. Either way, hopefully you know a little more about the test framework that comes with Rails 4.
