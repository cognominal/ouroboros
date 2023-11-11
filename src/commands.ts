import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

function endFilePosition(uri: { fsPath: fs.PathOrFileDescriptor; }): vscode.Position {
    let file = fs.readFileSync(uri.fsPath, 'utf8');
    let lines = file.split(/\r?\n/);
    return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
}

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
    // Create a new WorkspaceEdit
    const edit = new vscode.WorkspaceEdit();

    // Check if src/commands.ts exists in the selected folder
    const commandsFilePath = path.join(selectedFolder, 'src', 'commands.ts');
    if (!fs.existsSync(commandsFilePath)) {
        // Create the src directory if it doesn't exist
        const srcDirPath = path.join(selectedFolder, 'src');
        if (!fs.existsSync(srcDirPath)) {
            edit.createFile(vscode.Uri.file(srcDirPath));
            edit.insert(vscode.Uri.file(srcDirPath), new vscode.Position(0, 0), `import * as vscode from 'vscode';\n`);
        }
    }

    // Check if src/command.ts exists in the selected folder
    const commandFilePath = path.join(selectedFolder, 'src', 'command.ts');



    // `export function placeholderCommand() {
    //     // The code to execute when the command is called
    //     vscode.window.showInformationMessage('This is a placeholder command.');
    // }`);


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
    let extensionName = packageObj.name;

    // Show input box to get the name of the new command
    const commandName = await vscode.window.showInputBox({ prompt: 'Enter in camelcase the name of the new command' });
    if (!commandName) {
        return;
    }
    const commandTitle = await vscode.window.showInputBox({ prompt: 'Enter the tile of the new command (used in quickpick or menus)' });

    // Add a new command to the commands array
    let newCommand = {
        "command": `${extensionName}.${commandName}`,
        "title": commandTitle
    };
    packageObj.contributes.commands.push(newCommand);

    // Convert the modified object back to a JSON string
    let newPackageJson = JSON.stringify(packageObj, null, 2);

    // Write the string back to the package.json file
    fs.writeFileSync(packageJsonPath, newPackageJson);

    // Read the src/extension.ts file
    const extensionFilePath = path.join(selectedFolder, 'src', 'extension.ts');
    if (!fs.existsSync(extensionFilePath)) {
        vscode.window.showErrorMessage(`Error: src/extension.ts does not exist in ${selectedFolder}.`);
        return;
    }

    let extensionFile = fs.readFileSync(extensionFilePath, 'utf8');

    // Check if the activate function exists in the file
    if (extensionFile.includes('function activate(')) {
        // Add the code to register the new command to the activate function
        extensionFile = extensionFile.replace(
            /(function activate\([\s\S]*?)(\{[\s\S]*?)(\n\s*return)/,
            `$1$2\n\n\t// Register the new command\n\tlet disposable = vscode.commands.registerCommand('${commandName}', () => {\n\t\t// The code to execute when the command is called\n\t\t${commandName}();\n\t});\n\n\tcontext.subscriptions.push(disposable);$3`
        );
    } else {
        // Create the activate function and add the code to register the new command
        extensionFile += `\n\nfunction activate(context) {\n\t// Register the new command\n\tlet disposable = vscode.commands.registerCommand('${commandName}', () => {\n\t\t// The code to execute when the command is called\n\t\t${commandName}();\n\t});\n\n\tcontext.subscriptions.push(disposable);\n}\n\nexports.activate = activate;`;
    }

    // Write the modified file back to disk
    fs.writeFileSync(extensionFilePath, extensionFile);

    vscode.window.showInformationMessage(`Command ${commandName} has been added.`);
}


export async function deleteCommand() {
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

    // Show input box to get the name of the command to delete
    const commandName = await vscode.window.showInputBox({ prompt: 'Enter the name of the command to delete' });
    if (!commandName) {
        return;
    }

    // Find the index of the command to delete

    const commandIndex = packageObj.contributes.commands.findIndex((command: any) => command.command === commandName);
    if (commandIndex === -1) {
        vscode.window.showErrorMessage(`Error: Command ${commandName} not found.`);
        return;
    }

    // Remove the command from the commands array
    packageObj.contributes.commands.splice(commandIndex, 1);

    // Convert the modified object back to a JSON string
    let newPackageJson = JSON.stringify(packageObj, null, 2);

    // Write the string back to the package.json file
    fs.writeFileSync(packageJsonPath, newPackageJson);




    vscode.window.showInformationMessage(`Command ${commandName} has been deleted.`);
}