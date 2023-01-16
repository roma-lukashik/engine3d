import { EPS } from "@math/constants"

export const eq = (a: number, b: number, eps = EPS): boolean => zero(a - b, eps)

export const neq = (a: number, b: number, eps = EPS): boolean => !eq(a, b, eps)

export const gt = (a: number, b: number, eps = EPS): boolean => a - b > eps

export const gte = (a: number, b: number, eps = EPS): boolean => {
  const diff = a - b
  return diff > eps || zero(diff, eps)
}

export const lt = (a: number, b: number, eps = EPS): boolean => gt(b, a, eps)

export const lte = (a: number, b: number, eps = EPS): boolean => gte(b, a, eps)

export const zero = (a: number, eps = EPS): boolean => Math.abs(a) <= eps

export const clamp = (x: number, min: number, max: number): number => Math.max(min, Math.min(max, x))

export const sign = (x: number): number => zero(x) ? 0 : Math.sign(x)

export const ceilPowerOfTwo = (x: number): number => Math.pow(2, Math.ceil(Math.log(x) / Math.LN2))
