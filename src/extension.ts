
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path'
import * as fs from 'fs'
import { exec } from 'child_process';
import * as util from 'util';
import {  type JsonStruct } from './utils';

import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'
import { DepNodeProvider, Dependency } from './nodeDependencies';
import { ContributionsProviderClass, ContributionsProviderByContributionKind } from './contributionsTree';
import { workspace } from 'vscode';
import { readFile } from 'fs';
import { addCommand, deleteCommand } from './commands';
import { tsParse } from './tsParse';
import { TsParseCodeActionProvider } from './tsParse';

// intialized in init()
export let extensionConfiguration: vscode.WorkspaceConfiguration
export let foldersWithExtensions: string[]

interface FolderWithExtensions {
	dir?: string,
	path?: string,
	repoUrl?: string,
	name?: string
}
export let packageJsons: JsonStruct[]
// Get the extensionsPath setting
// const config = vscode.workspace.getConfiguration();
// const extensionsPath = config.get<string>('extensionsPath');

const appDirName = '.ouroboros' // TBD: make it an option
// const gitRepoSamplesName = 'https://github.com/microsoft/vscode-extension-samples'
// export const gitRepoSamplesDir = path.join(os.homedir(), appDirName, 'vscode-extension-samples');
// const cloneCmd = `git clone --depth 1 ${gitRepoSamplesName}`


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	init()

	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	const contributionsProvider = new ContributionsProviderClass();
	const contributionsByContributionKind = new ContributionsProviderByContributionKind();
	vscode.window.registerTreeDataProvider('extsContributions', contributionsProvider);
	vscode.window.registerTreeDataProvider('extsByContributionsType', contributionsByContributionKind);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	// vscode.commands.registerCommand('extension.openPackageOnNpm', () `)));
	vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => {
		return vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`);
	});
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));
    disposable = vscode.commands.registerCommand('ouroboros.tsParse', tsParse);
    context.subscriptions.push(disposable);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	disposable = vscode.commands.registerCommand('ouroboros.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from ouroboros!');
		await vscode.commands.executeCommand('workbench.views.openView', "workbench.views.openView");
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('ouroboros.addCommand', addCommand)
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('ouroboros.deleteCommand', deleteCommand)
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'typescript' }, new TsParseCodeActionProvider()));


}



vscode.window.onDidChangeActiveTextEditor((editor) => {
	let inAVSExtension = false;
    if (editor) {
        // Check if the file belongs to your extension's workspace
        inAVSExtension = checkIfFileInVSExtension(editor.document.uri);

        // Update the context key
        vscode.commands.executeCommand('setContext', 'inAVSExtension', inAVSExtension);
    }
});

function checkIfFileInVSExtension(uri: vscode.Uri): boolean {
	// Implement your logic to check if the file belongs to your extension's workspace
	// Return true if it does, false otherwise
	let lastDir = ''
	let dir = path.dirname(uri.fsPath);
	while (dir !== lastDir) {
		const packageJsonPath = path.join(dir, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
			return !!packageJson.contributes
		}
		dir = path.dirname(dir);
	}
	return false;
}


async function init() {

	// we add folders defined by the setting property `FoldersWithExtensions` to search for extensions
	// as defined by their package.json file
	extensionConfiguration = vscode.workspace.getConfiguration('ouroboros');
	foldersWithExtensions = extensionConfiguration.get<FolderWithExtensions[]>('FoldersWithExtensions') || [];
	let folders: string[] = foldersWithExtensions.reduce((acc: string[], folder: FolderWithExtensions) => {
		if (folder.path) {
			folder.path = folder.path.replace('${env:HOME}', process.env.HOME || '');
			acc.push(folder.path);
		}
		return acc;
	}, []);
	const workspaceFolders = workspace.workspaceFolders || [];
	const newWorkspaceFolders = folders.map((folder) => ({ uri: vscode.Uri.file(folder), name: path.basename(folder) }));
	// workspace.updateWorkspaceFolders(workspaceFolders.length, 0, ...newWorkspaceFolders);

	const homeDirectory = os.homedir();
	const appDirectory = path.join(homeDirectory, appDirName);
	fs.mkdirSync(appDirectory, { recursive: true });

	// clone the sample repo if necessary
	// TBD: we may work with a partial clone
	// fs.access(gitRepoSamplesDir, fs.constants.F_OK, (err) => {
	// 	if (err) {

	// 		exec(cloneCmd, async (error, stdout, stderr) => {
	// 			if (error) {
	// 				vscode.window.showErrorMessage('An error occurred: ' + error.message);
	// 				let res = await rimrafSync(gitRepoSamplesDir)
	// 			}
	// 		})

	// 	}
	// })
	// mkContributionTree(packageJsons)
}

// This method is called when your extension is deactivated
// export function deactivate() { }
