import * as vscode from 'vscode';

export namespace WhitespaceHighlighter {
    export class Extension {
        public static readonly extensionName = "Trailing Whitespace Highlighter"
        private static readonly trailingWhitespaceRegex = /\s+(\n|$)/g  ///\s+[\r\n]/g;
        private static readonly decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 66, 178, 0.3)'
        });

        private activeEditor: vscode.TextEditor;
        private context: vscode.ExtensionContext;
        private timeout: NodeJS.Timer;

        constructor(activeEditor: vscode.TextEditor, context: vscode.ExtensionContext) {
            this.activeEditor = activeEditor;
            this.context = context;

            this.subscribe();
            if (this.activeEditor) {
                this.triggerUpdateDecorations();
            }
        }

        public updateDecorations() {
            if (!this.activeEditor) {
                return;
            }

            let text = this.activeEditor.document.getText();

            let whiteSpaceDecoration: vscode.DecorationOptions[] = [];
            let match;

            while (match = Extension.trailingWhitespaceRegex.exec(text)) {
                let startPos = this.activeEditor.document.positionAt(match.index);
                let endPos = this.activeEditor.document.positionAt(match.index + match[0].length);

                let decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: "Trailing whitespace" };
                whiteSpaceDecoration.push(decoration);
            }

            this.activeEditor.setDecorations(Extension.decorationType, whiteSpaceDecoration);
        }

        private subscribe() {
            vscode.window.onDidChangeActiveTextEditor(editor => {
                this.activeEditor = editor;
                if (editor) {
                    this.triggerUpdateDecorations();
                }
            }, null, this.context.subscriptions);

            vscode.workspace.onDidChangeTextDocument(event => {
                if (this.activeEditor && event.document === this.activeEditor.document) {
                    this.triggerUpdateDecorations();
                }
            }, null, this.context.subscriptions);
        }

        private triggerUpdateDecorations() {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => this.updateDecorations(), 500);
        }
    }
}