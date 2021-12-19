// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const lexer = require('chain-lexer'); this lexer works for C and SQL only
//let lexr = require('lexr');
//let jsLexer = new lexr.Tokenizer("Javascript"); this lexer has scope bugs
//const lexer4js = require('lexer4js') // doesn't recognize the require keyword
//const lexer = new lexer4js.Lexer()
const acorn = require('acorn-node');
const walker = require('acorn-node/walk')

const javaParser = require('java-parser')

const { recommendations } = require('./recommendations');



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testfragilitylint" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('testfragilitylint.aslamAlaikum', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Aslam Alaikum!');
	});

	let disposable2 = vscode.commands.registerCommand('testfragilitylint.showTimestamp', function () {
		vscode.window.showWarningMessage(Date.now().toString())
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);

	/* vscode.languages.registerHoverProvider('javascript', {
		provideHover(document, position, token) {
			let a = document.getText(new vscode.Range(position, position.translate(0, 4)))
			let b = document.languageId;
			return {
				contents: [b]
			}
		}
	}) */

	let collection = vscode.languages.createDiagnosticCollection('diagnosticCollection');
	context.subscriptions.push(collection)

	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
}

/**
 * @param {vscode.TextDocument} document
 * @param {vscode.DiagnosticCollection} collection
 */
function updateDiagnostics(document, collection) {
	if (document) {
		let language = document.languageId;
		let diagnostics = []

		if (language == 'java') {
			parseJava(document, diagnostics)
		} else if (language == 'javascript') {
			parseJavascript(document, diagnostics);
		} else {
			console.error(`The ${language} language is not supported.`)
			collection.clear()
			return
		}

		console.log("Diagnostics have been collected.")

		if (diagnostics.length > 0)
			collection.set(document.uri, diagnostics);
		else collection.clear()
	} else {
		collection.clear();
	}
}

function parseJava(document, diagnostics) {
	let root = javaParser.parse(document.getText())

	let Visitor1 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.context = {};
			this.validateVisitor();
		}

		methodBody(node) {
			let state = {localVariables: [], firstStatementStartingOffset: getLocation(node.block).endOffset + 1, driverVariable: null}
			super.methodBody(node, state)

			/* if there is no setup section or the driver variable is not declared locally */
			if (state.localVariables.length == 0 || (state.driverVariable && !state.localVariables.includes(state.driverVariable))) {
				// in this case, the setup snippet is between the left curly bracket and the first character of the first statement
				addDiagnostic(document, diagnostics, getLocation(node.block).startOffset, state.firstStatementStartingOffset, "R.W.8.8")
				addDiagnostic(document, diagnostics, getLocation(node.block).startOffset, state.firstStatementStartingOffset, "R.W.8.2")
			}
		}

		blockStatements(node, state) {
			//console.log(node)
			state.firstStatementStartingOffset = node.blockStatement[0].location.startOffset
			super.blockStatements(node, state)
		}

		variableDeclaratorId(node, state) {
			//console.log(node)
			state.localVariables.push(node.Identifier[0])
			super.variableDeclaratorId(node)
		}

		fqnOrRefType(node, state) {
			console.log(node)
			state.isDriverVariable = false
			super.fqnOrRefType(node, state)

			if (!state.isDriverVariable) state.driverVariable = null
		}

		fqnOrRefTypePartFirst(node, state) {
			state.driverVariable = getChild(node.fqnOrRefTypePartCommon).Identifier[0].image
			super.fqnOrRefTypePartFirst(node)
		}

		fqnOrRefTypePartRest(node, state) {
			let calledMethod = getChild(node.fqnOrRefTypePartCommon).Identifier[0].image

			if (calledMethod.includes("click")) {
				state.isDriverVariable = true
			}

			super.fqnOrRefTypePartRest(node)
		}
	}

	/* No need to compute global variables separately, as Java doesn't support hoisting */
	let Visitor2 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.context = { globalVariables: [] };
			this.validateVisitor();
		}

		fieldDeclaration(node) {
			let state = { isGlobalDeclaration: true }
			super.fieldDeclaration(node, state)
		}

		methodBody(node) {
			let state = { isGlobalDeclaration: false, localVariables: [] }
			super.methodBody(node, state)
			//console.log(state.localVariables)
		}

		variableDeclaratorId(node, state) {
			if (state && !state.isGlobalDeclaration) {
				state.localVariables.push(node.Identifier[0])
			} else if (state && state.isGlobalDeclaration) {
				this.context.globalVariables.push(node.Identifier[0])
			}

			super.variableDeclaratorId(node)
		}

		fqnOrRefTypePartFirst(node, state) {
			//console.log(node)
			let reference = getChild(node.fqnOrRefTypePartCommon).Identifier[0]

			/* The recommendation in the flesh */
			// if the reference was not declared as local variable
			if (!state.localVariables.map(localVariable => localVariable.image).includes(reference.image) &&
				this.context.globalVariables.map(globalVariable => globalVariable.image).includes(reference.image)) {

				addDiagnostic(document, diagnostics, reference.startOffset, reference.endOffset + 1, "R.W.8.5")
			}

			super.fqnOrRefTypePartFirst(node)
		}

	}

	let Visitor3 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		literal(node) {
			let literalString = node.StringLiteral[0].image
			/* Delete surrounding quotes from the literal */
			if (literalString.startsWith("\"") && literalString.endsWith("\"")) {
				literalString = literalString.substring(1, literalString.length - 1)
			}

			if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) == '/') {
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.2", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.4", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.6", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.7", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.16", literalString)
			}
			if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) != '/') {
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.1", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.2", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.4", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.6", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.7", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.16", literalString)
			}
			if (literalString.startsWith("css")) {
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.2", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.4", literalString)
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.16", literalString)
			}

			/* Recur on inner string */
			if (literalString.includes("\"")) {
				//console.log(literalString)
				let firstQuoteIndex = literalString.indexOf("\"") + 1
				let lastQuoteIndex = literalString.lastIndexOf("\"") - 1
				let newImage = literalString.substring(firstQuoteIndex, lastQuoteIndex)

				let innerNode = Object.assign({}, node)
				innerNode.StringLiteral[0].image = newImage
				innerNode.StringLiteral[0].startOffset += firstQuoteIndex + 1
				innerNode.StringLiteral[0].endOffset -= (literalString.length - lastQuoteIndex + 1)
				//console.log(innerNode)
				this.literal(innerNode)
			} else if (literalString.includes("\'")) {
				//console.log(literalString)
				let firstQuoteIndex = literalString.indexOf("\'") + 1
				let lastQuoteIndex = literalString.lastIndexOf("\'")
				let newImage = literalString.substring(firstQuoteIndex, lastQuoteIndex)

				let innerNode = Object.assign({}, node)
				innerNode.StringLiteral[0].image = newImage
				innerNode.StringLiteral[0].startOffset += firstQuoteIndex + 1
				innerNode.StringLiteral[0].endOffset -= (literalString.length - lastQuoteIndex + 1)
				//console.log(innerNode)

				this.literal(innerNode)
			}

			super.literal(node)
		}
	}

	let Visitor4 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodDeclarator(node) {
			let testCaseName = node.Identifier[0].image

			if (!testCaseName.toLowerCase().includes("when") || !testCaseName.toLowerCase().includes("then")) {
				addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.8.1", testCaseName)
			}

			super.methodDeclarator(node)
		}
	}

	let visitor1 = new Visitor1()
	visitor1.visit(root)
	let visitor2 = new Visitor2()
	visitor2.visit(root)
	let visitor3 = new Visitor3()
	visitor3.visit(root)
	let visitor4 = new Visitor4()
	visitor4.visit(root)

	//visitor.customResult.forEach(item => console.log(item))

	//console.log(context.globalVariables)
}

function addDiagnostic(document, diagnostics, startOffset, endOffset, recommendationId, tokenValue) {
	let recommendation = recommendations.find(recommendation => recommendation.id == recommendationId)
	if (!recommendation) {
		console.error("Could not find a recommendation. Skipping it.")
	} else {
		diagnostics.push(
			buildDiagnostic(
				document,
				startOffset,
				endOffset,
				recommendation.id,
				recommendation.message(tokenValue)
			)
		)
	}
}

function getChild(node) {
	return node[0].children
}

function getLocation(node) {
	return node[0].location
}


function parseJavascript(document, diagnostics) {
	let root = acorn.Parser.parse(document.getText());

	// the parse history, like declared global variables
	let context = {
		globalVariableIdentifiers: []
	};

	// TODO: collect global variables separately to support hoisting
	let customVisitor = walker.make({
		VariableDeclaration: (node, state, c) => {
			node.declarations.forEach(declaration => {

				let declarationString = document.getText(new vscode.Range(document.positionAt(declaration.start), document.positionAt(declaration.end)));
				let result = recommendations[6].contract(declarationString, context);

				//console.log(JSON.stringify(result))
				result.forEach(diagnosedNode => {
					diagnostics.push(
						buildDiagnostic(
							document,
							node.declarations.length == 1 ? node.start : diagnosedNode.start + declaration.start,
							node.declarations.length == 1 ? node.end : diagnosedNode.end + declaration.start,
							recommendations[6].id,
							recommendations[6].message(diagnosedNode.name)
						)
					);
				});

				/* collect global variables */
				if (!result) { // do not include third-party library declarations
					context.globalVariableIdentifiers.push(declaration.id.name);
				}
			});

			node.declarations.forEach(declaration => c(declaration, state));
		},
		CallExpression: (node, state, c) => {
			if (node.callee.name == 'it') {
				let testCaseString = document.getText(new vscode.Range(document.positionAt(node.start), document.positionAt(node.end)));
				//console.log(testCaseString)
				let result = recommendations[2].contract(testCaseString, context);
				//console.log(JSON.stringify(result))
				result.forEach(diagnosedNode => {
					diagnostics.push(
						buildDiagnostic(
							document,
							diagnosedNode.start + node.start,
							diagnosedNode.end + node.start,
							recommendations[2].id,
							recommendations[2].message(diagnosedNode.name)
						)
					);
				});

				result = recommendations[3].contract(testCaseString, context);
				//console.log(JSON.stringify(result))
				result.forEach(diagnosedNode => {
					diagnostics.push(
						buildDiagnostic(
							document,
							diagnosedNode.start + node.start,
							diagnosedNode.end + node.start,
							recommendations[3].id,
							recommendations[3].message(diagnosedNode.name)
						)
					);
				});

				result = recommendations[4].contract(testCaseString, context);
				//console.log(JSON.stringify(result))
				result.forEach(diagnosedNode => {
					diagnostics.push(
						buildDiagnostic(
							document,
							diagnosedNode.start + node.start,
							diagnosedNode.end + node.start,
							recommendations[4].id,
							recommendations[4].message(diagnosedNode.name)
						)
					);
				});

				result = recommendations[5].contract(testCaseString, context);
				//console.log(JSON.stringify(result))
				result.forEach(diagnosedNode => {
					diagnostics.push(
						buildDiagnostic(
							document,
							diagnosedNode.start + node.start,
							diagnosedNode.end + node.start,
							recommendations[5].id,
							recommendations[5].message(diagnosedNode.name)
						)
					);
				});
			} else if (node.callee.name == 'beforeAll' || node.callee.name == 'afterAll') {
				let fixtureString = document.getText(new vscode.Range(document.positionAt(node.start), document.positionAt(node.end)));
				let result = recommendations[4].contract(fixtureString, context);
				//console.log(JSON.stringify(result))
				result.forEach(diagnosedNode => {
					diagnostics.push(
						buildDiagnostic(
							document,
							diagnosedNode.start + node.start,
							diagnosedNode.end + node.start,
							recommendations[4].id,
							recommendations[4].message(diagnosedNode.name)
						)
					);
				});
			} else {
				/* the node is a test suite */
				c(node.callee, state);
				node.arguments.forEach(argument => c(argument, state));
			}
			// should not continue here: see global variable collection algorithm
		},
		Literal: (node, state, c) => {
			let result = recommendations[0].contract(node.value);
			result.forEach(diagnosedNode => {
				diagnostics.push(
					buildDiagnostic(
						document,
						diagnosedNode.start + node.start,
						diagnosedNode.end + node.start + 3,
						recommendations[0].id,
						recommendations[0].message(diagnosedNode.value)
					)
				);
			});

			result = recommendations[1].contract(node.value);
			result.forEach(diagnosedNode => {
				diagnostics.push(
					buildDiagnostic(
						document,
						diagnosedNode.start + node.start,
						diagnosedNode.end + node.start + 3,
						recommendations[1].id,
						recommendations[1].message(diagnosedNode.value)
					)
				);
			});
		}
	});

	walker.recursive(root, null, customVisitor, walker.base);
}

function buildDiagnostic(document, start, end, code, message) {
	let diagnostic = new vscode.Diagnostic(
		new vscode.Range(document.positionAt(start), document.positionAt(end)),
		message,
		vscode.DiagnosticSeverity.Warning
	)

	diagnostic.code = code
	diagnostic.source = 'Fragility linter'
	/* diagnostic.relatedInformation =  relatedInformation: [
		new vscode.DiagnosticRelatedInformation(
			new vscode.Location(
				document.uri,
				new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))
			),
			'first assignment to `x`'
		)
	] */

	return diagnostic
}


// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}


