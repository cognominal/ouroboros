This extension expands on the package explorer in
[https://github.com/Microsoft/vscode-extension-samples/blob/main/tree-view-sample/USAGE.md](treeview sample)

## Ouroboros:  navigate vscode extensions, npm packages.

 - it provides a dedicated fuzzy picker and a tree view for easy navigation.
 - It reads package.json files to generate navigational information in a more interactive way.
 - It may eventually augment possible interactions with package.json files.

Explore the source code of vscode extensions and their npm dependencies, exploiting their
`package.json`files.`

It starts with the vscode extension samples [https://github.com/Microsoft/vscode-extension-samples](git repo).
It uses package.json files to generate a tree view of the extension.


To avoid to tax storage we search the pnpm store path to gather information about packages.
pnpm store path



Ouroboros creates a folder ".ouroboros" in the home directory where it
clones the git repo without history..

This extension named ouroboros for obvious reasons
facilitates the exploration of extensions samples.

It parses their package.json and propose a tree view of the samples
and what they do.


# Motivation

Being a newcomer in the modern web programmation, I am utterly lost and failed
miserably in what I wanted to do because I tried to stride among too many worlds.
So I decided to build some tools.
Here, the goal is to create a hub where I curate information in a different way,
programmaticalty if possible.
- It is not just ya [https://github.com/sindresorhus/awesome](awesome list).
- It is not (yet?) powered by AI.
- Once initialized it should mostly work offline.
- So it is not a comprensive web site listing npm packages, vsocde extension or whatever.

The current focus is to leverage the vscode extension samples.
It is dogfooding. I intend to use it to write project and leverage it
in this projects.

At any given time it has a single sample checked out.
It runs pnpm install in the sample directory.


# tree views

## dependency tree view

## info tree view
For all the selected extension. Default the sample ones.
Provide a COmmand to search for extensions

read the package.json files 