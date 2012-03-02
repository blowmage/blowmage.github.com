---
title:  Outgrowing the Cloud
layout: post
desc:   The one where I share my thoughts and slides about my presentation at Ruby on Ales 2012.
---
I had a great time presenting at [Ruby on Ales 2012](http://ruby.onales.com/). It has all the best parts of a really great Ruby conference and the best parts of a two day long party. What's not to like?

My presentation was an experience report on some changes that we made to [Bloomfire](http://www.bloomfire.com/)'s infrastructure. We had issues that we couldn't fix on our previous cloud hosting provider, and we had many thoughts on where we wanted to go in the future. In the end we decided on moving to Amazon's [Virtual Private Cloud](http://aws.amazon.com/vpc/) offereing and have been happy with the decison so far.

<script src="http://speakerdeck.com/embed/4f4fe67060be14001f0248ff.js"></script>

I'm very proud of our work on this migration. We picked up many features we had been trying to add for months and months, all with very minor changes to the application's code. We solved the problems in the most appropriate way, and I feel good about that.

Lastly, while my presentation looks like a public love letter to [Rainbow Dash](http://mlp.wikia.com/wiki/Rainbow_Dash), it is actually a public love letter to [Jason Roelofs](http://jameskilton.com/) who did all of the heavy lifting for this effort. I'm super proud that [simple_aws](https://github.com/jameskilton/simple_aws), the AWS library we use for all our automation, was a product of our efforts and is open source.
