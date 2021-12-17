const acorn = require('acorn-node');
const walker = require('acorn-node/walk')

const javaParser = require('java-parser')

const recommendations = [
    {
        id: "R.W.4",
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
        id: "R.W.0",
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
        id: "R.W.8.1",
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
        id: "R.W.8.2",
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
        }
    },
    {
        id: "R.W.8.5",
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
        id: "R.W.13",
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
    }
]

exports.recommendations = recommendations