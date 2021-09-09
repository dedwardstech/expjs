import { Token } from "./token";

export type Nullable = null | undefined;

export interface Tree {
    left?: Tree | Nullable;
    right?: Tree | Nullable;
    value: Token | Nullable;
}