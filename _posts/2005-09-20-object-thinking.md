---
title:  "Book Review: Object Thinking"
layout: post
desc:   "Have you read 'Object Thinking'? No? Then put the internet down and read it now."
---
> Despite any appearances to the contrary, objects are not something you do; objects are a way that you think.

[Object Thinking on Amazon](https://www.amazon.com/dp/0735619654?tag=blowmage-20)

David West's book "[Object Thinking](https://www.amazon.com/dp/0735619654?tag=blowmage-20)" leads you down the garden path that you can create something new, inventive, and more than the sum of the parts. Your program can be something more than just data with algorithms. And the way to do that is by simply changing your thinking about the problem. Quite a promise, fortunately for me (and hopefully you) it delivers on the promise.

This book is very different from every other [OOP](http://en.wikipedia.org/wiki/Object-oriented_programming) or [design pattern](http://en.wikipedia.org/wiki/Design_patterns) book I've ever come across. The first half of the book is an intriguing philosophical exploration into both the art and science of programming and how they came about. It is the author's premise that there are fundamentally two schools of thought in Computer Science; formalist thinkers and [hermeneutic thinkers](http://www.cis.drexel.edu/faculty/gerry/publications/interpretations/hermeneutic.html). The majority of programmers (and western culture) are formalists, who share notions of control, centralization, mathematical, hierarchy, predictability, and provability. While a small minority <sarcasm>of mostly [Smalltalkers](http://en.wikipedia.org/wiki/Smalltalk)</sarcasm> follow a more humanistic approach to the design of software. I have to say I found the author's portrayal quite compelling. The concept of designing code using a humanistic approach blew me away.

According to West's definitions, I am (or was) a formalist, and have been for as long as I can remember. Most every computer science or programming book I've ever read has been from the formalist position. I have worked hard and struggled many times to [grok](http://en.wikipedia.org/wiki/Grok) OOP and design patterns in efforts to improve my project's design. Every time I thought I had a handle on it I found a new way to break the complex model I built. I hope I'm not alone in admitting that I have struggled at times trying to find the "perfect" design solution for a given project.

The author then extends this discussion to define and differentiate computer thinking and object thinking. Computer thinking is limiting your design of the software to how you think the computer is going to perform. I found this way of thinking analogous to premature optimization, and we all know what [Donald Knuth](http://en.wikiquote.org/wiki/Donald_Knuth) has says about that; "Premature optimization is the root of all evil (or at least most of it) in programming."

Object thinkers strive to understand and model the domain fully, and letting their designs reflect the real world without respect to implementation. This may seem similar to use-cases, but I think there are important differences. Use-cases are a way to capture requirements, while object thinkers attempt to capture the behavior and responsibilities. Here is what the author has to say about thinking about object design:

> You cannot begin to understand what must be until you understand what is. This assertion has two corollaries:
>
> - Almost all of the objects you will ever need are already defined, and already have behavioral expectations associated with them, in the domain.
> - Almost all of the requirements of new development arise from a misalignment of behaviors and objects. Misalignment results when the wrong object (or group of objects) is providing a particular service, a service is more appropriately provided by a silicon-based object simulation instead of a carbon-based biological object, or, occasionally, no existing object is capable of providing the needed service.

West gives some great guidelines for composing objects throughout the book. Here are some of the ideas that rang true to me:

- Objects are lazy.
- The four presuppositions for Object Thinking:
    1. Everything is an object.
    2. Simulation of a problem domain drives object discovery and definition.
    3. Objects must be composable.
    4. Distributed cooperation and communication must replace hierarchical centralized control as an organizational paradigm.
- Eliminating centralized control is one of the hardest lessons to be learned by object developers.

Part of designing objects is delegating the right responsibilities to them. One way of determining the appropriateness of a design is to treat objects as if they were people. I found this analogy very effective when describing the book to others.

> Many readers will be uncomfortable with the object-as-person metaphor. A major source of discomfort arises from consideration of characteristics that humans have that we obviously cannot replicate (and probably do not want to replicate) in software. Emotions, true intelligence, and will are major examples. The problem is made worse when descriptions of objects and their behaviors seem to allude to precisely this kind of nonreplicable characteristic--for example, "Objects are lazy."
>
> Effective use of metaphor requires constant awareness that a metaphor is not a specification. It is often helpful to replace the metaphor--an object is a person--with a supposition: what if an object were a person? You can then ask questions about your design in this form: if an object were a person, would I write my code this way? Here are two examples:
>
> - If an object were a person, would I directly access part of its memory without its knowledge instead of sending it a message asking for the information I need? If a developer is obsessed with performance, direct access is tempting. But reminding yourself that, as a person, you would not like someone directly probing your brain without your knowledge reminds you that this is a bad design choice. (It leads to undesirable coupling.)
> - Technology exists that would allow me to make hardware connections to your brain. I could then build a control box that would allow me to raise your hand whenever I pressed a button. Eventually this same technology might allow me to make you perform a complicated dance. Again, as a person, you might not like this, and neither would an object if it were a person.

Once you have properly designed the objects to fit the problem domain, you should find that the application using the objects is less of a controller and more of a collaborator. The metaphor West uses is that of a theater and the application as a director putting the right actors/objects in the right place and the right time. This is in sharp contrast to the majority of projects I've worked on, which mostly maintain a death-grip on the application behavior. As I look back at the projects that I've been a part of, I've found that the more elegantly designed solutions have been the ones that have relied less on rigid control and more on the proper behavior of the actors/objects.

The book is not without its failings however. I found the latter chapters that focused on a process for discovering object responsibilities using [CRC cards](http://en.wikipedia.org/wiki/Class-Responsibility-Collaboration_card) less captivating. The author stated that this approach was presented to support and aid in the discovery of object's responsibilities, but that the approach was not mandatory to do so. To me the real value of the book was its challenge to how I thought, not what tools or practices I used.

In the end, this was the book I have been looking for. I was tired of reading about the implementations of OOP, and wanted a book to just help me "get it" on a deeper level. I hope to find more books like this in the future. Highly recommended.
