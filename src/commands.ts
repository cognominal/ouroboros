

import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export async function addCommand() {
    // Show quickpick to choose the folder to search for package.json
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        vscode.window.showErrorMessage('Error: No workspace folders found.');
        return;
    }
    const folderPaths = folders.map(folder => folder.uri.fsPath);
    const selectedFolder = await vscode.window.showQuickPick(folderPaths, { placeHolder: 'Select a folder to search for package.json' });
    if (!selectedFolder) {
        return;
    }

    // Check if package.json exists in the selected folder
    const packageJsonPath = path.join(selectedFolder, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        vscode.window.showErrorMessage(`Error: package.json does not exist in ${selectedFolder}.`);
        return;
    }

    // Read the package.json file
    let packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    // Parse the file content to a JavaScript object
    let packageObj = JSON.parse(packageJson);

    // Add a new command to the commands array
    let newCommand = {
        "command": "ouroboros.newCommand",
        "title": "Ouroboros New Command"
    };
    packageObj.contributes.commands.push(newCommand);

    // Convert the modified object back to a JSON string
    let newPackageJson = JSON.stringify(packageObj, null, 2);

    // Write the string back to the package.json file
    fs.writeFileSync(packageJsonPath, newPackageJson);

}