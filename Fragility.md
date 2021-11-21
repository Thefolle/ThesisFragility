# Fragility

This document first defines fragility within the scope of the thesis; then, through a top-down approach, several issues pertaining fragility have been brainstormed and evaluated.
Note that the research method followed here is a-priori, so it is opposite to the data mining technique which instead tries to infer general laws from mere data.

Software engineering borrows the concept of fragility from the materials science, like also rigidity, viscosity and so on. As commonly known, an object can respond in two ways when it gets subjected to some force: it morphs by bending itself, or it tries to keep a shape. In this last case, the object may either endure as it is against the force, or break in pieces; the more fragile the body is, the more breaking points occur. In computer science, the software devoted to test an application, a.k.a. test cases, behave similarly: as soon as the Application Under Test, AUT in short, gets changed by a developer, test cases may also need to be corrected accordingly; this phenomenom is due to the fragility of test cases. The more fragile a test case is, the more defects are induced by a modification in the AUT.
Within the scope of this study, one step further has been done by widening the definition of fragility, as described beneath.

Let S be an arbitrary snippet of code, like a statement or a test case.
Then S is fragile against a modification M if M can be applied to S. The degree of fragility of S increases as the number of times M occured in the wild enhances.

The above definition is wide, since M may or may not take place in the AUT. For instance, M can be a comment modification or even a macro definition.
Concerning how to measure the degree of fragility given a snippet S, it is necessary to count the occurences of M that took place in projects developed in the past even by other teams. Incidentally, this way to measure fragility of a currently-available test case is a kind of prediction and has to do with quantitative data mining, as explained in paragraph [TODO].
In any case, this doesn't mean that every modification is considered relevant: for example, evident style modifications have been ignored. What decides if a change is important or not is its frequency of occurence: if a task like organizing imports happens in < 0.1% of times, it is just a matter of style; however, measuring the frequency occurence of M is a way to not make assumptions.

In more formal notation:
Let S be an arbitrary snippet of code, like a test case or a statement. S is made up of more fine-grained tokens: for instance, a test is made up of a signature and a body, which in turn can be further split; let's call S(i, l + 1) the i-th component that S comprises, where l represents a monotonic-increasing level of granularity. The following property subsists:

Fragility(S(i, l)) := sum(j)(fragility(S(j, l + 1))) + residualFragility(S(i, l))

Fragility can be classified according to its nature:

- Data fragility: test cases are run on some input test data, whose eventual modification automatically affects tests;
- Time fragility: the test may depend upon the circumstancial time it is executed;
- Effort fragility: the effort needed to adapt/correct a test case may induce the programmer to remove or comment it. The more a test case is fragile, the more breakages come out, which in turn imply a greater effort for fixing them;
- Infrastructural fragility: a breakage may occur due to random delays in the network or in the host machine; the symptoms include unexpected test case failure that typically disappears if the test case is run multiple times.

## Draft

p = p(LOC)

As stated in paper 3, paragraph 2.3, which in turn cites Ralph (2008), one strategy to produce a taxonomy is personal experience. Therefore, here are some common evidencies that may cause fragility:

Several heuristics about writing test cases don't depend neither from the underlying AUT nor from the testing tool, like time fragility.

A test case typically emulates a use case. As stated by paper 3, paragraph 5.2, the use cases of an Android app slightly change over time. This may be relevant for subsequent work.

Can I treat fragility as belonging to the absolute scale, or should I assign categorical measures?
