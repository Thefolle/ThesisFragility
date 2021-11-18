# Recommendations from the wild

## Recommendation W.0

I think we experienced most of the known problems[3] of tests structured according to the left image: ![left image](<./TestingPyramid.jpg>)

As you move higher up the agile testing pyramid, you encounter issues like:

- Test fragility (tests that break easily and unexpectedly, even when changes 'shouldn't' have influenced the test)
- Longer feedback time
- Increased effort levels
- Higher costs to implementation
- More specialized knowledge required

For example, UI tests break easily, often because the UI structure changes over time. Low-level tests are faster and more stable, so this is where we recommend you put the vast majority of your effort. Then, write very few higher-level tests, like end-to-end tests.

## Recommendation W.1

Test fragility, in this case, refers to the degree of change necessary for a test suite to accurately find faults on the implementation. Because unit tests are much closer to lower level implementation details of a system they have higher test fragility. If the prospect for the reusability of this test is low, then this can seem like a waste of time. Because unit tests offer a smaller scope of testable behaviors and require more changes to a test. In comparison, integration tests offer a larger scope of testable behaviors and require less changes to a test. Therefore, integration tests can offer higher test quality with lower test fragility than unit tests

## Recommendation W.2

You should use id locators, because:

- Clean automation code. Your automation code will be more readable if you get the attribute's locator by ID instead of getting it by XPath or CSS selectors;
- In some cases, it's inevitable to find an element by ID, but if you create a XPath with the ID element, this XPath will be more robust.
- Fastest way to locate elements on page because selenium gets it down executing document.getElementById().
- Fragility in UI tests is hard to manage, so other issues might also need to be resolved before you see the benefits of adding IDs. This point can achieve everybody's confidence in the team aboutautomated tests.
- Best discussions and articles about this subject can be found here:
  - Good practices for thinking in ID and Class name by Google \[this was a web reference, reported as recommendation W.3, n.d.a.\].
    - Google's HTML code has ID's with some_id and also with some-id. I believe that the two one is correct. It must be chosen one way to follow and make the code readable.
  - Is adding ids to everything standard practice when using selenium
  - Which is the best and fastest way to find the element using webdriver by xpath

[Why would you use ID attributes](https://github.com/manoelcyreno/test-samples/wiki/Why-would-you-use-ID-attributes)

## Recommendation W.3

Use meaningful or generic ID and class names.

Instead of presentational or cryptic names, always use ID and class names that reflect the purpose of the element in question, or that are otherwise generic.

Names that are specific and reflect the purpose of the element should be preferred as these are most understandable and the least likely to change.

Generic names are simply a fallback for elements that have no particular or no meaning different from their siblings. They are typically needed as “helpers.”

**Using functional or generic names reduces the probability of unnecessary document or template changes**.

```CSS
/* Not recommended: meaningless */
#yee-1901 {}

/* Not recommended: presentational */
.button-green {}
.clear {}

/* Recommended: specific */
#gallery {}
#login {}
.video {}

/* Recommended: generic */
.aux {}
.alt {}
```

[HTML best practices](https://google.github.io/styleguide/htmlcssguide.html#ID_and_Class_Naming)

---
[The official Node best practices](https://github.com/goldbergyoni/nodebestpractices)

---
[Signs your software project is rotting](https://github.com/jopheno/CleanArchitecture/wiki/Signs-your-software-project-is-rotting)

---
[Coding styles](https://github.com/MikeSmvl/travelingstrategy/wiki/Coding-Styles)

---
[Some software engineering properties](https://github.com/py00300/myWorkFeb2018/wiki/so_6461_04)

---
[Non-technical issues](https://github.com/howard8888/pycon-ca-2018/wiki)

---
[Global variables induct fragile tests](https://github.com/freudgroup/freudcs/wiki/Javascript-Namespace-Declaration)

---
The book [Antifragile: Things That Gain From Disorder](https://en.wikipedia.org/wiki/Antifragile_(book))

---
[Devops](https://gigaom.com/2013/04/21/great-devops-anti-fragility-and-complexity-resources/)

---
[Order of preference of selectors](https://www.selenium.dev/documentation/webdriver/locating_elements/#tips-on-using-selectors)

---
[Compatibility between browsers: DesiredCapabilities](https://www.browserstack.com/guide/desired-capabilities-in-selenium-webdriver)
