import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { packageJsons } from './extension';
import * as util from 'util';
import { mkContributionTree } from './utils';

export type JsonStruct = Record<string, unknown> | Record<string, JsonStruct[]>;
export type ContributionTree = Record<string, JsonStruct>;

let contributionTree: Promise<ContributionTree>;

async function getContributionTree() {
    if (!contributionTree) {
        const excludePattern = '**/node_modules/**';
        const packageJsonFiles = await vscode.workspace.findFiles('**/package.json', excludePattern);
        const readFile = util.promisify(fs.readFile);

        let packageJsons = await Promise.all(packageJsonFiles.map(async (packageJsonFile) => {
            const data = await readFile(packageJsonFile.fsPath, 'utf8');
            return JSON.parse(data);
        }));


        let contributionTree: ContributionTree = {}
        for (const packageJson of packageJsons) {
            const jsonStruct: Record<string, unknown> = {};
            jsonStruct["contributes"] = packageJson["contributes"];
            contributionTree[packageJson["name"]] = jsonStruct;
            contributionTree[jsonStruct["name"] as string] = jsonStruct["contributes"] as JsonStruct;
        }
    }
    return contributionTree
}

// for now display only the packages names
export class ContributionsProviderByContributionKind implements vscode.TreeDataProvider<Contribution> {
    // contributionTree: Promise<ContributionTree>
    // constructor() {
    //     this.contributionTree = this.initialize();
    // }

    // async initialize() : Promise<ContributionTree> {
    //     let tree = await contributionTree;
    //     return tree 
    // }

    getTreeItem(element: Contribution): vscode.TreeItem {
        return { id: element.id, label: element.id }
    }

    async getChildren(element?: Contribution): Promise<Contribution[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            let contributionTree: ContributionTree

            contributionTree = await getContributionTree();


            const contributionsTypes
                = Object.keys(contributionTree).map(id => new Contribution(id, id));
            let a = Promise.resolve(contributionsTypes);
            return a

        }
    }

    getParent(element: Contribution): Contribution | null {
        return null;
    }

}

export class ContributionsProviderClass implements vscode.TreeDataProvider<Contribution> {
    contributionTree: Promise<ContributionTree>;
    constructor() {
        this.contributionTree = contributionTree; // Assuming contributionTree is a Promise
        this.initialize();
    }

    async initialize() {
        await this.contributionTree;
    }

    getTreeItem(element: Contribution): vscode.TreeItem {
        return { id: element.id, label: element.id }
    }

    getChildren(element?: Contribution): Thenable<Contribution[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            const contributionsTypes
                = Object.keys(contributionTree).map(id => new Contribution(id, id));
            return Promise.resolve(contributionsTypes);

        }
    }

    getParent(element: Contribution): Contribution | null {
        return null;
    }



}

export class Contribution {
    constructor(readonly id: string, label: string) { }

}
