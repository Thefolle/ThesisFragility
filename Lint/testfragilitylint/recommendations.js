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
        id: "TODO",
        message: (tokenValue) => "Id locators are primarily more robust than XPaths; they are also cleaner and faster.",
        contract: (literal) => {
            let result = []

            //console.log(`literal: ${literal}, ${literal.length}`)

            /* 
            *   This heuristic doesn't probe the content of variables:
            *   let a = "/"
            *   a += "bookstore"
            */
            /*
            *   This heuristic may produce false positives: 
            *   let pathInTheDisk = "/mnt/c/etc/bin"
            */
            if (!literal) {
                /* Native values like null and undefined are not stringified */
            } else if (literal.length >= 2 && literal.charAt(0) == '/' && !literal.includes('#')) {
                result.push({
                    start: 0,
                    end: literal.length - 1,
                    value: literal
                }) // just convert the literal to a Node
            }

            return result
        },
        contractJava: (literal) => {
            let result = false

            if (literal.length >= 2 && literal.charAt(0) == '/' && !literal.includes('#')) {
                result = true
            }

            return result
        }
    },
    {
        id: "TODO",
        message: (tokenValue) => `If an id locator is not applicable, convert the absolute XPath ${tokenValue} to a more robust relative XPath.`,
        contract: (literal) => {
            let result = []

            //console.log(`literal: ${literal}, ${literal.length}`)

            if (!literal) {
                /* Native values like null and undefined are not stringified */
            } else if (literal.length >= 2 && literal.charAt(0) == '/' && literal.charAt(1) != '/' && !literal.includes('#')) {
                result.push({
                    start: 0,
                    end: literal.length - 1,
                    value: literal
                }) // just convert the literal to a Node
            }

            return result
        },
        contractJava: (literal) => {
            let result = false

            if (literal.length >= 2 && literal.charAt(0) == '/' && literal.charAt(1) != '/' && !literal.includes('#')) {
                result = true
            }

            return result
        }
    },
    {
        id: "TODO",
        message: (tokenValue) => "Test names must contain three parts: what is being tested, under which circumstances and what's the expected result. Follow the pattern: When <circumstances>, then <expected result>",
        contract: (testCaseString, context) => {
            let result = []

            let testCase = acorn.Parser.parse(testCaseString)
            
            let customVisitor = walker.make({
                CallExpression: (node, state, c) => {
                    if (node.callee.name == 'it' && node.arguments[0].type == 'Literal') {
                        let testCaseName = node.arguments[0].value

                        /* The heuristic in the flesh */
                        // if (testCaseName.length < 3) {
                        //     result.push(node.arguments[0])
                        // }
                        if (!testCaseName.toLowerCase().includes("when") || !testCaseName.toLowerCase().includes("then")) {
                            result.push(node.arguments[0])
                        }
                    }

                    // should not continue here, as the work has finished
                }
            })

            walker.recursive(testCase, null, customVisitor, walker.base)
            
            return result
        },
        contractJava: (testCaseName) => {
            let result = false

            /* The heuristic in the flesh */
            // if (testCaseName.length < 3) {
            //     result.push(node.arguments[0])
            // }
            if (!testCaseName.toLowerCase().includes("when") || !testCaseName.toLowerCase().includes("then")) {
                result = true
            }

            return result
        }
    },
    {
        id: "TODO",
        message: (tokenValue) => "Test cases that share the same execution plan are more robust: setup at first, act at second and assert at the end.",
        contract: (testCaseString, context) => {
            let testCase = acorn.Parser.parse(testCaseString)
            let result = []

            // test setup violation is probed through variable declaration in the other two phases
            // assert is probed through functions that contain the term assert
            let customVisitor = walker.make({
                CallExpression: (node, state, c) => {
                    if (node.callee.name == 'it') {
                        let testCaseStatements = node.arguments[1].body.body

                        /* The heuristic in the flesh */
                        let isTestSetupFinished = false
                        testCaseStatements.forEach(statement => {
                            if (statement.type != 'VariableDeclaration') {
                                isTestSetupFinished = true
                            } else {
                                if (isTestSetupFinished) {
                                    result.push(statement)
                                }
                            }
                        })
                    }

                    state.isInCallExpression = true
                    c(node.callee, state)
                    state.isInCallExpression = false

                    node.arguments.forEach(argument => c(argument, state))
                },
                Identifier: (node, state, c) => {
                    /* Apply the heuristic only for callees of functions */
                    if (state.isInCallExpression) {
                        /* The heuristic in the flesh */
                        if (node.name.toLowerCase().includes('assert')) {
                            result.push(node)
                        }
                    }
                }
            })

            walker.recursive(testCase, {}, customVisitor, walker.base)

            return result
        },
        contractJava: () => {
            let result = false

            return result
        }
    },
    {
        id: "TODO",
        message: (tokenValue) => "Each test case should setup its own input data separately and redundantly, without: referencing global variables; exploiting dedicated setup methods; sharing database data with other tests; continuing other tests.",
        contract: (testCaseString, context) => {
            let testCase = acorn.Parser.parse(testCaseString)
            let result = []

            let localVariableIdentifiers = []
            /* first search for all declarations of local variables*/
            walker.full(testCase, (node) => {
                if (node.type == 'VariableDeclaration') {
                    node.declarations.forEach(variableDeclarator => localVariableIdentifiers.push(variableDeclarator.id.name))
                }
            })
            //console.log(localVariableIdentifiers)

            /* then count the number of distinct occurences of global references*/
            let globalVariableReferences = 0

            /* the custom visitor makes the walker recur on an assignment expression, which doesn't happen by default*/
            let customVisitorForLocalVariables = walker.make({
                AssignmentExpression: (node, state, c) => {
                    c(node.left, state)
                    c(node.right, state)
                },
                Identifier: (node, state, c) => {
                    if (!localVariableIdentifiers.includes(node.name) && context.globalVariableIdentifiers.includes(node.name)) {
                        globalVariableReferences++
                        result.push(node)
                    }
                }
            })

            let customVisitorForFixture = walker.make({
                CallExpression: (node, state, c) => {
                    if (node.callee.name == 'afterAll' || node.callee.name == 'beforeAll') {
                        result.push(node)
                    }
                }
            })

            walker.recursive(testCase, null, customVisitorForLocalVariables, walker.base)
            walker.recursive(testCase, null, customVisitorForFixture, walker.base)

            //console.log(globalVariableReferences)

            return result
        }
    },
    {
        id: "TODO",
        message: (tokenValue) => "Use of fixed-time wait to synchronize actions. Instead, use a condition-based wait.",
        contract: (testCaseString, context) => {
            let testCase = acorn.Parser.parse(testCaseString)
            let result = []

            let customVisitor = walker.make({
                CallExpression: (node, state, c) => {
                    if (node.callee.name == 'setTimeout') {
                        result.push(node.callee)
                    } else {
                        /* The node is not a setTimeout */
                        c(node.callee, state)
                        node.arguments.forEach(argument => c(argument, state))
                    }
                }
            })

            walker.recursive(testCase, null, customVisitor, walker.base)

            return result
        }
    },
    {
        id: "TODO",
        message: (tokenValue) => "Avoid third-party libraries and services as much as possible. They decrease the stability of tests, especially when their source code cannot be accessed.",
        contract: (declarationString, context) => {
            let declaration = acorn.Parser.parse(declarationString)
            let result = []

            let customVisitor = walker.make({
                AssignmentExpression: (node, state, c) => {
                    if (node.right && node.right.callee && node.right.callee.name == 'require') {
                        result.push(node)
                    }
                }
            })

            walker.recursive(declaration, null, customVisitor, walker.base)

            return result
        }
    },
    {
        id: "R.W.0",
        message: ``,
        scope: Unclassified
    },
    {
        id: "R.W.1",
        message: `XPath locators relative to an element found by id come up to be more robust than absolute ones: for instance, //*[@id="fox"]/a.`,
        scope: Literal
    },
    {
        id: "R.W.2",
        message: `Locators by id allow to pick up an element in the fastest way.`,
        scope: Literal
    },
    {
        id: "R.W.3",
        message: `Ids and names of elements should reflect their functional purpose so as to lower the probability they get changed; additionally, they would be more readable.
        If an element is not directly involved in a use case, like containers, their ids or names should be generic.`,
        scope: Literal
    },
    {
        id: "R.W.4",
        message: `Locators by id help in building more stable test cases, since they break less likely when a change in the AUT occurs.`,
        scope: Literal
    },
    {
        id: "R.W.5",
        message: `Predictable locators by id help in writing robust tests for dynamically-populated lists.`,
        scope: Literal
    },
    {
        id: "R.W.6",
        message: `XPath locators are slow and so they may break test cases, which in turn increases fragility.`,
        scope: Literal
    },
    {
        id: "R.W.7",
        message: `XPath locators are more vulnerable to UI changes, fact that augments test maintenance.`,
        scope: Literal
    },
    {
        id: "R.W.8.0",
        message: `Integration tests must be developed before unit tests along the lifecycle of a test suite, due to their wider coverage applying a given effort. Unit tests, if built first, could lead developers to abandon them due to a scarce availability at the beginning of the project.`,
        scope: TestSuite
    },
    {
        id: "R.W.8.1",
        message: `Test names must contain three parts: what is being tested, under which circumstances and what's the expected result. Follow the pattern: When <circumstances>, then <expected result>`,
        scope: TestCase
    },
    {
        id: "R.W.8.2",
        message: `Test cases that share the same execution plan are more robust: setup at first, act at second and assert at the end.`,
        scope: TestSuite
    },
    {
        id: "R.W.8.3",
        message: `The fragility-related recommendations of this document may be indirectly enforced by linting the code against other types of good practices.`,
        scope: TestSuite
    },
    {
        id: "R.W.8.4",
        message: `Even better, the linter should be run for every key that the tester presses to avoid subsequent modifications.`,
        scope: Unclassified
    },
    {
        id: "R.W.8.5",
        message: `Test cases that rely upon global variables are fragile. Indeed, these can be changed unexpectedly due to their wide scope.`,
        scope: TestSuite
    },
    {
        id: "R.W.8.6",
        message: `Mutual-dependent test cases w.r.t. the input data are highly fragile because sensible to a range of different modifications that may appear unrelated. Defining a data setup per test case make them independent and less fragile to input data modifications.`,
        scope: TestSuite
    },
    {
        id: "R.W.8.7",
        message: `One step further, test cases must not access the same data from the test DB; restore the DB state after each test.`,
        scope: TestSuite
    },
    {
        id: "R.W.8.8",
        message: `Creating a new web driver instance per each test case ensures test isolation and easier parallelization.`,
        scope: TestCase
    },
    {
        id: "R.W.8.9",
        message: `Running only a subset of the test cases save effort. Tagging tests having a common attribute and running only those tests lower the test run time.`,
        scope: TestSuite
    },
    {
        id: "R.W.9",
        message: `Keeping test cases decoupled from each other and from the context reduces fragility against any type of modification.`,
        scope: TestSuite
    },
    {
        id: "R.W.10",
        message: `Sections on data setup, actions and assertions must be as short as possible. Long test cases are instead expensive to run and poorly debuggable since an eventual fault is more difficult to trace back.`,
        scope: TestCase
    },
    {
        id: "R.W.11",
        message: `The test data setup should not perform visual actions; the scenario must instead be initialized by calling APIs and performing DB queries that the AUT exposes.`,
        scope: Snippet
    },
    {
        id: "R.W.12",
        message: `Test cases should adopt the Page Object Pattern, in order to decouple the test behaviour from the underlying implementation. In most cases, one or two operations per section (data setup, actions or assertion sections, n.d.r.) are enough. Test cases must not contain any visual statement; they should contain assertions. Page objects should contain visual statements; they should not contain any assertion, beside those for checking that the page has loaded.`,
        scope: TestSuite
    },
    {
        id: "R.W.13",
        message: `Third-party libraries and services decrease the stability of tests.`,
        scope: TestSuite
    },
    {
        id: "R.W.14",
        message: `No test case should continue the workflow of other tests; instead, when the tester decides to split a use case in many test cases, each test case but the first one must rather stub the preceding scenario with a proper test setup.`,
        scope: TestCase
    },
    {
        id: "R.W.15",
        message: `Page objects (according to the Page Object Pattern, n.d.r.) should be designed as fluent APIs.`,
        scope: Unclassified
    },
    {
        id: "R.W.16",
        message: `Id locators are the most robust choice; when they are not available, CSS locators should be selected; as last resort, XPaths can be chosen.`,
        scope: Literal
    }
]

exports.recommendations = recommendations