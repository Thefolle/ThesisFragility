// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const lexer = require('chain-lexer'); this lexer works for C and SQL only
//let lexr = require('lexr');
//let jsLexer = new lexr.Tokenizer("Javascript"); this lexer has scope bugs
//const lexer4js = require('lexer4js') // doesn't recognize the require keyword
//const lexer = new lexer4js.Lexer()
const acorn = require('acorn-node')

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

	let disposable2 = vscode.commands.registerCommand('testfragilitylint.showTimestamp', function() {
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
	let lexer = acorn.tokenizer(document.getText())

	let token = lexer.getToken()
	let a = ""
	let i = 0
	while (token && i < 8) {
		a += JSON.stringify(token.type)
		
		i++
		token = lexer.getToken()
	}

	if (document) {
		collection.set(document.uri, [{
			code: '',
			message: `token: ${a}`,
			range: new vscode.Range(new vscode.Position(3, 4), new vscode.Position(3, 10)),
			severity: vscode.DiagnosticSeverity.Error,
			source: '',
			relatedInformation: [
				new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
			]
		}]);
	} else {
		collection.clear();
	}
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
