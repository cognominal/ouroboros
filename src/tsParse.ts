
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { getTsFiles } from './FindFiles';
let contributors = [ "registerCommand", "registerTreeDataProvider", "registerTextEditorCommand", "registerWebviewPanelSerializer", 
"registerWebviewViewProvider", "registerDecorationProvider", "registerFileSystemProvider", "registerTerminalProfileProvider", 
"registerTerminalLinkProvider", "registerTaskProvider", "registerDebugConfigurationProvider", "registerDebugAdapterDescriptorFactory", 
"registerDebugAdapterTrackerFactory", "registerDebugAdapterDescriptorFactory", "registerDebugAdapterTrackerFactory", "registerCommentController", "registerNotebookSerializer" ]

// editor.action.smartSelect.expand

// A registerCommand will directly push the disposable to the context.subscriptions array or use an 
// intermediary activate variable.
// This activate variable may be declared onece.

export class TsParseCodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(): vscode.CodeAction[] {
        const action = new vscode.CodeAction('Run tsParse on all TypeScript files', vscode.CodeActionKind.Source);
        action.command = { command: 'extension.tsParse', title: 'Run tsParse on all TypeScript files' };
        return [action];
    }
}



export async function tsParse() {
    const tsFiles = await getTsFiles();
    let gotit = false;

    for (const file of tsFiles) {
        if (gotit) {
            break;
        }
        const document = await vscode.workspace.openTextDocument(file);
        const ast = ts.createSourceFile(file.fsPath, document.getText(), ts.ScriptTarget.Latest, true);
        // Do something with the AST here
        ts.forEachChild(ast, function cb(node) {
            const kindString = ts.SyntaxKind[node.kind];
            // console.log(node.kind)
            gotit = getRangeStatementWithSymbol(node, ast, document, 'registerCommand');
            ts.forEachChild(node, cb);
        });
    }
}


// Open the file in an editor and set the selection to the range
function setSelection(range: vscode.Range, document: vscode.TextDocument) {
    vscode.window.showTextDocument(document.uri).then(editor => {
        editor.selection = new vscode.Selection(range.start, range.end);
    });
}

function getRangeStatementWithSymbol(node: ts.Node, ast: ts.SourceFile, document: vscode.TextDocument, symbol: string){

}

type NodeTest = (node: ts.Node) => boolean;

function getRangeWithSymbol(node: ts.Node, ast: ts.SourceFile, document: vscode.TextDocument, symbol: string, test: NodeTest ): vscode.Range | null {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === symbol) {
        let parentNode = node.parent;
        while (parentNode && !ts.isStatement(parentNode)) {
            parentNode = parentNode.parent;
        }
        if (parentNode) {
            const start = parentNode.getStart(ast);
            const end = parentNode.getEnd();
            const range = new vscode.Range(document.positionAt(start), document.positionAt(end));
            return range;
        }
    }
    return null;
}

// vscode.Location vscode.Range vscode.Position vscode.LocationLink vscode.SymbolInformation vscode.DocumentSymbo
vscode.L

export async function searchSymbolsInTsFiles() {
    const tsFiles = await getTsFiles();
    const symbolSearchResults = [];

    for (const file of tsFiles) {
        const document = await vscode.workspace.openTextDocument(file);
        const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeDocumentSymbolProvider', document.uri);

        if (symbols) {
            for (const symbol of symbols) {
                if (contributors.includes(symbol.name)) {
                    symbolSearchResults.push({ file: file, symbol: symbol });
                }
            }
        }
    }

    return symbolSearchResults;
}
        
   