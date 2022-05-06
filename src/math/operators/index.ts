import { EPS } from '../constants'

export const eq = (a: number, b: number): boolean => Math.abs(a - b) <= EPS

export const neq = (a: number, b: number): boolean => !eq(a, b)

export const gt = (a: number, b: number): boolean => a - b > EPS

export const gte = (a: number, b: number): boolean => gt(a, b) || eq(a, b)

export const lt = (a: number, b: number): boolean => b - a > EPS

export const lte = (a: number, b: number): boolean => lt(a, b) || eq(a, b)

export const clamp = (x: number, min: number, max: number): number => Math.max(min, Math.min(max, x))
