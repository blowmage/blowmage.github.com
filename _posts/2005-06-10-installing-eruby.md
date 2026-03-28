---
title:  Installing eRuby on Shared Hosting
layout: post
desc:   eRuby was an early attempt at getting web responses from Ruby.
---
Now that we've got [Ruby installed](/2005/05/27/installing-ruby), we can use it to write CGI scripts. But that is so 1995, isn' t there a better way to use Ruby to create web sites? Of course there is, and the first step is [eRuby](http://raa.ruby-lang.org/project/eruby). eRuby interprets Ruby code that is embedded in a text file. Our interest is embedding Ruby code to a HTML file, much like [Microsoft's](http://microsoft.com/) [Active Server Pages](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnanchor/html/activeservpages.asp), [Sun's](http://sun.com/) [Java Server Pages](http://java.sun.com/products/jsp/), and [Zend's](http://zend.com/) [PHP](http://php.net/).

Just like installing Ruby, this is surprisingly easy to do, as we simply enter these commands in at the shell:

{% highlight bash %}
$ cd ~
$ wget http://www.modruby.net/archive/eruby-1.0.5.tar.gz
$ tar zxvf eruby-1.0.5.tar.gz
$ cd eruby-1.0.5
$ ./configure.rb --prefix=$HOME/local && make && make install
$ cd ~
$ cp local/bin/eruby public_html/cgi-bin/eruby
{% endhighlight %}

We've installed, compiled, and copied the `eruby` executable file to our site's `cgi-bin` directory. Our site is now ready to use the executable to parse our HTML files for Ruby code and execute it. To do this, we need to associate our files with the CGI executable. Parsing our files for Ruby code does add some overhead, so we probably don't want to parse every single file, so we'll associate the file extension `.rhtml` with `eruby`. We make this association in the `.htaccess` file in the `public_html` directory by adding these lines:

{% highlight text %}
AddType application/x-httpd-eruby .rhtml
Action  application/x-httpd-eruby /cgi-bin/eruby
{% endhighlight %}

If you don't have an `.htaccess` file in your `public_html` directory then simply create one. Let's test this! Create a new file in your `public_html` directory named `hello.rhtml`. The file should include the following lines:

{% highlight rhtml %}
<html>
<head>
<title>Hello Ruby!</title>
</head>
<body>
<h1>Hello Ruby!</h1>
<p>
<% 5.times do %>
Hello
<% end %>
Ruby!</p>
</body>
</html>
{% endhighlight %}

When you browse to the file you will see a message that displays "Hello Hello Hello Hello Hello Ruby!" then you have officially installed eRuby, congratulations.
