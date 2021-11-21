# Recommendations from the wild

## Recommendation W.0

I think we experienced most of the known problems of tests structured according to the left image: ![left image](<./TestingPyramid.jpg>)

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
  - Good practices for thinking in ID and Class name by Google (this was a web reference, reported as recommendation W.3, n.d.r.).
    - Google's HTML code has ID's with some_id and also with some-id. I believe that the two one is correct. It must be chosen one way to follow and make the code readable.
  - Is adding ids to everything standard practice when using selenium (another web reference, reported here as recommendation W.4, n.d.r.)
  - Which is the best and fastest way to find the element using webdriver by xpath (web reference to an opinion-based question, discarded, n.d.r.)

[Why would you use ID attributes](https://github.com/manoelcyreno/test-samples/wiki/Why-would-you-use-ID-attributes)

## Recommendation W.3

### ID and Class Naming

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

### ID and Class Name Style

Use ID and class names that are as short as possible but as long as necessary.

Try to convey what an ID or class is about while being as brief as possible.

Using ID and class names this way contributes to acceptable levels of understandability and code efficiency.

### ID and Class Name Delimiters

Separate words in ID and class names by a hyphen.

Do not concatenate words and abbreviations in selectors by any characters (including none at all) other than hyphens, in order to improve understanding and scannability.

[HTML best practices](https://google.github.io/styleguide/htmlcssguide.html#ID_and_Class_Naming)

## Recommendation W.4

It's not unusual \[answer to previous question, n.d.r.\]. IDs tend to aid greatly in creating more stable UI tests, since class name changes or other refactoring is less likely to break tests. Also, dynamically populated lists tend to be high-maintenance in UI automation, and having predictable IDs can help with that. Using XPath is not only slow, as squeemish pointed out (and slowness itself can break tests if there are any timeouts, which leads those tests being fragile), but XPath also tends to be more vulnerable to UI changes, again increasing test maintenance.

[Is adding ids to everything standard practice when using selenium](https://sqa.stackexchange.com/questions/6326/is-adding-ids-to-everything-standard-practice-when-using-selenium)

## Recommendation W.5

### 4.1 At the very least, write API (component) testing

TL;DR: Most projects just don't have any automated testing due to short timetables or often the 'testing project' ran out of control and was abandoned. For that reason, prioritize and start with API testing which is the easiest way to write and provides more coverage than unit testing (you may even craft API tests without code using tools like Postman). Afterward, should you have more resources and time, continue with advanced test types like unit testing, DB testing, performance testing, etc

Otherwise: You may spend long days on writing unit tests to find out that you got only 20% system coverage

### 4.2 Include 3 parts in each test name

TL;DR: Make the test speak at the requirements level so it's self-explanatory also to QA engineers and developers who are not familiar with the code internals. State in the test name what is being tested (unit under test), under what circumstances, and what is the expected result

Otherwise: A deployment just failed, a test named “Add product” failed. Does this tell you what exactly is malfunctioning?

### 4.3 Structure tests by the AAA pattern

TL;DR: Structure your tests with 3 well-separated sections: Arrange, Act & Assert (AAA). The first part includes the test setup, then the execution of the unit under test, and finally the assertion phase. Following this structure guarantees that the reader spends no brain CPU on understanding the test plan

Otherwise: Not only you spend long daily hours on understanding the main code, but now also what should have been the simple part of the day (testing) stretches your brain

### 4.4 Detect code issues with a linter

TL;DR: Use a code linter to check the basic quality and detect anti-patterns early. Run it before any test and add it as a pre-commit git-hook to minimize the time needed to review and correct any issue. Also check Section 3 on Code Style Practices

Otherwise: You may let pass some anti-pattern and possible vulnerable code to your production environment.

### 4.5 Avoid global test fixtures and seeds, add data per-test

TL;DR: To prevent test coupling and easily reason about the test flow, each test should add and act on its own set of DB rows. Whenever a test needs to pull or assume the existence of some DB data - it must explicitly add that data and avoid mutating any other records

Otherwise: Consider a scenario where deployment is aborted due to failing tests, team is now going to spend precious investigation time that ends in a sad conclusion: the system works well, the tests however interfere with each other and break the build

### 4.7 Tag your tests

TL;DR: Different tests must run on different scenarios: quick smoke, IO-less, tests should run when a developer saves or commits a file, full end-to-end tests usually run when a new pull request is submitted, etc. This can be achieved by tagging tests with keywords like #cold #api #sanity so you can grep with your testing harness and invoke the desired subset. For example, this is how you would invoke only the sanity test group with Mocha: mocha --grep 'sanity'

Otherwise: Running all the tests, including tests that perform dozens of DB queries, any time a developer makes a small change can be extremely slow and keeps developers away from running tests

[The official Node best practices](https://github.com/goldbergyoni/nodebestpractices)

### Recommendation W.6

Rigidity, fragility, immobility and viscosity are the four fundamental symptoms that your code shows when your project is rotting.

For a project to rot, it means that as the system enhance its size, the number of errors enhance exponentially as well as the code comprehension is abruptly affected, meaning that it will be harder and harder to maintain, this way decreasing efficiency.

- A system that presents rigidity, means that a simple change takes longer and longer to be made. This happens because the modules are coupled together in a way that, a simple change in one of them triggers a lot of changes in other modules that was not expecting those changes to happen. Rigidity means poor code comprehension as well as interdependent modules.
- Fragility is presented by the systems that is already rigid. Once the development operations starts to become more and more complex over time due to massive amount of interdependent modules and a hard to understand development pattern - if present, bugs and errors starts popping up more frequently, in a way that can cause nasty consequences. Fear and trust-issues are common emotions related with these symptoms.
- (neglecting other unrelated properties, n.d.r.)

All of these symptoms has the property of increasing over time, and in order to straight up a project, a major refactor may be needed and in some cases, it could be easier to throw it away and start from scratch. This way it is important to be aware of these symptoms not only when starting a new project, but also over time in a way to increase mobility, increase code comprehension and make the modules less dependent.

[Signs your software project is rotting](https://github.com/jopheno/CleanArchitecture/wiki/Signs-your-software-project-is-rotting)

## Recommendation W.7

Test-driven development also called TDD, is a technic of developing the application side by side with some tests that should verify all functionalities as the development is being made. Using TDD should decrease considerably the amount of bugs that would appear with application changes over time, once a lots of tests will be executed and will test application functions for each change / commit.

Although TDD will reduce the bugs rate, a great amount of time will be needed to write test scripts, and to keep them up to date once changes are being made to the application over time. So, in order to TDD be effective, the tests coverage amount must be high as well as up-to-date.

There are two different approaches of TDD, the inside-out, and the outside-in.

On the inside-out approach, all the small functionalities have tests of their own, this way, it is used to guarantee that each piece of business are working on a tear-down way. On the other hand, on the outside-in approach, more complex tests are made in order to test the whole system interconnected, and the development is made looking forward to pass these more complex tests.

While you can pick one of the approaches, you can also use they both. The inside-out approach is in general for future-proof, once it will not be really dependent on more than one part of the system, however it may not be as accurate as the outside-in approach. In the other hand, a small change in the business of the application will unveil in a great amount of changes on those more complex tests.

[The TDD basics](https://github.com/jopheno/CleanArchitecture/wiki/What's-TDD-and-its-practices%3F)

## Recommendation W.8

[Working memory limitations](https://github.com/howard8888/pycon-ca-2018/wiki)

## Recommendation W.9

Code Fragility: when a lot of code lies on the usage of global variables or functions, that code is highly coupled to the environment, so if by any reason the state of the environment changes, a lot of lines of codes would break. In javascript the likelihood that the state of the globals changes is even higher because any function can change the values of any global element. In contrast the following function is not coupled to the environment therefore its result is more predictable and testable:

```js
function printColor(color) {
    console.log(color);
}
```

[Global variables induce fragile tests](https://github.com/freudgroup/freudcs/wiki/Javascript-Namespace-Declaration)

---
The book [Antifragile: Things That Gain From Disorder](https://en.wikipedia.org/wiki/Antifragile_(book))

## Recommendation W.10

As Humble noted, most IT projects are highly fragile — a few relatively small errors during development or operations can send the entire project crashing down at an inopportune time. IT projects (and individual project releases, for that matter) tend to:

- have giant scopes of hundreds or thousands of requirements.
- be managed through a series of organizational siloes with weak feedback loops between the silos.
- introduce new operations vulnerabilities with each release, due to dependence upon manual process steps, and highly context-specific, fragile “scripting.”

Change, therefore, is artificially suppressed, or at least intensely controlled. This just makes projects more fragile in the long term, especially from the perspective of meeting constantly changing business needs.

One solution to that problem is highlighted today in the form of devops or “noops”-driven software organizations like Netflix (s nflx) and Etsy. The software approach these organizations take is one of releasing small changes as often as possible, with heavy reliance on automation, and — this is very important — measuring the resulting effect on dynamics important to the business stakeholders.

Given the difference between devops and most “construction-method” approaches to IT that we see today, for example, I would argue that enterprises should adopt devops and address anti-fragility first by using it for those IT projects that would benefit from continuous change. Ones like marketing applications, business process automation and so on. Less critical would be systems like core ERP databases and infrastructure that don’t often need to undergo change.

[Devops](https://gigaom.com/2013/04/21/great-devops-anti-fragility-and-complexity-resources/)

## Recommendation W.11

Some test are made intentionally fragile in order to protect some areas of code from even smallest changes.

[The Magento testing standard](https://github.com/MykolaAkhtyrtsevDev/magento2/wiki/Magento-Automated-Testing-Standard)

---
[Order of preference of selectors](https://www.selenium.dev/documentation/webdriver/locating_elements/#tips-on-using-selectors)

---
[Compatibility between browsers: DesiredCapabilities](https://www.browserstack.com/guide/desired-capabilities-in-selenium-webdriver)
