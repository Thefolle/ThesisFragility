# Recommendations from the wild analysis



## Draft

Source: S.W.2

Benefits of employing id locators don't come up immediately, especially in UI test cases. //TODO: how to classify this statement?

---

Source: S.W.6

The aforementioned properties rise along time. Performing a major refactor or starting a new project from scratch solve the issue; most importantly, the problem can be avoided through awareness thereof.

This recommendation struggles with the principle of robustness proposed in this study. The fact that rigidity and fragility inevitably increase over time define the limits of a strategy that make the test suite more robust.

### Recommendation R.W.1

Source: S.W.1

Since low-level tests depend upon implementation details, their fragility is greater than their high-level counterpart.

Contract: 

## Recommendation R.W.16

Source: S.W.17, S.W.15

Test cases should adopt the Page Object Pattern, in order to decouple the test behaviour from the underlying implementation. In most cases, one or two operations per section (data setup, actions or assertion sections, n.d.r.) are enough. Test cases must not contain any visual statement; they should contain assertions. Page objects should contain visual statements; they should not contain any assertion, beside those for checking that the page has loaded.

## Recommendation R.W.15

Page objects (according to the Page Object Pattern, n.d.r.) should be designed as fluent APIs.

## Recommendation W.7

Test-driven development, known as TDD, is a technique that ensures that all features of a project get tested as they are being developed.
It decreases the number of defects that appear after a modification, during the lifetime of a project. However, TDD requires a lot of effort to write and maintain test cases, since high coverage is requested by definition.

## Recommendation W.8

*Acceptance is pending*.