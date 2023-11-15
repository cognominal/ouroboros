import process from 'process';
import { expect } from 'chai';
import 'mocha';

before(() => {
    process.env.NODE_ENV = 'test';
  });
  

describe('sanity test', () => {
    it('should return true if the symbol exists in the node', () => {
        expect(true).to.be.true;
    });
});


describe('NODE_ENV set to test', () => {
    it('should return true if the symbol exists in the node', () => {
        console.log(process.env.NODE_ENV);
        expect(process.env.NODE_ENV === 'test').to.be.true;
    });
});