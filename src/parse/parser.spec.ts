import { Tree } from "./ast";
import { Lexer } from "./lexer";
import { parse } from "./parser";
import { TokenType } from "./token";

describe('Parser', () => {

    it('parses a tree', () => {
        const l = new Lexer('(foo > bar)');
        const tree = parse(l);

        const expected: Tree = {
            value: { type: TokenType.IsGreater, value: '>', line: 1, col: 6 },
            left: {
                value: { type: TokenType.Identifier, value: 'foo', line: 1, col: 4 },
                left: null,
                right: null
            },
            right: {
                value: { type: TokenType.Identifier, value: 'bar', line: 1, col: 10 },
                left: null,
                right: null
            }
        }

        expect(tree).toEqual(expected as any);
    });

    it('parses complex trees', () => {
        const l = new Lexer('((foo > bar) && true)');
        const tree = parse(l);

        const expected = {
            value: { type: TokenType.LogicalAnd, value: '&&', line: 1, col: 15 },
            left: {
                value: { type: TokenType.IsGreater, value: '>', line: 1, col: 7 },
                left: {
                    value: { type: TokenType.Identifier, value: 'foo', line: 1, col: 5 },
                    left: null,
                    right: null
                },
                right: {
                    value: { type: TokenType.Identifier, value: 'bar', line: 1, col: 11 },
                    left: null,
                    right: null
                }
            },
            right: {
                value: { type: TokenType.Boolean, value: 'true', line: 1, col: 20 },
                left: null,
                right: null
            }
        };

        expect(tree).toEqual(expected as any);
    });
});