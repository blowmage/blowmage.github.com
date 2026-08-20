---
layout: post
title: "Everybody Guesses"
desc: "The one where we turn guesses into architecture."
---

I've watched the same mistake a dozen times over twenty years, and it never looks like a mistake when it happens.

It comes in as progress.
A team decides to clean something up and draws a diagram that finally makes the whole thing make sense.
The people in the room understand why the code is divided that way.
The reviewers nod, and I nod.
For a few months it's the thing people point to when they explain the system.

Then somebody needs to change one small thing.
That small change reaches into parts of the system they didn't know they were responsible for, then breaks somewhere they can't point to.

So what was wrong with the design?
Nothing.
The diagram is still accurate.
It describes what the system does, just as it did the day somebody drew it.

What it never held was the why, and neither did the code.
The reasons lived in the heads of the people who did the refactor.
Somebody asked a question at standup and got an answer in fifteen seconds, and that fifteen seconds was the documentation.
Nobody wrote it down because nobody had to.
(The person who knew was six feet away.)
Then the person with the answer moved to another team, and the code stayed, and the reasons didn't.

For most of my career that was survivable.
Typing faster never protected us.
The work passed through enough conversations that somebody usually asked why before a missing reason caused trouble.

Sometimes we still lost enough of the why to make a project miserable.
Lose enough people at once and you find out quickly how much of the system was living in people's heads instead of in code or documentation.

But that kind of failure stayed rare enough that we treated it as bad luck rather than something to design against.

Now an agent can finish the change before anybody asks why.

## Code Says What, Not Why

The source doesn't have to change for a codebase to rot.
Sometimes the first thing we lose is the why.

Software is intellectual work that doesn't explain itself.
The code tells you what happens without telling you why anybody wanted that, so every reader has to supply the why.
We've always started by reading code and guessing at intent.
When the guess felt wrong, we asked somebody.
Agents start in the same place, but a plausible answer lets them keep building.
When the guess is right, the output is good and arrives fast.
When it's wrong, you don't necessarily get an error.
You get working software that solves a problem nobody had.

Slop begins with an assumed why that nobody corrected.
Once that guess reaches the codebase, later decisions start treating it as fact.
Agent speed lets the same mistake compound even faster.

So is the fix a smarter model?
Sometimes.

Some reasons were written down but are hard to find.
A model that can search the repository, issue tracker, and old design documents will recover more of them than most of us bother to.

Other reasons were understood but never recorded.
They surfaced in a hallway or in the fifteen-second answer at standup.
A model can infer them, just as a new teammate can, but inference is still a guess.

Then there are decisions nobody has made yet.
Someone who knows why the customer needs a feature doesn't know why the cache is there.
Someone else understands the cache but wasn't in the room when the business constraint was set.
Neither person is holding out on you.
They each have a piece.

Intent changes while the software is being built.
A design argument can move it, and production can prove an assumption wrong.
Sometimes two people discover they meant different things by "customer."

As the work moves through the software lifecycle, the team gets repeated chances to challenge what it intends to build.
One-shot prompting skips some of those opportunities.

## Yesterday's Guess Is Today's Documentation

Agents guess wrong, just as people do.
We've built a whole discipline around catching those mistakes.
The danger is a wrong guess that leaves no mark.

Suppose you ask an agent to add a feature.
It reads the surrounding code, finds a pattern, and follows it.

Good.
That's what we want, and it's what a new hire does in their first week.

But suppose the pattern was a workaround added years ago to avoid a library bug that has since been fixed.
Nobody ever went back, so all the agent sees is a repeated pattern in code that ships.
It does the reasonable thing and writes one more instance.

Now there are more of them than there were.

The next reader sees a stronger pattern, whether that reader is a person or an agent.
What used to be one workaround now looks like a convention, and a convention looks like a decision somebody made on purpose.

The guess got promoted to documentation, and nothing records that it was ever a guess.

Normally a bad assumption eventually collides with evidence.
A test might fail, or a reviewer might catch the contradiction before it reaches production.
That's how the work gets corrected.

This guess can produce no signal at all.
Everything passes, and the review looks fine for the worst possible reason.
The new code matches the code around it, which is exactly what we ask reviewers to check.

When you don't know why code is there, the right move is to stop and find out.
An agent keeps going because nothing in this loop tells it to stop.

I don't have the whole why either, because nobody does.
The agent assumes, and if I accept the assumption because the code works, it becomes the codebase's account of itself.

Two participants, and neither of us has the why.

One bad guess is not a catastrophe.
The danger comes from making and compounding guesses faster than people can inspect them.
Florian Herrengt wrote an [essay](https://blog.florianherrengt.com/ai-removing-middle-class-software-engineering.html) about where that leads across a whole team.
It's good.
Go read it.
The volume of generated change eventually overwhelms the people responsible for understanding it.
It starts here, when one reasonable guess becomes a fact the next change will trust.

## No Obvious Deficiencies

> There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.
> The first method is far more difficult.

I love this quote from [Tony Hoare's 1980 Turing Award lecture](https://wiki.c2.com/?TwoWaysToDesign).
It's usually read as a warning about complexity because complicated systems hide their bugs.
But what is considered *obvious* depends on who is looking.

You can read the what in the code, but you need the why to know whether it's wrong.
Take away the supposed-to and the code still does something.
You just can't tell whether it's the right something.

That's why the first method is far more difficult.
To make a design obviously correct, you have to know what correct means.
The second way only needs everything to look reasonable.

Agents are extremely good at making things look reasonable.
Producing code that fits the local conventions and comes with a confident explanation is exactly what we ask agents to do.
If a piece is missing, another prompt adds it.
If the new piece doesn't quite fit, another abstraction smooths the seam.
(I hate the word "seam".
AI uses it often, and it's annoyingly more accurate than my beloved "boundary".)

So the second way got cheap.
Nobody sits down intending to build a system with no obvious deficiencies.
It happens when each prompt makes the last guess look more deliberate.

Stronger models don't remove this failure.
They can make a mistaken premise look coherent enough to survive review.

## The Program Isn't the Point

If the why isn't in the code, where is it?

Peter Naur answered that in 1985 in ["Programming as Theory Building"](http://www.naur.com/comp/c1-4.html).
His argument is that we've misidentified what programmers produce.
The theory in their heads is the primary product, and the program text is secondary.

By *theory* he means what lets a programmer explain the program.
They understand how the code maps onto the world outside it.
They can explain why each part exists and respond when somebody asks for a change.
Programmers who hold the theory can answer questions the source can't.
Programmers who don't can read every line and still guess.

Naur goes further.
He argues that an essential part of it "could not conceivably be expressed, but is inextricably bound to human beings."
Hand a codebase to a new team and they don't inherit the same theory.
They construct a different one.

The team maintaining the refactored system had the program and the diagram, but not the theory behind them.
It's also why the person arguing for a rewrite is so often the newest person on the team.
They're not necessarily arrogant.
They're reading code whose theory they don't have, and from the outside that can look exactly like bad code.

So does an agent escape the problem Naur described?
It helps with one part of it.

Retrieval gets much cheaper.
Give an agent the repository and the issue tracker and it can assemble more recorded context than most of us go looking for.
That matters, and we should take advantage of it.

That advantage has a limit.
Retrieval only finds what somebody captured.
It can't recover a conversation that was never recorded or a decision nobody has made.
Better models may guess right more often.
But we still have to explain what never got written down and decide what happens next.

## You Had to Be There

Naur tried to transfer the theory with documentation.
One team handed another team a compiler along with annotated source, written design discussions, personal advice, and full documentation.
The receiving team was capable and motivated, but they proposed changes that would have wrecked the design.
The things they missed had been discussed at length in the documents they were holding.

The original team captured the intent on purpose, and it didn't take.

Naur's answer wasn't better documentation.
It was apprenticeship: a new programmer had "to work in close contact with the programmers who already possess the theory."
He compares it to learning an instrument under a teacher.
(The documents weren't useless; they just couldn't do the apprenticeship's job too.)

> [Individuals and interactions over processes and tools.](https://agilemanifesto.org/)

That's the first value in the Agile Manifesto, which turns twenty-five this year.
The overlap isn't an accident: Alistair Cockburn, one of the people who signed the manifesto, [reprinted Naur's paper](https://gwern.net/doc/cs/algorithm/1985-naur.pdf) in the back of *Agile Software Development*.

In 1985, close contact meant two people at one desk.
In 2001, it meant a team in one room.
Today it can mean pairing remotely through a tool somebody had to show me how to use.
We've stretched what close contact means before, and it kept working.

An agent session can create another kind of close contact.
I'm not handing over a document and leaving.
I answer questions during the work, especially when the obvious approach conflicts with something the code can't show.
Those fifteen-second answers happen throughout the agent session.

An agent has none of the team's shared history.
I fill in what the agent can't retrieve, and we test the design against evidence as it takes shape.

We can preserve some of the why.
Notes can explain why a decision went the way it did while the reason is fresh, and tests keep expected behavior available as evidence.
Those artifacts help the next person, but they don't replace the interaction.
Stay in the room.

## So Write a Better Spec

Somebody is going to read all of that and hear me asking for more documents up front.
Fair, because it sounds like it.
The nearest idea is spec-driven development, which I've been doing for about a year.
It works by giving the agent better context.

That context can arrive as a plan, a conversation, a test, or a correction halfway through the work.
A plan makes the current understanding concrete enough to inspect, but it can't contain decisions nobody has made.
Make it detailed enough to determine every line and you've written code in the one language the computer can't run.
The teams I've seen do this well treat the plan as scaffolding for a conversation, then archive it when the work ships.

Not every task needs a plan or an extended conversation.
One-shot prompting works fine when one person holds the relevant intent and the result is cheap to throw away.
There is nobody else's intent to include, and little cost if the guess is wrong.

A side project that only a dozen people will ever run and a ten-year-old system somebody has to keep alive don't need the same process.
Most arguments about agentic development amount to someone building the first kind of software telling someone maintaining the second how to work, or the reverse.
They do need the same standard.

## What Good Looks Like

We use numbers as proxies for quality because they're easy to collect.
Coverage tells us which code ran, while defect counts can reveal patterns worth investigating.
Cycle time shows where delivery gets stuck.
I want all of that information, and yet none of it is quality.

Quality shows up when the next person tries to change the system.
They need to find the relevant behavior without reading half the application and understand what else their change will touch.
Green tests should give them evidence that the software still means what it meant before.
The next person shouldn't need a scavenger hunt to find those reasons.

Some of that confidence can be automated.
Linters hold the opinions that fit into rules, while tests preserve behavior we know matters.
What remains is judgment.
For me, that means noticing when reasonable choices produce a design that's harder than the problem deserves, then asking whether I'd want to debug it under pressure.

I've maintained enough of my own good ideas to become suspicious of them on sight.
Some aged well.
Others spent five years collecting conditionals until nobody could remember what problem they solved.

That suspicion is a reason to look harder, not a reason to win the argument.
When somebody shows me I'm wrong, my suspicion doesn't get a vote.

Judgment that can't be explained is just seniority.
If the quality standard disappears when the most experienced person leaves the review, it was never part of the system.

## Make Feedback Cheap Too

[Software factories](http://hdl.handle.net/1721.1/17131) predate agents.

Their useful lesson is arranging work so mistakes become visible before an exhausted inspector sees the finished product.
For software, repeatable checks matter more than raw code volume.

Cheap implementation tempts us to put an experienced reviewer at the end and ask them to catch everything.
One-shot prompting on a mature system creates one very fast station, with a person at both ends and no feedback in between.
That's a machine with branding.
Nobody reviews well for six hours a day.

Move the feedback earlier.
Research the current behavior before designing a replacement, then ask for the test that will prove the next change before implementation begins.
(Watch the test; agents are surprisingly willing to *improve* it until the implementation passes.)
Research and tests should challenge the main decisions before the change reaches review.

Extra agents can do some of their best work before anyone writes code.
One can trace the current behavior while another challenges the proposed design.
Compare their findings before choosing an approach, then keep each implementation step small enough to discard.

Evidence can't guarantee the result, but it can expose a bad premise before the change becomes expensive to undo.
Dex Horthy and Jan-Niklas Wortmann explore this approach further in their [conversation about agentic coding](https://www.youtube.com/watch?v=5FcHP22u0zs).
It's good.

Faster agents make smaller steps practical.
Stop after the research and read what they found.
Keep each decision close to the evidence that can correct it.
That's still XP.
(But with a new pairing partner!)

## Someone Has to Say No

My grand unified theory of software engineering in the agentic age contains almost nothing new.
That's mildly disappointing because *grand unified theory* looks tremendous in a conference abstract.

Almost all of it predates my career.
The new part is the pressure.
Agents can produce more change than our quality practices can absorb.
They also give us the capacity to run those practices earlier and more often.

What happens next depends on what we reward.
If we measure generated output, we'll get more of it.
But if we build around understanding and evidence, we'll find out sooner when we're wrong.

The model can write the change.
I still have to decide whether it belongs in the system, so the change has to stay small enough to inspect.
Sometimes the code works and the tests pass, but I still can't explain why the abstraction exists.
That's enough to stop.

Not forever, just long enough to understand what we're committing the next person to maintain.
I'll get that judgment wrong sometimes.
When the evidence proves me wrong, I have to change my mind.
But a green build doesn't relieve me of making the call.

A change can have no obvious deficiencies and still be wrong in a way the build can't detect.
Somebody still has to say no and explain why.
