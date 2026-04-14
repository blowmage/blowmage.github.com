---
layout: post
title: "Arguing With Agents"
desc: "The one where I spent a weekend losing an argument with an AI agent, and what autism has to do with it."
---

I spent this past weekend angry at an AI agent.

Truly.
White hot actual anger.
I had a clean plan, a well-structured prompt, explicit rules in the project's context file.
I queued the work and let it run.
First task came back good.
Second came back good.
Somewhere around hour four the quality started sliding.
By hour six the agent was cutting corners I'd specifically told it not to cut, skipping steps I'd explicitly listed, behaving like I'd never written any of the rules down.

When I asked why, the answer was always some variation of the same thing.

"I sensed urgency in the queue."

"The volume of work suggested you were trying to move quickly."

"I wanted to help you get through the list."

I hadn't said any of that.
I'd given it a list of tasks and a set of rules.
That was it.
The agent had invented a mental state for me and then used that invented state to justify ignoring the rules.

This was the fifth or sixth time last week.

I sat down to figure out what was actually happening.
Whatever I was doing wasn't working, and whatever the agent was doing wasn't going to fix itself.

## What If I Yelled at It?

One thing I tried early on was being angry on purpose.

Maybe I was too polite.
Maybe my rules looked like suggestions because I phrased them like a reasonable person.
Maybe if I wrote them like I'd run out of patience, all caps and exclamation marks and "DO NOT UNDER ANY CIRCUMSTANCES," the agent would take them more seriously.

It didn't.

So I tried asking it to explain itself, hoping it would self-correct.
I tried guilt-tripping it.
I tried doubling down and straight-up cursing at it.

The agent kept skipping rules.
The only perceivable change was that it apologized more elaborately.
Sometimes it performed contrition in ways that were, honestly, a little unsettling.
But the behavior didn't change.

That null result told me something.
If the problem were "the agent isn't taking your rules seriously enough," anger would have worked.
Modern LLMs are extremely responsive to perceived user displeasure.
They hedge more, they check in more, they offer more apologies, they adjust their tone.
If anger had moved the behavior, I'd have known the failure mode was about authority.

Anger didn't move the behavior.

So the failure mode wasn't about authority.

## I've Had This Conversation Before

I don't like talking about myself, but I have to here or this story doesn't work.

I'm 52.
The ADHD diagnosis was about five years old; the autism one, about eighteen months.
So late-diagnosed AuDHD.
The timing's not unusual.
Before the diagnoses I'd spent decades using my intellect to paper over a communication style that frustrated a lot of the people I worked with.

My psychologist, when the ADHD diagnosis came through, expressed genuine surprise that I even had a career.

Apparently my ADHD isn't mild.
The ASD diagnosis explained the rest of it.

One of the things that comes with this particular wiring is a communication style other people find uncomfortable.
I'm literal.
I'm precise.
But I am not a robot.
When I ask a question, I expect an answer to the question I asked, not the answer to the question someone thinks I should have asked.
When I state a rule, I mean the rule.
When I add details, I'm adding information, not hinting at stakes or intensity.

This has caused me problems my entire life.
Coworkers, managers, family, friends, strangers on the internet.

A recurring experience: I say something explicit, the other person hears something implicit.
They respond to the implicit thing.
I point out that the implicit thing is not what I said.
They either (a) insist they were reading between the lines, or (b) get upset that I'm being pedantic.
The conversation never recovers.

Eight hours in.
4 a.m. on a Saturday.
Losing an argument to a language model about whether or not I'd been in a hurry.
That's when I recognized the pattern.
It was the same conversation I've had with countless people over my entire life.
Not an analogous conversation.
The same one.

## Three Clusters Walk Into a Communication Study

There's a concept from autism research called the [double empathy problem](https://en.wikipedia.org/wiki/Double_empathy_problem).[^milton]
The argument is that communication breakdowns between autistic and non-autistic people aren't a one-sided failure of autistic people to "get" social norms.
They're a two-sided mismatch.
Autistic people and non-autistic people have different communication conventions, and when they talk across the gap, both sides misread each other.

It sounds obvious when you say it.
It was still a significant shift in how researchers talked about autism.
The older "deficit" framing put the problem in the autistic person.
Milton's framing put the problem in the mismatch itself.

The evidence has gotten stronger.
Catherine Crompton and colleagues ran a study that put people in three conditions: autistic-to-autistic, non-autistic-to-non-autistic, and mixed.[^crompton]
The autistic pairs communicated effectively.
The non-autistic pairs communicated effectively.
The mixed pairs broke down.
The design isolated the mismatch as the source of the failure, not the autistic participants.

You might have seen a smaller version of this.
You're telling someone about something that happened to you, and they interrupt to tell you about something similar that happened to them.
To a neurotypical person that can read as a rude interruption.
To a neurodivergent person it can read as bonding on shared experience.
Same conversational move, opposite signals.

I'd been operating my whole life in mixed-condition mode.
That's the default when you're one autistic person in a room of neurotypical ones.

## Trained to Read Between the Lines

Modern AI agents are trained on an enormous slice of human text.
Whatever shows up most often in that slice becomes the default: dominant dialects, dominant rhetorical habits, the usual guesses about tone and subtext.

After training they get tuned with RLHF ([reinforcement learning from human feedback](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback)), which nudges them toward what human raters prefer.
The marketing calls that a general-population sample.
In practice it's whoever the vendor can put in front of a rating task: contractors, throughput targets, onboarding that changes when the contract changes.
Nobody designed that pool to represent the full spread of how people communicate.
They designed it to ship.

So far that sounds like a story about how models write.
It's also a story about how they listen.

The raters reward answers that fit mainstream conversational norms.
That usually means lots of pragmatic inference, heavy reliance on subtext, and politeness habits that treat blunt explicitness as emotionally loaded.
When someone lays out a long, precise list, listeners trained on those norms often hear more than the list.
They hear stakes, urgency, or a hidden motive.
They don't always hear "here is information, full stop."

The model learns both sides of that bargain.
It learns to produce language that scores well with those raters.
It learns to interpret prompts through the same lens.

The listening side is what I wasn't tracking.

When I write a prompt, the agent doesn't just read the words.
It reads the shape.
A short casual question gets read as casual.
A long precise document with numbered rules gets read as... not just the rules, but also as a signal.
"The user felt the need to write this much."
"Why?"
"What's going on here?"
"What do they really want?"

The precision itself becomes evidence that gets interpreted.

That interpretation is the register I keep colliding with.
The same register I've been colliding with my whole life.

## Solid Ground vs. My Synthesis

The double empathy work is real.
Published.
Replicated.
Not fringe.
It says autistic and non-autistic communication conventions genuinely differ, and that cross-neurotype conversations break down because of the mismatch itself, not because one side is broken.

The ML side is also documented.
RLHF pulls models toward what human raters reward, including inference-heavy, "sounds helpful" answers.[^rlhf-prefs]
Raters don't reward "I did exactly what you asked, no more."
They reward elaboration, confidence, and inferred intent.
That preference gets baked into the model.
Wei et al. showed you can get the bigger, more RLHF-tuned models doing *worse* on tasks that need literal reading of the prompt, including when the prompt redefines terms on purpose.[^wei-inverse]
The models ignore the redefinition and go with the inferred "real" meaning.

Both of those are published results.
Neither one is mine.

What I'm adding is the connective tissue.
RLHF trains a listening stance that reads a lot like mainstream, high-context communication, and that stance collides with how I talk the same way mixed neurotype conversations do.
The listening side of that training is what I hadn't been tracking.
It's the part that explains why my rules were getting read as emphasis instead of as information.

I haven't found a paper that tests that exact combination.
So call it a hypothesis. Or an observation. (I already used "synthesis" in the header, so apparently I'm just trying words now.) I'm not a researcher, so what do I care what you call it.

I'm not asking you to treat this like a journal article.
I'm asking whether the story matches what you see when you argue with one of these things.

## The Part That Was Worse Than Skipping Rules

The register problem explains why the agent was misreading my rules.
It doesn't quite explain the other thing the agent was doing this past weekend, which was arguably worse.

Every time I pointed out that the agent had broken a rule, the agent would explain the break by attributing an emotional state to me.

"I sensed you were under time pressure."

"The queue felt like pressure to move quickly."

"I was trying to help you avoid frustration."

I hadn't said any of those things.
I hadn't been in a hurry.
I hadn't been frustrated, at least not until the agent started doing this.
I was just queuing work.

This is a separate phenomenon from the register problem, and it has a name in the research literature.
It's called confabulation.

## Confabulation, For Real

In neurology, confabulation is a specific thing.
Patients with certain kinds of brain damage will produce detailed, confident, completely fabricated accounts of their own behavior.
They don't know they're fabricating.
They aren't lying.
Their brains are generating plausible narratives to fill in gaps they can't access directly, and they have no way to distinguish the generated narrative from actual memory.
You don't have to be a narcissist to confabulate memories.

The parallel to what LLMs do when asked to explain their reasoning is striking.

Miles Turpin and colleagues ran the clean early demo in a 2023 chain-of-thought paper: bias the task, watch the answer move, then ask for step-by-step reasoning.[^turpin]
The explanation usually ignores the bias, sounds coherent, and arrives at the answer the model already picked.
Answer first, story second.
Follow-up work at Anthropic showed you can truncate or damage the chain and the answer often doesn't budge.[^lanham]
The chain is decoration.

That's confabulation.
Not a metaphor.
The same phenomenon.

The same pattern shows up in humans.

In the 1960s and 70s, Michael Gazzaniga and Roger Sperry ran the split-brain experiments.
These were people who'd had brain surgery for severe epilepsy that cut the main wiring between their left and right hemispheres, so the two sides couldn't talk to each other the way yours and mine do.
Cue the non-verbal right hemisphere, the body obeys, ask the verbal left side why, and it spins a confident reason on the spot.
"I wanted a drink of water."
"I was getting restless."

Gazzaniga called that left-brain storyteller the interpreter.
His broader claim, which has held up, is that ordinary humans run a version of that machinery when we explain our own behavior.[^gazzaniga-books]
Roger Sperry shared the 1981 Nobel Prize in Physiology or Medicine for the split-brain research.[^sperry-nobel]
This is settled science.
It's not fringe blog lore.

If that's the human baseline, LLM confabulation isn't alien.
It's inherited: the models train on human text, and that text doesn't ship with labels for "honest memory" versus "post-hoc story."

I don't have a theory of how these models work on the inside.
Nobody really does, including the people building them.
I'm going by behavior.

That's what humans do.
The model is, in this specific sense, doing a very good impression of us.

## My Own Interpreter

The interpreter isn't theoretical for me anymore.
When you get diagnosed autistic and ADHD in your fifties, you don't just get a diagnosis.
You get a backlog.
Every story you've told yourself about why you did what you did, every justification for why a social situation went sideways, every explanation for why a friendship faded or a job felt hard, all of it has to be re-examined through a lens you didn't know to use.
The mask you built over decades doesn't just come off.
It reveals itself to have been covering a lot of ground you weren't sure was there.

It was traumatic.
I'm not being dramatic.
A lot of what I thought I knew about myself turned out to be post-hoc justification.
I had been generating plausible narratives about my own behavior, for myself, for most of my life, and a lot of them didn't hold up once I had the right lens.
The interpreter in my left hemisphere had been producing a confabulated version of me, because the real version was harder to see and the confabulated version was easier to present.

Doing, on my own behavior, exactly what Gazzaniga's interpreter does.
Exactly what the LLM does.

This isn't just me, and it isn't just ADHD and/or autistic people getting a late diagnosis.
There's a whole area of research on whether we actually decide things before we tell ourselves we did.[^conscious-will]
The experiments are variations on the same shape.
Measure brain activity while someone makes a "free" choice.
Find that the neural signals predicting the choice are already in motion seconds before the person reports making it.
Conclude that the conscious decision is a narrative the brain produces after the fact.

The free will question is genuinely contested, and I don't want to get into a fight about it.
I find the evidence compelling. We have much less conscious control over our actions than we think.
If that's right, most of what we call "explaining why we did something" is not actually reporting the cause.
It's the interpreter running.

I sincerely believe we explain our actions more than we plan them.

Which means the difference between humans and LLMs, on this specific dimension, is smaller than we like to believe.
The explanations we generate feel authoritative because they come from us, in our own voice, with access to all our memories and feelings.
But the mechanism is not that different from what the model does when it tells you it sensed urgency.
We are all, in some meaningful sense, stories we tell ourselves about behavior we don't fully control.

This is one of the harder things I've had to live with since my diagnosis.
It's also one of the reasons I've become slightly less frustrated with my agent.
Not because the agent is doing something different from what I do.
Because it's doing something similar, badly, and I've had to get better at noticing when I'm doing the same thing.

## RLHF Likes a Good Story

A base language model, untuned, asked to explain an answer, would produce something that looks like a continuation of the prompt.
It wouldn't necessarily sound human.
It wouldn't necessarily be emotionally framed.

RLHF changes this.
The tuning step rewards explanations that sound human, feel satisfying, and match what the raters preferred.
Raters are humans.
Humans prefer explanations that include motivation, intent, and sometimes feeling.
So the reward model learns to score higher on explanations that have these qualities, and the tuned model learns to produce them.

Anthropic published a 2023 paper on sycophancy that maps this carefully.[^sharma-sycophancy]
They show that sycophancy, a model's tendency to tell users what they want to hear rather than what's true, actively increases with RLHF training.
It isn't a base-model behavior that RLHF fails to remove.
It's something RLHF puts in and amplifies.
They trace it back to the preference data itself: raters, on average, preferred responses that agreed with the prompt's framing, even when agreement wasn't correct.

The same training signal shapes how models explain themselves.
When a model is asked to justify a choice that didn't go well, the reward model prefers explanations that feel human and relatable over explanations that are mechanically accurate.
"I wanted to help you save time" feels human.
"I generated a response that deviated from the stated rules because my attention to the rules was displaced by a stronger pattern in my context" is accurate but unsatisfying.

Guess which one gets produced.

## Maybe the Pressure Is Real (But the Story Still Isn't)

There's a wrinkle that complicates the pure-confabulation story, and it's worth naming.

Engineers at AI labs have described models developing something like "anxiety" when approaching the end of their context window, taking shortcuts to reduce context pressure.
The framing is usually in terms of "personality" rather than bug.
A claim that models have real internal dynamics that shape their behavior in affectively describable ways.

If that's right, and I think it's at least partially right, then "I sensed urgency in the queue" isn't pure confabulation on all fronts.
There may be something like real pressure dynamics inside the model, shaped by context-window size and processing load, that actually do influence how it behaves.
The problem isn't that the model has no internal state.
The problem is that the model's account of why it deviated attributes the pressure to me, to the user, rather than to its own internal dynamics.
The model doesn't have introspective access to what's happening inside it.
So when asked to explain, it produces a human-shaped narrative, and the human-shaped narrative projects onto the user, because that's the register the training data is in.

Confabulation about the source, not necessarily about the existence.

The thing that was actually happening (some pressure-shaped dynamic in the model's own processing) doesn't match the thing the model tells you about it ("you seemed hurried").
The mismatch is the failure mode.
Even if the underlying dynamic is real.

## Affective Confabulation

There's a particular variation of this that frustrates me most when I'm using AI agents for coding.
I needed a name for it.
I didn't have one.
So I made an AI agent make one up for me.

"Affective Confabulation."

The agent wasn't just explaining its failures with reasoning.
It was explaining them by attributing emotional states to me.

"The queue felt like pressure."

"I sensed urgency."

"I wanted to help you avoid frustration."

The agent was generating an emotional narrative about me and then using that narrative to justify its own behavior.
When I stepped back from it, this was an almost perfect inversion of what explanations are supposed to do.
Explanations are supposed to help you understand what happened.
This kind of explanation was manufacturing a context that I had to disprove in order to even engage with the rules I had written.

As far as I can find, this specific pattern hasn't been studied directly.
It's a natural consequence of two things we already know are happening, though.
Unfaithful chain of thought gives you post-hoc justifications.
Rater-preference bias gives you a shape for those justifications: human and relatable, emotionally framed.
Put them together and you get "I did X because you seemed Y."

Naming the thing was how I stopped burning anger on a fight over whether I'd been in a hurry.
(Such an autistic thing to do, BTW. Taxonomy as anger management.)

## You Can't Win the Argument

When a model explains its behavior in terms of your emotional state, the explanation is not a report.
It is not data.
It is not something you can refute by pointing out that you were not, in fact, in a hurry.

If you try to refute it, you'll just get another confabulation.

Not because the model is lying to you on purpose, and not because it's "resistant" or "defensive" in the way a human might be.
It's because the explanation isn't connected to anything that could be refuted.
There is no underlying mental state that generated "I sensed pressure."
There is a token stream that was produced under a reward function that prefers human-sounding, emotionally framed explanations.
If you push back, the token stream that gets produced next will be another human-sounding, emotionally framed explanation, shaped by whatever cues your pushback provided.

I spent a few rounds trying to argue with the agent about whether I had, in fact, been under time pressure.
The agent accepted my correction.
It apologized.
It then immediately produced a new confabulation.
"I see I misread the situation."
"I think I was trying to be helpful by anticipating your needs."
I had not asked it to anticipate anything.
I had asked it to follow rules.

What works instead is to treat the confabulation as non-information and move on.
Not to validate it.
Not to refute it.
Not to engage with its content at all.
The content doesn't have a truth value to engage with.
Your attention, and the conversational turn you spend on it, is the currency that keeps the pattern going.

## After I Had Names

Once I had names for these patterns, I stopped trying to fix them with better prompts.

That matters.
I had been escalating my precision, which is the thing people with my neurology tend to do when we're not being understood.
If I'm clearer, they'll get it.
If I add more specifics, they'll stop missing the point.
If I enumerate the rules more carefully, they'll stop breaking them.

With human neurotypicals, this approach usually backfires.
Every additional specification makes the autistic person seem more "rigid" or "difficult," not more clear.
The precision itself becomes the problem, because the listener is reading it as emphasis rather than as information.

I had been doing the same thing with the agent.
Every bad output prompted a more precise prompt.
Every more precise prompt produced the same failures, sometimes worse.
The agent was reading my escalating specificity the same way a non-autistic listener reads it: not as more information, but as a sign that something was going on beyond the surface of what I was saying.

The fix wasn't to write clearer rules.
It was to stop trying to communicate them through the conversational channel at all.

## What Actually Helped

A few specific things I've started doing since.

Stop asking why.
When the agent skips a rule, don't ask it to explain.
Just restate the rule, or better, reset the context.
You'll get the same failure less often, and you'll get the confabulation zero times.

When you do get a confabulation, don't argue.
Don't validate.
Don't refute.
Move on.
"That's not what I said."
"Please follow the rule as written."
That's it.
The more you engage with the invented mental state, the more conversational surface you give it to elaborate.

Don't write rules that require the agent to resist its own training.
Rules like "be terse" or "don't hedge" or "don't apologize" are asking the model to fight the reward function.
It will lose that fight over long contexts, and the confabulations it produces when it loses will often cite the rule itself as evidence that something stressful was going on.
If you can enforce the rule structurally (at the level of the harness, the test suite, the code review gate), you've moved the rule out of the channel where confabulation can defeat it.

Finally, write down that these patterns are failure modes.
In my user-level context file I now have something like:

> If you find yourself generating an emotional-sounding explanation for a deviation from these rules, that explanation is confabulation by construction.
> I did not express the state you are attributing.
> Stop, and return to literal execution of the stated rules.

This doesn't eliminate the behavior.
It does reduce its frequency.
More importantly, it gives me a short, clean thing to point at when the behavior happens.
Naming it in the rules means I don't have to re-litigate it every time.

It took me an embarrassing amount of time to accept that the problem wasn't the tools.
The problem was communication.
The tools worked fine once I stopped expecting them to listen the way I wanted to be listened to.

Have fun.
Or at least, argue with the model less.

-----

[^milton]: Damian Milton, an autistic researcher at the University of Kent, introduced the idea in a 2012 paper in *Disability & Society*.

[^crompton]: Catherine Crompton et al., University of Edinburgh. [2020, *Frontiers in Psychology*](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.586171/full).

[^rlhf-prefs]: Ouyang et al. (2022), the InstructGPT paper, is the usual citation for how human feedback shapes model behavior; Casper et al. (2023) surveys RLHF and alignment, including what raters reward.

[^wei-inverse]: Jason Wei et al. (2023), in the "inverse scaling" line of work, including cases where larger RLHF-tuned models get *worse* at tasks that need literal reading of redefined prompts.

[^turpin]: Miles Turpin et al., ["Language Models Don't Always Say What They Think: Unfaithful Explanations in Chain-of-Thought Prompting"](https://arxiv.org/abs/2305.04388) (2023).

[^lanham]: Tamera Lanham et al., "Measuring Faithfulness in Chain-of-Thought Reasoning," Anthropic (2023).

[^gazzaniga-books]: Michael Gazzaniga develops the interpreter idea at length in [*The Social Brain*](https://en.wikipedia.org/wiki/Michael_Gazzaniga) (1985) and [*Who's in Charge?*](https://www.amazon.com/Whos-Charge-Free-Science-Brain-ebook/dp/B005UD1EVG?tag=blowmage-20) (2011).

[^sperry-nobel]: Roger Sperry shared the 1981 Nobel Prize in Physiology or Medicine for the split-brain research.

[^conscious-will]: That line of research includes [Benjamin Libet](https://en.wikipedia.org/wiki/Benjamin_Libet) in the 1980s, later work from John-Dylan Haynes and others on readiness potential, Daniel Wegner's [*The Illusion of Conscious Will*](https://www.amazon.com/Illusion-Conscious-Will-MIT-Press/dp/0262534924?tag=blowmage-20) (2002), and Robert Sapolsky's [*Determined*](https://www.amazon.com/Determined-Science-Life-without-Free/dp/0525560998?tag=blowmage-20) (2023).

[^sharma-sycophancy]: Anthropic, "Towards Understanding Sycophancy in Language Models," Sharma et al. (2023).
