---
layout: post
title: "Everybody Guesses"
desc: "The one where AI agents turn yesterday's guesses into tomorrow's architecture."
---

I've watched the same mistake a dozen times over twenty years, and it never looks like a mistake when it happens.

It comes in as progress.
A team decides to clean something up, draws a diagram that finally makes the whole thing make sense, and puts a clean seam where there used to be a tangle.
The reviewers nod, and I nod.
For a few months it's the thing people point to when they explain the system.

Then somebody needs to change one small thing, and it touches a service, a migration, and a cache they didn't know they were responsible for.
They try anyway, and it breaks somewhere they can't point to.

So what was wrong with the design?
Nothing.
The diagram still looks right because it's right, accurate the day somebody drew it and accurate now.

What it never held was the why, and neither did the code.
The reasons lived in the heads of the people who did the refactor.
Somebody asked a question at standup and got an answer in fifteen seconds, and that fifteen seconds was the documentation.
Nobody wrote it down because nobody had to.
(The person who knew was six feet away.)
Then the person with the answer moved to another team, and the code stayed, and the reasons didn't.

For most of my career that was survivable.
Typing speed wasn't what protected us; it has never been the limiting factor in getting software done.
Interaction did, because the work moved through enough conversations for a missing why to surface.

Sometimes one got away from us anyway, and those were miserable projects.
Lose enough people at once and you find out quickly how much of the system was living in people's heads instead of in code or documentation.

But that kind of failure stayed rare enough that we treated it as bad luck rather than something to design against.

Agents make it easier for a finished-looking change to skip the interactions that used to expose the missing why.

## Code Says What, Not Why

A codebase doesn't rot because the source changes while we're away; the source is exactly where we left it.
What rots is the why.

Software is intellectual work that doesn't explain itself.
The code tells you what happens without telling you why anybody wanted that, so every reader has to supply the why.
We've always done it the same way.
Read the code, guess the intent, and ask somebody when the guess feels wrong.

Agents do exactly that.
They read the code, fill the gap with something plausible, and build on top of the guess.
When the guess is right, the output is good and arrives fast.
When it's wrong, you don't necessarily get an error.
You get working software that solves a problem nobody had.

That's what slop is.
Code isn't slop because an agent wrote it.
It's slop because whoever wrote it was working from an assumed why that nobody corrected, and then a thousand decisions got made on top of it.

So is the fix a smarter model?
Sometimes.

*Missing context* hides several different problems, and smarter models help with some more than others.
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

The intent gets built while we work.
It appears when somebody argues about a design and changes their mind, or when production proves an assumption wrong.
Sometimes two people discover they meant different things by "customer," and the intent changes again.

That's why the software lifecycle matters.
Research finds the pieces nobody has.
Design makes intent concrete enough to argue with.
A test makes part of it executable, and review checks it against the result.
Production introduces the whole arrangement to reality.

Every step exists because somebody's why is incomplete.

When several people have to keep changing the software, one-shot prompting doesn't just skip process.
It skips part of how the intent gets made.

## Yesterday's Guess Is Today's Documentation

The problem isn't just that an agent guesses wrong.
People guess wrong constantly, and we've built a whole discipline around catching it.

The problem is that a wrong guess doesn't leave a mark.

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

Normally a bad assumption eventually produces an error.
A test fails, production breaks, or a reviewer catches the contradiction.
That's how the work gets corrected.

This guess produces no such signal.
The code compiles, the tests pass, and the review looks fine for the worst possible reason.
The new code matches the code around it, which is exactly what we ask reviewers to check.

When you don't know why code is there, the right move is to stop and find out.
An agent doesn't stop.
Not because it can't, but because nothing in this loop tells it to.

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

I love this quote.
Tony Hoare [gave it to us](https://wiki.c2.com/?TwoWaysToDesign) in his 1980 Turing Award lecture.
I think about this daily.

The usual reading is that it's about complexity, and that complicated systems hide their bugs.
That's in there.
But look at the word he used.

Obvious.

Obvious to whom?
A deficiency is only obvious to someone who can see what the code was supposed to do and notice that it doesn't.
Take away the supposed-to and the code still does something.
You just can't tell whether it's the right something.

That's why the first method is far more difficult.
To make a design obviously correct, you have to know what correct means.
The second way only needs everything to look reasonable.

Agents are extremely good at making things look reasonable.
Producing code that fits the local conventions and explains itself confidently is exactly what we ask them to do.
If a piece is missing, another prompt adds it.
If the new piece doesn't quite fit, another abstraction smooths the seam.

So the second way got cheap.
Nobody sits down intending to build a system with no obvious deficiencies.
It's what you get when plausibility is abundant and the why isn't.

A weak model gives us loud errors.
A strong model gives us a beautifully organized mistake.

## The Program Isn't the Point

If the why isn't in the code, where is it?

Peter Naur answered that in 1985 in ["Programming as Theory Building"](http://www.naur.com/comp/c1-4.html).
His argument is that we've misidentified what programmers produce.
The theory in their heads is the primary product, and the program text is secondary.

By *theory* he means what lets a programmer explain the program.
They understand how the code maps onto the world outside it, why each part is what it is, and how to respond when somebody asks for a change.
Programmers who hold the theory can answer questions the source can't.
Programmers who don't can read every line and still guess.

Naur doesn't merely say the theory is difficult to document.
He argues that an essential part of it "could not conceivably be expressed, but is inextricably bound to human beings."
Hand a codebase to a new team and they don't inherit the same theory.
They construct a different one.

The team from the beginning of this post had the program and the diagram, but the theory behind them left with the people who built them.
It's also why the person arguing for a rewrite is so often the newest person on the team.
They're not necessarily arrogant.
They're reading code whose theory they don't have, and from the outside that can look exactly like bad code.

So does an agent escape the problem Naur described?
It helps with one part of it.

Retrieval gets much cheaper.
Give an agent the repository and the issue tracker and it can assemble more recorded context than most of us go looking for.
That matters, and we should take advantage of it.

But retrieval only finds what somebody captured.
It can't return the hallway conversation that never became an artifact, and it can't retrieve a decision the team hasn't made.
Better models may make better guesses, but we still have to reconstruct the missing reason and make the unfinished decision together.

Cheap retrieval clears away the part we already knew how to solve and leaves the part no search can find.

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
I'm answering questions, correcting assumptions, and explaining why the obvious approach fails against something the code can't show.
It's the fifteen-second answer from the beginning of this post, repeated throughout the agent session.

That doesn't make the agent a person or give it the team's shared history.
It means the interaction gives uncertainty a chance to become visible before the guess hardens into code.
I fill in what the agent can't retrieve, and we test the design against evidence as it takes shape.

So we should capture what we can, because we leave far more unwritten than we have to.
Document the research behind a decision and write down why it went the way it did while the reason is still fresh.
Encode the expected behavior in a test so the next change has evidence to argue with.

But don't expect the document to replace the interaction.
Stay in the room.

## So Write a Better Spec

Somebody is going to read all of that and hear me asking for more documents up front.

Fair, because it sounds like it.

The nearest idea is spec-driven development.
I've been doing it for about a year, and it works, but the spec isn't the mechanism.

Context is.

Give the agent better context and you get better results.
That context can arrive as a plan, a conversation, a test, or a correction halfway through the work.

The plan helps by making the current understanding concrete enough to inspect, but it can't contain decisions nobody has made yet.
Make it detailed enough to determine every line of code and it isn't a plan anymore.

It's code.
You've just written it in the one language the computer can't run.

The teams I've seen do this well plan the work in front of them, get it roughly right, and archive the plan when the work ships.
The plan was scaffolding for a conversation, not another document we have to keep in sync forever.

That doesn't mean every task needs a plan or an extended conversation.
One-shot prompting works fine when one person holds the relevant intent and the result is cheap to throw away.
There is nobody else's intent to include, and little cost if the guess is wrong.

A side project that only a dozen people will ever run and a ten-year-old system somebody has to keep alive don't need the same process.
Most arguments about agentic development amount to someone building the first kind of software telling someone maintaining the second how to work, or the reverse.
They do need the same standard.

## What Good Looks Like

We keep trying to turn quality into a number because numbers fit in dashboards and judgment keeps asking follow-up questions.
Coverage tells us which lines ran during the tests.
Defect counts reveal patterns, and cycle time shows where delivery gets stuck.

All useful.
None of them are quality.

Quality shows up when the next person tries to change the system.
Can they find the behavior they're looking for?
Can they tell what their change will affect without reading half the application?
When the tests go green, do they have a reason to believe the software still means what it meant before?

Every one is a question about the why.
A system has quality when the answer is yes without a scavenger hunt.
It doesn't have to be small, and it doesn't have to match my preferences, of which I have collected a great many.

It has to give up its reasons.

Some of that can be automated, and it should be.
If a rule matters and a linter can enforce it, write the rule down and let the machine be relentless.
(Machines are wonderful at opinions that fit in a rule.)
If a behavior matters, put it in a test so the next change has to argue with evidence.

The rest is judgment.
It's the moment in review when every individual choice looks fine and the design still feels harder than the problem deserves.
It's noticing that a new abstraction removed six duplicated lines and spread one decision across five files.
It's asking whether you'd want to debug this path under pressure and taking your answer seriously.

I've maintained enough of my own good ideas to become suspicious of them on sight.
Some aged well.
Others spent five years collecting conditionals until nobody could remember what problem they solved.

That suspicion is a reason to look harder, not a reason to win the argument.
When somebody shows me I'm wrong, my suspicion doesn't get a vote.

Judgment that can't be explained is just seniority.
If the quality standard disappears when the most experienced person leaves the review, it was never part of the system.

## Spend the Abundance on Feedback

[Software factories](http://hdl.handle.net/1721.1/17131) predate agents, but agentic engineering gives the idea new urgency.

Research and design define what we intend to build.
Tests, continuous integration, review, and production tell us whether we built it.
Together they form a feedback system instead of relying on someone to catch every mistake.

A useful software factory isn't the one that produces the most code.
It's the one that makes correctness repeatable.

An agent-enabled software factory should build on the lifecycle we already have, not replace it.
The whole argument comes down to one word: *on*.

Dex Horthy and Jan-Niklas Wortmann have a [conversation about agentic coding](https://www.youtube.com/watch?v=5FcHP22u0zs) that explores this in more depth.
It's good.

When implementation gets cheap, the obvious response is to put an experienced person at the end of the pipe and ask them to catch what went wrong.
Factories learned long ago that you don't fix a fast station with an exhausted inspector.
You change the system so errors become visible closer to where they are introduced.

Judgment sets the standard, and automation holds whatever can be expressed.

What agents can't be is the whole factory.
A factory with one station isn't a factory.
It's a machine with branding.
One-shot prompting on a mature system tries to replace the feedback loop with a single very fast station.
Review then becomes the only place we touch the work, which is how we end up reading generated code for six hours a day.

Nobody reviews well for six hours a day.

So we move our work upstream.
We research the current behavior before anybody designs a replacement, then break the design into steps small enough to verify as we go.
We ask for the test that will prove the next change before implementation begins.
(Watch the test; agents are surprisingly willing to *improve* it until the implementation passes.)
Then review stops being an archaeological dig through decisions nobody saw being made.

We don't have to spend all that capacity on producing more code.

We can spend it on feedback.
The point isn't to keep every agent busy.
It's to buy more chances to notice that the premise was wrong before the change becomes inventory.

Let one agent trace the current behavior while another looks for the assumptions hiding in the proposed design.
Have one produce an approach and another explain how it might fail.
Generate edge cases while the change is still small enough to discard.
Run the whole suite every time the design moves.

That doesn't make the result true.
It gives us more evidence while the work is still cheap to change.

The move sounds backward: use faster agents to take smaller steps.
Stop after the research and read what they found.
Keep the distance between a decision and its evidence short enough that either one can still correct the other.

That's XP with a new pair.
The practices didn't become obsolete when one participant turned into silicon.

They finally met somebody extreme enough to need them.

## Someone Has to Say No

My grand unified theory of software engineering in the agentic age contains almost nothing new.
That's mildly disappointing because *grand unified theory* looks tremendous in a conference abstract.

Almost all of it predates my career.
The new part is the pressure: agents can overwhelm every practice we built to protect quality, but their capacity can also make those practices cheaper and more powerful than before.

What happens next depends on what we reward.
If we measure generated output, we'll get generated output.
If we design the system around understanding and evidence, we preserve our ability to change direction.

The model can't set that standard for us.
Not because it's incapable of judgment, but because the why isn't finished being made.
Nobody can hand over the whole thing because nobody holds all of it.

It gets built in the argument about a design.
It changes in the outage that teaches everyone what they missed.
It appears when two people discover they meant different things.

The model has no relationship with whoever has to change this next year and no presence in those rooms.
(It has no 3:00 AM pager memories either.)
It'll make a decision anyway because that's what we built it to do.

So we need people with opinions about what good looks like.
Some of us acquired them the expensive way over many years.
Others are acquiring them right now by reading a diff and asking where the data comes from.

Somebody still has to look at a change and say no.

That's the error signal.
When the code works and the tests pass, the automated signals have nothing left to say.
We can still refuse the change.

We'll be wrong sometimes.
We have to explain what we see and change our minds when the evidence proves us wrong.
But we still have to say it.

Not because an agent wrote the change.
Because it's too large to understand.
Because nobody can explain why the abstraction exists.
Because nothing records the intent, so the next person will guess and the person after that will guess about the guess.

Because it has no obvious deficiencies, and that's exactly the problem.

No isn't the end of the work.
It protects the room to make the next attempt small enough to understand and good enough to keep.

That somebody doesn't have to be the oldest engineer in the room.

It can be us.
