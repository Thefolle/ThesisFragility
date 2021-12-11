# Analysis

Statements of UI test cases are not naturally synchronized. For instance, given the statement:

```js
driver.getElementById("nav").click()
```

It doesn't implicitly wait that the target element has been rendered or even attached to the DOM. This lack of synchronization make test cases dependent upon the infrastructural delays, which are in turn affected by the load of the host machine.
Several techniques are available to the testers to address the issue as described beneath.

## Wait for condition

All statements virtually need to wait for an element until it appears. This suggests the following scenarios:

- when D adds a statement, L suggests to create a corresponding wait for condition. In this way, every statement is preceded by a wait for condition. As a consequence, D will not worry about this issue in future;
- if D modifies the selector of a statement, the corresponding one in the wait should be modified as well. This has to do with locators, a topic faced in another document.

## Wait for page to load

Nowadays most AUTs are single-page.

## Wait for fixed time lapse

This statement typically assumes the form of a `Thread.sleep` call in Java and `setTimeout` call in JavaScript.

This statement should be converted to a wait for condition, for diverse reasons:

- The AUT is typically event-based, so a wait for condition decreases the waiting time to the minimum admissible time lapse; the waiting time is the same in case the test fails;
- The waiting time may not be enough.

These two opposite forces cause a continuous modification of the timeout.

However, the conversion of a fixed wait into a condition-based wait seems not always to be recommended. Indeed, if the test case is intended for performance check, a fixed wait would immediately point out any slowness in the web page. However, here is where timeouts come into play: a condition-based wait can set a maximum timeout equal to the performance threshold established by the expected responsiveness; at the same time, if the condition is met earlier than the timeout lapse, the control flow of the test case can proceed immediately without wasting time.

## Implicit wait

This technique should be discouraged. First of all, it waits through polling which is resource-consuming; secondly, it is not compatible with the other types of wait.
