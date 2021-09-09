export const deepEqual = <T>(a: T, b: T): boolean => {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }

    for (const key in a) {
        if (a[key] instanceof Object && !deepEqual(a[key], b[key])) {
            return false;
        }

        if (!(a[key] instanceof Object) && a[key] !== b[key]) {
            return false;
        }
    }

    return true;
}