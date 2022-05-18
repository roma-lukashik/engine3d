import { Vector4 } from '../types'

export const vector4 = (x: number, y: number, z: number, w: number): Vector4 => [x, y, z, w]

export const zero = () => vector4(0, 0, 0, 0)

export const one = () => vector4(1, 1, 1, 1)

export const divide = (v: Vector4, c: number): Vector4 => vector4(v[0] / c, v[1] / c, v[2] / c, v[3] / c)

export const lengthSquared = (v: Vector4): number => (v[0] ** 2) + (v[1] ** 2) + (v[2] ** 2) + (v[3] ** 2)

export const length = (v: Vector4): number => Math.sqrt(lengthSquared(v))

export const normalize = (v: Vector4): Vector4 => divide(v, length(v))
