---
title:  Binary Lottery 2008
layout: post
desc:   "**Watch** as I demonstrate the Binary Lottery! **Feel** the excitement from MountainWest RubyConf 2008!"
---

This year at [MountainWest RubyConf 2008](http://mtnwestrubyconf.org/) we had a slew of books and t-shirts to give away to attendees. Like last year we printed each attendee's unique number on their badge in base 2 (binary). We would then randomly select a winner from the attendee list. But we would use their binary number in the reveal, showing only one number at a time. It might be cheesy, but we really enjoy it so deal. :)

This is what the badges looked like:

![My MWRC Badge. I'm number 11111111 because I made the badges. Its my right as an organizer! :)](/images/binary-lottery-2008/badge.jpg)

Last year I wrote a command line app that used [figlet](http://www.figlet.org/) to display the winner. You can see the [video of last year's Lightning Talk](http://mtnwestrubyconf2007.confreaks.com/session07.html) where I show the code if you are interested. This year I wanted to mix it up a bit, and I decided about 10 hours before the conference to try my hand at using [_why](http://whytheluckystiff.net/)'s [Shoes](http://code.whytheluckystiff.net/shoes/) to build a GUI version. So here it is:

{% highlight ruby linenos %}
require 'yaml'

# The source of much evil...
def update_digit(p, cnt, dig, wnr)
  if cnt < dig
    p.replace rand(2)
  else
    p.replace wnr[8 - dig].chr
    p.style[:stroke] = red
  end
end

# Use the full path because either Shoes is easily confused, or I am
users = YAML::load(open('/Users/blowmage/Lottery/users.yaml'))
winner = users[rand(users.size)] until (winner and winner[:eligible])
count = 0

Shoes.app :width => 900, :height => 700 do
  keypress do |k|
    count += 1
  end
  stack do
    para "MountainWest RubyConf 2008 Binary Lottery\n",
      "And your winner is...", :font => 'Helvetica 48px'
    lbl_name = para '', :font => 'Helvetica 128px'
    flow do
      a = para rand(2), :font => 'Helvetica 192px'
      b = para rand(2), :font => 'Helvetica 192px'
      c = para rand(2), :font => 'Helvetica 192px'
      d = para rand(2), :font => 'Helvetica 192px'
      e = para rand(2), :font => 'Helvetica 192px'
      f = para rand(2), :font => 'Helvetica 192px'
      g = para rand(2), :font => 'Helvetica 192px'
      h = para rand(2), :font => 'Helvetica 192px'

      animate(60) do
        update_digit(a, count, 8, winner[:number])
        update_digit(b, count, 7, winner[:number])
        update_digit(c, count, 6, winner[:number])
        update_digit(d, count, 5, winner[:number])
        update_digit(e, count, 4, winner[:number])
        update_digit(f, count, 3, winner[:number])
        update_digit(g, count, 2, winner[:number])
        update_digit(h, count, 1, winner[:number])

        if count >= 8
          lbl_name.replace winner[:name]
        end
        if count > 8
          # Click one more time to flag the user so they won't win again.
          lbl_name.style[:stroke] = red
          winner[:eligible] = false
          open('/Users/blowmage/Lottery/users.yaml', 'w') do |out|
            YAML.dump users, out
          end
        end
      end
    end
  end
end
{% endhighlight %}

Here is a sample of what the `users.yaml` file looked like:

{% highlight yaml linenos %}
---
- :number: "00000000"
  :name: Jonathan Younger
  :eligible: true
- :number: "00000001"
  :name: Brian Cooke
  :eligible: false
- :number: "00000010"
  :name: Justin Kay
  :eligible: false
{% endhighlight %}

Here is what the app looked like while running:

![Binary Lottery written in Shoes](/images/binary-lottery-2008/shoes.gif)

Logan Barnett also wrote a GUI using [JRuby](http://jruby.codehaus.org/) and [MonkeyBars](http://monkeybars.rubyforge.org/). I really hope he releases his version as well. Here is what the app looked like on the third draw, sort of an easter egg I discovered during the conference:

![Binary Lottery written in JRuby with MonkeyBars](/images/binary-lottery-2008/monkeybars.jpg)
