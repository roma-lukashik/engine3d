const eps = 1e-3

export const eq = (a: number, b: number): boolean => Math.abs(a - b) <= eps

export const neq = (a: number, b: number): boolean => !eq(a, b)

export const gt = (a: number, b: number): boolean => a - b > eps

export const gte = (a: number, b: number): boolean => gt(a, b) || eq(a, b)

export const lt = (a: number, b: number): boolean => b - a > eps

export const lte = (a: number, b: number): boolean => lt(a, b) || eq(a, b)
