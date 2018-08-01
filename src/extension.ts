'use-strict';
import * as vscode from 'vscode';

const completionTriggerChars = ['<'];

export function activate(context: vscode.ExtensionContext) {
    console.log("Activated");
    
    vscode.languages.registerCompletionItemProvider('html', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            return (
                new vscode.CompletionList(getCompletionItems())
            );
        }
    }, ...completionTriggerChars);

    // a-scene snippet
    // createSnippetItem();

}

// this metod is called when your extension is deactivated
export function deactivate() {
}

export function getCompletionItems(): vscode.CompletionItem[] {
    let completionList: vscode.CompletionItem[] = [];
    let primitives = ['a-box', 'a-camera', 'a-circle', 'a-collada-model', 'a-cone',
     'a-cursor', 'a-curvedimage', 'a-cylinder', 'a-dodecahedron', 'a-gltf-model', 'a-icosahedron',
     'a-image', 'a-light', 'a-link', 'a-obj-model', 'a-octahedron', 'a-plane', 'a-ring', 'a-sky',
     'a-sound', 'a-sphere', 'a-tetrahedron', 'a-text', 'a-torus-knot', 'a-torus', 'a-triangle',
     'a-video', 'a-videosphere'];
    primitives.forEach(unit => {
        let completionItem = new vscode.CompletionItem(unit);
        completionItem.kind = vscode.CompletionItemKind.Property;
        completionList.push(completionItem);
    });
    return completionList;
}

export function createSnippetItem(): vscode.CompletionItem {
    let item = new vscode.CompletionItem('a-scene', vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString()
    return item;
}