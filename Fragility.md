# Fragility

[Questo paragrafo va aggiunto solo se decidi che il tool debba misurare la fragilità]
In more formal notation:
Let S be an arbitrary snippet of code, like a test case or a statement. S is made up of more fine-grained tokens: for instance, a test is made up of a signature and a body, which in turn can be further split; let's call S(i, l + 1) the i-th component that S comprises, where l represents a monotonic-increasing level of granularity. The following property subsists:

Fragility(S(i, l)) := sum(j)(fragility(S(j, l + 1))) + residualFragility(S(i, l))

## Draft

p = p(LOC, effort)

As stated in paper 3, paragraph 2.3, which in turn cites Ralph (2008), one strategy to produce a taxonomy is personal experience. Therefore, here are some common evidencies that may cause fragility:

Several heuristics about writing test cases don't depend neither from the underlying AUT nor from the testing tool, like time fragility.

A test case typically emulates a use case. As stated by paper 3, paragraph 5.2, the use cases of an Android app slightly change over time. This may be relevant for subsequent work.

Can I treat fragility as belonging to the absolute scale, or should I assign categorical measures?

[Antifragility through microservices](https://developers.redhat.com/blog/2016/07/20/from-fragile-to-antifragile-software)

This study investigates fragility of test cases rather than about the AUT or its documentation.
