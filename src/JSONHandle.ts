import parse, { ASTNode, ObjectNode, PropertyNode } from 'json-to-ast';

function getValueFromKey(key: string, obj: ObjectNode): PropertyNode | undefined{
    return obj.children.find((node: PropertyNode) => {
        return node.key?.value === key;
    });
}

export function getJsonAst(text: string, navigate: string): ASTNode {
    let parsed = parse(text);
    
    let node: ASTNode | undefined  = parsed
    navigate.split('/').forEach((key) => {
        if (parsed.type === 'Object') {
            node = getValueFromKey(key, parsed)?.value;
        } else if (parsed.type === 'Array') {
            node = parsed.children[parseInt(key)];
        }
        if (node) {
            parsed = node;
        }
    });
    
    
    return parsed;
    
}

function test() {
    const text = `
    {
        "foo": {
            "bar": {
                "baz": 1
            }
        },
        "array": [
            {
                "foo": "bar"
            }
        ]
    }
    `;
    let node = getJsonAst(text, '/foo/bar/baz');
    
    node = getJsonAst(text, '/foo/array/0');
    
    console.log(node);
}