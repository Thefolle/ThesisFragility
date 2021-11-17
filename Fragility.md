# Fragility

This document first defines fragility within the scope of the thesis; then, through a top-down approach, several issues pertaining fragility have been brainstormed and evaluated.
Note that the research method followed in this document is a-priori, so it is opposite to the data mining technique which instead tries to infer general laws from mere data.

Here we refer to fragility of test cases rather than of the AUT.

Let S be an arbitrary snippet of code.
Then S is fragile against a modification M if M can be applied to T. The degree of fragility is the number of times M occured in the wild.

Can I treat fragility as belonging to the absolute scale, or should I assign categorical measures?

The above definition is wide, since M may or may not take place in the AUT. For instance, M can be a comment modification or even a macro definition. In this way, the definition comprises perfective, corrective and preventive modifications.

In any case, this doesn't mean that every modification is considered relevant: for example, evident style modifications have been ignored. What decides if a change is important or not is its frequency of occurence: if a task like organizing imports happens in < 0.1% of times, it is just a matter of style; however, measuring the frequency of occurence is a way to not make assumptions.

In more formal notation:
Let S be an arbitrary snippet of code, like a test case or a statement. S is made up of more fine-grained tokens: for instance, a test is made up of a signature and a body, which in turn can be further split; let's call S(i, l + 1) the i-th component that S comprises, where l represents a monotonic-increasing level of granularity. The following property subsists:

Fragility(S(i, l)) := sum(j)(fragility(S(j, l + 1))) + residualFragility(S(i, l))

## Draft

As a first attempt, let's establish which are the variables fragility depends from in our model. Here follows a list of the possible independent variable that may affect fragility or the probability of fragility:

- Number of distinct DOM elements involved;
- Effort required to align the test suite with a new version of the AUT;

p = p(LOC)

As stated in paper 3, paragraph 2.3, which in turn cites Ralph (2008), one strategy to produce a taxonomy is personal experience. Therefore, here are some common evidencies that may cause fragility:

Fragility can be classified according to its nature:

- Data fragility:
  - DB test data are volatile: data chosen as actual values for tests;
  - shared literal values easily produce inconsistencies;
- Time fragility: the test must not depend upon the response time of the network, as paper 1 underlines; the test must not depend upon the circumstancial time it is executed;
- Effort fragility: the effort needed to adapt/correct a test case may induct the programmer to remove or comment it;
- Infrastructural fragility: a breakage may occur due to random delays in the network or in the host machine.

Several heuristics about writing test cases don't depend neither from the underlying AUT nor from the testing tool, like time fragility.

A test case typically emulates a use case. As stated by paper 3, paragraph 5.2, the use cases of an Android app slightly change over time. This may be relevant for subsequent work.
