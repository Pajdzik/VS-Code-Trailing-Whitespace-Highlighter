'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    var extensionName = "Trailing Whitespace Highlighter"

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(`Extension "${extensionName}" is now active!`);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);

    var activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    var timeout = null;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 500);
    }

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }

        var regEx = /\s+[\r\n]/g;

        var text = activeEditor.document.getText();

        var whiteSpaceDecoration: vscode.DecorationOptions[] = [];
        var match;

        while (match = regEx.exec(text)) {

            var startPos = activeEditor.document.positionAt(match.index);

            var endPos = activeEditor.document.positionAt(match.index + match[0].length);

            var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
            whiteSpaceDecoration.push(decoration);
        }

        // create a decorator type that we use to decorate large numbers
        var largeNumberDecorationType = vscode.window.createTextEditorDecorationType({
            cursor: 'crosshair',
            backgroundColor: 'rgba(255,0,0,0.3)'
        });

        //activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
        activeEditor.setDecorations(largeNumberDecorationType, whiteSpaceDecoration);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}