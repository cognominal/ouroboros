import assert from "assert";

// export function _deepOmit(obj: any, toOmit: string | string[] = 'loc'): any {
//     if (Array.isArray(obj)) {
//         return obj.map(item => deepOmit(item, keyToOmit));
//     } else if (typeof obj === 'object' && obj !== null) {
//         return Object.fromEntries(
//             Object.entries(obj)
//                 .filter(([key]) => key !== keyToOmit)
//                 .map(([key, value]) => [key, deepOmit(value, keyToOmit)])
//         );
//     } else {
//         return obj;
//     }
// }

export function deepOmit(obj: any, toOmit: string | string[] = 'loc'): any {
    let keysToOmit: string[];
    if (Array.isArray(toOmit)) {
        keysToOmit = toOmit;
    } else {
        keysToOmit = [toOmit];
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepOmit(item, keysToOmit));
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([key]) => !keysToOmit.includes(key))
                .map(([key, value]) => [key, deepOmit(value, keysToOmit)])
        );
    } else {
        return obj;
    }
}

export function deepOmitLocAndRaw(obj: any): any {
    return deepOmit(obj, ['loc', 'raw']);
}

export function assertDeepEqualWithOmit(actual: any, expected: any, omitKey: string = 'loc') {
    assert.deepStrictEqual(deepOmit(actual, omitKey), deepOmit(expected, omitKey));
}
