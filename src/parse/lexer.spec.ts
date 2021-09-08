import {Token, TokenType} from "./token";
import {Lexer} from "./lexer";

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

        ];

        const tokensAreEqual = (t1: Token, t2: Token): boolean => t1.type === t2.type && t1.value === t2.value;

        tests.forEach(t => {
            const l = new Lexer(t.expression);
            const tokens = l.token();

            expect(tokens.every((token, idx) => tokensAreEqual(token, t.tokens[idx]))).toBeTrue();
        });
    });
});
