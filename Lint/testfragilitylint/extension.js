// @ts-nocheck

// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');

// Dependencies for Javascript parsing
const acorn = require('acorn-node');
const walker = require('acorn-node/walk')

// Dependencies for Java parsing
const javaParser = require('java-parser')

// Internal modules
const { recommendations } = require('./recommendations');
const chartReporter = require('./ChartReporter')


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Extension testfragilitylint is active.');


	let activateCommand = vscode.commands.registerCommand('Activate', function () {
		/* Do nothing. A command's callback must be defined even if it is empty. */
	})
	context.subscriptions.push(activateCommand);

	let collection = vscode.languages.createDiagnosticCollection('diagnosticCollection');
	context.subscriptions.push(collection)

	let openTextDocumentListener = vscode.workspace.onDidOpenTextDocument(document => {
		if (document.uri.scheme === 'file') { // ignore git files that get opened in background
			updateDiagnostics(document, collection)
		}
	})
	context.subscriptions.push(openTextDocumentListener)

	let closeTextDocumentListener = vscode.workspace.onDidCloseTextDocument(document => collection.delete(document.uri))
	context.subscriptions.push(closeTextDocumentListener)

	let changeTextDocumentListener = vscode.workspace.onDidChangeTextDocument(event => updateDiagnostics(event.document, collection))
	context.subscriptions.push(changeTextDocumentListener)

	let generateReportCommand = vscode.commands.registerCommand('Generate Report', function () {
		if (!vscode.window.activeTextEditor) {
			vscode.window.showInformationMessage("No text editor has focus. Please, open a file and issue the command again.")
			return
		}

		let document = vscode.window.activeTextEditor.document
		if (!isLanguageSupported(document.languageId)) {
			vscode.window.showInformationMessage(`The ${document.languageId} language is not supported.`)
		}
		let diagnostics = collection.get(document.uri)
		generateReport(document, diagnostics)
	})
	context.subscriptions.push(generateReportCommand)

	let generateFileChartReportCommand = vscode.commands.registerCommand('Generate Chart Report for File', function (fileUri) {
		vscode.workspace.openTextDocument(fileUri).then(document => {
			if (!isLanguageSupported(document.languageId)) {
				vscode.window.showInformationMessage(`The ${document.languageId} language is not supported.`)
				return
			} else if (!isTestFile(getResourceName(document.fileName), document.languageId)) {
				vscode.window.showInformationMessage(`The file ${document.fileName} is not recognized 
					as a test file. Test file names have to contain
					${document.languageId === 'java' ? '\'Test\' or \'test\'' : '\'spec\' or \'test\''}`)
				return
			}
			let diagnostics = collection.get(document.uri)
			generateChartReport(document.uri, diagnostics)
		})
	})
	context.subscriptions.push(generateFileChartReportCommand)

	let generateFolderChartReportCommand = vscode.commands.registerCommand('Generate Chart Report for Folder', function (folder) {
		generateFolderChartReport(folder)
	})
	context.subscriptions.push(generateFolderChartReportCommand)

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
 * 
 * @param {string} fsPath The path of a resource
 * @returns The resource name of a resource
 * @example './folder1/file.js' // returns 'file.js'
 * @example './folder1' // returns 'folder1'
 */
function getResourceName(fsPath) {
	return fsPath.substring(fsPath.lastIndexOf('\\') + 1)
}

/**
 * @param {vscode.TextDocument} document
 * @param {vscode.DiagnosticCollection} collection
 */
function updateDiagnostics(document, collection) {
	if (document && document.uri.scheme === 'file') { // the git counterpart of the document must be ignored
		let diagnostics = collectDiagnostics(document)
		if (diagnostics.length > 0) {
			console.log(`Diagnostics of ${document.uri} have been collected.`)
		}
		

		collection.set(document.uri, diagnostics);
	} else {
		collection.set(document.uri, []);
	}
}

/**
 * Collects the diagnostics given a text document
 * @param {vscode.TextDocument} document 
 * @returns {vscode.Diagnostic[]} diagnostics
 */
function collectDiagnostics(document) {
	let language = document.languageId;
	let diagnostics = []

	if (!isLanguageSupported(language)) return []

	let fileName = getResourceName(document.fileName)
	if (!isTestFile(fileName, language)) return []

	if (language == 'java') {
		parseJava(document, diagnostics)
	} else if (language == 'javascript') {
		parseJavascript(document, diagnostics);
	}

	if (diagnostics.length > 0) {
		// prioritize diagnostics by narrowing scope
		diagnostics.sort((diagnostic1, diagnostic2) => {
			let scope1 = recommendations.find(recommendation => recommendation.id == diagnostic1.code).scope
			let scope2 = recommendations.find(recommendation => recommendation.id == diagnostic2.code).scope
			return scope1 - scope2
		})
	}

	return diagnostics
}

function isLanguageSupported(actualLanguage) {
	if (['java', 'javascript'].includes(actualLanguage)) return true
	else return false
}

function isTestFile(fileName, language) {
	if (language == 'java' && ['test'].some(pattern => fileName.toLowerCase().includes(pattern))) {
		return true
	} else if (language == 'javascript' && ['test', 'spec'].some(pattern => fileName.toLowerCase().includes(pattern))) {
		return true
	}

	return false
}

/**
 * Generate a 'Report.json' file filled with the provided diagnostics. The report is created in
 * the same folder as the document.
 * @param {vscode.TextDocument} document 
 * @param {vscode.Diagnostic[]} diagnostics 
 */
function generateReport(document, diagnostics) {
	let reportUri = vscode.Uri.joinPath(document.uri, "..", "Report.json")
	let workspaceEdit = new vscode.WorkspaceEdit()

	workspaceEdit.createFile(reportUri, { overwrite: true, ignoreIfExists: false })
	workspaceEdit.insert(reportUri, new vscode.Position(0, 0), JSON.stringify(diagnostics))
	vscode.workspace.applyEdit(workspaceEdit)
}

/**
 * 
 * @param {vscode.Uri} uri Uri of the overall resource
 * @param {vscode.Diagnostic[]} diagnostics 
 */
function generateChartReport(uri, diagnostics) {
	let chartReportPanel = vscode.window.createWebviewPanel('chartReport', 'Chart report', vscode.ViewColumn.Active, {
		enableScripts: true
	})

	let cleanedData = diagnostics.map(diagnostic => {
		if (!diagnostic.relatedInformation) console.log(diagnostic)
		const diagnosticPath = diagnostic.relatedInformation[0].location.uri.fsPath
		return {
			message: diagnostic.message,
			testFileName: getResourceName(diagnosticPath) // location of the diagnostic
		}
	})

	let resourceName = getResourceName(uri.fsPath)

	chartReportPanel.webview.html = chartReporter.getHTMLcontent(resourceName, cleanedData)
}

/**
 * Generate a chart report for a folder. Subdirectories are scanned recursively and included in the report.
 * @param {vscode.Uri} folder 
 */
function generateFolderChartReport(folder) {
	let folderDiagnostics = []
	generateFolderChartReportInner(folder, folderDiagnostics).then(_ => {
		generateChartReport(folder, folderDiagnostics)
	}).catch(reason => {
		vscode.window.showErrorMessage(`Could not generate the chart report for ${getResourceName(folder.path)}.`)
		if (reason) {
			console.error(reason)
		}
	})
}

/**
 * Recursive method to scan the subtree of a root folder.
 * @param {vscode.Uri} folder 
 * @inner Do not call this method directly
 * @see {@link generateFolderChartReport}
 */
function generateFolderChartReportInner(folder, folderDiagnostics) {
	return new Promise((resolve, reject) => {
		vscode.workspace.fs.readDirectory(folder).then(dictionary => {
			Promise.all(
				/* return a promise for each entry in the folder */
				dictionary.map((entry, i) => {
					return new Promise((resolve2, reject2) => {
						let timeout = (i / 10) * 1000 // the timeout prevents the opening of too many files at a high rate (the OS forbids that)

						setTimeout(_ => {
							const resourceName = entry[0]
							const resourceType = entry[1]

							if (resourceType == vscode.FileType.File) {
								if (!isTestFile(resourceName, resourceName.endsWith('java') ? 'java' : 'javascript')) resolve2()

								let fileUri = vscode.Uri.joinPath(folder, resourceName)

								/* Just collect the diagnostics of the file */
								vscode.workspace.openTextDocument(fileUri).then(textDocument => { // triggers the onDidOpenTextDocument listener

									let diagnostics = vscode.languages.getDiagnostics(textDocument.uri)
									diagnostics = filterDiagnostics(diagnostics)

									folderDiagnostics.push(...diagnostics)

									resolve2()
								}, reason => {
									vscode.window.showErrorMessage(`Could not open file ${fileUri.path}.`)
									console.error(reason)
									reject2()
								})

							} else if (resourceType == vscode.FileType.Directory) {
								const newPath = vscode.Uri.joinPath(folder, resourceName)
								console.log(resourceName)
								generateFolderChartReportInner(newPath, folderDiagnostics).then(_ => {
									resolve2()
								}).catch(reason => {
									if (reason) {
										console.error(reason)
									}
									reject2()
								})
							} else {
								resolve2()
							}

						}, timeout)
					})
				})
			).then(_ => {
				resolve() // when all items in the folder have been diagnosed, the folder is considered passed
			}).catch(reason => {
				if (reason) {
					console.error(reason)
				}
				reject()
			})
		}, reason => {
			if (reason) {
				vscode.window.showErrorMessage(`Could not read directory ${getResourceName(folder.path)}.`)
				console.error(reason)
			}
			reject()
		})

	})
}

/**
 * A parser for Java code.
 * @param {vscode.TextDocument} document 
 * @param {vscode.Diagnostic[]} diagnostics An empty array
 * @returns The {@link diagnostics} array filled with the violations
 */
function parseJava(document, diagnostics) {
	let root = javaParser.parse(document.getText())


	let DriverVariableVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodDeclaration(node) {
			let state = {}
			if (isTestCase(node)) {
				state = { isTestCase: true }
			}

			super.methodDeclaration(node, state)
		}

		methodBody(node, state) {
			if (!state || !state.isTestCase) {
				super.methodBody(node)
				return
			}

			state = { ...state, localVariables: [], firstStatementStartingOffset: getLocation(node.block).endOffset + 1, driverVariable: null }
			super.methodBody(node, state)

			/* if there is no setup section or the driver variable is not declared locally */
			if (state.localVariables.length == 0 || (state.driverVariable && !state.localVariables.map(localVariable => localVariable.image).includes(state.driverVariable))) {
				// in this case, the setup snippet is between the left curly bracket and the first character of the first statement
				addDiagnostic(document, diagnostics, getLocation(node.block).startOffset, state.firstStatementStartingOffset, "R.W.12.6")
			}
		}

		blockStatements(node, state) {
			if (!state || !state.isTestCase) {
				super.blockStatements(node)
				return // If the state is undefined, the node is outside a method body
			}

			state.firstStatementStartingOffset = node.blockStatement[0].location.startOffset
			super.blockStatements(node, state)
		}

		variableDeclaratorId(node, state) {
			if (!state || !state.isTestCase) {
				super.variableDeclaratorId(node)
				return // If the state is undefined, the node is outside a method body
			}

			state.localVariables.push(node.Identifier[0])
			super.variableDeclaratorId(node)
		}

		fqnOrRefType(node, state) {
			if (!state || !state.isTestCase) {
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
			if (!state || !state.isTestCase) {
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
			if (!state || !state.isTestCase) {
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
	let GlobalVariablesVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
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
			if (!state) {
				super.variableDeclaratorId(node)
				return // If the state is undefined, the node is outside a method body
			}

			if (state && state.imInBody && !state.isGlobalDeclaration) {
				state.localVariables.push(node.Identifier[0])
			} else if (state && !state.imInBody && state.isGlobalDeclaration) {
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
			let reference = getChild(node.fqnOrRefTypePartCommon)[property][0]

			/* The recommendation in the flesh */
			// if the reference was not declared as local variable
			if (!state.localVariables.map(localVariable => localVariable.image).includes(reference.image) &&
				this.context.globalVariables.map(globalVariable => globalVariable.image).includes(reference.image)) {

				addDiagnostic(document, diagnostics, reference.startOffset, reference.endOffset + 1, "R.W.12.4")
			}

			super.fqnOrRefTypePartFirst(node)
		}

	}

	let LocatorsVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		blockStatement(node) {
			let state = { chain: [] }
			super.blockStatement(node, state)
		}

		/* Method to provide better precision */
		fqnOrRefTypePartCommon(node, state) {
			if (!state || !state.chain) {
				super.fqnOrRefTypePartCommon(node)
				return
			}

			let chain = state.chain
			chain.push(node.Identifier[0].image.toLowerCase())

			if (chain.length >= 2) {
				if (chain.includes('by')) {
					if (chain.includes('css')) {
						state.isCssLocator = true
					} else if (chain.includes('xpath')) {
						state.isXpathLocator = true
					} else if (chain.includes('classname')) {
						state.isClassNameLocator = true
					} else if (chain.includes('linktext') || chain.includes('partiallinktext')) {
						state.isLinkTextLocator = true
					} else if (chain.includes('name')) {
						state.isNameLocator = true
					} else if (chain.includes('id')) {
						state.isIdLocator = true
					} else if (chain.includes('tagname')) {
						state.isTagLocator = true
					} else if (chain.includes('model')) { // Note that at the moment, this is only supported for AngularJS apps.
						state.isModelLocator = true
					} else if (chain.includes('binding')) { // Note that at the moment, this is only supported for AngularJS apps.
						state.isBindingLocator = true
					} else if (chain.includes('repeater')) { // Note that at the moment, this is only supported for AngularJS apps.
						state.isRepeaterLocator = true
					}
				}
			}

			super.fqnOrRefTypePartRest(node, state)
		}

		literal(node, state) {
			if (!node.StringLiteral) return // if the literal is not a string

			let literalString = node.StringLiteral[0].image
			/* Delete surrounding quotes from the literal */
			if (literalString.startsWith("\"") && literalString.endsWith("\"")) {
				literalString = literalString.substring(1, literalString.length - 1)
			}

			const urlPatterns = ['http']
			const imagePatterns = ['gif', 'png', 'jpg', 'jpeg', 'bmp']
			const localDrivePatterns = ['downloads', 'desktop']
			const driverPatterns = ['chrome', 'driver']
			const falsePositives = [...urlPatterns, ...imagePatterns, ...localDrivePatterns, ...driverPatterns]
			if (!state || ((state && !state.chain.includes('open')) && !falsePositives.some(falsePositive => literalString.includes(falsePositive)))) { // condition to mask all rules
				if (literalString.length >= 2 && ((literalString.charAt(0) == '/' && literalString.charAt(1) == '/'))) {
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of relative XPath.")
				} else if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) != '/') { // the open method accepts URLs
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.1", "Use of absolute XPath.")
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of absolute XPath.")
				} else if (state && state.isXpathLocator) {
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3")
				} else if ((state && state.isLinkTextLocator) || literalString.includes('link=')) {
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.19")
				} else if ((state && state.isIdLocator)) {
					if (literalString.includes('_')) {
						addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.7")
					}
				} else if (literalString.startsWith('#')) { // By.css('#el') is equivalent to By.id('el') from the functional point of view, but performance is different
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of id locator mapped as CSS locator.")
				} else if ((state && state.isCssLocator) || literalString.startsWith("css") || literalString.includes('>') || literalString.includes('btn') || ((literalString.includes('.') && !literalString.endsWith('.')) && literalString.includes('-') && !literalString.includes('.js')) || (literalString.includes('[') && literalString.includes(']') && literalString.includes('=') && literalString.includes('class'))) {
					addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.3", "Use of CSS locator.")
					if (literalString.includes('_')) {
						addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.7")
					}
				} else if ((state && state.isTagLocator)) {
					if (!state.chain.some(calledMethod => calledMethod.endsWith('s'))) {
						addDiagnostic(document, diagnostics, node.StringLiteral[0].startOffset, node.StringLiteral[0].endOffset + 1, "R.W.20", "Use of a tag locator to find only one element.")
					}
				}
			}

			/* Recur on inner string */
			if (literalString.split("\"").length > 2) { // if there are at least two apostrofy commas: for instance, "shouldn't" is a string with one apex that should not be recurred on 
				let firstQuoteIndex = literalString.indexOf("\"") + 1
				let lastQuoteIndex = literalString.indexOf("\"", firstQuoteIndex + 1)
				let newImage = literalString.substring(firstQuoteIndex, lastQuoteIndex)

				let innerNode = Object.assign({}, node)
				innerNode.StringLiteral[0].image = newImage
				innerNode.StringLiteral[0].startOffset += firstQuoteIndex + 1
				innerNode.StringLiteral[0].endOffset -= (literalString.length - lastQuoteIndex + 1)
				this.literal(innerNode)
			} else if (literalString.split("\'").length > 2) {
				let firstQuoteIndex = literalString.indexOf("\'") + 1
				let lastQuoteIndex = literalString.indexOf("\'", firstQuoteIndex + 1)
				let newImage = literalString.substring(firstQuoteIndex, lastQuoteIndex)

				let innerNode = Object.assign({}, node)
				innerNode.StringLiteral[0].image = newImage
				innerNode.StringLiteral[0].startOffset += firstQuoteIndex + 1
				innerNode.StringLiteral[0].endOffset -= (literalString.length - lastQuoteIndex + 1)

				this.literal(innerNode)
			}

			super.literal(node)
		}
	}

	let TestCaseNamesVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodDeclaration(node) {
			let state
			if (isTestCase(node)) {
				state = { isTestCase: true }
			}

			super.methodDeclaration(node, state)
		}

		methodDeclarator(node, state) {
			if (!state || !state.isTestCase) {
				super.methodDeclarator(node)
				return
			}

			let testCaseName = node.Identifier[0].image

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
				addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.12.1", "The test name is not specifying the starting scenario.")
			} else if (!isScenarioMissing && isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.12.1", "The test name is not specifying the expected result.")
			} else if (isScenarioMissing && isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.12.1", "The test name is not specifying neither the starting scenario nor the expected result")
			}

			super.methodDeclarator(node)
		}
	}

	let TestCaseSectionsVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
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

	let FixtureMethodsVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodHeader(node, state) {
			state.startOffset = getChild(node.methodDeclarator).Identifier[0].startOffset
			state.endOffset = getChild(node.methodDeclarator).Identifier[0].endOffset + 1
			super.classMemberDeclaration(node, state)
		}

		methodDeclaration(node) {
			let state = {}
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
			} else if (annotationName == 'After') {
				state.isFixtureMethod = true
			}
		}
	}

	let TestCaseLengthVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super();
			this.validateVisitor();
		}

		methodDeclaration(node) {
			let state = {}
			if (isTestCase(node)) {
				state = { isTestCase: true }
			}

			super.methodDeclaration(node, state)
		}

		methodDeclarator(node, state) {
			state.testCaseName = node.Identifier[0]
			super.methodDeclarator(node, state)
		}

		methodBody(node, state) {
			if (!state || !state.isTestCase || isEmptyTestCase(node)) {
				super.methodBody(node)
				return
			}

			let testCaseLength = getChild(getChild(node.block).blockStatements).blockStatement.length

			if (testCaseLength > 15) { // Magic number: need further research
				addDiagnostic(document, diagnostics, state.testCaseName.startOffset, state.testCaseName.endOffset, "R.W.14", "The test case is too long.")
			}

			super.methodBody(node)
		}

	}

	let CommentsVisitor = function () {
		/* Search and formalize single-line comments */
		let matches = document.getText().matchAll('//.*') // match until the end of line
		let singleLineComments = []

		/* Get and prepare all matches */
		for (let match of matches) {
			let text = match[0].toLowerCase()
			let startOffset = match.index
			let endOffset = startOffset + text.length
			let lineNumber = document.positionAt(startOffset).line
			let isOnlyCommentLine = document.offsetAt(new vscode.Position(lineNumber, document.lineAt(lineNumber).firstNonWhitespaceCharacterIndex)) == startOffset
			let leftTextComment = document.getText(new vscode.Range(new vscode.Position(lineNumber, 0), document.positionAt(startOffset)))
				.slice(0, startOffset)
			
			let numberOfApexes = leftTextComment.split("\"").length - 1 // for instance, in "ehi\"/* ..." is 2
			let numberOfEscapedApexes = leftTextComment.split("\\\"").length - 1
			let isInsideString = (numberOfApexes - numberOfEscapedApexes) % 2 == 1
			
			if (!isInsideString) {
				singleLineComments.push({
					text,
					startOffset,
					endOffset,
					lineNumber,
					isOnlyCommentLine
				})
			}
			
		}

		/* Merge successive comments as a single multi-line comment */
		let multilineComments = []
		singleLineComments.forEach(comment => {
			let singleLineCommentAsMultiline = { // promote the single-line comment to a multi-line one
				text: comment.text,
				startOffset: comment.startOffset,
				endOffset: comment.endOffset,
				startLineNumber: comment.lineNumber,
				endLineNumber: comment.lineNumber
			}

			if (multilineComments.length == 0 || !comment.isOnlyCommentLine) {
				multilineComments.push(singleLineCommentAsMultiline)
				return
			}

			let lastMultilineComment = multilineComments[multilineComments.length - 1]
			if (lastMultilineComment.endLineNumber == comment.lineNumber - 1) {
				lastMultilineComment.text += comment.text
				lastMultilineComment.endOffset = comment.endOffset
				lastMultilineComment.endLineNumber++
			} else {
				multilineComments.push(singleLineCommentAsMultiline)
			}
		})

		/* Search block comments */
		let blockComments = []
		matches = document.getText().matchAll(/\/\*[\s\S]*?\*\//g)
		
		for (let match of matches) {
			let text = match[0].toLowerCase()
			let startOffset = match.index
			let endOffset = startOffset + text.length
			let lineNumber = document.positionAt(startOffset).line
			let isInsideString = document.getText(new vscode.Range(new vscode.Position(lineNumber, 0), document.positionAt(startOffset)))
				.slice(0, startOffset).split("\"").length % 2 == 0 
			
			if (!isInsideString) {
				blockComments.push({
					text,
					startOffset,
					endOffset
				})
			}
		}

		let comments = [...multilineComments, ...blockComments]

		const patterns = ['import', 'todo', 'license', 'copyright', 'function(', '=>', 'const ', 'let ', 'async', '= new', '()', 'private final', 'findelement', '@author', '@version', '@param']
		comments
			.filter(comment => !patterns.some(pattern => comment.text.includes(pattern)))
			.forEach(comment => {
				addDiagnostic(document, diagnostics, comment.startOffset, comment.endOffset, "R.W.21", "Use of a comment to describe the behaviour.")
			})
	}

	let ExternalLibrariesVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		importDeclaration(node) {
			addDiagnostic(document, diagnostics, node.Import[0].startOffset, node.Semicolon[0].endOffset, "R.W.16")

			super.importDeclaration(node)
		}
	}

	let FixedTimeWaitVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		blockStatement(node) {
			let state = { chain: [] }
			super.blockStatement(node, state)

			const pattern = ['Thread', 'sleep']
			if (pattern.every(word => state.chain.map(identifier => identifier.image).includes(word))) {
				let threadWord = state.chain.find(method => method.image == 'Thread')
				let sleepWord = state.chain.find(method => method.image == 'sleep')
				addDiagnostic(document, diagnostics, threadWord.startOffset, sleepWord.endOffset + 1, "R.D.0")
			}
		}

		fqnOrRefTypePartCommon(node, state) {
			if (!state || !state.chain) {
				super.fqnOrRefTypePartCommon(node)
				return
			}

			state.chain.push(node.Identifier[0])

			super.fqnOrRefTypePartCommon(node)
		}
	}

	let VariablesNameVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		methodDeclaration(node) {
			//if (isTestCase(node)) { // the rule is valid also for non-test methods actually
			let state = { imInMethod: true }
			super.methodDeclaration(node, state)
			//}

		}

		variableDeclaratorId(node, state) {
			if (!state || !state.imInMethod) {
				super.variableDeclaratorId(node)
				return // If the state is undefined, the node is outside a method body
			}

			let identifier = node.Identifier[0].image

			if (identifier.length < 2 && identifier != 'i') { // need stronger heuristics
				addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.6", "The variable name is too short.")
			}

			super.variableDeclaratorId(node)
		}
	}

	let TestCaseTagsVisitor = class extends javaParser.BaseJavaCstVisitorWithDefaults {
		constructor() {
			super()
			this.validateVisitor()
		}

		methodDeclaration(node) {
			let state = {}
			if (isTestCase(node) && !hasTags(node)) {
				state.isRuleMatched = true
			}

			super.methodDeclaration(node, state)
		}

		methodDeclarator(node, state) {
			if (!state || !state.isRuleMatched) {
				super.methodDeclarator(node)
				return
			}

			addDiagnostic(document, diagnostics, node.Identifier[0].startOffset, node.Identifier[0].endOffset + 1, "R.W.12.7", "The test case has no recognized tags.")

			super.methodDeclarator(node)
		}
	}


	let visitors = [new DriverVariableVisitor(), new GlobalVariablesVisitor(), new LocatorsVisitor(), new TestCaseNamesVisitor()/* , new TestCaseSectionsVisitor() */, new FixtureMethodsVisitor(),
	new TestCaseLengthVisitor(), CommentsVisitor, new ExternalLibrariesVisitor(), new FixedTimeWaitVisitor(), new VariablesNameVisitor(), new TestCaseTagsVisitor()]

	let promises = visitors.map(visitor => new Promise((resolve, reject) => {
		try {
			if (typeof visitor === 'object') {
				visitor.visit(root)
			} else if (typeof visitor === 'function') {
				visitor()
			}

			resolve(undefined)
		} catch (e) {
			reject(e)
		}
	}))


	Promise.allSettled(promises).then(results => {
		if (results.some(result => result.status === 'rejected')) {
			vscode.window.showWarningMessage(`File ${getResourceName(document.fileName)} has been scanned partially, due to some internal bug.`)
			console.error(results.filter(result => result.status === 'rejected').map(result => result.reason))
		}
	}).catch(reason => {
		/* Probable parsing error */
		vscode.window.showErrorMessage(`Could not parse file ${getResourceName(document.fileName)}.`)
		console.error(reason)
	})
}

/**
 * A parser for Javascript code.
 * @param {vscode.TextDocument} document 
 * @param {vscode.Diagnostic[]} diagnostics An empty array
 * @returns The {@link diagnostics} array filled with the violations
 */
function parseJavascript(document, diagnostics) {

	let multiLineNonBlockDiagnostics = []

	let root = acorn.Parser.parse(document.getText(), {
		allowImportExportEverywhere: true,

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
				/* Define a convenient variable */
				let lastCommentOffset
				if (multiLineNonBlockDiagnostics.length > 0) {
					lastCommentOffset = multiLineNonBlockDiagnostics[multiLineNonBlockDiagnostics.length - 1].lastCommentOffset
				}

				// if the last encountered comment was at the previous line && the two single-line comments are not separated by code, then this comment is the continuation of the previous
				if (multiLineNonBlockDiagnostics.length > 0 && lastCommentOffset && document.positionAt(lastCommentOffset).line == document.positionAt(start).line - 1 && document.getText(new vscode.Range(document.positionAt(lastCommentOffset), document.positionAt(start))).trim().length == 0) {
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

	let DriverVariableVisitor = walker.make({
		CallExpression(node, state, c) {
			if (state && state.driverVariable) return

			if (node.callee.name == 'it' || node.callee.name == 'test') {
				let state = { imInTestCase: true, driverVariable: null, localVariables: [] }

				walker.base.CallExpression(node, state, c)
				if (state.localVariables.length == 0 || (state.driverVariable && !state.localVariables.map(localVariable => localVariable.name).includes(state.driverVariable))) {
					// in this case, the setup snippet is between the left curly bracket and the first character of the first statement
					addDiagnostic(document, diagnostics, node.arguments[1].body.start, node.arguments[1].body.body[0].start, "R.W.12.6")
				}

				return
			}

			if (!state || !state.imInTestCase) {// If the state is undefined, the node is outside a method body

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


			walker.base.CallExpression(node, state, c)
		},

		VariableDeclaration(node, state, c) {
			if (state && state.driverVariable) return

			if (!state || !state.imInTestCase) {// If the state is undefined, the node is outside a method body

				walker.base.VariableDeclaration(node, null, c)
				return
			}

			node.declarations.forEach(declaration => {
				state.localVariables.push(declaration.id)
			})


			walker.base.VariableDeclaration(node, state, c)
		},

		MemberExpression(node, state, c) {
			if (state && state.driverVariable) return

			if (!state || !state.imInTestCase) {// If the state is undefined, the node is outside a method body

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


			walker.base.MemberExpression(node, state, c)
		}

	})

	let GlobalVariablesVisitor = walker.make({
		Program(node, junkState, c) {
			let state = { globalVariables: [] }

			walker.base.Program(node, state, c)
		},

		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {

				walker.base.CallExpression(node, state, c)
				return
			}

			state.imInTestCase = true
			state.localVariables = []

			walker.base.CallExpression(node, state, c)

			state.imInTestCase = false
		},

		VariableDeclarator(node, state, c) {
			if (!state.imInTestCase) {
				if (!node.init || (node.init.type != 'FunctionExpression' && node.init.type != 'ArrowFunctionExpression')) {
					/* Now get the identifier */
					if (node.id.type == 'Identifier') { // let a = ...
						state.globalVariables.push(node.id.name)
					} else if (node.id.type == 'ObjectPattern') { // const {a, b} = ...
						node.id.properties.forEach(property => {
							state.globalVariables.push(property.key.name)
						})
					}
				}
			} else {
				state.localVariables.push(node.id.name)
			}


			walker.base.VariableDeclarator(node, state, c)
		},

		Identifier(node, state, c) {
			if (!state.imInTestCase) {

				walker.base.Identifier(node, state, c)
				return
			}

			if (state.globalVariables.includes(node.name) && !state.localVariables.includes(node.name)) {
				addDiagnostic(document, diagnostics, node.start, node.end, "R.W.12.4")
			}


			walker.base.Identifier(node, state, c)
		}
	})

	let LocatorsVisitor = walker.make({
		CallExpression(node, junkState, c) {
			let chain = []
			getChain(node, chain)
			chain = chain
				.filter(ring => typeof ring === 'string') // array subscripting (for instance array[0]) is not relevant here
				.map(ring => ring.toLowerCase())

			let state = { chain }
			if (chain.length >= 2) {
				if (chain.includes('by')) {
					if (chain.includes('css')) {
						state.isCssLocator = true
					} else if (chain.includes('xpath')) {
						state.isXpathLocator = true
					} else if (chain.includes('classname')) {
						state.isClassNameLocator = true
					} else if (chain.includes('linktext')) {
						state.isLinkTextLocator = true
					} else if (chain.includes('name')) {
						state.isNameLocator = true
					} else if (chain.includes('id')) {
						state.isIdLocator = true
					} else if (chain.includes('tagname')) {
						state.isTagLocator = true
					} else if (chain.includes('model')) { // Note that at the moment, this is only supported for AngularJS apps.
						state.isModelLocator = true
					} else if (chain.includes('binding')) { // Note that at the moment, this is only supported for AngularJS apps.
						state.isBindingLocator = true
					} else if (chain.includes('repeater')) { // Note that at the moment, this is only supported for AngularJS apps.
						state.isRepeaterLocator = true
					}
				}
			}

			walker.base.CallExpression(node, state, c)
		},

		Literal(node, state, c) {
			if (!(typeof node.value === 'string' || node.value instanceof String) && !node.regex) {

				walker.base.Literal(node, null, c)
				return
			}

			let literalString
			if (node.regex) {
				literalString = node.regex.pattern
			} else {
				literalString = node.value
			}

			this.innerDiagnostic(literalString, node, state)

			walker.base.Literal(node, null, c)
		},

		TemplateElement(node, state, c) {
			let literalString = node.value.cooked

			this.innerDiagnostic(literalString, node, state)

			walker.base.TemplateElement(node, null, c)
		},

		innerDiagnostic(literalString, node, state) {
			const urlPatterns = ['http']
			const imagePatterns = ['gif', 'png', 'jpg', 'jpeg', 'bmp']
			const localDrivePatterns = ['downloads', 'desktop']
			const driverPatterns = ['chrome', 'driver']
			const falsePositives = [...urlPatterns, ...imagePatterns, ...localDrivePatterns, ...driverPatterns]
			if (!state || ((state && state.chain && !state.chain.includes('open')) && !falsePositives.some(falsePositive => literalString.includes(falsePositive)))) { // condition to mask all rules
				if (literalString.length >= 2 && ((literalString.charAt(0) == '/' && literalString.charAt(1) == '/'))) {
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.3", "Use of relative XPath.")
				} else if (literalString.length >= 2 && literalString.charAt(0) == '/' && literalString.charAt(1) != '/') { // the open method accepts URLs
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.1", "Use of absolute XPath.")
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.3", "Use of absolute XPath.")
				} else if (state && state.isXpathLocator) {
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.3")
				} else if ((state && state.isLinkTextLocator) || literalString.includes('link=')) {
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.19")
				} else if ((state && state.isIdLocator)) {
					if (literalString.includes('_')) {
						addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.7")
					}
				} else if (literalString.startsWith('#')) { // By.css('#el') is equivalent to By.id('el') from the functional point of view, but performance is different
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.3", "Use of id locator mapped as CSS locator.")
				} else if ((state && state.isCssLocator) || literalString.startsWith("css") || literalString.includes('>') || literalString.includes('btn') || ((literalString.includes('.') && !literalString.endsWith('.')) && literalString.includes('-') && !literalString.includes('.js')) || (literalString.includes('[') && literalString.includes(']') && literalString.includes('=') && literalString.includes('class'))) {
					addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.3", "Use of CSS locator.")
					if (literalString.includes('_')) {
						addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.7")
					}
				} else if ((state && state.isTagLocator)) {
					if (state.chain && !state.chain.some(calledMethod => calledMethod.endsWith('s'))) {
						addDiagnostic(document, diagnostics, node.start, node.end + 1, "R.W.20", "Use of a tag locator to find only one element.")
					}
				}
			}

		}
	})

	let TestCaseNamesVisitor = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {

				walker.base.CallExpression(node, null, c)
				return
			}

			let concat = []
			getLiteralsFromConcatenation(node.arguments[0], concat)
			let testCaseName = concat.join('')

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
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.1", "The test name is not specifying the starting scenario.")
			} else if (!isScenarioMissing && isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.1", "The test name is not specifying the expected result.")
			} else if (isScenarioMissing && isExpectedResultMissing) {
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.1", "The test name is not specifying neither the starting scenario nor the expected result")
			}


			walker.base.CallExpression(node, null, c)
		}
	})

	/* This rule has complex heuristics:
	*	- Selenium can be used to perform visual unit testing, but unit tests are not structured as use cases (see navbar.test.js)
	*/
	let TestCaseSectionsVisitor = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {

				walker.base.CallExpression(node, state, c)
				return
			}

			state = { imInFixtureSection: false, imInActSection: false, imInAssertSection: false, errorFound: false, lastStatement: { startOffset: node.arguments[1].body.start, endOffset: node.arguments[1].body.end }, imInBody: true }

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

				walker.base.ExpressionStatement(node, null, c)
				return
			}

			state.currentStatement = { startOffset: node.start, endOffset: node.end }


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

				walker.base.VariableDeclaration(node, null, c)
				return
			}

			if (node.declarations.length == 1) {
				state.lastStatement = state.currentStatement
				state.currentStatement = { startOffset: node.start, endOffset: node.end }
				state.isJustOneDeclaration = true
			}


			walker.base.VariableDeclaration(node, state, c)
			state.isJustOneDeclaration = false
		},

		VariableDeclarator(node, state, c) {
			if (!state || !state.imInBody) { // If the state is undefined, the node is outside a method body

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


			walker.base.VariableDeclarator(node, state, c)
		}

	})

	let FixtureMethodsVisitor = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name == 'afterAll' || node.callee.name == 'beforeAll') {
				addDiagnostic(document, diagnostics, node.callee.start, node.callee.end, "R.W.12.5", "Usage of setup/tear down method.")
				addDiagnostic(document, diagnostics, node.callee.start, node.callee.end, "R.W.13", "Usage of setup/tear down method.")
				addDiagnostic(document, diagnostics, node.callee.start, node.callee.end, "R.W.17", "Usage of setup/tear down method.")
			}


			walker.base.CallExpression(node, state, c)
		}
	})

	let TestCaseLengthVisitor = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {

				walker.base.CallExpression(node, state, c)
				return
			}

			state = { numberOfStatements: 0 }

			walker.base.CallExpression(node, state, c)

			if (state.numberOfStatements > 20) {
				addDiagnostic(document, diagnostics, node.callee.start, node.callee.end, "R.W.14", "The test case is too long.")
			}

			state = null
		},

		ExpressionStatement(node, state, c) {
			if (!state) {

				walker.base.ExpressionStatement(node, state, c)
				return
			}

			state.numberOfStatements++


			walker.base.ExpressionStatement(node, state, c)
		},

		VariableDeclaration(node, state, c) {
			if (!state) {

				walker.base.VariableDeclaration(node, state, c)
				return
			}

			state.numberOfStatements++


			walker.base.VariableDeclaration(node, state, c)
		}
	})

	let ExternalLibrariesVisitor = walker.make({
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


			walker.base.CallExpression(node, state, c)
		},

		ImportDeclaration(node, state, c) {
			addDiagnostic(document, diagnostics, node.start, node.end, "R.W.16", "Use of a third-party library.")

			walker.base.ImportDeclaration(node, state, c)
		}
	})

	let FixedTimeWaitVisitor = walker.make({
		CallExpression(node, state, c) {
			const patterns = ['setTimeout', 'sleep']

			if (node.callee.name) {
				let diagnosedPattern = patterns.find(pattern => node.callee.name.includes(pattern))
				if (diagnosedPattern) {
					addDiagnostic(document, diagnostics, node.callee.start, node.callee.end, "R.D.0", `Use of ${diagnosedPattern}.`)
				}
			}

			walker.base.CallExpression(node, state, c)
		}
	})

	let VariablesNameVisitor = walker.make({

		VariableDeclarator(node, state, c) {

			let variables = []
			if (node.id.type == 'Identifier') { // let a = ...
				variables.push({
					identifier: node.id.name,
					start: node.id.start,
					end: node.id.end
				})
			} else if (node.id.type == 'ObjectPattern') { // const {a, b} = ...
				node.id.properties.forEach(property => {
					variables.push({
						identifier: property.key.name,
						start: property.key.start,
						end: property.key.end
					})
				})
			} else {
				console.error("Unrecognized variable declarator.")
				super.VariableDeclarator(node, state, c)
				return
			}

			const commonShortIdentifiers = ['i', 'j', '$', '$$']
			variables.forEach(variable => {
				if (variable.identifier.length <= 2 && !commonShortIdentifiers.some(commonShortIdentifier => variable.identifier == commonShortIdentifier)) { // need stronger heuristics
					addDiagnostic(document, diagnostics, variable.start, variable.end + 1, "R.W.6", "The variable name is too short.")
				}
			})

			walker.base.VariableDeclarator(node, state, c)
		}

	})

	let TestCaseTagsVisitor = walker.make({
		CallExpression(node, state, c) {
			if (node.callee.name != 'it' && node.callee.name != 'test') {

				walker.base.CallExpression(node, null, c)
				return
			}

			let concat = []
			getLiteralsFromConcatenation(node.arguments[0], concat)
			let testCaseName = concat.join('')

			if (!testCaseName.includes('#')) {
				addDiagnostic(document, diagnostics, node.arguments[0].start, node.arguments[0].end, "R.W.12.7", "The test case has no recognized tags.")
			}

			walker.base.CallExpression(node, null, c)
		}
	})

	let visitors = [DriverVariableVisitor, GlobalVariablesVisitor, LocatorsVisitor, TestCaseNamesVisitor/* , TestCaseSectionsVisitor */, FixtureMethodsVisitor,
		TestCaseLengthVisitor, ExternalLibrariesVisitor, FixedTimeWaitVisitor, VariablesNameVisitor, TestCaseTagsVisitor]
	let promises = visitors.map(visitor => new Promise((resolve, reject) => {
		try {
			walker.recursive(root, null, visitor, walker.base)
			resolve(undefined)
		} catch (e) {
			reject(e)
		}
	}))

	Promise.allSettled(promises).then(results => {
		if (results.some(result => result.status === 'rejected')) {
			vscode.window.showWarningMessage(`File ${getResourceName(document.fileName)} has been scanned partially, due to some internal bug.`)
			console.error(results.filter(result => result.status === 'rejected').map(result => result.reason))
		}
	}).catch(reason => {
		/* Probable parsing error */
		vscode.window.showErrorMessage(`Could not parse file ${getResourceName(document.fileName)}.`)
		console.error(reason)
	})

}


function getChild(node) {
	return node[0].children
}

function getLocation(node) {
	return node[0].location
}

function getMethodAnnotations(methodDeclaration) {
	let annotations = methodDeclaration.methodModifier
		.map(modifier => modifier.children)
		.filter(modifier => modifier.annotation)
		.map(annotation => getChild(getChild(annotation.annotation).typeName).Identifier[0].image)

	return annotations
}

function isTestCase(methodDeclaration) {
	let annotations = getMethodAnnotations(methodDeclaration)

	if (annotations.includes('Test')) {
		return true
	} else {
		return false
	}
}

function hasTags(methodDeclaration) {
	let annotations = getMethodAnnotations(methodDeclaration)

	if (annotations.includes('Tag') /* In JUnit 5 */ || annotations.includes('Category') /* In JUnit 4 */) {
		return true
	} else {
		return false
	}
}

function isEmptyTestCase(methodBody) {
	if (getChild(methodBody.block).blockStatements) {
		return false
	} else {
		return true
	}

}

/**
 * Transforms a tree in an array
 * @param {*} node can be either a CallExpression, a MemberExpression or an Identifier 
 * @param {string[]} chain an empty array that will contain the output
 */
function getChain(node, chain) {
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

/**
 * Returns the literal strings in a concatenation
 * @param {*} node 
 * @param {*} concat An empty array
 * @returns A string that is the concatenation of *just* the literals in the concatenations
 * @example "Hello" + punctuationVariable + " World!" // is evaluated as "Hello World!"
 */
function getLiteralsFromConcatenation(node, concat) {
	if (node.type == 'BinaryExpression') {
		getLiteralsFromConcatenation(node.left, concat)
		getLiteralsFromConcatenation(node.right, concat)
	} else if (node.type == 'Literal') {
		if (node.regex) {
			concat.push(node.regex.pattern)
		} else {
			concat.push(node.value)
		}
	}
}

/**
 * Adds a recommendation to the list of {@link diagnostics}
 * @param {vscode.TextDocument} document 
 * @param {vscode.Diagnostic[]} diagnostics 
 * @param {number} startOffset 
 * @param {number} endOffset 
 * @param {string} recommendationId 
 * @param {string} specificMessage 
 */
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

/**
 * Custom constructor for a vscode.Diagnostic
 * @param {vscode.TextDocument} document 
 * @param {number} start 
 * @param {number} end 
 * @param {string} code 
 * @param {string} message 
 * @param {string} specificMessage 
 * @inner Do not call this method directly
 * @returns A diagnostic
 */
function buildDiagnostic(document, start, end, code, message, specificMessage) {
	let diagnostic = new vscode.Diagnostic(
		new vscode.Range(document.positionAt(start), document.positionAt(end)),
		message,
		vscode.DiagnosticSeverity.Warning
	)

	diagnostic.code = code
	diagnostic.source = 'Fragility linter'
	if (!specificMessage) {
		specificMessage = ""
	}

	diagnostic.relatedInformation = [
		new vscode.DiagnosticRelatedInformation(
			new vscode.Location(
				document.uri,
				new vscode.Range(document.positionAt(start), document.positionAt(end))
			),
			specificMessage
		)
	]

	return diagnostic
}

/**
 * Filters the diagnostics whose source is not this extension. This is useful when the diagnostics are 
 * picked from the vscode UI list that may contain issues from other extensions.
 * @param {vscode.Diagnostic[]} diagnostics 
 */
function filterDiagnostics(diagnostics) {
	return diagnostics.filter(diagnostic => diagnostic.source === 'Fragility linter')
}


module.exports = {
	activate,
	deactivate
}
