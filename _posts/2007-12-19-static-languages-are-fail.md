---
title:  The Failure of Static Languages
layout: post
desc:   A point-by-point rebuttal of criticism I received for thinking static languages don't work.
---

So, [Bertrand Le Roy](http://weblogs.asp.net/bleroy/) left a comment on my [previous post](https://blowmage.com/2007/12/18/the-rubification-of-csharp) calling me out for saying, "static languages have failed". I think I need more space than the comment field to make a full reply, so I'll do it here with a sensational title to gain the maximum attention. ;)

> I usually enjoy reading your blog but wow. "Static languages have failed"? Just wow. Don't you think that viewpoint might be just a little myopic?

Like I said in my comment, I hope this view isn't myopic. The last 20+ years have been dominated by static languages like C++, Java, and C#. I believe we are in the midst of a dynamic language revolution and I expect the landscape to look dramatically different in 3 to 5 years. I'm talking about the entire IT landscape, not just the .NET or J2EE landscape (although they will look different as well).

My point isn't that static languages aren't useful and won't continue to be used. But they aren't where I believe the majority of development will be done in the future. Just as you would build a departmental client app using VB instead of C++ 10 years ago, you will be using a dynamic language instead of a static language in 3-5 years.

> Because they don't work for you or for the microcosm you're hanging out in doesn't mean it doesn't work for the rest of the world.

My point is that static languages don't work *for you*! Creating an interface just to run a unit test is a sign (to me) of a weak language. The existence of so many design patterns and anti-patterns are also a sign (to me) of a weak language. There are and will be better languages that allow you to get your work done faster while being more maintainable.

> Static languages have been and continue to be very successful. Maybe it would be a little more productive to recognize the merits of each side before making definitive judgements like this one.

I don't mean to take any thing away from static languages like C# and Java. Hell, I program in C# every single day. Well, every work day. And I certainly don't hate C#, but I don't love it like I love Ruby. I think I've been a good soldier in the static camp long enough to make up my own mind and voice my opinion. I don't do so out of ignorance.

> It might also help the dynamic language world to recognize major advances in language design (which imo Linq is) so that they can incorporate similar concepts in their own favorite technology.

I know many folks have been excited by the prospect of using LINQ from IronRuby. But honestly I don't know how to take advantage of LINQ from IronRuby. If you have your local objects, you can already iterate and .map() or .collect() on them. And there are already ORM and data access libraries that will use a DSL or take a closure and query your data store. [Jim Weirich](http://onestepback.org/) recently discussed building such a library at [RubyConf](http://rubyconf2007.confreaks.com/d1t1p2_advanced_ruby_class_design.html).

LINQ looks to be very useful and a huge win while working in C# and VB.NET. But I don't need that in a dynamic language like Ruby because I already have those facilities. So I don't see LINQ as a major advance in language design.

> One thing that can be said from the C# team (which from our own microcosm looks very very far from "desperate") is that *they* know how to keep an eye on the other side and incorporate what looks interesting, while not compromising the integrity of the language.

I didn't mean to imply that the C# team is desperate, just that the language is trying hard to stay relevant amidst the dynamic language onslaught. There are alot of reasons why I'll do my best to stay on the .NET platform, but I can't say the same for C#. From the beginning the CLR was designed to support multiple languages, so I've always found the staunch defense of C# confusing. Particularly amongst the [Alt.NET](http://altdotnet.org/) crowd, but that's a topic for a different post. :)

> In that respect, anonymous types capture an essential aspect of dynamic languages while remaining strongly-typed (and thus keeping IntelliSense working).

I think there is the perception that you can't get IntelliSense&copy;&trade; or performance with dynamic languages. You certainly can. We might not be there 100% just yet, but we will get there. [NetBeans](http://www.netbeans.org/) and [Komodo](http://www.activestate.com/Products/komodo_ide/) and [Ruby in Steel](http://www.sapphiresteel.com/) are good examples of Ruby IDEs with autocomplete.

> You might also want to consult the documentation for anonymous methods, which do capture surrounding local variables (since 2.0), which in my book is pretty much what a closure is.

Great point! Anonymous methods are definitely closer to closures than anonymous delegates. But the point I tried to make about anonymous delegates wasn't about local variables as parameters; it was about accessing private class variables. Once you replace the delegate you lose the ability to access private class variables.

> Don't want to look aggressive or anything, sorry if I did, not my intention. Keep up the good work and the provocative thinking.

No way man, I appreciate you wanting to engage in a discussion about this! There are a couple more points I want to make to clarify what I'm trying to say but didn't fit well in response to you comment.

I say static languages have failed because the features we are looking for in future languages are at odds with static typing. For example, static languages achieve polymorphism through inheritance (or implementation of an interface) instead of duck-typing/composition/parametric polymorphism. So you have an explosion of interfaces when you want to test your code. But those interfaces aren't for reuse as much as they are for testing. They don't really help the reason your code exists, just your test cases. You end up with all that code cruft adding little value because static languages achieve polymorphism through tightly coupling implementations. Meanwhile Ruby promotes object composition over class inheritance.

My problem with the Rubification of C# is that C# has incorporated some of the aspects of Ruby, but not the real power of Ruby. Its all sugar and no meat. OO in Ruby or Smalltalk is very different than OO in C# or Java. I've had many discussions where other developers have said they are a better C++ or Java or C# programmer because of the time they've spent with Ruby. That isn't because of Ruby's syntax, that is because of Ruby's fundamentally different understanding of objects.

Am I right or am I wrong? Please let me know. You can either leave me a comment or send me [hate](mailto:mike@blowmage.com?subject=You Suck! Static Languages ARE the Future!) (or [fan](mailto:mike@blowmage.com?subject=You Rock! Static Languages are SO 2007!)) mail.
