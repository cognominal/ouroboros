import * as fs from 'fs';
import * as path from 'path';


export type JsonStruct = Record<string, unknown> | Record<string, JsonStruct[]>;
export type ContributionTree = Record<string, JsonStruct>;


// export async function mkContributionTree(dir: string, select: string) {
export async function mkContributionTree(packageJsons: JsonStruct[]) {
    let contributionTree: ContributionTree = {}
    for (const packageJson of packageJsons) {
        const jsonStruct: Record<string, unknown> = {};
        contributionTree[jsonStruct["name"] as string] = jsonStruct["contributes"] as JsonStruct;
    }
    return contributionTree
}



