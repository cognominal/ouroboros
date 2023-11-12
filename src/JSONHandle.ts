// We use the json-to-ast library to parse the JSON file into an AST
// so we can navigate the json not like an object but like a AST tree 
// which gives us the location of the thing we navigate to.
// This allows us    to safely edit the JSON file

import parse, { ASTNode, ObjectNode, PropertyNode } from 'json-to-ast';


function ASTNodeToJSON(s : string, node: ASTNode): string {
    let start = node.loc?.start.offset;
    let end = node.loc?.end.offset;
    return s.slice(start, end);
}


function getValueFromKey(key: string, obj: ObjectNode): ASTNode | undefined{
    let node : PropertyNode | undefined = obj.children.find((node: PropertyNode) => {
        return node.key?.value === key;
    });
    return node ? node.value : undefined;
}

export function getJsonAst(text: string, navigate: string): ASTNode {
    let parsed = parse(text);
    console.log(ASTNodeToJSON(text, parsed))
    let node: ASTNode | undefined  = parsed
    let split = navigate.split('/')
    split.forEach((key) => {
        console.log('+++', key, parsed.type)
        if (parsed.type === 'Object') {
            node = getValueFromKey(key, parsed)
        } else if (parsed.type === 'Array') {
            node = parsed.children[parseInt(key)];
        }
        if (!node) {
            console.log("node not found")
            return undefined;
        } else {
            console.log("\n----\n", node, "\n====\n\n", ASTNodeToJSON(text, node))
        }
    });
    return node;
    
}
