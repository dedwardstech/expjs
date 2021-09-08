import { Token, TokenType } from "./token";
import { Lexer } from "./lexer";

fdescribe('Lexer', () => {
    it('parses expression strings into tokens', () => {
        interface TestCase {
            expression: string;
            tokens: Token[];
        }

        const tests: TestCase[] = [
            {
                expression: 'foo > bar',
                tokens: [
                    { type: TokenType.Identifier, value: 'foo', line: 1, col: 4 },
                    { type: TokenType.IsGreater, value: '>', line: 1, col: 6 },
                    { type: TokenType.Identifier, value: 'bar', line: 1, col: 9 },
                    { type: TokenType.EOF, value: '', line: 1, col: 9 }
                ]
            },
            {
                expression: `bar == 'baz'`,
                tokens: [
                    { type: TokenType.Identifier, value: 'bar', line: 1, col: 4 },
                    { type: TokenType.IsEqual, value: '==', line: 1, col: 6 },
                    { type: TokenType.Identifier, value: 'baz', line: 1, col: 9 },
                    { type: TokenType.EOF, value: '', line: 1, col: 9 }
                ]
            },
            {
                expression: `(bar!="baz")&&foo==123.00`,
                tokens: [
                    { type: TokenType.LeftParen, value: '(' },
                    { type: TokenType.Identifier, value: 'bar' },
                    { type: TokenType.IsNotEqual, value: '!=' },
                    { type: TokenType.String, value: 'baz' },
                    { type: TokenType.RightParen, value: ')' },
                    { type: TokenType.LogicalAnd, value: '&&' },
                    { type: TokenType.Identifier, value: 'foo' },
                    { type: TokenType.IsEqual, value: '==' },
                    { type: TokenType.Number, value: '123.00' },
                    { type: TokenType.EOF, value: '' }
                ]
            },
            {
                expression: `!true`,
                tokens: [
                    { type: TokenType.LogicalNot, value: '!' },
                    { type: TokenType.Boolean, value: 'true' },
                    { type: TokenType.EOF, value: '' }
                ]
            }
        ];

        tests.forEach(t => {
            const l = new Lexer(t.expression);
            const tokens = l.token();

            tokens.forEach((token: Token, idx: number) => {
                expect(token.type).toEqual(t.tokens[idx].type);
                expect(token.value).toEqual(t.tokens[idx].value);
            });
        });
    });
});
