import {Tree} from "./tree";
import {TokenType} from "./parse/token";

type Params = { [key: string]: string };

export interface Exp {
    Eval(params: Params): boolean;
}

export const visit = (t: Tree): Exp => {
    const token = t.value;

    if (token.type === TokenType.Boolean) {
        return token.value;
    }

    if (token.type === TokenType.LogicalAnd) {
        const l = visit(t.left);
        const r = visit(t.right);

        return new And(l, r)
    }

    if (token.type === TokenType.LogicalOr) {
        const l = visit(t.left);
        const r = visit(t.right);

        return new Or(l, r);
    }

    if (token.type === TokenType.IsEqual) {

    }
    return null;
}

export class And implements Exp {
    elements: Exp[] = [];

    constructor(
        ...elems: Exp[]
    ) {
        this.elements.push(...elems)
    }

    Eval(params: Params): boolean {
        return this.elements.every((e: Exp) => e.Eval(params));
    }
}

export class Or implements Exp {
    elements: Exp[] = [];

    constructor(
        ...elems: Exp[]
    ) {
        this.elements.push(...elems);
    }

    Eval(params: Params): boolean {
        return this.elements.some((e: Exp) => e.Eval(params));
    }
}

export class Not implements Exp {
    constructor(public element: Exp) {
    }
    Eval(params: Params): boolean {
        return !this.element.Eval(params);
    }
}

export class Equal implements Exp {
    constructor(public key: string, public value: any) {
    }

    Eval(params: Params): boolean {
        const v = parseInt(params[this.key]);

        return v === this.value;
    }
}

export class NotEqual implements Exp {
    constructor(public key: string, public value: any) {
    }

    Eval(params: Params): boolean {
        return new Not(new Equal(this.key, this.value)).Eval(params);
    }
}
