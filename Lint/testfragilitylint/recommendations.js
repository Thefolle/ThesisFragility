const { tokenizer } = require('acorn-node');
const acorn = require('acorn-node');
const walker = require('acorn-node/walk')

const recommendations = [
    // {
    //     id: "R.W.4",
    //     message: (tokenValue) => "Id locators are primarily more robust than XPaths; they are also cleaner and faster.",
    //     contract: (tokenValues) => {
    //         if (tokenValues.length < 1) return false

    //         return tokenValues[0].charAt(0) == '/' && tokenValues[0].charAt(1) != '/'
    //     }
    // },
    // {
    //     id: "R.W.0",
    //     message: (tokenValue) => `If an id locator is not applicable, convert the absolute XPath ${tokenValue} to a more robust relative XPath.`,
    //     contract: (tokenValues) => {
    //         if (tokenValues.length < 1) return false

    //         return tokenValues[0].charAt(0) == '/' && tokenValues[0].charAt(1) != '/'
    //     }
    // },
    // {
    //     id: "R.W.8.1",
    //     message: (tokenValue) => "Test names must contain three parts: what is being tested, under which circumstances and what's the expected result.",
    //     contract: (tokenValues) => {
    //         if (tokenValues.length < 3) return false

    //         if (tokenValues[2] == 'it' && tokenValues[1] == '(') {
    //             if (tokenValues[0].length < 3) return true // should not be a false positive with that threshold
    //             else return false
    //         } else return false
    //     }
    // },
    {
        id: "R.W.8.2",
        message: (tokenValue) => "Each test case should define its own input data, which are independent from global variables and from data of other test cases.",
        contract: (testCaseString, context) => {
            let testCase = acorn.Parser.parse(testCaseString)
            let result = []

            let localVariableIdentifiers = []
            // first search for all declarations of local variables
            walker.full(testCase, (node) => {
                if (node.type == 'VariableDeclaration') {
                    node.declarations.forEach(variableDeclarator => localVariableIdentifiers.push(variableDeclarator.id.name))
                }
            })
            console.log(localVariableIdentifiers)

            // then count the number of distinct occurences of global references
            let globalVariableReferences = 0

            // the custom visitor makes the walker recur on an assignment expression, which doesn't happen by default
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

            console.log(globalVariableReferences)

            if (result.length > 1) return result
            else return []
        }
    }
]

exports.recommendations = recommendations