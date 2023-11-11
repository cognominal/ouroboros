import { it, describe, before } from 'mocha';
import * as assert from 'assert';
import { assertDeepEqualWithOmit, deepOmit } from '../test-utils';

describe('deepomit', () => {
    it('`deepOmit`should return the same object if no key is omitted', () => {
        assert.deepEqual(deepOmit({ a: 1 }), { a: 1 });
    })
    it('`deepOmit`should omit entry with default key loc', () => {
        assert.deepEqual(deepOmit({ a: 1, loc: null }), { a: 1 });
    })
    it('`deepOmit`should omit entry with explicit key loc', () => {
        assert.deepEqual(deepOmit({ a: 1, loc: null }, 'loc'), { a: 1 });
    })
    it('`deepOmit`should omit entry with explicit key foo', () => {
        assert.deepEqual(deepOmit({ a: 1, foo: null }, 'foo'), { a: 1 });
    })
    it('`deepOmit`should omit entry with default key loc even deeper', () => {
        assert.deepEqual(deepOmit({foo: { a: 1, loc: null }}), {foo: { a: 1 }});
    })
    it('`deepOmit`should omit entry with default key loc deeper', () => {
        assert.deepEqual(deepOmit([{foo: { a: 1, loc: null }}]), [{foo: { a: 1 }}]);
    })
    
})

describe('deepEqual', () => {
    it('`deepEqual` should return true for equal objects', () => {
        assertDeepEqualWithOmit({ a: 1 }, { a: 1 })
        assertDeepEqualWithOmit({ a: { b: 2 } }, { a: { b: 2 } })
        assertDeepEqualWithOmit({ a: { b: { c: 3 } } }, { a: { b: { c: 3 } } })})

    it('`deepEqual` should return true for equal objects except for `loc` keys', () => {
        assertDeepEqualWithOmit({ loc: 1, a: 1 }, { a: 1 })
        assertDeepEqualWithOmit({ a: { loc: 1, b: 2 } }, { a: { b: 2 } })
        assertDeepEqualWithOmit({ a: { b: { loc: 1, c: 3 } } }, { a: { b: { c: 3 } } })})

    it('`deepEqual` should return true for equal objects except for `loc` keys, explicit', () => {
        assertDeepEqualWithOmit({ loc: 1, a: 1 }, { a: 1 }, 'loc')
        assertDeepEqualWithOmit({ a: { loc: 1, b: 2 } }, { a: { b: 2 } }, 'loc')
        assertDeepEqualWithOmit({ a: { b: { loc: 1, c: 3 } } }, { a: { b: { c: 3 } } }, 'loc')
    });
})
