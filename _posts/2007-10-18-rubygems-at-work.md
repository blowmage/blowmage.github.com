---
title:  Getting RubyGems to play nice at work
layout: post
desc:   I am so impressed with myself for hacking RubyGems that I announce it to the world.
---

At work I'm on Windows and behind a proxy server. I recently wiped my workstation and started over. After I installed Ruby I found the gems command not working, again. The reason is that my proxy server requires a username and password, and open-uri doesn't pass them. (Supposedly because keeping your username and password in an environment variable isn't secure, but at work I don't care as much about apps snooping my environment variables.)

To get things working I had to hack up open-uri a bit.  So I found the following code in `C:\ruby\lib\ruby\1.8\open-uri.rb`

{% highlight ruby %}
require 'net/http'
  klass = Net::HTTP
  if URI::HTTP === target
    # HTTP or HTTPS
    if proxy
      klass = Net::HTTP::Proxy( proxy.host, proxy.port)
    end
{% endhighlight %}

And I make the following change:

{% highlight ruby %}
require 'net/http'
klass = Net::HTTP
if URI::HTTP === target
  # HTTP or HTTPS
  if proxy
    # Add proxy user and password to work with the proxy server.
    klass = Net::HTTP::Proxy(proxy.host, proxy.port, proxy.user, proxy.password)
  end
{% endhighlight %}

Then I create the `http_proxy` environment variable with the value of `http://blowmage:s3cr3t@proxy:8080` and I'm good to go. Well, I have to log off and log back in for Windows to find and RubyGems to use the new environment variable. Oh, and be sure to create it as a user variable and not a system variable. :)
