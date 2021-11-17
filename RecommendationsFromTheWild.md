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

---
[Why would you use ID attributes](https://github.com/manoelcyreno/test-samples/wiki/Why-would-you-use-ID-attributes)

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
