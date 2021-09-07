import {TokenType} from "./token";
import {Lexer} from "./lexer";

describe('Lexer', () => {
    it('parses expression strings into tokens', () => {
        const cases = [
            {
                expression: 'foo > bar',
                tokens: [
                    { type: TokenType.Identifier, value: 'foo' },
                    { type: TokenType.IsGreater, value: '>' },
                    { type: TokenType.Identifier, value: 'bar' },
                    { type: TokenType.EOF }
                ]
            }
        ];

        cases.forEach(c => {
            const l = new Lexer(c.expression);
            const tokens = l.token();

            console.log(tokens);
        })
    });
});
