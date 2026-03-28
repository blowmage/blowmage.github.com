---
title:  Installing Rublog on Shared Hosting
layout: post
desc:   Oh man, back in the day Rublog was all the rage.
---
One of my requirements when looking for a blogging engine was to have the engine pull the content from the file system. I just wanted a very simple and lightweight framework. I also wanted to edit my content files manually, and not through some web-based WYSIWYG interface. I'm not distrustful of more complicated blogging engines, I use them on my other sites, but I thought this site needed a different approach. I wanted to be closer to the metal.

I originally started out using [blosxom](http://www.blosxom.com/), and I liked that approach very much. But I've never been much of a [Perl](http://www.perl.com/) hack, and I was faced with either learning more Perl or finding a different solution. Once I found [Ruby](http://ruby-lang.org/) I knew I had my language, and I just needed an engine. I thought about porting blosxom to Ruby, but I decided that I would do better with [Rublog](http://rubyforge.org/projects/rublog/) as my starting point. Rublog isn't 100% what I'd like it to be out of the box, but I find it very easy to change to my liking. I figure one of the tenants of ["Don't Repeat Yourself"](http://www.artima.com/intv/dry.html) is not reinventing the wheel when you don't have to.

This may seem to fly in the face of the current [Rails](http://rubyonrails.com/) hype, (and I may indeed only be delaying the inevitable move to Rails) but until my hosting provider has more support for Rails I'm very happy with where I'm at with [Rublog](http://www.pragprog.com/pragdave).

You start by downloading and uncompressing the Rublog source:

{% highlight bash %}
$ cd ~
$ wget http://rubyforge.org/frs/download.php/1668/rublog-1.0.tgz
$ tar zxtar zxvf rublog-1.0.tgz
{% endhighlight %}

The next step is to copy the CGI script to your `public_html` directory. I've renamed it for reasons that I'll explain later. I also created a new directory to store all my blog entries. I find it best to not store these blog entries in the `public_html` directory, since you probably don't want folks to bypass the CGI script to get to the content.

{% highlight bash %}
$ cp rublog-1.0/rublog.cgi public_html/index.cgi
$ mkdir blog
{% endhighlight %}

Before you browse to `/index.cgi` and see the content, you need to change the CGI file to point to your local instance of Ruby. Be sure to change `/home/*blowmage*` to the path to your account's home directory:

{% highlight ruby %}
#!/home/<i>blowmage</i>/local/bin/ruby
RubLogSourceLocation("/home/blowmage/rublog-1.0")
{% endhighlight %}

The CGI will show you the Rublog documentation by default. Once you are comfortable with the way Rublog works, you should update the `index.cgi` script to look at the `blog` directory for the blog content:

{% highlight ruby %}
BLOG_DIR = "/home/blowmage/blog"
{% endhighlight %}

You can now browse your site through the script: `/index.cgi`.

However, I hate seeing a CGI script in the URL. I feel this doesn't [promote](http://www.useit.com/alertbox/990321.html) [good](http://www.w3.org/Provider/Style/URI) [URIs](http://www.w3.org/DesignIssues/HTTP-URI). If we could hide the CGI script then we are free to replace our site's implementation without breaking search engine results and people's bookmarks. Doing this is much easier than it sounds, and it involves our old friend the `.htaccess` file.

What we need to do is tell the `.htaccess` file to route all failed requests through our Rublog CGI script. This means that requests to existing resources such as other CGI scripts or HTML or image files will continue to be served. The requests for files that don't exist are sent to the Rublog CGI where Rublog determines what to serve for that request. This is accomplished by adding the following rewrite rules to the `.htaccess` file.

{% highlight text %}
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.cgi/$1 [L,QSA]
{% endhighlight %}

Rublog is now installed and will respond to requests even if they are missing the script path. However, Rublog wasn't written with the expectation that we would want to hide the script path, and the script path is embedded throughout the Rublog code. I have made additional changes to Rublog to hide the script path, but those are outside of the scope of this document.

That's it! Despite the hype machine working overtime promoting Rails, I've found the hardest part was installing Ruby. I hope this article has been of interest to you. If you have any suggestions or corrections [drop me a line](mailto:mike@blowmage.com?subject= Installing Ruby on HostingPlex). With Ruby installed, you're on your way to become more productive and have more fun. Good luck!
