import { Nullable, Tree } from "./ast";
import { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

const newTree = (): Tree => ({ left: null, right: null, value: null });

export const parse = (l: Lexer) => {
    let tree = { left: null, right: null, value: null };
    let node: Tree | undefined = tree;

    const stack: Tree[] = [];
    stack.push(tree);

    const tokens = l.token();

    for (const token of tokens) {
        switch (token.type) {
            case TokenType.LeftParen:
                if (!!node) {
                    node.left = newTree();
                    stack.push(node);
                    node = node.left;
                }

                break;
            case TokenType.RightParen:
                node = stack.pop();

                break;
            case TokenType.LogicalAnd:
            case TokenType.LogicalOr:
            case TokenType.IsEqual:
            case TokenType.IsNotEqual:
            case TokenType.IsGreater:
            case TokenType.IsGreaterOrEqual:
            case TokenType.IsSmaller:
            case TokenType.IsSmallerOrEqual:
                if (!!node) {
                    node.value = token;
                    node.right = newTree();
                    stack.push(node);
                    node = node.right;
                }

                break;
            case TokenType.Identifier:
            case TokenType.String:
            case TokenType.Number:
            case TokenType.Boolean:
                if (!!node) {
                    node.value = token;
                }

                node = stack.pop();

                break;
            case TokenType.EOF:
                break;
            case TokenType.Err:
                throw new Error(token.value);
            default:
                throw new Error(`unknown token ${token.type}`);
        }
    }

    return tree;
};