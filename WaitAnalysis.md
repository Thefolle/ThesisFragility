# Analysis

## Wait for condition

All statements virtually need to wait for an element until it appears. This suggests the following scenarios:

- when D adds a statement, L suggests to create a corresponding wait for condition. In this way, every statement is preceded by a wait for condition. As a consequence, D will not worry about this issue in future;
- if D modifies the selector of a statement, the corresponding one in the wait should be modified as well. This has to do with locators, a topic faced in another document.

## Wait for page to load

Nowadays most AUTs are single-page.

## Wait for fixed time lapse

This statement typically assumes the form of a `Thread.sleep` call.

This statement should be converted to a wait for condition, for diverse reasons:

- The AUT is typically event-based, so a wait for condition decreases the waiting time to the minimum admissible time lapse; the waiting time is the same in case the test fails;
- The waiting time may not be enough.

These two opposite forces cause a continuous modification of the timeout.

## Implicit wait

This technique should be discouraged. First of all, it waits through polling which is resource-consuming; secondly, it is not compatible with the other types of wait.
