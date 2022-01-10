// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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

	console.log('Extension testfragilitylint is active.');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let activateCommand = vscode.commands.registerCommand('Activate', function () {
		/* Do nothing. A command's callback must be defined even if it is empty. */
	})

	context.subscriptions.push(activateCommand);

	//vscode.workspace.

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

	// TODO: onDidChangeTextDocument, so as to refresh while coding (or also saving)
	let openTextDocumentListener = vscode.workspace.onDidOpenTextDocument(document => updateDiagnostics(document, collection))
	context.subscriptions.push(openTextDocumentListener)

	let generateReportCommand = vscode.commands.registerCommand('Generate Report', function () {
		if (!vscode.window.activeTextEditor) {
			vscode.window.showInformationMessage("No text editor has focus. Please, open a file and issue the command again.")
			return
		}

		let document = vscode.window.activeTextEditor.document
		if (!supportLanguage(document.languageId)) {
			vscode.window.showInformationMessage(`The ${document.languageId} language is not supported.`)
		}
		let diagnostics = collection.get(document.uri)
		generateReport(document, diagnostics)
	})
	context.subscriptions.push(generateReportCommand)

	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}

}

// this method is called when your extension is deactivated
function deactivate() {
	console.log("Extension deactivated")
	return undefined // must return this value if deallocation is synchronous
}

/**
 * @param {vscode.TextDocument} document
 * @param {vscode.DiagnosticCollection} collection
 */
function updateDiagnostics(document, collection) {
	if (document) {
		let language = document.languageId;
		let diagnostics = []

		if (!supportLanguage(language)) return

		if (language == 'java') {
			parseJava(document, diagnostics)
		} else if (language == 'javascript') {
			parseJavascript(document, diagnostics);
		}

		console.log("Diagnostics have been collected.")

		if (diagnostics.length > 0) {
			// prioritize diagnostics by narrowing scope
			diagnostics.sort((diagnostic1, diagnostic2) => {
				let scope1 = recommendations.find(recommendation => recommendation.id == diagnostic1.code).scope
				let scope2 = recommendations.find(recommendation => recommendation.id == diagnostic2.code).scope
				return scope1 - scope2
			})

			collection.set(document.uri, diagnostics);
		}
		else collection.set(document.uri, [])
	} else {
		collection.set(document.uri, []);
	}
}

function supportLanguage(actualLanguage) {
	if (['java', 'javascript'].includes(actualLanguage)) return true
	else return false
}

function generateReport(document, diagnostics) {
	let reportUri = vscode.Uri.joinPath(document.uri, "..", "Report.json")
	let workspaceEdit = new vscode.WorkspaceEdit()
	
	workspaceEdit.createFile(reportUri, {overwrite: true, ignoreIfExists: false})
	workspaceEdit.insert(reportUri, new vscode.Position(0, 0), JSON.stringify(diagnostics))
	vscode.workspace.applyEdit(workspaceEdit)
}

function parseJava(document, diagnostics) {
	let root = javaParser.parse(document.getText())

	let Visitor1 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodBody(node, pastState) {
			let state = { localVariables: [], firstStatementStartingOffset: getLocation(node.block).endOffset + 1, driverVariable: null }
			super.methodBody(node, state)

			/* if there is no setup section or the driver variable is not declared locally */
			if (state.localVariables.length == 0 || (state.driverVariable && !state.localVariables.map(localVariable => localVariable.image).includes(state.driverVariable))) {
				// in this case, the setup snippet is between the left curly bracket and the first character of the first statement
				addDiagnostic(document, diagnostics, getLocation(node.block).startOffset, state.firstStatementStartingOffset, "R.W.12.6")
			}
		}

		blockStatements(node, state) {
			if (!state) {
				super.blockStatements(node)
				return // If the state is undefined, the node is outside a method body
			}

			state.firstStatementStartingOffset = node.blockStatement[0].location.startOffset
			super.blockStatements(node, state)
		}

		variableDeclaratorId(node, state) {
			if (!state) {
				super.variableDeclaratorId(node)
				return // If the state is undefined, the node is outside a method body
			}

			state.localVariables.push(node.Identifier[0])
			super.variableDeclaratorId(node)
		}

		fqnOrRefType(node, state) {
			if (!state) {
				super.fqnOrRefType(node)
				return // If the state is undefined, the node is outside a method body
			}

			state.hasCalledBothPartFirstAndPartRest = false // accept evaluation only if both fqnOrRefTypePartFirst and fqnOrRefTypePartRest have been called
			super.fqnOrRefType(node, state)

			if (!state.hasCalledBothPartFirstAndPartRest) {
				state.driverVariable = null
			}
		}

		fqnOrRefTypePartFirst(node, state) {
			if (!state) {
				super.fqnOrRefTypePartFirst(node)
				return // If the state is undefined, the node is outside a method body
			}

			if (!state.driverVariable) {
				let property = Object.keys(getChild(node.fqnOrRefTypePartCommon)).find(prop => prop == 'Identifier' || prop == 'Super')
				state.driverVariable = getChild(node.fqnOrRefTypePartCommon)[property][0].image
				state.hasSetDriverVariable = true
			} else {
				state.hasSetDriverVariable = false
			}

			super.fqnOrRefTypePartFirst(node)
		}

		fqnOrRefTypePartRest(node, state) {
			if (!state) {
				super.fqnOrRefTypePartRest(node)
				return // If the state is undefined, the node is outside a method body
			}

			let calledMethod = getChild(node.fqnOrRefTypePartCommon).Identifier[0].image

			if (!calledMethod.includes("click") && state.hasSetDriverVariable) {
				state.driverVariable = null
			}

			state.hasCalledBothPartFirstAndPartRest = true
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
			let state = { isGlobalDeclaration: false, localVariables: [], imInBody: true }
			super.methodBody(node, state)
		}

		variableDeclaratorId(node, state) {
			if (!state || !state.imInBody) {
				super.variableDeclaratorId(node)
				return // If the state is undefined, the node is outside a method body
			}

			if (state && !state.isGlobalDeclaration) {
				state.localVariables.push(node.Identifier[0])
			} else if (state && state.isGlobalDeclaration) {
				this.context.globalVariables.push(node.Identifier[0])
			}

			super.variableDeclaratorId(node)
		}

		fqnOrRefTypePartFirst(node, state) {
			if (!state || !state.imInBody) {
				super.fqnOrRefTypePartFirst(node)
				return // If the state is undefined, the node is outside a method body
			}

			let property = Object.keys(getChild(node.fqnOrRefTypePartCommon)).find(prop => prop == 'Identifier' || prop == 'Super')
			let reference = getChild(node.fqnOrRefTypePartCommon)[property][0].image

			/* The recommendation in the flesh */
			// if the reference was not declared as local variable
			if (!state.localVariables.map(localVariable => localVariable.image).includes(reference.image) &&
				this.context.globalVariables.map(globalVariable => globalVariable.image).includes(reference.image)) {

				addDiagnostic(document, diagnostics, reference.startOffset, reference.endOffset + 1, "R.W.12.4")
			}

			super.fqnOrRefTypePartFirst(node)
		}

	}

	let Visitor3 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		/* Method to provide better precision */
		fqnOrRefTypePartRest(node) {
			let calledMethod = getChild(node.fqnOrRefTypePartCommon).Identifier[0].image
			let state = {calledMethod}
			super.fqnOrRefTypePartRest(node, state)
		}

		literal(node, state) {
			if (!node.StringLiteral) return // if the literal is not a string

			let literalString = node.StringLiteral[0].image
			/* Delete surrounding quotes from the literal */
			if (literalString.startsWith("\"") && literalString.endsWith("\"")) {
				literalString = literalString.substring(1, literalString.length - 1)
			}

			if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) == '/') {
/* 				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.2", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.8", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.9", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.10", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.11", "Use of relative XPath.") */
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.18", "Use of relative XPath.")
			} else if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) != '/' && (state && state.calledMethod != 'open')) { // the open method accepts URLs
/* 				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.1", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.2", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.8", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.9", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.10", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.11", "Use of relative XPath.") */
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.18", "Use of relative XPath.")
			} else if (literalString.startsWith("css") || literalString.includes('#') || literalString.includes('>')) {
/* 				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.2", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.8", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.9", "Use of CSS locator.") */
				addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.18", "Use of CSS locator.")
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
				addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.12.1", testCaseName)
			}

			super.methodDeclarator(node)
		}
	}

	let Visitor5 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodBody(node) {
			let state = { imInFixtureSection: false, imInActSection: false, imInAssertSection: false, errorFound: false, lastStatement: { startOffset: getLocation(node.block).startOffset, endOffset: getLocation(node.block).endOffset }, imInBody: true }
			super.methodBody(node, state)

			if (!state.imInFixtureSection && !state.imInActSection && !state.imInAssertSection && !state.errorFound) {
				/* The test is empty: do nothing */
			} else if (state.imInActSection && !state.errorFound) {
				addDiagnostic(document, diagnostics, state.lastStatement.endOffset, getLocation(node.block).endOffset, "R.W.8.2", "The assert section is empty.")
			}
		}

		blockStatement(node, state) {
			if (!state || !state.imInBody) {
				super.blockStatement(node)
				return // If the state is undefined, the node is outside a method body
			}

			let statementProperty = Object.keys(node).find(property => property.toLowerCase().includes("statement"))
			state.currentStatement = { startOffset: getLocation(node[statementProperty]).startOffset, endOffset: getLocation(node[statementProperty]).endOffset }
			let statementSection = Object.assign({}, state)

			super.blockStatement(node, statementSection)

			if (state.errorFound) return // probe only the first error

			if (!state.imInFixtureSection && !state.imInActSection && !state.imInAssertSection && statementSection.imInFixtureSection) {

				state.imInFixtureSection = true

			} else if (state.imInFixtureSection && statementSection.imInActSection) {

				state.imInFixtureSection = false
				state.imInActSection = true

			} else if (state.imInActSection && statementSection.imInAssertSection) {
				
				state.imInActSection = false
				state.imInAssertSection = true
			
			} else if (!state.imInFixtureSection && !state.imInActSection && !state.imInAssertSection && !statementSection.imInFixtureSection) {
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.lastStatement.startOffset, state.currentStatement.startOffset, "R.W.8.2", "The setup section is empty.")
			
			} else if (state.imInFixtureSection && statementSection.imInAssertSection) { // if no act section is present
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.lastStatement.endOffset, state.currentStatement.startOffset, "R.W.8.2", "The act section is empty.")
			
			} else if (state.imInActSection && statementSection.imInFixtureSection) { // if declaration is in act section
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.currentStatement.startOffset, state.currentStatement.endOffset, "R.W.8.2", "The declaration is inside the act section.")
			
			} else if (state.imInAssertSection && statementSection.imInFixtureSection) { // if no act section is present
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.currentStatement.startOffset, state.currentStatement.endOffset, "R.W.8.2", "The setup statement is inside the assert section.")
			
			} else if (state.imInAssertSection && statementSection.imInActSection) { // if no act section is present
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.currentStatement.startOffset, state.currentStatement.endOffset, "R.W.8.2", "The act statement is inside the assert section.")
			
			}

			// this statement must go after the recursive call
			state.lastStatement = state.currentStatement
		}

		variableDeclaratorId(node, state) {
			if (!state || !state.imInBody) {
				super.variableDeclaratorId(node)
				return // If the state is undefined, the node is outside a method body
			}

			state.imInFixtureSection = true
			state.imInActSection = false
			state.imInAssertSection = false

			super.variableDeclaratorId(node, state)
		}

		fqnOrRefTypePartFirst(node, state) {
			if (!state || !state.imInBody) {
				super.fqnOrRefTypePartFirst(node)
				return // If the state is undefined, the node is outside a method body
			}

			let property = Object.keys(getChild(node.fqnOrRefTypePartCommon)).find(prop => prop == 'Identifier' || prop == 'Super')
			let calledMethod = getChild(node.fqnOrRefTypePartCommon)[property][0].image

			if (calledMethod.includes("assert")) {
				state.imInFixtureSection = false
				state.imInActSection = false
				state.imInAssertSection = true
			}

			super.fqnOrRefTypePartFirst(node, state)
		}

		fqnOrRefTypePartRest(node, state) {
			if (!state || !state.imInBody) {
				super.fqnOrRefTypePartRest(node)
				return // If the state is undefined, the node is outside a method body
			}

			let calledMethod = getChild(node.fqnOrRefTypePartCommon).Identifier[0].image

			if (calledMethod.includes("click") || calledMethod.includes("waitForCondition") || calledMethod.includes("type")) {
				state.imInFixtureSection = false
				state.imInActSection = true
				state.imInAssertSection = false
			} else if (calledMethod.includes("assert")) {
				state.imInFixtureSection = false
				state.imInActSection = false
				state.imInAssertSection = true
			}

			super.fqnOrRefTypePartRest(node, state)
		}

	}

	let Visitor6 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		classMemberDeclaration(node) {
			if (!node.methodDeclaration) { // if the current declaration is not a method
				super.classMemberDeclaration(node)
				return
			}

			let state = {startOffset: getLocation(node.methodDeclaration).startOffset, endOffset: getLocation(node.methodDeclaration).endOffset}
			super.classMemberDeclaration(node, state)
		}

		methodDeclaration(node, state) {
			state.isFixtureMethod = false
			super.methodDeclaration(node, state)

			if (state.isFixtureMethod) {
				addDiagnostic(document, diagnostics, state.startOffset, state.endOffset, "R.W.12.5", "Usage of setup/tear down method.")
				addDiagnostic(document, diagnostics, state.startOffset, state.endOffset, "R.W.13", "Usage of setup/tear down method.")
				addDiagnostic(document, diagnostics, state.startOffset, state.endOffset, "R.W.17", "Usage of setup/tear down method.")
			}
		}

		methodModifier(node, state) {
			state.imInMethodModifier = true
			super.methodModifier(node, state)
		}

		annotation(node, state) {
			if (!state || !state.imInMethodModifier) {
				super.annotation(node)
				return
			}

			let annotationName = getChild(node.typeName).Identifier[0].image

			if (annotationName == 'Before') {
				state.isFixtureMethod = true
			} else if (annotationName == 'After' ) {
				state.isFixtureMethod = true
			}
		}
	}

	let Visitor7 = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodBody(node) {
			let testCaseLength = getChild(getChild(node.block).blockStatements).blockStatement.length

			if (testCaseLength > 15) { // Magic number: need further research
				addDiagnostic(document, diagnostics, getLocation(node.block).startOffset, getLocation(node.block).endOffset, "R.W.14", "The test case is too long.")
			}

			super.methodBody(node)
		}

	}

	let visitors = [new Visitor1(), new Visitor2(), new Visitor3(), new Visitor4()/* , new Visitor5() */, new Visitor6(),
		new Visitor7()]
	let promises = visitors.map(visitor => new Promise((resolve, reject) => {
		try {
			visitor.visit(root)
			resolve(undefined)
		} catch (e) {
			reject(e)
		}
	}))

	Promise.all(promises).then(res =>
		undefined
	).catch(err => {
		/* Probable parsing error */
		console.error(err)
	})
}

function parseJavascript(document, diagnostics) {

	let multiLineNonBlockDiagnostics = []

	let root = acorn.Parser.parse(document.getText(), {

		/* Rule about comments must go here */
		onComment: (isBlock, text, start, end, startLoc, endLoc) /* startLoc and endLoc are always undefined */ => {
			
			// Keep in mind that a multi-line non-block comment is actually a list of single-line non-block comments
			
			let multiLineNonBlockDiagnostic = {
				initialCommentOffset: undefined,
				lastCommentOffset: undefined,
				isPositive: true
			}

			/* Get the first and the last line of the multi-line non-block comment */
			if (!isBlock) {
				
				if (multiLineNonBlockDiagnostics.length > 0 && multiLineNonBlockDiagnostics[multiLineNonBlockDiagnostics.length - 1].lastCommentOffset && document.positionAt(multiLineNonBlockDiagnostics[multiLineNonBlockDiagnostics.length - 1].lastCommentOffset).line == document.positionAt(start).line - 1) {
					// this comment line is the continuation of the previous comment line
					multiLineNonBlockDiagnostic = multiLineNonBlockDiagnostics.pop()
					multiLineNonBlockDiagnostic.lastCommentOffset = end
				} else {
					// this is a separate comment
					multiLineNonBlockDiagnostic.initialCommentOffset = start
					multiLineNonBlockDiagnostic.lastCommentOffset = end
				}
			}
			
			let patterns = ['todo', 'license', 'copyright', 'function(', '=>', 'const ', 'let ', 'async']
			
			if (patterns.some(pattern => text.toLowerCase().includes(pattern))) {
				if (!isBlock) {
					multiLineNonBlockDiagnostic.isPositive = false
				} else {
					addDiagnostic(document, diagnostics, start, end, "R.W.21", "Use of a comment to describe the behaviour.")
				}
			}

			if (!isBlock) {
				multiLineNonBlockDiagnostics.push(multiLineNonBlockDiagnostic)
			}

		}
	})

	/* onComment is not called after the last line of the comment; so here add the diagnostic*/
	multiLineNonBlockDiagnostics.forEach(multiLineNonBlockDiagnostic => {
		if (multiLineNonBlockDiagnostic.isPositive)
			addDiagnostic(document, diagnostics, multiLineNonBlockDiagnostic.initialCommentOffset, multiLineNonBlockDiagnostic.lastCommentOffset, "R.W.21", "Use of a comment to describe the behaviour.")
	})

	let Visitor1 = walker.make({
		CallExpression(node, state, c) {
			if (state && state.driverVariable) return

			if (node.callee.name == 'it' || node.callee.name == 'test') {
				let state = {imInTestCase: true, driverVariable: null, localVariables: []}
				// @ts-ignore
				walker.base.CallExpression(node, state, c)
				if (state.localVariables.length == 0 || (state.driverVariable && !state.localVariables.map(localVariable => localVariable.name).includes(state.driverVariable))) {
					// in this case, the setup snippet is between the left curly bracket and the first character of the first statement
					addDiagnostic(document, diagnostics, node.arguments[1].body.start, node.arguments[1].body.body[0].start, "R.W.12.6")
				}

				return
			}

			if (!state || !state.imInTestCase) {// If the state is undefined, the node is outside a method body
				// @ts-ignore
				walker.base.CallExpression(node, null, c)
				return
			}

			const recognizedDriverMethods = ['wait', 'getTitle', 'get', 'findElement']
			let chain = []
			getChain(node, chain)
			if (recognizedDriverMethods.some(recognizedDriverMethod => chain.map(string => `${string}`.toLowerCase()).includes(recognizedDriverMethod.toLowerCase()))) {
				state.driverVariable = chain[0]
				return
			}

			// @ts-ignore
			walker.base.CallExpression(node, state, c)
		},

		VariableDeclaration(node, state, c) {
			if (state && state.driverVariable) return

			if (!state || !state.imInTestCase) {// If the state is undefined, the node is outside a method body
				// @ts-ignore
				walker.base.VariableDeclaration(node, null, c)
				return 
			}

			node.declarations.forEach(declaration => {
				state.localVariables.push(declaration.id)
			})
			
			// @ts-ignore
			walker.base.VariableDeclaration(node, state, c)
		},

		MemberExpression(node, state, c) {
			if (state && state.driverVariable) return

			if (!state || !state.imInTestCase) {// If the state is undefined, the node is outside a method body
				// @ts-ignore
				walker.base.MemberExpression(node, null, c)
				return 
			}

			const recognizedDriverMethods = ['wait', 'getTitle', 'get', 'findElement']
			let chain = []
			getChain(node, chain)
			if (recognizedDriverMethods.some(recognizedDriverMethod => chain.map(string => `${string}`.toLowerCase()).includes(recognizedDriverMethod.toLowerCase()))) {
				state.driverVariable = chain[0]
				return
			}

			// @ts-ignore
			walker.base.MemberExpression(node, state, c)
		}

	})

	let Visitor2 = walker.make({
		Program(node, junkState, c) {
			let state = {globalVariables: []}
			// @ts-ignore
			walker.base.Program(node, state, c)
		},

		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {
				// @ts-ignore
				walker.base.CallExpression(node, state, c)
				return
			}

			state.imInTestCase = true
			state.localVariables = []
			// @ts-ignore
			walker.base.CallExpression(node, state, c)

			state.imInTestCase = false
		},

		VariableDeclarator(node, state, c) {
			if (!state.imInTestCase) {
				if (node.init && node.init.type != 'FunctionExpression' && node.init.type != 'ArrowFunctionExpression')
					state.globalVariables.push(node.id.name)
			} else {
				state.localVariables.push(node.id.name)
			}

			// @ts-ignore
			walker.base.VariableDeclarator(node, state, c)
		},

		Identifier(node, state, c) {
			if (!state.imInTestCase) {
				// @ts-ignore
				walker.base.Identifier(node, state, c)
				return
			}

			if (state.globalVariables.includes(node.name) && !state.localVariables.includes(node.name)) {
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.12.4")
			}

			// @ts-ignore
			walker.base.Identifier(node, state, c)
		}
	})

	let Visitor3 = walker.make({
		Literal(node, state, c) {
			if (!(typeof node.value === 'string' || node.value instanceof String)) {
				// @ts-ignore
				walker.base.Literal(node, null, c)
				return
			}
			let literalString = node.value

			if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) == '/') {
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.2", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.3", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.8", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.9", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.10", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.11", "Use of relative XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.18", "Use of relative XPath.")
			} else if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) != '/' && (state && state.calledMethod != 'open')) { // the open method accepts URLs
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.1", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.2", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.3", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.8", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.9", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.10", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.11", "Use of absolute XPath.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.18", "Use of absolute XPath.")
			} else if (literalString.startsWith("css") || (literalString.includes('#') && !literalString.includes('http')) || literalString.includes('>')) {
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.2", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.3", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.8", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.9", "Use of CSS locator.")
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.18", "Use of CSS locator.")
			}

			// @ts-ignore
			walker.base.Literal(node, null, c)
		}
	})

	let Visitor4 = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {
				// @ts-ignore
				walker.base.CallExpression(node, null, c)
				return
			}

			let testCaseName = node.arguments[0].value

			const scenarioPatterns = [
				"when", "if"
			]

			const expectedResultPatterns = [
				"then", "return", "should"
			]

			let isScenarioMissing = false, isExpectedResultMissing = false
			if (!scenarioPatterns.some(scenarioPattern => testCaseName.toLowerCase().includes(scenarioPattern))) {
				isScenarioMissing = true
			}
			if (!expectedResultPatterns.some(expectedResultPattern => testCaseName.toLowerCase().includes(expectedResultPattern))) {
				isExpectedResultMissing = true
			}

			if (isScenarioMissing && !isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.1", "The test name is not specifying the expected result.")
			} else if (!isScenarioMissing && isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.1", "The test name is not specifying the starting scenario.")
			} else if (isScenarioMissing && isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.1", "The test name is not specifying neither the starting scenario nor the expected result")
			}

			// @ts-ignore
			walker.base.CallExpression(node, null, c)
		}
	})

	/* This rule has complex heuristics:
	*	- Selenium can be used to perform visual unit testing, but unit tests are not structured as use cases (see navbar.test.js)
	*/
	let Visitor5 = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {
				// @ts-ignore
				walker.base.CallExpression(node, state, c)
				return
			}

			state = { imInFixtureSection: false, imInActSection: false, imInAssertSection: false, errorFound: false, lastStatement: { startOffset: node.arguments[1].body.start, endOffset: node.arguments[1].body.end }, imInBody: true }
			// @ts-ignore
			walker.base.CallExpression(node, state, c)

			if (!state.imInFixtureSection && !state.imInActSection && !state.imInAssertSection && !state.errorFound) {
				/* The test is empty: do nothing */
			} else if (state.imInFixtureSection && !state.errorFound) {
				addDiagnostic(document, diagnostics, state.lastStatement.endOffset, state.lastStatement.endOffset + 1, "R.W.8.2", "The act section is empty.")
			} else if (state.imInActSection && !state.errorFound) {
				addDiagnostic(document, diagnostics, state.lastStatement.endOffset, state.lastStatement.endOffset + 1, "R.W.8.2", "The assert section is empty.")
			}

		},

		// Represent a statement in test cases, even in callback-styled code
		ExpressionStatement(node, state, c) {
			if (!state || !state.imInBody) { // If the state is undefined, the node is outside a method body
				// @ts-ignore
				walker.base.ExpressionStatement(node, null, c)
				return
			}

			state.currentStatement = { startOffset: node.start, endOffset: node.end }

			// @ts-ignore
			walker.base.ExpressionStatement(node, state, c)

			// this statement must go after the recursive call
			state.lastStatement = state.currentStatement
		},

		check(state, statementSection) {
			if (state.errorFound) return // probe only the first error

			if (!state.imInFixtureSection && !state.imInActSection && !state.imInAssertSection && statementSection.imInFixtureSection) {

				state.imInFixtureSection = true

			} else if (state.imInFixtureSection && statementSection.imInActSection) {

				state.imInFixtureSection = false
				state.imInActSection = true

			} else if (state.imInActSection && statementSection.imInAssertSection) {
				
				state.imInActSection = false
				state.imInAssertSection = true
			
			} else if (!state.imInFixtureSection && !state.imInActSection && !state.imInAssertSection && !statementSection.imInFixtureSection) {
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.lastStatement.startOffset, state.currentStatement.startOffset, "R.W.8.2", "The setup section is empty.")
			
			} else if (state.imInFixtureSection && statementSection.imInAssertSection) { // if no act section is present
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.lastStatement.endOffset, state.currentStatement.startOffset, "R.W.8.2", "The act section is empty.")
			
			} else if (state.imInActSection && statementSection.imInFixtureSection) { // if declaration is in act section
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.currentStatement.startOffset, state.currentStatement.endOffset, "R.W.8.2", "The declaration is inside the act section.")
			
			} else if (state.imInAssertSection && statementSection.imInFixtureSection) { // if no act section is present
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.currentStatement.startOffset, state.currentStatement.endOffset, "R.W.8.2", "The setup statement is inside the assert section.")
			
			} else if (state.imInAssertSection && statementSection.imInActSection) { // if no act section is present
				
				state.errorFound = true
				addDiagnostic(document, diagnostics, state.currentStatement.startOffset, state.currentStatement.endOffset, "R.W.8.2", "The act statement is inside the assert section.")
			
			}
		},

		MemberExpression(node, state, c) {
			if (!state || !state.imInBody) {
				// @ts-ignore
				walker.base.MemberExpression(node, null, c)
				return
			}

			/* Check for assert section */
			// the first part of a statement (before the first dot) can either be a variable (like 'driver') or a function call (like 'expect(...)')
			if (node.object.type == 'Identifier' || (node.object.type == 'CallExpression' && node.object.callee.type == 'Identifier')) {
				let statementSection = Object.assign({}, state)

				let reference = ""
				if (node.object.type == 'Identifier') {
					reference = node.object.name
				} else {
					reference = node.object.callee.name
				}

				console.log(reference)
				console.log(state)

				if (reference.toLowerCase().includes("assert") || reference.toLowerCase().includes("expect")) {
					statementSection.imInFixtureSection = false
					statementSection.imInActSection = false
					statementSection.imInAssertSection = true
					this.check(state, statementSection)
				}
				
			}

			// @ts-ignore
			walker.base.MemberExpression(node, state, c)

			/* Check for act section */
			if (node.property.type == 'Identifier') {
				let statementSection = Object.assign({}, state)
				let calledMethod = node.property.name
				console.log(`.${calledMethod}`)
				let matchCalledMethodHeuristic = ['click', 'waitForCondition', 'type', 'find'].some(value => calledMethod.includes(value))  // The 'get' method is part of the fixture section
				if (matchCalledMethodHeuristic) {
					statementSection.imInFixtureSection = false
					statementSection.imInActSection = true
					statementSection.imInAssertSection = false
					this.check(state, statementSection)
				} else if (calledMethod.includes("assert")) {
					statementSection.imInFixtureSection = false
					statementSection.imInActSection = false
					statementSection.imInAssertSection = true
					this.check(state, statementSection)
				} else if (calledMethod.includes("get")) {
					statementSection.imInFixtureSection = true
					statementSection.imInActSection = false
					statementSection.imInAssertSection = false
					this.check(state, statementSection)
				}
			}

		},

		VariableDeclaration(node, state, c) {
			if (!state || !state.imInBody) { // If the state is undefined, the node is outside a method body
				// @ts-ignore
				walker.base.VariableDeclaration(node, null, c)
				return
			}

			if (node.declarations.length == 1) {
				state.lastStatement = state.currentStatement
				state.currentStatement = { startOffset: node.start, endOffset: node.end }
				state.isJustOneDeclaration = true
			}

			// @ts-ignore
			walker.base.VariableDeclaration(node, state, c)
			state.isJustOneDeclaration = false
		},

		VariableDeclarator(node, state, c) {
			if (!state || !state.imInBody) { // If the state is undefined, the node is outside a method body
				// @ts-ignore
				walker.base.VariableDeclarator(node, null, c)
				return
			}

			let statementSection = Object.assign({}, state)

			console.log(`Declaration: ${node.id.name}`)

			statementSection.imInFixtureSection = true
			statementSection.imInActSection = false
			statementSection.imInAssertSection = false

			/* Variable declarations are not considered statements (Expression Statements)*/
			if (!state.isJustOneDeclaration) {
				state.lastStatement = state.currentStatement
				state.currentStatement = { startOffset: node.start, endOffset: node.end }
			}

			this.check(state, statementSection)

			// @ts-ignore
			walker.base.VariableDeclarator(node, state, c)
		}

	})

	let Visitor6 = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name == 'afterAll' || node.callee.name == 'beforeAll') {
				addDiagnostic(document, diagnostics, node.start,node.end, "R.W.12.5", "Usage of setup/tear down method.")
				addDiagnostic(document, diagnostics, node.start,node.end, "R.W.13", "Usage of setup/tear down method.")
				addDiagnostic(document, diagnostics, node.start,node.end, "R.W.17", "Usage of setup/tear down method.")
			}

			// @ts-ignore
			walker.base.CallExpression(node, state, c)
		}
	})

	let Visitor7 = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {
				// @ts-ignore
				walker.base.CallExpression(node, state, c)
				return
			}

			state = {numberOfStatements: 0}
			// @ts-ignore
			walker.base.CallExpression(node, state, c)

			if (state.numberOfStatements > 15) {
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.14", "The test case is too long.")
			}

			state = null
		},

		ExpressionStatement(node, state, c) {
			if (!state) {
				// @ts-ignore
				walker.base.ExpressionStatement(node, state, c)
				return
			}

			state.numberOfStatements++

			// @ts-ignore
			walker.base.ExpressionStatement(node, state, c)
		},

		VariableDeclaration(node, state, c) {
			if (!state) {
				// @ts-ignore
				walker.base.VariableDeclaration(node, state, c)
				return
			}

			state.numberOfStatements++

			// @ts-ignore
			walker.base.VariableDeclaration(node, state, c)
		}
	})

	let Visitor8 = walker.make({
		VariableDeclaration(node, state, c) {
			node.declarations.forEach(variableDeclarator => {
				let chain = []
				if (!variableDeclarator.init) return // declaration with no init
				getChain(variableDeclarator.init, chain)
				if (chain[0] == 'require') {
					addDiagnostic(document, diagnostics, node.start, node.end, "R.W.16", "Use of a third-party library.")
				}
			})
		},

		CallExpression(node, state, c) {
			if (node.callee.name == 'it' || node.callee.name == 'test') {
				return
			}

			// @ts-ignore
			walker.base.CallExpression(node, state, c)
		}
	})

	let Visitor9 = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.type != 'Identifier' || node.callee.name != 'setTimeout') {
				// @ts-ignore
				walker.base.CallExpression(node, state, c)
				return
			}

			addDiagnostic(document, diagnostics, node.callee.start, node.callee.end, "R.D.0", "Use of setTimeout.")

			// @ts-ignore
			walker.base.CallExpression(node, state, c)
		}
	})

	let visitors = [Visitor1, Visitor2, Visitor3, Visitor4/* , Visitor5 */, Visitor6, Visitor7, Visitor8, Visitor9]
	let promises = visitors.map(visitor => new Promise((resolve, reject) => {
		try {
			walker.recursive(root, null, visitor, walker.base)
			resolve(undefined)
		} catch (e) {
			reject(e)
		}
	}))

	Promise.all(promises).then(res =>
		undefined
	).catch(err => {
		/* Probable parsing error */
		console.error(err)
	})
	
}

function getChild(node) {
	return node[0].children
}

function getLocation(node) {
	return node[0].location
}

/* node can be either a CallExpression, a MemberExpression or an Identifier */
function getChain(node, chain) {
	if (!node) console.log(chain)

	if (node.type == 'MemberExpression') {
		getChain(node.object, chain)
		getChain(node.property, chain)
	} else if (node.type == 'CallExpression') {
		getChain(node.callee, chain)
	} else if (node.type == 'Identifier') {
		chain.push(node.name)
	} else if (node.type == 'AwaitExpression') {
		getChain(node.argument, chain)
	} else if (node.type == 'Literal') {
		chain.push(node.value)
	}
}

function addDiagnostic(document, diagnostics, startOffset, endOffset, recommendationId, specificMessage) {
	let recommendation = recommendations.find(recommendation => recommendation.id == recommendationId)
	if (!recommendation) {
		console.error(`Could not find recommendation ${recommendationId}. Skipping it.`)
	} else {
		diagnostics.push(
			buildDiagnostic(
				document,
				startOffset,
				endOffset,
				recommendation.id,
				recommendation.message,
				specificMessage
			)
		)
	}
}

function buildDiagnostic(document, start, end, code, message, specificMessage) {
	let diagnostic = new vscode.Diagnostic(
		new vscode.Range(document.positionAt(start), document.positionAt(end)),
		message,
		vscode.DiagnosticSeverity.Warning
	)

	diagnostic.code = code
	diagnostic.source = 'Fragility linter'
	if (specificMessage) {
		diagnostic.relatedInformation = [
			new vscode.DiagnosticRelatedInformation(
				new vscode.Location(
					document.uri,
					new vscode.Range(document.positionAt(start), document.positionAt(end))
				),
				specificMessage
			)
		]
	}
	

	return diagnostic
}



module.exports = {
	activate,
	deactivate
}


