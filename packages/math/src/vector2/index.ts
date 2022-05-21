import { eq } from "@math/operators"
import { Vector2 } from "@math/types"

export const vector2 = (x: number, y: number): Vector2 => [x, y]

export const copy = (v: Vector2): Vector2 => [...v]

export const x = (v: Vector2) => v[0]

export const y = (v: Vector2) => v[1]

export const zero = () => vector2(0, 0)

export const add = (a: Vector2, b: Vector2) => vector2(x(a) + x(b), y(a) + y(b))

export const subtract = (a: Vector2, b: Vector2) => vector2(x(a) - x(b), y(a) - y(b))

export const multiply = (v: Vector2, c: number) => vector2(x(v) * c, y(v) * c)

export const divide = (v: Vector2, c: number) => vector2(x(v) / c, y(v) / c)

export const lengthSquared = (v: Vector2) => (x(v) ** 2) + (y(v) ** 2)

export const length = (v: Vector2) => Math.sqrt(lengthSquared(v))

export const distanceSquared = (a: Vector2, b: Vector2) => (x(a) - x(b)) ** 2 + (y(a) - y(b)) ** 2

export const distance = (a: Vector2, b: Vector2) => Math.sqrt(distanceSquared(a, b))

export const normalize = (v: Vector2) => divide(v, length(v))

export const dot = (a: Vector2, b: Vector2) => x(a) * x(b) + y(a) * y(b)

export const cross = (a: Vector2, b: Vector2) => x(a) * y(b) - y(a) * x(b)

export const perp = (v: Vector2) => vector2(y(v), -x(v))

export const negate = (v: Vector2) => vector2(-x(v), -y(v))

export const angleTo = (a: Vector2, b: Vector2) => Math.atan2(cross(a, b), dot(a, b))

export const equal = (a: Vector2, b: Vector2) => eq(x(a), x(b)) && eq(y(a), y(b))
