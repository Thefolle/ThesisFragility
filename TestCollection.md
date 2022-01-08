# Test collection validity

Notice that, for practical reasons, the test cases have not been collected all in once. Therefore, one may wander about whether the search operation produces different results in different moments. This is not an issue since:

- Test cases already collected can be discarded since the project and the test suite folder to which they belong are recorded as well;
- Non-relevant test cases are just evaluated twice.

The other threat to the validity of the collection task is the chance that new tests are added, deleted or modified during the collection task. This facet cannot be directly controlled, but it has been considered acceptable since encountered commit messages were written years ago.

Filtering meaningful modifications is not seamless and precise, overall. Each modification is linked to the reason that led the developer to perform it. However, this is not an issue, since a famous taxonomy already tells which are the four types of modifications that can occur: adaptive, perfective, corrective and preventive.
As a first flavour, all modifications have been taken into account without any distinction in terms of motivation.

There are more fine-grained caveats however. A given adaptive modification may occur for a huge amount of different motivations which require some effort to infer starting from the code change alone. The commit message, tool documentation and comments help for the purpose; the value of literal strings can help too, although they rarely need to be translated to English language when necessary.

It is worth to spend some words on the fact that the recorded modifications also comprise additions: for instance, the addition of an XPath is taken into account as well. Although this potential threat validity was unexpected at collection time, it has been chosen to keep them during computations, since they are modifications like the remainder.

## Analysis

By inspecting the modifications developers do, so that a certain initial snippet s0 is modified into s1, it can be observed that s1 quite frequently exploits the same selector or assertion of s0. This means that developers sometimes don't try to improve them by selecting or asserting other correlated properties, but they tend to **adapt** the test code for compliance with the AUT. The consequence is the propagation of fragility: since the change was necessary at least once, it may be necessary again in the future.

Interesting how developers of the project `ffhu22/Web-CI-Build` tried several techniques to improve stability of the test case `qa_assignment/selenium/uitest/UserFlowRegisterTest.java`, as emerges from its commit messages. Among these attempts there are: build failing if test failing, using default timeouts, keeping essential tests, taking screenshots and refreshing the working web page.

XPath fragility is not solved by extracting its literal string representation into a parametric macro: see `BrentDouglas/richfaces-3` in test case `samples/richfaces-demo/functional-test/src/test/java/org/jboss/richfaces/integrationTest/orderingList/OrderingListTestCase.java`.

Another attempt to solve fragility by surrounding snippets with wait statements for fixed time lapse: see `BrentDouglas/richfaces-3` in test case `samples/richfaces-demo/functional-test/src/test/java/org/jboss/richfaces/integrationTest/orderingList/OrderingListTestCase.java`.

Here is an example of test suite management: `Vijayasok89/selenium`, `java/client/test/com/thoughtworks/selenium/WebDriverSeleniumTestSuite.java`.

Regarding comments, their purpose sometimes reflect the need to summarize the user behaviour behind a certain snippet. This practice can be considered as a primitive page object pattern.
