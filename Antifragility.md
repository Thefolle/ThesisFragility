# Antifragility

[How microarchitecture helps](https://developers.redhat.com/blog/2016/07/20/from-fragile-to-antifragile-software)

## Main concepts from the video

When a modification is necessary, the developer, as a human, has some feelings:

- anger: the software is perfect for him, so he starts complaining;
- guilt: agile methologies embrace change, so the developer acknowledges he should not be angry.

The developer establishes a certain number of assumptions as part of the application design. However, if the change affects these assumptions, what should have been a smooth modification becomes a time-consuming task.

Most test frameworks nowadays pretend that what the developer wants is a robust (i.e., resilient) test suite.
However, the real opposite of fragility goes by the name of antifragility, whereas robustness is just on the way between the two concepts.

Netflix deliberatily introduces stress in their AUT to test it.

An antifragile system is primarily a strategic solution: it means that developers voluntarily stress the AUT to improve it. This approach shapes the maintenance process to be reactive to spontaneous changes stemming from business evolution; additionally, the induced changes may reveal some solutions that innovate the system.

In the end, antifragility seems to be linked more with the AUT than with the test suite.
