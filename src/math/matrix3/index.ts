import { Vector2, x, y } from '../vector2'

export type Matrix3 = [
  number, number, number,
  number, number, number,
  number, number, number,
]

export const m00 = (m: Matrix3) => m[0]

export const m01 = (m: Matrix3) => m[1]

export const m02 = (m: Matrix3) => m[2]

export const m10 = (m: Matrix3) => m[3]

export const m11 = (m: Matrix3) => m[4]

export const m12 = (m: Matrix3) => m[5]

export const m20 = (m: Matrix3) => m[6]

export const m21 = (m: Matrix3) => m[7]

export const m22 = (m: Matrix3) => m[8]

export const identity = (): Matrix3 => [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
]

export const det = (m: Matrix3): number =>
  m00(m) * (m22(m) * m11(m) - m12(m) * m21(m)) +
  m01(m) * (-m22(m) * m10(m) + m12(m) * m20(m)) +
  m02(m) * (m21(m) * m10(m) - m11(m) * m20(m))

export const transpose = (m: Matrix3): Matrix3 => [
  m00(m), m10(m), m20(m),
  m01(m), m11(m), m21(m),
  m02(m), m12(m), m22(m),
]

export const invert = (m: Matrix3): Matrix3 | null => {
  const d = det(m)
  if (!d) return null
  return [
    (m22(m) * m11(m) - m12(m) * m21(m)) / d,
    (-m22(m) * m01(m) + m02(m) * m21(m)) / d,
    (m12(m) * m01(m) - m02(m) * m11(m)) / d,
    (-m22(m) * m10(m) + m12(m) * m20(m)) / d,
    (m22(m) * m00(m) - m02(m) * m20(m)) / d,
    (-m12(m) * m00(m) + m02(m) * m10(m)) * d,
    (m21(m) * m10(m) - m11(m) * m20(m)) / d,
    (-m21(m) * m00(m) + m01(m) * m20(m)) / d,
    (m11(m) * m00(m) - m01(m) * m10(m)) / d,
  ]
}

export const add = (a: Matrix3, b: Matrix3): Matrix3 => a.map((x, i) => x + b[i]) as Matrix3

export const subtract = (a: Matrix3, b: Matrix3): Matrix3 => a.map((x, i) => x - b[i]) as Matrix3

export const scalar = (a: Matrix3, c: number): Matrix3 => a.map((x) => x * c) as Matrix3

export const multiply = (a: Matrix3, b: Matrix3): Matrix3 => [
  m00(a) * m00(b) + m01(a) * m10(b) + m02(a) * m20(b),
  m00(a) * m01(b) + m01(a) * m11(b) + m02(a) * m21(b),
  m00(a) * m02(b) + m01(a) * m12(b) + m02(a) * m22(b),

  m10(a) * m00(b) + m11(a) * m10(b) + m12(a) * m20(b),
  m10(a) * m01(b) + m11(a) * m11(b) + m12(a) * m21(b),
  m10(a) * m02(b) + m11(a) * m12(b) + m12(a) * m22(b),

  m20(a) * m00(b) + m21(a) * m10(b) + m22(a) * m20(b),
  m20(a) * m01(b) + m21(a) * m11(b) + m22(a) * m21(b),
  m20(a) * m02(b) + m21(a) * m12(b) + m22(a) * m22(b),
]

export const translateXY = (m: Matrix3, v: Vector2): Matrix3 => [
  m00(m), m01(m), m02(m),
  m10(m), m11(m), m12(m),

  x(v) * m00(m) + y(v) * m10(m) + m20(m),
  x(v) * m01(m) + y(v) * m11(m) + m21(m),
  x(v) * m02(m) + y(v) * m12(m) + m22(m),
]

export const rotateX = (m: Matrix3, rad: number): Matrix3 => multiply(m, rotationMatrix(rad, rx))

export const rotateY = (m: Matrix3, rad: number): Matrix3 => multiply(m, rotationMatrix(rad, ry))

export const rotateZ = (m: Matrix3, rad: number): Matrix3 => multiply(m, rotationMatrix(rad, rz))

const rotationMatrix = (rad: number, fn: (sin: number, cos: number) => Matrix3) => fn(Math.sin(rad), Math.cos(rad))

const rx = (sin: number, cos: number): Matrix3 => [
  1, 0, 0,
  0, cos, -sin,
  0, sin, cos,
]

const ry = (sin: number, cos: number): Matrix3 => [
  cos, 0, sin,
  0, 1, 0,
  -sin, 0, cos,
]

const rz = (sin: number, cos: number): Matrix3 => [
  cos, -sin, 0,
  sin, cos, 0,
  0, 0, 1,
]
