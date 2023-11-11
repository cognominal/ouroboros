import { it, describe, before } from 'mocha';
import * as assert from 'assert';
import { getJsonAst } from '../JSONHandle';

describe('JSONHandle', () => {
  it('should return a Literal node with value 1 for /foo/bar/baz', () => {
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
    assert.deepStrictEqual(node, {
      type: 'Literal',
      value: 1,
      raw: '1'
    });
  });

  it('should return an ObjectExpression node with key "foo" and value "bar" for /foo/array/0', () => {
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
    let node = getJsonAst(text, '/foo/array/0');
    assert.deepStrictEqual(node, {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            name: 'foo'
          },
          value: {
            type: 'Literal',
            value: 'bar',
            raw: '"bar"'
          },
          kind: 'init',
          computed: false,
          method: false,
          shorthand: false
        }
      ]
    });
  });
});