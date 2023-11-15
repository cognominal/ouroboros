import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";

// depending on setting, we use the vscode API to search for files
const includePattern = '**/*.ts';
const excludePattern = '**/*.test.ts';



function findFiles(directory: string, includePattern: string, excludePattern: string): string[] {
    let result: string[] = [];

    fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
            result = result.concat(findFiles(fullPath, includePattern, excludePattern));
        } else if (fullPath.match(includePattern) && !fullPath.match(excludePattern)) {
            result.push(fullPath);
        }
    });

    return result;
}



export async function getTsFiles() {
    const tsFiles = await vscode.workspace.findFiles(includePattern, excludePattern);

    return tsFiles;
}
