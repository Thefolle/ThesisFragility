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
const { TokenType, tokTypes, Token, Parser, tokContexts, defaultOptions } = require('acorn');
const { recommendations } = require('./recommendations');
const { isFunctionTypeNode, visitLexicalEnvironment, visitNode } = require('typescript');

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
		let diagnostics = []

		let root = acorn.Parser.parse(document.getText())

		let globalVariableIdentifiers = []
		let context = {}

		let customVisitor = walker.make({
			VariableDeclaration: (node, state, c) => {
				node.declarations.forEach(declaration => globalVariableIdentifiers.push(declaration.id.name))
			},
			CallExpression: (node, state, c) => {
				if (node.callee.name == 'it') {
					let testCaseString = document.getText(new vscode.Range(document.positionAt(node.start), document.positionAt(node.end)))
					console.log(testCaseString)
					context.globalVariableIdentifiers = globalVariableIdentifiers

					let result = recommendations[0].contract(testCaseString, context)
					console.log(JSON.stringify(result))
					result.forEach(diagnosedNode => {
						diagnostics.push(
							buildDiagnostic(
								document,
								diagnosedNode.start + node.start,
								diagnosedNode.end + node.start,
								recommendations[0].id,
								recommendations[0].message(diagnosedNode.name)
							)
						)
					})
				} else {
					/* the node is a test suite */
					c(node.callee, state)
					node.arguments.forEach(argument => c(argument, state))
				}
				// should not continue here: see global variable collection algorithm
			}
		})

		walker.recursive(root, null, customVisitor, walker.base)

		console.log("Diagnostics have been collected.")

		if (diagnostics.length > 0)
			collection.set(document.uri, diagnostics);
		else collection.clear()
	} else {
		collection.clear();
	}
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

function isXPath(token) {
	if (typeof token === 'string')
		return token.includes("/");
	return null;
}

function isAbsoluteXPath(token) {
	if (typeof token === 'string')
		return token.charAt(0) == '/' && token.charAt(1) != '/';
	return null;
}

function isIdLocator(token) {
	if (typeof token === 'string')
		return token.charAt(0) == '#' || token.startsWith("id=");
	return null;
}

function isCssLocator(token) {
	if (typeof token === 'string')
		return token.startsWith("css=");
	return null;
}

function isNotSeparatedByHyphen(token) {
	if (typeof token === 'string')
		return token.search(/_|&|,|;/) !== -1;
	return null;
}

function isTestCaseName(secondToLastToken, firstToLastToken, token) {
	if (typeof secondToLastToken === 'string' && typeof firstToLastToken === 'string' && typeof token === 'string')
		return secondToLastToken == 'it' && firstToLastToken == '('
	return null;
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
