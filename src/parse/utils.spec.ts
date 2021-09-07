import {isAlphanumeric, isNumeric, isOperator, isWhitespace} from "./utils";
import {alphabetArr, digitStrArr} from "../testing/constants";

describe('Parse Utils', function () {
  const operators = ['=', '!', '>', '<', '&', '|'];

  describe('isWhitespace()', () => {
    const tests = [
      {name: 'returns true for a single white space', arg: ' ', expected: true},
      {name: 'returns true for tab character', arg: '\t', expected: true},
      {name: 'returns true for new line character', arg: '\n', expected: true},
      {name: 'returns true for carriage return character', arg: '\r', expected: true},
      {
        name: 'returns false for any other character',
        arg: [null, void 0, undefined, '  ', ...alphabetArr, ...digitStrArr, ...operators],
        expected: false
      }
    ];

    tests.forEach(t => {
      it(t.name, () => {
        if (Array.isArray(t.arg)) {
          expect(t.arg.every(a => isWhitespace(a as any) === t.expected)).toBeTrue();
        } else {
          expect(isWhitespace(t.arg)).toEqual(t.expected);
        }
      });
    });
  });

  describe('isAlphanumeric()', () => {
    it('returns true for a-z, A-Z , 0-9, periods and underscores', () => {
      const cases = [...alphabetArr, ...digitStrArr, '.', '_'];

      expect(cases.every(c => isAlphanumeric(c))).toBeTrue();
      expect(operators.every(o => !isAlphanumeric(o))).toBeTrue();
    });
  });

  describe('isNumeric()', () => {
    it('returns true for digits only', () => {
      expect(digitStrArr.every(d => isNumeric(d))).toBeTrue();
      expect([...alphabetArr, ...operators].every(c => !isNumeric(c))).toBeTrue();
    });
  });

  describe('isOperator()', () => {
    it(`returns true for operator characters (${operators.join(', ')})`, () => {
      expect(operators.every(o => isOperator(o))).toBeTrue();
      expect([...alphabetArr, ...digitStrArr].every(c => !isOperator(c))).toBeTrue();
    });
  });
});
