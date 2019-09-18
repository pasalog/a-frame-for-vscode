'use-strict';
import * as vscode from 'vscode';

var openurl = require('openurl');
import primitives from './data/components.json';

const completionTriggerChars = ["a", "a-"];

export function activate(context: vscode.ExtensionContext) {

    vscode.window.showInformationMessage("I see you like this extension. This is the new (1.2.*) version 😇 I will continue developing this extension. 💻 Please star the repo on GitHub or maybe you'd like to buy me a beer! 🥰", ...['Star ⭐', 'Cheers! 🍺'])
    .then(selection => {
        if (selection === 'Star ⭐') {
            openurl.open("https://github.com/pasalog/a-frame-for-vscode");
        }if (selection === 'Cheers! 🍺') {
            openurl.open("https://www.patreon.com/pasalog");
        }
    });

    let primitiveProvider = vscode.languages.registerCompletionItemProvider('html', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            return (
                new vscode.CompletionList(getCompletionItems(document, position))
            );
        }
    }, ...completionTriggerChars);

    const attrProvider = vscode.languages.registerCompletionItemProvider('html', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            return (
                new vscode.CompletionList(getAttributes(document, position))
            );
        }
    }, ' ');

    context.subscriptions.push(primitiveProvider, attrProvider);
}

export function deactivate() {
    vscode.window.showInformationMessage("It seems that you have disabled the plugin." +
        "Feel free to open an issue or contribute.", ...['Open an issue', 'Contribute'])
        .then(selection => {
            if (selection === 'Contribute') {
                openurl.open("https://github.com/pasalog/a-frame-for-vscode");
            }
            if (selection === 'Open an issue') {
                openurl.open("https://github.com/pasalog/a-frame-for-vscode/issues");
            }
        });
}

export function getCompletionItems(doc: vscode.TextDocument, pos: vscode.Position): vscode.CompletionItem[] {
    let completionList: vscode.CompletionItem[] = [];
    // @ts-ignore
    primitives.forEach(i => {
        let completionItem = new vscode.CompletionItem(i.label);
        completionItem.kind = vscode.CompletionItemKind.Property;
        completionItem.detail = i.name;
        completionItem.insertText = new vscode.SnippetString('<' + completionItem.label + '>${1}</' + completionItem.label + '>');
        // test if an open tag was already written
        let linePrefix = doc.lineAt(pos).text.substr(0, pos.character);
        let openTag = linePrefix.lastIndexOf('<');
        let closeTag = linePrefix.lastIndexOf('>');
        // delete the open tag if duplicate
        if (openTag > closeTag) {
            let range = new vscode.Range(doc.lineAt(pos).lineNumber, openTag, doc.lineAt(pos).lineNumber, openTag + 1);
            completionItem.additionalTextEdits = [vscode.TextEdit.delete(range)]
        }
        completionItem.documentation = new vscode.MarkdownString(i.documentation);
        completionList.push(completionItem);
    });
    return completionList;
}

export function getAttributes(doc: vscode.TextDocument, pos: vscode.Position): vscode.CompletionItem[] {
    
    
    let completionItems: vscode.CompletionItem[] = [];
    let prePos = doc.lineAt(pos).text.substr(0, pos.character);
    prePos = prePos.substr(prePos.lastIndexOf('<'), pos.character);

    primitives.forEach((primitive: any) => {
        let preIndex = prePos.indexOf('<' + primitive.label + '');
        let closingTagIndex = prePos.indexOf('>');
        if (preIndex === -1 || closingTagIndex > preIndex)
            return undefined;
        primitive.attributes.forEach((attr: any) => {
            const completionItem = new vscode.CompletionItem(attr.name, vscode.CompletionItemKind.Method)
            completionItem.insertText = new vscode.SnippetString(attr.name + '="' + '${1:' + attr.default + '}"');
            completionItem.documentation = new vscode.MarkdownString(attr.description);
            completionItems.push(completionItem);
        });
    });

    return completionItems;
}