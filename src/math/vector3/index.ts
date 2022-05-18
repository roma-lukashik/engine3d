import { eq } from '../operators'
import { Vector3 } from '../types'

export const vector3 = (x: number, y: number, z: number): Vector3 => [x, y, z]

export const copy = (v: Vector3): Vector3 => [...v]

export const x = (v: Vector3) => v[0]

export const y = (v: Vector3) => v[1]

export const z = (v: Vector3) => v[2]

export const zero = () => vector3(0, 0, 0)

export const one = () => vector3(1, 1, 1)

export const add = (a: Vector3, b: Vector3) => vector3(x(a) + x(b), y(a) + y(b), z(a) + z(b))

export const subtract = (a: Vector3, b: Vector3) => vector3(x(a) - x(b), y(a) - y(b), z(a) - z(b))

export const multiply = (v: Vector3, c: number) => vector3(x(v) * c, y(v) * c, z(v) * c)

export const divide = (v: Vector3, c: number) => vector3(x(v) / c, y(v) / c, z(v) / c)

export const lengthSquared = (v: Vector3) => (x(v) ** 2) + (y(v) ** 2) + (z(v) ** 2)

export const length = (v: Vector3) => Math.sqrt(lengthSquared(v))

export const distanceSquared = (a: Vector3, b: Vector3) => (x(a) - x(b)) ** 2 + (y(a) - y(b)) ** 2 + (z(a) - z(b)) ** 2

export const distance = (a: Vector3, b: Vector3) => Math.sqrt(distanceSquared(a, b))

export const normalize = (v: Vector3) => divide(v, length(v))

export const negate = (v: Vector3) => vector3(-x(v), -y(v), -z(v))

export const dot = (a: Vector3, b: Vector3) => x(a) * x(b) + y(a) * y(b) + z(a) * z(b)

export const cross = (a: Vector3, b: Vector3) => vector3(
  y(a) * z(b) - z(a) * y(b),
  z(a) * x(b) - x(a) * z(b),
  x(a) * y(b) - y(a) * x(b),
)

export const equal = (a: Vector3, b: Vector3) => eq(x(a), x(b)) && eq(y(a), y(b)) && eq(z(a), z(b))

export const lerp = (a: Vector3, b: Vector3, t: number) => vector3(
  a[0] + t * (b[0] - a[0]),
  a[1] + t * (b[1] - a[1]),
  a[2] + t * (b[2] - a[2]),
)
