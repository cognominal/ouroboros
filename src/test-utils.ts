import assert from "assert";

export function deepOmit(obj: any, keyToOmit: string = 'loc'): any {
    if (Array.isArray(obj)) {
        return obj.map(item => deepOmit(item, keyToOmit));
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([key]) => key !== keyToOmit)
                .map(([key, value]) => [key, deepOmit(value, keyToOmit)])
        );
    } else {
        return obj;
    }
}


export function assertDeepEqualWithOmit(actual: any, expected: any, omitKey: string = 'loc') {
    assert.deepStrictEqual(deepOmit(actual, omitKey), deepOmit(expected, omitKey));
}
