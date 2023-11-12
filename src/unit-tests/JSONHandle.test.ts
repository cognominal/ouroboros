import { it, describe, before } from 'mocha';
import * as assert from 'assert';
import { getJsonAst } from '../JSONHandle';
import { assertDeepEqualWithOmit } from '../test-utils';



describe('JSONHandle simple', () => {
  it('should return a Literal node with value 42 for foo', () => {
    const text = '{ "foo": 42 }'
    let node = getJsonAst(text, 'foo')
    assertDeepEqualWithOmit(node, {
      type: 'Literal',
      value: 42,
      raw: '42'
    });
  })
  it('should return a Literal node with value 1 for foo', () => {
    const text = '[42]'
    let node = getJsonAst(text, '0');
    assertDeepEqualWithOmit(node, {
      type: 'Literal',
      value: 42,
      raw: '42'
    });
  })

})

describe('JSONHandle', () => {
  it('should return a Literal node with value 42 for foo/bar', () => {
    const text = '{ "foo": { "bar":  42 } }'
    let node = getJsonAst(text, 'foo/bar');
    assert.deepStrictEqual(node, {
      type: 'Literal',
      value: 42,
      raw: '42'
    });
  });

  it('should return a Literal node with value 42 for foo/bar/baz', () => {
    const text = `
    {
        "foo": {  "bar": {  "baz": 42 }},
        "array": [ 666 ]
    }
    `;
    let node = getJsonAst(text, 'foo/bar/baz');
    assert.deepStrictEqual(node, {
      type: 'Literal',
      value: 42,
      raw: '42'
    });
  });

  it('should return an ObjectExpression node with key "foo" and value "bar" for foo/array/0', () => {
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
  });
});