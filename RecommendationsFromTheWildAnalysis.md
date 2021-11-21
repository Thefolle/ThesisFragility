# Recommendations from the wild analysis

## Recommendation W.0

The cause of fragility is traced back to the volatility of test cases, which increases as they cover more features of the AUT, as written:
> Low-level tests are faster and more stable

## Recommendation W.1

Lower-level tests are more fragile since they depend upon implementation details: the recommendation should be read and interpreted keeping in mind this assumption.

## Recommendation W.2

Locators by id are cleaner than the XPath or CSS counterparts.
XPath locators relative to an element found by id come up to be more robust: for instance, //*[@id="fox"]/a.
Locators by id allows to pick up an element in the fastest way.
Benefits of employing id locators don't come up immediately, especially in UI test cases.

## Recommendation W.3

Ids and names of elements should reflect their functional purpose so as to lower the probability they get changed; additionally, they would be more readable.
If an element is not directly involved in a use case, like containers, their ids or names should be generic.

## Recommendation W.4

Locators by id help in building more stable test cases, since they break less likely when a change in the AUT occurs.
Predictable locators by id help in writing robust tests for dynamically-populated lists.
XPath locators are slow and so they may break test cases, which in turn increases fragility.
XPath locators are more vulnerable to UI changes, fact that augments test maintenance.

## Recommendation W.5

Node.js recommendations are curated and revisioned by the respective authors and by the Node team, so they do not require additional analysis here.
Each best practice is sometimes further explained in a page apart, which is not reported here for the sake of brevity.

## Recommendation W.6

A project is said rigid when a modification takes more and more effort to be applied since it implies the correction of many other consequent issues. This is a typical scenario when modules are strongly coupled.
Fragility grows when a project is rigid. A developer may choose to avoid applying the modification from the start, but it is not always possible: in this situation test cases and the AUT break, showing up a relevant set of bugs and errors.

The aforementioned properties tend to rise along time. Performing a major refactor or starting a new project from scratch solve the issue; most importantly, the problem can be avoided through awareness thereof.

## Recommendation W.7

Test-driven development, known as TDD, is a technique that ensures that all features of a project get tested as they are being developed.
It decreases the number of defects that appear after a modification, during the lifetime of a project. However, TDD requires a lot of effort to write and maintain test cases, since high coverage is requested by definition.

## Recommendation W.8

*Acceptance is pending*.

## Recommendation W.9

Test cases that rely upon global variables are fragile. Indeed, these can be changed unexpectedly due to their wide scope. The issue is even worse in JavaScript, where their scope may be the whole project.
