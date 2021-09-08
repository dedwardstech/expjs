import {Token, TokenType} from "./token";
import {isAlphanumeric, isNumeric, isOperator, isWhitespace} from "./utils";

export type StateFn = (l: Lexer) => StateFn | null;

const EOF = '!!EOF!!';

export class Lexer {
    public name: string = '';

    private input: string;
    private state: StateFn | null = stateInit;

    private position: number = 0;
    private start: number = 0;
    private width: number = 0;
    private tokens: Token[] = [];

    constructor(input: string) {
        this.input = input;
    }

    public next(): string {
        if (this.position >= this.input.length) {
            this.width = 0;

            return EOF;
        }

        const r = this.input.substring(this.position, this.position + 1);
        this.width = r.length;
        this.position += r.length;

        return r;
    }

    public seek(n: number): void {
        this.position += n;
    }

    public peek(): string {
        const r = this.next();
        this.backup();

        return r;
    }

    public backup(): void {
        this.position -= this.width;
    }

    public buffer(): string {
        return this.input.substring(this.start, this.position).trimEnd();
    }

    public ignore(): void {
        this.start = this.position;
    }

    public emit(t: TokenType): void {
        this.tokens.push({
            type: t,
            value: this.buffer(),
            line: this.lineNumber(),
            col: this.columnNumber()
        });

        this.start = this.position;
    }

    public errorf(...args: any[]): StateFn | null {
        this.tokens.push({
            type: TokenType.Err,
            value: `${args.join('')}`,
            line: this.lineNumber(),
            col: this.columnNumber()
        });

        return stateEnd;
    }

    public lineNumber(): number {
        return this.input.substring(0, this.position).split('\n').length;
    }

    public columnNumber(): number {
        const lf = this.input.substring(0, this.position).lastIndexOf('\n');
        if (lf !== -1) {
            return this.input.substring(lf + 1, this.position).length;
        } else {
            return this.input.substring(0, this.position).length;
        }
    }

    public advanceUntil(until: (val: string) => boolean): string {
        let r = this.next();

        while (until(r)) {
            r = this.next();
        }

        return r;
    }

    public token() {
        let state: StateFn | null = this.state;
        while(state !== null) {
            state = state(this);
        }

        return this.tokens
    }
}

const stateInit = (l: Lexer): StateFn | null => {
    const s = l.next();

    if (isWhitespace(s)) {
        l.ignore();
        return stateInit;
    }

    if (isNumeric(s)) {
        return stateNumber;
    }

    if (isAlphanumeric(s)) {
        return stateIdentifier;
    }

    if (isOperator(s)) {
        return stateOperator;
    }

    if (s === `'`) {
        return stateSingleQuote;
    }

    if (s === `"`) {
        return stateDoubleQuote;
    }

    if (s === '(') {
        l.emit(TokenType.LeftParen);
        return stateInit;
    }

    if (s === ')') {
        l.emit(TokenType.RightParen);
        return stateInit;
    }

    return stateEnd;
}

const stateIdentifier = (l: Lexer): StateFn => {
    l.advanceUntil((s: string) => isAlphanumeric(s));
    l.backup();

    const val = l.buffer();

    if (val === 'true' || val === 'false') {
        l.emit(TokenType.Boolean);
    } else {
        l.emit(TokenType.Identifier);
    }

    return stateInit;
}

const stateOperator = (l: Lexer): StateFn => {
    l.advanceUntil((s: string) => isOperator(s));
    l.backup();

    const val = l.buffer();

    if (val === '!') l.emit(TokenType.LogicalNot);
    else if (val === '&&') l.emit(TokenType.LogicalAnd);
    else if (val === '!!') l.emit(TokenType.LogicalOr);
    else if (val === '==') l.emit(TokenType.IsEqual);
    else if (val === '!=') l.emit(TokenType.IsNotEqual);
    else if (val === '>') l.emit(TokenType.IsGreater);
    else if (val === '>=') l.emit(TokenType.IsGreaterOrEqual);
    else if (val === '<') l.emit(TokenType.IsSmaller);
    else if (val === '<=') l.emit(TokenType.IsSmallerOrEqual);

    return stateInit;
}

const stateSingleQuote = (l: Lexer): StateFn | null => {
    l.ignore();
    const r = l.advanceUntil((s: string) => s !== `'` && s !== EOF);

    if (r === EOF) {
        return l.errorf('unexpected EOF');
    }

    l.backup();
    l.emit(TokenType.Identifier);
    l.next();
    l.ignore();

    return stateInit;
}

const stateDoubleQuote = (l: Lexer): StateFn | null => {
    l.ignore();
    const r = l.advanceUntil((s: string) => s !== `"` && s !== EOF);

    if (r === EOF) {
        return l.errorf('unexpected EOF');
    }

    l.backup();
    l.emit(TokenType.String);
    l.next();
    l.ignore();

    return stateInit;
}

const stateNumber = (l: Lexer): StateFn => {
    l.advanceUntil((s: string) => isNumeric(s) || s === '.');
    l.backup();
    l.emit(TokenType.Number);

    return stateInit;
}

const stateEnd = (l: Lexer): StateFn | null => {
    l.emit(TokenType.EOF);

    return null;
}
