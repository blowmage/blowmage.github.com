---
title:  Extending Rublog with ERb
layout: post
desc:   This is where I attempt to prove my serious Rublog chops.
---
[Rublog](http://rubyforge.org/projects/rublog/) is a great web site system and has many interesting features. The script works off the files on the file system and supports different file types including RDoc, HTML, and plain text. I wanted to extend Rublog to also support embedded Ruby in `.rhtml` files, and here is how I did it.

I decided to use [ERb](http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/) instead of [eRuby](http://www.modruby.net/). eRuby is a native library, while ERb is written in Ruby, which makes it slower. I would have chosen to use eRuby, but I couldn't find any documentation on how to use it from a Ruby script, so I decided to follow the examples I could find online that were using ERb. I assume there are better ways to implement this, but this is good enough for me (for now).

Rublog makes supporting new file types easy. The first step is to create a new converter class. You'll need to inherit from the `BaseConverter` class. I followed the example of the `HtmlConverter` class that comes with Rublog. You can find the converter classes in the `*rublog*/convertors/` directory. Here is my `RHtmlConvertor.rb` script:

{% highlight ruby %}
# The rhtml convertor reads a file and performs the ERb render.
# Like the html converter, we look for a natural title.
# If we can't find it, we use the first line (removing it
# if it doesn't look like valid HTML)

require 'erb'
require 'BaseConvertor'

class RHtmlConvertor < BaseConvertor
  handles "rhtml"

  def convert_html(file_name, f, all_entries)
    body  = f.read || ""
    title = "Untitled"

    if body =~ /<title>(..*?)<\/title>/m
            title = $1
    elsif body =~ /<h1[^><]*>(.*?)<\/h1>/
            title = $1
    elsif body.sub!(/\A\s*([^\s<].*)/, '')
            title = $1
    end

    erb =  ERB.new(title)
    title = erb.result
    erb =  ERB.new(body)
    body= erb.result

    HTMLEntry.new(title, body, body, self)
  end

end
{% endhighlight %}

The next step is to add the new converter to your Rublog CGI script. Find where the `load_convertors` method is called and add the text "RHtml" to the list. You need to add it before the text "Html", or else the `HtmlConverter.rd` script will handle your `.rhtml` files. You need to be aware of the order the converters are loaded because the converters don't look at the file extension, they simply match the end of the file name.

Confused? Don't worry about it. Here is what the load_convertors line looks like in my CGI script:

    RubLog::load_convertors(*%w{ RHtml RDoc Text Html })

That's it, you should be ready to go. Add the following text to a file with the `.rhtml` extension to your blog directory and watch the magic.

{% highlight rhtml %}
<h1>Testing ERb and RHTML files in Rublog</h1>

<p>This is just a test of supporting *.rhtml files in
Rublog. This additional functionality will render the *.rhtml source
with ERb and display the output.</p>

<p>For example, the following code is executed below:</p>

<hr>

<pre><code>
&lt;p&gt;&lt;% 5.times do %&gt;Hello &lt;% end %&gt;Ruby!&lt;/p&gt;

&lt;ul&gt;

&lt;li&gt;Addition: &lt;%= 1+2 %&gt;&lt;/li&gt;
&lt;li&gt;Concatenation: &lt;%= "cow" + "boy" %&gt;&lt;/li&gt;
&lt;/ul&gt;
</code></pre>

<hr>

<p><% 5.times do %>Hello <% end %>Ruby!</p>
<ul>
<li>Addition: <%= 1+2 %></li>

<li>Concatenation: <%= "cow" + "boy" %></li>
</ul>

<hr>

<p>This concludes our test...</p>
{% endhighlight %}

You may be asking yourself why this would be necessary, or even desired. To be honest part of why I wrote this was to see if I could do it, but I do see value in enabling a piece if web content with server-side functionality. It allows me to add new behavior without duplicating the navigation and presentation that Rublog gives you. At least, that's how I justified it. ;)
