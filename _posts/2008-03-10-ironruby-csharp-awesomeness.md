---
title:  IronRuby + C# = Awesomeness
layout: post
desc:   Slides and code from a presentation I gave about a fantastical future where we didn't use a computer language just because a giant corporation told us to.
---
Saturday I gave a session at the third [Boise Code Camp](http://www.boisecodecamp.org/). [Boise](http://www.cityofboise.org/) is my home town, so I am always happy to get back and enjoy the nostalgia. The Boise Code Camp this year was huge! As of Saturday morning there were 495 folks registered to attend, and 370 that were actually there. Crazy. Much props to the folks running it this year. Having helped organize the first Boise Code Camp and organized both MountainWest RubyConfs I know how hard they worked to pull this off. Great work guys!

Here are some of my notes for my session. I use a modified [Takahashi Method](http://presentationzen.blogs.com/presentationzen/2005/09/living_large_ta.html) of presentation, so my slide deck doesn’t make much sense by itself. Also, I only gave three demos, and the code was really simple because I can’t type and talk at the same time. Another reason for limited demo code is that alot of these concepts are new to folks so I wanted to go slow and make sure I brought everyone along. Disclaimer finished, here is the [slide deck](https://blowmage.com/assets/2008/3/10/ironruby-csharp-awesomeness.pdf) and the [code](https://blowmage.com/assets/2008/3/10/ironruby-csharp-awesomeness.zip). (Watch for the random Spider-Man appearance.)

### Can a Computer Language be Beautiful?

I believe that software developers tend to create an exclusive culture around their technical knowledge. Most think that you need to “earn” your knowledge, and will respond to naive questions with answers such as “RTFM” or “Just Google it”. While this is understandable I think this attitude hurts more than it helps in the long run.

Seeing as the majority of sessions are Microsoft-centric, I kept my observations to Microsoft technologies. I’ve got my own path through Microsoft technologies and really came to my own on “classic” ASP. ASP and COM were a great leap forward for web programming compared to what we were using before, but it was typical to end up with spaghetti code. The introduction of .NET was seen as a solution to ASP’s “loose” code, but it came at a cost of restricting how expressive our code could be, making beautiful code more difficult

It shouldn’t come as a surprise that Ruby folks refer to Ruby code as “beautiful”. This is one of the things that I really love about the Ruby community. Ruby’s notion of Object Orientation is fundamentally different that C++/Java/C#. And Ruby’s meta-programming enables you to place responsibility where it belongs, and write expressive code by avoiding the accidental complexity typical of static language. This is why I like to think of Ruby as beautiful.

I gave the example of trying to enable sorting of domain objects in a DataGridView control, because that just happened to come up yesterday. The .NET solution is to inherit from BindingList and implement 4 properties and 2 methods. The Ruby solution is to simply call the array’s `sort_by` passing a block of how you want the item’s sort value to be calculated. My point being that Ruby code tends to rely on on the trust of the developer, while there is no way to quantify that trust in statically-compiled C#.

### What is Polyglot Programming?

Another term for “Polyglot Programming” can be “Language Oriented Programming”, or using the right tool for the right job. I asked the folks attending if their language is right for their task, and a few responded that they thought C# was indeed the right language. I countered by putting forth my opinion that unless it is a domain specific language it probably isn’t the right language. DSLs can express the domain instructions without all the cruft or implementation instructions. I’m not sure how well this was received, as most seemed skeptical.

I also soap-boxed a bit about some developers defending C# to their dying breath, and the irony that the CLR was intended for multiple languages. Then I went into my belief that static languages are not the future, and in 5 years we will be using a dynamic language for the majority of work we are using static languages for today. You can read more about my thoughts on this [here](https://blowmage.com/2006/2/17/ruby-thinking) and [here](https://blowmage.com/2007/12/18/the-rubification-of-csharp) and [here](https://blowmage.com/2007/12/19/static-languages-are-fail).

But I don’t believe that C# will or should go away. C# will still be the best language for system-level coding, because it is so aligned to the CLR. What I do believe is that we will stack dynamic languages on top of the static languages, and DSLs on top of the dynamic languages. You can hear more about this in my [Rubiverse Podcast with Ola Bini](https://archive.org/details/RubiversePodcast/rubiverse-5-ola-bini-on-polyglot-programming.mp3).

### What can IronRuby do now?

IronRuby is not complete and therefore not 100% compatible with MRI. But, there are some great things that we can do with IronRuby today. I gave four examples of how we can use IronRuby now. I didn’t have a demo for the testing though, I ran out of time.

*   Calling and using .NET objects from IronRuby
*   Replacing tests written in C# with tests written in IronRuby
*   Replacing application code written in C# with code in IronRuby
*   Provide Scripting in Application