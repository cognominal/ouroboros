import * as vscode from 'vscode';

import { ESLint } from "eslint";

export async function tsParse() {
    // Create an instance with the TypeScript parser.
    const eslint = new ESLint({
        overrideConfig: {
            parser: "@typescript-eslint/parser",
        },
    });

    // Lint a TypeScript string.
    const text = `const x: number = 42;`; // Replace with your TypeScript code
    const results = await eslint.lintText(text, { filePath: "<input>" });

    // The parsed AST is in the first result.
    const ast = results[0].messages[0].node;

    // Create a new terminal
    const terminal = vscode.window.createTerminal('My Terminal');

    // Send the AST to the terminal
    terminal.sendText(`echo '${JSON.stringify(ast, null, 2)}'`);

    // Show the terminal
    terminal.show();
}