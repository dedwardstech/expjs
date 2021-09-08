export enum TokenType {
    Err = 'error',
    EOF = 'eof',

    Identifier = 'identifier',

    Number = 'number',
    String = 'string',
    Boolean = 'boolean',

    LogicalAnd = 'logical-and',
    LogicalOr = 'logical-or',
    LogicalNot = 'logical-not',

    LeftParen = 'left-paren',
    RightParen = 'right-paren',

    IsEqual = 'is-equal',
    IsNotEqual = 'is-not-equal',
    IsGreater = 'is-greater',
    IsGreaterOrEqual = 'is-greater or equal',
    IsSmaller = 'is-smaller',
    IsSmallerOrEqual = 'is-smaller-or-equal'
}

export interface Token {
    type: TokenType;
    value?: any;
    line?: number;
    col?: number;
}
