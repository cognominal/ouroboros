import * as ts from 'typescript';

export function visitNodeAndCheck<T extends ts.Node>(node: T, predicate: (node: ts.Node) => boolean): boolean {
    let result = false;
    ts.forEachChild(node, child => {
        if (predicate(child)) {
            result = true;
        } else if (!result) {
            result = visitNodeAndCheck(child, predicate);
        }
    });
    return result;
}

export function hasSymbol(node: ts.Node, symbolStr: string): boolean {
    return visitNodeAndCheck(node, node => 
        ts.isIdentifier(node) && node.text === symbolStr
    )
}
