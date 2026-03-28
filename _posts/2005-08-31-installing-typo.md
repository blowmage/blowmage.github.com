---
title:  Installing Typo on Shared Hosting
layout: post
desc:   I ran Typo for a while. Seems like needless complexity now, but at the time it was so hawt!
---
Okay, I've succumbed to the peer pressure, I've installed [Ruby on Rails](http://www.rubyonrails.org/) and I'll even use it for this site. As I said earlier, my hosting provider is [HostingPlex](http://www.hostingplex.com/redir.php?aff=blowmage), and is not yet well suited to host Rails applications because [mod_ruby](http://modruby.net/) and [FastCGI](http://fastcgi.com/) are not installed with a shared-hosting account. I've been begging for first class Ruby support, but so far nothing has come of it. Of course, folks could always [contact HostingPlex](mailto:sales@hostingplex.com?subject=Ruby and Rails Support?) and ask that they support Ruby and Rails in the future.

I've used and said nice things about [Rublog](http://rubyforge.org/projects/rublog/) in the past, but the reason I've decided to move from Rublog is the exact reason I chose it in the first place. Rublog works off the files on the file system, and not a database. I've found that if I need to make a change to an older article, the file's timestamp and subsequently the article's URL is changed. I've discovered that I like to correct spelling and grammar mistakes, and that ended up changing the chronological order of my site.

I could have extended Rublog to change this behavior (similar to the extensions used in [blosxom](http://www.blosxom.com/)), but I decided to switch to [Typo](http://typo.leetsoft.com/) which uses Ruby on Rails. Typo recently released a new version that caches the generated pages on the file system, so the blog serves static HTML files the majority of the time. Compared to the performance to the older versions of Typo, the performance seems good enough (for now), even without mod_ruby and FastCGI.

The first step is to download the latest version:

{% highlight bash %}
$ cd ~
$ wget http://rubyforge.org/frs/download.php/5602/typo-2.5.5.tgz
$ tar zxvf typo-2.5.5.tgz
{% endhighlight %}

Typo uses a database to store articles and comments, so the next step is going to be to create a new MySQL database. It seems HostingPlex doesn't allow you to create a new database using shell commands, so we'll use the tools available on CPanel. First, go to the CPanel and choose "MySQL Databases" and create a new DB named `typo`. This will actually create a new database named `*hostname*_typo`, because your account name is always added to the beginning. The same is true for user accounts. On the MySQL page create a new user named `typo`. This will create the user `*hostname*_typo`. Use the same MySQL page to add the `*hostname*_typo` user to the `*hostname*_typo` database with "All" privileges.

Next you click the "phpMyAdmin" link at the bottom of the page. This tool will allow you to create and maintain tables in your databases. Instead of creating each table manually, we will run the script that comes with Typo. Using a new instance of CPanel, go into the "File Manager", navigate to the `typo-2.5.5/db` directory and view the `schema.mysql.sql` file. Copy the contents of the file and paste them into the "SQL" tab in "phpMyAdmin". You should add 15 new tables to your schema.

Now that you have the tables created, you need to tell Typo what database to use. To do this, edit the `typo-2.5.5/config/database.yml` file and add your database credentials.

{% highlight yaml %}
production:
  adapter: mysql
  database: blowmage_typo
  host: localhost
  username: blowmage_typo
  password: super_secret_password
{% endhighlight %}

We need to tell Typo where to find Ruby and where to find the Typo scripts. We do this in the `typo-2.5.5/public/dispatch.cgi` script. (Because HostingPlex doesn't have Ruby installed, we installed a local version [earlier](/2005/05/27/installing-ruby).) We also need to tell Typo that we should be running in the production environment by setting the RAILS_ENV environment value. This will tell Typo to use caching for improved performance. Change the first few lines to this:

{% highlight ruby %}
#!/home/blowmage/local/bin/ruby
ENV["RAILS_ENV"] = "production"
require "/home/blowmage/typo-2.5.5/config/environment"
{% endhighlight %}

We also need to tell Apache to use the `dispatch.cgi` script instead of the default `dispatch.fgci`. In the `typo-2.5.5/public/.htaccess` file, change the last RewriteRule line to the following:

{% highlight text %}
RewriteRule ^(.*)$ dispatch.cgi [QSA,L]
{% endhighlight %}

Like all Rails apps, the "typo-2.5.5/public" directory is what the web server is supposed to serve files from. However, with our shared accounts we don't have permissions to change where Apache to serves the site. Instead, we will copy the files from the public directory to the directory that Apache uses. We also need to tell Typo where to write the cached files so that Typo and Rails don't load into memory with every request -- killing performance. The configuration isn't difficult, but it needs to be set in two different files. First, the `typo-2.5.5/config/environments/production.rb` file needs the following lines added to it.

{% highlight ruby %}
ActionController::Base.page_cache_directory = "/home/blowmage/public_html"
ActionController::Base.page_cache_extension = ".html"
{% endhighlight %}

Second, we need to tell Typo's `PageCache` class where to remove the cached entries from. (I believe this is a flaw in the current design, and I have opened a [case](http://typo.leetsoft.com/trac/ticket/328). As of this writing, the case has not yet been assigned.) So change the `typo-2.5.5/app/models/page_cache.rb` file to the following:

{% highlight ruby %}
class PageCache < ActiveRecord::Base

  cattr_accessor :public_path
#  @@public_path = RAILS_ROOT + "/public"
  @@public_path = "/home/blowmage/public_html"
{% endhighlight %}

Alright, we're almost there! We just need to copy the public files to our site.

{% highlight bash %}
$ cd ~
$ cp –r typo-2.5.5/public/* public_html
$ cp –r typo-2.5.5/public/.htaccess public_html/.htaccess
{% endhighlight %}

Now when you browse to your site you will be prompted for your login information. Enter your info and you will be redirected to the admin section. You can now create new articles and categories. Enjoy.
