export type Matrix3 = [
  number, number, number,
  number, number, number,
  number, number, number,
]

export const identity = (): Matrix3 => [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
]

export const zero = (): Matrix3 => [
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
]

export const det = (m: Matrix3): number => {
  const [
    a00, a01, a02,
    a10, a11, a12,
    a20, a21, a22,
  ] = m
  return (
    a00 * (a22 * a11 - a12 * a21) +
    a01 * (a12 * a20 - a22 * a10) +
    a02 * (a21 * a10 - a11 * a20)
  )
}

export const transpose = (m: Matrix3): Matrix3 => {
  const [
    a00, a01, a02,
    a10, a11, a12,
    a20, a21, a22,
  ] = m
  return [
    a00, a10, a20,
    a01, a11, a21,
    a02, a12, a22,
  ]
}

export const invert = (m: Matrix3): Matrix3 => {
  const d = det(m)
  if (d === 0) return zero()
  const [
    a00, a01, a02,
    a10, a11, a12,
    a20, a21, a22,
  ] = m
  return [
    (a22 * a11 - a12 * a21) / d,
    (a02 * a21 - a22 * a01) / d,
    (a12 * a01 - a02 * a11) / d,
    (a12 * a20 - a22 * a10) / d,
    (a22 * a00 - a02 * a20) / d,
    (a02 * a10 - a12 * a00) / d,
    (a21 * a10 - a11 * a20) / d,
    (a01 * a20 - a21 * a00) / d,
    (a11 * a00 - a01 * a10) / d,
  ]
}

export const add = (a: Matrix3, b: Matrix3): Matrix3 => a.map((x, i) => x + b[i]) as Matrix3

export const subtract = (a: Matrix3, b: Matrix3): Matrix3 => a.map((x, i) => x - b[i]) as Matrix3

export const scalar = (a: Matrix3, c: number): Matrix3 => a.map((x) => x * c) as Matrix3

export const multiply = (a: Matrix3, b: Matrix3): Matrix3 => {
  const [
    a00, a01, a02,
    a10, a11, a12,
    a20, a21, a22,
  ] = a
  const [
    b00, b01, b02,
    b10, b11, b12,
    b20, b21, b22,
  ] = b
  return [
    a00 * b00 + a01 * b10 + a02 * b20,
    a00 * b01 + a01 * b11 + a02 * b21,
    a00 * b02 + a01 * b12 + a02 * b22,

    a10 * b00 + a11 * b10 + a12 * b20,
    a10 * b01 + a11 * b11 + a12 * b21,
    a10 * b02 + a11 * b12 + a12 * b22,

    a20 * b00 + a21 * b10 + a22 * b20,
    a20 * b01 + a21 * b11 + a22 * b21,
    a20 * b02 + a21 * b12 + a22 * b22,
  ]
}

export const translate = (m: Matrix3, x: number, y: number): Matrix3 => multiply(m, translation(x, y))

const translation = (x: number, y: number): Matrix3 => [
  1, 0, 0,
  0, 1, 0,
  x, y, 1,
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
