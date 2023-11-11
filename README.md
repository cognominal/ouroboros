# THIS IS A WORK IN PROGRESS. NOT WORKING YET.˝

## Helper to write vscode extensions using the ouroboros extension

Ouroboros helps the user to write vscode extensions by using treeviews to
navigate the source code of existing extensions. The involved extensions can be
installed extensions, internal, external or sample extensions. If not already
declared present, the folders are downloaded, by default with a shallow clone,
and the treeview are progressively populated. If you have the said folders on
your disk, you can declare them in the settings and they will be used instead
of downloading them.


[Ouroboros](https://marketplace.visualstudio.com/items?itemName=cognominal.ouroboros) uses [treeviews](https://code.visualstudio.com/api/extension-guides/tree-view) to examine the contributions of installed
extensions, internal, external or from the sample extensions
([generic](https://github.com/microsoft/vscode-extension-samples) or specific to [notebooks](https://github.com/microsoft/notebook-extension-samples)).
Clicking on a treeview leaf opens the corresponding source code.
Ouroboros is an invaluable help for vscode extension developpers :
For any [contribution](https://code.visualstudio.com/api/references/contribution-points) tree items, ouroboros give direct access to the relevant code.


## Features
- Ouroboros provide two treeviews. They allow to navigate extensions source code. 
They provide the same information but organized differently. The `extension treeview` first level is the extensions list. On the other hand, the  `contribution treeview` first level are contribution points. So for any [contribution point](https://code.visualstudio.com/api/references/contribution-points) you can easily browse extensions
that provide them.
- by default ouroboros treeviews are added to the explorer view but you can use a [view container](https://code.visualstudio.com/api/extension-guides/tree-view#view-containers) accessible from a icon
in the [activity bar](https://code.visualstudio.com/api/ux-guidelines/activity-bar)
- (TBD) the treeview are progressively populated as the source code of the extensions is downloaded. 
-  (TBD) Commands allow to add or remove contributions from the source code of the extension and
the package.json file.
- (TBD) You can launch and debug sample extension by right clicking on an extension name on the `extension treeview`.

## Extension Settings


This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.

## Other extensions by the same author

[shortcuts](https://marketplace.visualstudio.com/items?itemName=cognominal.shortcuts)
Access  the keyboard [shortcuts](https://marketplace.visualstudio.com/items?itemName=cognominal.shortcuts) using a [quick pick](https://code.visualstudio.com/api/ux-guidelines/quick-picks)
similar to the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).


	let disposable = vscode.commands.registerCommand('helper-shortcuts.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from helper-shortcuts!');


`add-register-command` will add a call to `vsocode.commmands.registerCommand` in the activation function of `extension.ts`, and create the command
to be registerd.
The command is added to the `package.json` file.
It provides three ways to do create the command. One is to inline it in the activation function. The second is to create a new file by the name of
the command. The third is to add it to an existing file. 
(TBD) 

Redactoring is available : you can move a command implementation from inline to a file.


According to github copilot :

If you want to find package.json files outside of the current workspace, you would need to use Node.js's built-in fs and path modules to traverse the file system. However, this is generally not recommended for a Visual Studio Code extension, as it could potentially lead to performance issues and security concerns.

VS Code extensions are primarily designed to operate within the context of a workspace. If you need to work with files outside of the workspace, you might want to consider asking the user to open the relevant directory as a workspace.

# setting variables


FoldersWithExtensions is an array of objects which denotes
folder to search for extensions.
These object may have the following keys: `folder`, `name`, `RepoUrl`.
`folder` is mandatory and is a folder path
`name` is mandatory if `RepoUrl` is  absent. 

# ouroboros.addCommand

It updates `package.json`, `src/extension.ts` and `src/command.ts` to add placeholders for a command in this file.




