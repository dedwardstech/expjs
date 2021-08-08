import {Token} from "./parse/token";

export interface Tree {
    left: Tree;
    right: Tree;
    value: Token;
}

export class ExpressionTree implements Tree {

    constructor(
        public left: Tree,
        public right: Tree,
        public value: Token
    ) {}
}
