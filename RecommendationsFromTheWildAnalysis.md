# Recommendations from the wild analysis

## Recommendations R.W.0

Source: S.W.0

### Recommendation R.W.0.0

The cause of fragility is traced back to the volatility of test cases, which increases as they cover more features of the AUT, as written:
> Low-level tests are faster and more stable

### Recommendation R.W.0.1

Lower-level tests are more fragile since they depend upon implementation details.

### Discussion to select the admissible recommendation

Current tools for visual testing hide most implementation details to end users, so R.W.0.0 gets consequently discarded in favor of end-to-end testing.

See also: R.W.8.1

## Recommendation R.W.1

Source: S.W.2

XPath locators relative to an element found by id come up to be more robust: for instance, //*[@id="fox"]/a.

## Recommendation R.W.2

Source: S.W.2

Locators by id allows to pick up an element in the fastest way.

## Recommendation R.W.3

Source: S.W.3

Ids and names of elements should reflect their functional purpose so as to lower the probability they get changed; additionally, they would be more readable.
If an element is not directly involved in a use case, like containers, their ids or names should be generic.

## Recommendation R.W.4

Source: S.W.4

Locators by id help in building more stable test cases, since they break less likely when a change in the AUT occurs.

## Recommendation R.W.5

Source: S.W.4

Predictable locators by id help in writing robust tests for dynamically-populated lists.

## Recommendation R.W.6

Source: S.W.4

XPath locators are slow and so they may break test cases, which in turn increases fragility.

## Recommendation R.W.7

Source: S.W.4

XPath locators are more vulnerable to UI changes, fact that augments test maintenance.

## Recommendations R.W.8

Node.js recommendations are curated and revisioned by the respective authors and by the Node team, so they do not require additional analysis here.
Each best practice is sometimes further explained in a page apart, which is not reported here for the sake of brevity.

## Recommendation R.W.8.0

Source: S.W.5.0

Integration tests must be developed before unit tests along the lifecycle of a test suite, due to their wider coverage applying a given effort. Unit tests, if built first, could lead developers to abandon them due to a scarce availability at the beginning of the project.

## Recommendation R.W.8.1

Source: S.W.5.1

When testers write a new test case or when the test suite is getting big, they try to establish a rule to name test cases in a clear and consistent way; this task implies modifications in the test cases and in particular in their name. This recommendation establishes an effective naming rule from the very beginning, avoiding subsequent changes.

If the name of a test case doesn't describe the starting scenario, the developer should infer it by reading the function's body.
Additionally, clearly stating what's the expected output in advance helps in overcoming the psychological bias that may lead the tester to define by mistake an assertion so as to make the test find no bugs.

## Recommendation R.W.8.2

Source: S.W.5.2, S.W.14

Arranging each test case in a standard way, like the proposed one, saves effort since the plan of test cases is uniform along test suites. Saving effort, in turn, decreases the probability that the test case gets abandoned.

## Recommendation R.W.8.3

Source: S.W.5.3

The fragility-related recommendations of this document may be indirectly enforced by linting the code against other types of good practices.

## Recommendation R.W.8.4

Source: S.W.5.3

The rule proposes to run linters before commit or test run; even better, the linter should be run for every key that the tester presses to avoid subsequent modifications.

## Recommendation R.W.8.5

Source: S.W.5.4, S.W.20, S.W.23, S.W.9

Test cases that rely upon global variables are fragile. Indeed, these can be changed unexpectedly due to their wide scope. The issue is even worse in JavaScript, where their scope may be the whole project.
Mutual-dependent test cases w.r.t. the input data are highly fragile because sensible to a range of different modifications that may appear unrelated. Defining a data setup per test case make them independent and less fragile to input data modifications. One step further, test cases must not access the same data from the test DB; restore the DB state after each test. Even more, creating a new web driver instance per each test case ensures test isolation and easiers parallelization.

See also: R.W.8.2

## Recommendation R.W.8.6

Source: S.W.5.4

Running only a subset of the test cases save effort. Tagging tests having a common attribute and running only those tests lower the test run time.

## Recommendation R.W.9

Source: S.W.6

A project is said rigid when a modification takes more and more effort to be applied since it implies the correction of many other consequent issues. This is a typical scenario when modules are strongly coupled.
Fragility grows when a project is rigid. A developer may choose to avoid applying the modification from the start, but it is not always possible: in this situation test cases and the AUT break, showing up a relevant set of bugs and errors.

Keeping test cases decoupled from each other and from the context reduces fragility against any type of modification.

See also: R.W.8.5

## Recommendation R.W.10

Source: S.W.15

Sections on data setup, actions and assertions must be as short as possible. This approach minimizes the fragility of test cases. Long test cases instead are long to run and poorly debuggable since the fault is more difficult to trace back.

See also: R.W.8.2

## Recommendation R.W.11

Source: S.W.16, S.W.18

The test data setup should not perform visual actions; the scenario must instead be initialized by calling APIs and performing DB queries that the AUT exposes.

## Recommendation R.W.12

Source: S.W.17, S.W.15

Test cases should adopt the Page Object Pattern, in order to decouple the test behaviour from the underlying implementation. In most cases, one or two operations per section (data setup, actions or assertion sections, n.d.r.) are enough. Test cases must not contain any visual statement; they should contain assertions. Page objects should contain visual statements; they should not contain any assertion, beside those for checking that the page has loaded.

## Recommendation R.W.13

Source: S.W.19

Third-party libraries and services decrease the stability of tests.

## Recommendation R.W.14

No test case should continue the workflow of other tests; instead, when the tester decides to split a use case in many test cases, each test case but the first one must rather stub the preceding scenario with a proper test setup.

See also: R.W.11

## Recommendation R.W.15

Page objects (according to the Page Object Pattern, n.d.r.) should be designed as fluent APIs.

## Recommendation W.7

Test-driven development, known as TDD, is a technique that ensures that all features of a project get tested as they are being developed.
It decreases the number of defects that appear after a modification, during the lifetime of a project. However, TDD requires a lot of effort to write and maintain test cases, since high coverage is requested by definition.

## Recommendation W.8

*Acceptance is pending*.

## Recommendation W.9



## Draft

Source: S.W.2

Benefits of employing id locators don't come up immediately, especially in UI test cases. //TODO: how to classify this statement?

---

Source: S.W.6

The aforementioned properties rise along time. Performing a major refactor or starting a new project from scratch solve the issue; most importantly, the problem can be avoided through awareness thereof.

This recommendation struggles with the principle of robustness proposed in this study. The fact that rigidity and fragility inevitably increase over time define the limits of a strategy that make the test suite more robust.
