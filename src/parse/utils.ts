export const isWhitespace = (s: string): boolean => {
    return s === ' ' || s === '\t' || s === '\n' || s === '\r'
}

export const isNumeric = (s: string): boolean => {
    return /^[0-9]$/.test(s);
}

export const isAlphanumeric = (s: string): boolean => {
    return /^[_a-zA-Z0-9.]$/.test(s);
}

export const isOperator = (s: string): boolean => {
    return s === '=' || s === '!' || s === '>' || s === '<' || s === '&' || s === '|'
}
