---
title:  'minitest-rails: Roadmap to 1.0'
layout: post
desc:   The one about getting minitest-rails ready for prime time.
reddit: true
hackernews: true
---
**tl;dr**: *The newest [minitest](https://github.com/seattlerb/minitest) and [minitest-rails](https://github.com/blowmage/minitest-rails) are awesome.*

I've been working on the [minitest-rails](http://blowmage.com/minitest-rails) project for almost two years now. That is a terribly long time to work on a project without having a stable release. Fortunately with the [0.9 release](https://rubygems.org/gems/minitest-rails/versions/0.9.0), which came out earlier tonight, we are on our way to stability.

The Problem
-----------

Inheritance is great, except when it isn't. All Rails tests inherit from ActiveSupport::TestCase. In Rails 3, ActiveSupport::TestCase inherits from Test::Unit::TestCase, which inherits from MiniTest::Unit::TestCase in Ruby 1.9 and higher. Or, if you are on Ruby 1.8 you can install the [minitest_tu_shim](https://github.com/seattlerb/minitest_tu_shim) gem to inject minitest into the inheritance chain.

What we want, however, is to inherit from MiniTest::Spec. In fact, for almost a year during the development of Rails 4 ActiveSupport::TestCase [inherited](https://github.com/rails/rails/commit/1c09c29a0958eac86fffede00f30a1bee36d09a9#L1L11) from MiniTest::Spec. Unfortunately, that was [changed](https://github.com/rails/rails/commit/eb4930e3c724cf71d6ce5bb2aec4af82b2025b03#L4L19) before the first beta gem was released and it now inherits directly from MiniTest::Unit::TestCase. (Which is disappointing but totally appropriate for the core team to do. It's their project, and they should do what they think is best, always.) So what do we do? How can we change the nature of the Rails tests? Time to roll up our sleeves and get hacky!

A Terrible Solution
-------------------

One terrible solution is to change the ancestry of the ActiveSupport::TestCase and inject MiniTest::Spec. For [minitest-rails](https://github.com/blowmage/minitest-rails) this has meant creating a MiniTest::Rails::TestCase that inherits from MiniTest::Spec and includes all the Rails testing modules. For [minitest-spec-rails](https://github.com/metaskills/minitest-spec-rails) this has meant replacing Test::Unit::TestCase with an implementation that inherits from MiniTest::Spec.

This approach generally works, but you have to be very careful in how you load the libraries that are getting replaced. You can replace a constant in Ruby, but if another object is inheriting from the object you replaced, it will continue to inherit from that even after you replace the constant. Problems arise when some other library affects your carefully planned hack, which is ultimately inevitable. And don't even get me started on Rails 3's `threadsafe!` option.

A Sustainable Solution
----------------------

What we really need is to be able to enable the MiniTest::Spec functionality without altering the ancestry. But how? Instead of using Ruby meta-programming for evil, how about we use it for good. Imagine if this worked:

{% highlight ruby %}
class ActiveSupport::TestCase
  extend MiniTest::Spec::DSL
end
{% endhighlight %}

Well, with the latest release of minitest that's the case. Ryan Davis added the ability to enable the spec DSL on any minitest TestCase. This means that this is functionally equivalent:

{% highlight ruby %}
class TestMyStuff < MiniTest::Spec
  it "works" do
    assert true
  end
end

class TestMyStuffAgain < MiniTest::Test::Unit
  extend MiniTest::Spec::DSL

  it "works" do
    assert true
  end
end
{% endhighlight %}

It turns out because of how well MiniTest::Spec was designed this was a fairly easy change to make. I love working in code that Ryan produces because this is generally the case.

The Unlimited Possibilities
---------------------------

This change means that supporting minitest's spec DSL is suddenly trivial. Specifying the version of minitest in your Rails project's Gemfile and including the following in your test helper enables the DSL:

{% highlight ruby %}
require "minitest/spec"
class ActiveSupport::TestCase
  extend MiniTest::Spec::DSL
end
{% endhighlight %}

Unfortunately, that doesn't do everything for you. If you want to use the full spec DSL, you need to configure which TestCase is used in your tests. To do that you need to register the TestCase with the spec DSL:

{% highlight ruby %}
class ActiveSupport::TestCase
  # Use AS::TestCase for the base class when describing a model
  register_spec_type(self) do |desc|
    desc < ActiveRecord::Base if desc.is_a?(Class)
  end
end

class ActionController::TestCase
  # Use AC::TestCase for the base class when describing a controller
  register_spec_type(self) do |desc|
    Class === desc && desc < ActionController::Metal
  end
  register_spec_type(/Controller( ?Test)?\z/i, self)
end
{% endhighlight %}

And so on. But there is another piece. Controller and Helper and Mailer tests also attempt to deduce and create an instance of the controller or helper or mailer from the name of the test. This is a bit more involved, and currently minitest-rails uses [MiniTest::Rails::Testing::ConstantLookup](https://github.com/blowmage/minitest-rails/blob/v0.9/lib/minitest/rails/constant_lookup.rb) to resolve the constant from the test name.

What this means is that instead of hacking how Rails loads code, we can declare how we want our tests configured. This is a huge step forward. Fortunately, all this and more is included with minitest-rails, which is the easiest way to use advanced minitest functionality within your Rails app. (End sales pitch.)

Upgrade Path
------------

If you are already using minitest-rails, thank you! Because of the various ways we've attempted to inject minitest into Rails there is some cruft that has accumulated along the way. So for the 0.9 release we've added a few deprecation warnings for things that will be removed in 1.0. If you have an existing app using minitest-rails please look at the [Upgrade Guide](https://github.com/blowmage/minitest-rails/wiki/Upgrading-to-0.9) and make those changes.
