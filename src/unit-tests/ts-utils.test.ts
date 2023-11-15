import * as ts from 'typescript';
import { hasSymbol } from '../ts-utils'; 
import { expect } from 'chai';
import 'mocha';

describe('hasSymbol', () => {
    it('should return true if the symbol exists in the node', () => {
        const sourceCode = 'const myVar = 123;';
        const sourceFile = ts.createSourceFile('sample.ts', sourceCode, ts.ScriptTarget.Latest);
        const result = hasSymbol(sourceFile, 'myVar');
        expect(result).to.be.true;
    });

    it('should return false if the symbol does not exist in the node', () => {
        const sourceCode = 'const myVar = 123;';
        const sourceFile = ts.createSourceFile('sample.ts', sourceCode, ts.ScriptTarget.Latest);
        const result = hasSymbol(sourceFile, 'nonexistentVar');
        expect(result).to.be.false;
    });
});