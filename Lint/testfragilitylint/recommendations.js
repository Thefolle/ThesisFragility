const acorn = require('acorn-node');
const walker = require('acorn-node/walk')

const javaParser = require('java-parser')

const TestSuite = 0
const TestCase = 1
const Snippet = 2
const Statement = 3
const Literal = 4
const Unclassified = 5

const recommendations = [
    {
        id: "R.W.0",
        message: `Keep the number of unit tests greater than the number of end-to-end tests.`,
        scope: TestSuite
    },
    {
        id: "R.W.1",
        message: `Use relative XPath locators in place of absolute XPath locators.`,
        scope: Literal
    },
    {
        id: "R.W.2",
        message: `Use locators by id since they are the fastest locators.`,
        scope: Literal
    },
    {
        id: "R.W.3",
        message: `Use locators by id due to their high readability.`,
        scope: Literal
    },
    {
        id: "R.W.4",
        message: `Give to an element an id that mirrors its functional purpose. When an element has no particular meaning, give it a generic id.`,
        scope: Literal
    },
    {
        id: "R.W.5",
        message: `Give to elements a name that mirrors their functional purpose. When an element has no particular meaning, give it a generic name.`,
        scope: Literal
    },
    {
        id: "R.W.6",
        message: `Keep names and ids of elements clear to everyone.`,
        scope: Literal
    },
    {
        id: "R.W.7",
        message: `Separate words in id and class names by a hyphen.`,
        scope: Literal
    },
    {
        id: "R.W.8",
        message: `Use locators by id since they are more robust than other types of locator.`,
        scope: Literal
    },
    {
        id: "R.W.9",
        message: `Use locators by id to ease tests that build lists of elements at runtime.`,
        scope: Snippet
    },
    {
        id: "R.W.10",
        message: `Do not use XPath locators as they may break tests that rely upon timeouts.`,
        scope: Literal
    },
    {
        id: "R.W.11",
        message: `Prefer id than XPath locators since they require less maintenance.`,
        scope: Literal
    },
    {
        id: "R.W.12.0",
        message: `First write end-to-end tests, then unit tests.`,
        scope: TestSuite
    },
    {
        id: "R.W.12.1",
        message: `Give test cases a name with three sections: what is being tested, under which circumstances and what's the expected result.`,
        scope: TestCase
    },
    {
        id: "R.W.12.2",
        message: `Arrange each test case in three successive sections: setup, act and assert.`,
        scope: TestCase
    },
    {
        id: "R.W.12.3",
        message: `Run linters to detect any anti-pattern.`,
        scope: Unclassified
    },
    {
        id: "R.W.12.4",
        message: `Do not use global variables in test cases.`,
        scope: TestCase
    },
    {
        id: "R.W.12.5",
        message: `Devote separate DB data to each test case.`,
        scope: TestCase
    },
    {
        id: "R.W.12.6",
        message: `Create a separate web driver per each test case.`,
        scope: TestCase
    },
    {
        id: "R.W.12.7",
        message: `Tag related test cases in order to run a subset of them.`,
        scope: TestSuite
    },
    {
        id: "R.W.13",
        message: `Keep test cases decoupled from each other, under every point of view.`,
        scope: TestSuite
    },
    {
        id: "R.W.14",
        message: `Keep test cases as short as possible.`,
        scope: TestCase
    },
    {
        id: "R.W.15",
        message: `Do not perform visual actions to setup the test case scenario. Instead, use APIs of the AUT and direct DB queries.`,
        scope: TestCase
    },
    {
        id: "R.W.16",
        message: `Minimize the number of external libraries.`,
        scope: TestSuite
    },
    {
        id: "R.W.17",
        message: `Test cases must not continue the workflow of other test cases.`,
        scope: TestCase
    },
    {
        id: "R.W.18",
        message: `Prefer id locators to CSS locators, and CSS locators to XPath locators.`,
        scope: Literal
    },
    {
        id: "R.W.19",
        message: `Do not use link locators.`,
        scope: Literal
    },
    {
        id: "R.W.20",
        message: `Use tag locators to pick up multiple elements.`,
        scope: Literal
    }
]

exports.recommendations = recommendations