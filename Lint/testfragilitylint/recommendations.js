const acorn = require('acorn-node');
const walker = require('acorn-node/walk')

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
            if (literal.length >= 2 && literal.charAt(0) == '/' && literal.charAt(1) != '/' && !literal.includes('#')) {
                result.push({
                    start: 0,
                    end: literal.length - 1,
                    value: literal
                }) // just convert the literal to a Node
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

            /* 
            *   This heuristic doesn't probe the content of variables:
            *   let a = "/"
            *   a += "bookstore"
            */
            /*
            *   This heuristic may produce false positives: 
            *   let pathInTheDisk = "/mnt/c/etc/bin"
            */
            if (literal.length >= 2 && literal.charAt(0) == '/' && literal.charAt(1) != '/' && !literal.includes('#')) {
                result.push({
                    start: 0,
                    end: literal.length - 1,
                    value: literal
                }) // just convert the literal to a Node
            }

            return result
        }
    },
    {
        id: "R.W.8.1",
        message: (tokenValue) => "Test names must contain three parts: what is being tested, under which circumstances and what's the expected result.",
        contract: (testCaseString, context) => {
            let testCase = acorn.Parser.parse(testCaseString)
            let result = []

            let customVisitor = walker.make({
                CallExpression: (node, state, c) => {
                    if (node.callee.name == 'it' && node.arguments[0].type == 'Literal') {
                        let testCaseName = node.arguments[0].value
                        
                        /* The heuristic in the flesh */
                        if (testCaseName.length < 3) {
                            result.push(node.arguments[0])
                        }
                    }

                    // should not continue here, as the work has finished
                }
            })

            walker.recursive(testCase, null, customVisitor, walker.base)

            return result
        }
    },
    {
        id: "R.W.8.2",
        message: (tokenValue) => "Test cases that share their execution plan are more robust: setup at first, act at second and assert at the end.",
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
        message: (tokenValue) => "Each test case should define its own input data, which are independent from global variables and so from data of other test cases.",
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
            let customVisitor = walker.make({
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
            
            walker.recursive(testCase, null, customVisitor, walker.base)

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
    }
]

exports.recommendations = recommendations