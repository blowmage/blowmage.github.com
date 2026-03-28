---
title:  Installing Rails on Shared Hosting
layout: post
desc:   Obligatory post where you show how to install Rails. Who didn't do one of these?
---
I stated in an earlier entry on installing the excellent [Rublog](http://www.pragprog.com/pragdave) that I may be simply delaying the inevitable move to [Ruby on Rails](http://rubyonrails.com/), and I was right. The siren call of the new and shiny has won me over, and I decided to extend this site's Ruby support to include Rails. (The fact that the [Typo](http://typo.leetsoft.com/) blog engine now renders static HTML files dramatically improving performance also helped, but more on that next time.)

It is possible to install and use Rails on [HostingPlex](http://www.hostingplex.com/redir.php?aff=blowmage), but the performance will suffer. Rails is a large framework, and not having [mod_ruby](http://modruby.net/) and [FastCGI](http://fastcgi.com/) installed hurts performance tremendously. Until they are properly supported by HostingPlex, you should use at your own risk. But since you're reading this, I'll assume that you want to continue with installing Rails. ;)

The first step to installing Rails is to install [RubyGems](http://docs.rubygems.org/). Truth be known, you probably want to install gems whether you install Rails or not. Installing gems is as easy as our previous installations:

{% highlight bash %}
$ cd ~
$ wget http://rubyforge.org/frs/download.php/3463/rubygems-0.8.8.tgz
$ tar zxvf rubygems-0.8.8.tgz
$ cd rubygems-0.8.8
$ ruby setup.rb
{% endhighlight %}

Once gems is installed, installing Rails or any other gem is the easiest thing in the world:

{% highlight bash %}
$ gem install rails
{% endhighlight %}

Be sure to answer `y` when prompted by the Rails installation. While you are at it, you can also install a couple supporting libraries common to Rails apps.

{% highlight bash %}
$ gem update mysql
$ gem install redcloth
{% endhighlight %}

By default, Rails connects to a MySQL database using a library written in Ruby. This library isn't as fast as using a compiled library. [James Duncan Davidson](http://blog.x180.net/) has a great [article](http://blog.x180.net/2005/07/rails_and_mysql.html) on improving the performance or Rails apps by using the native library. To install the native library you should use these commands:

{% highlight bash %}
$ cd ~
$ wget http://tmtm.org/downloads/mysql/ruby/mysql-ruby-2.6.3.tar.gz
$ tar zxvf mysql-ruby-2.6.3.tar.gz
$ cd mysql-ruby-2.6.3
$ ruby extconf.rb --with-mysql-dir=$HOME/local/mysql && make && make install
{% endhighlight %}

Is it me, or are these tasks getting easier?
