---
title:  Installing Ruby on Shared Hosting
layout: post
desc:   I attempt to show that installing Ruby on shared hosting doesn't have to suck. I think I failed.
---
The hosting provider for this site is [HostingPlex](http://www.hostingplex.com/redir.php?aff=blowmage). HostingPlex doesn't support [Ruby](http://ruby-lang.org/) "out-of-the-box", which is unfortunate because Ruby is gaining momentum and has a lot of mind share with web developers right now. I've made the following modifications to my account in order to run Ruby and I hope you find them useful. Hopefully the steps I tool will translate to other hosting providers and will be useful to others.

Much of this information is a direct result of an excellent [article](http://www.viarails.net/articles/2005/04/22/installing-typo-on-a-freeshell-org-account) on [Wesley Moxam](http://www.viarails.net/)'s blog. I am going to initially focus on installing and using Ruby and Rublog, and not necessarily [Rails](http://rubyonrails.com/). Although once Ruby is installed and configured, installing and using Rails shouldn't be too hard to do. However, HostingPlex is not well suited to Rails hosting (yet) because some server-side configurations such as [mod_ruby](http://modruby.net/) and [FastCGI](http://fastcgi.com/) are very difficult or impossible to install with a shared-hosting account. Hopefully HostingPlex will change their mind and start supporting Ruby and Rails in the future.

Ruby is not currently installed on the HostingPlex servers, as I assume is the case for the majority of Linux hosting. To install Ruby, you'll need access to the shell for your account. The Unix shell is similar to the Command Prompt on Windows machines. You can access the shell through your CPanel interface by clicking the "SSH/Shell Access" link.

We'll start with a simple command to ask Ruby to tell us what version it is.

{% highlight bash %}
$ ruby -v
{% endhighlight %}

If you don't have Ruby installed you should see a message such as "command not found". If you do have Ruby installed, then you can skip ahead.

To install Ruby we will download and compile Ruby from the source code. We'll install Ruby into a new directory named `local`, because we don't have permissions to install Ruby for all users on the server. We will follow this process for the other programs we'll eventually install.

{% highlight bash %}
$ cd ~
$ wget ftp://ftp.ruby-lang.org/pub/ruby/ruby-1.8.2.tar.gz
$ tar zxvf ruby-1.8.2.tar.gz
$ cd ruby-1.8.2
$ ./configure --prefix=$HOME/local && make && make install
{% endhighlight %}

Our next step is to ask Ruby what version is installed.

{% highlight bash %}
$ ruby -v
{% endhighlight %}

Did that fail again? Don't worry, this is because we installed Ruby in a non-standard location, and the shell doesn't know to look in the new directory. To make the shell look in that directory, run the following command:

{% highlight bash %}
$ export PATH=$HOME/local/bin:$PATH
{% endhighlight %}

Now you should be able to ask Ruby for its version without receiving an error message. Of course, it would be a pain to run the preceding `PATH` command every time we connected to the server, so we'll create a new file named `.bash_profile`. In this file, you should add the now following line:

{% highlight text %}
PATH=$HOME/local/bin:$PATH
{% endhighlight %}

Now every time you connect to the server through the shell, your account will look in your `local` directory for Ruby.

Let's test this! Create a new file in your `public_html` directory named `hello.cgi`. The file should include the following lines:

{% highlight ruby %}
#!/home/blowmage/local/bin/ruby
# hello.cgi
puts "content-type: text/html"
puts
puts "<html>"
puts "<body>"
puts "<h1>Hello Ruby!</h1>"
puts "</body>"
puts "</html>"
{% endhighlight %}

The home directory for my account on HostingPlex is `/home/*blowmage*`. You'll want to change the first line of your script from `/home/*blowmage*` to the path to your account's home directory. If you do not, then the script won't know where to find Ruby and the script will fail. If you see a message that displays "Hello Ruby!" then you have officially installed Ruby, congratulations.
