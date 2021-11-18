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
