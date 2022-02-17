export type Matrix4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]

export const m00 = (m: Matrix4) => m[0]
export const m01 = (m: Matrix4) => m[1]
export const m02 = (m: Matrix4) => m[2]
export const m03 = (m: Matrix4) => m[3]

export const m10 = (m: Matrix4) => m[4]
export const m11 = (m: Matrix4) => m[5]
export const m12 = (m: Matrix4) => m[6]
export const m13 = (m: Matrix4) => m[7]

export const m20 = (m: Matrix4) => m[8]
export const m21 = (m: Matrix4) => m[9]
export const m22 = (m: Matrix4) => m[10]
export const m23 = (m: Matrix4) => m[11]

export const m30 = (m: Matrix4) => m[12]
export const m31 = (m: Matrix4) => m[13]
export const m32 = (m: Matrix4) => m[14]
export const m33 = (m: Matrix4) => m[15]

export const identity = (): Matrix4 => [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]

export const det = (m: Matrix4): number =>
  (m00(m) * m11(m) - m01(m) * m10(m)) * (m22(m) * m33(m) - m23(m) * m32(m)) -
  (m00(m) * m12(m) - m02(m) * m10(m)) * (m21(m) * m33(m) - m23(m) * m31(m)) +
  (m00(m) * m13(m) - m03(m) * m10(m)) * (m21(m) * m32(m) - m22(m) * m31(m)) +
  (m01(m) * m12(m) - m02(m) * m11(m)) * (m20(m) * m33(m) - m23(m) * m30(m)) -
  (m01(m) * m13(m) - m03(m) * m11(m)) * (m20(m) * m32(m) - m22(m) * m30(m)) +
  (m02(m) * m13(m) - m03(m) * m12(m)) * (m20(m) * m31(m) - m21(m) * m30(m))

export const transpose = (m: Matrix4): Matrix4 => [
  m00(m), m10(m), m20(m), m30(m),
  m01(m), m11(m), m21(m), m31(m),
  m02(m), m12(m), m22(m), m32(m),
  m03(m), m13(m), m23(m), m33(m),
]

export const invert = (m: Matrix4): Matrix4 | null => {
  const d = det(m)
  if (d === 0) return null
  return [
    (m11(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m12(m) * (m21(m) * m33(m) - m23(m) * m31(m)) + m13(m) * (m21(m) * m32(m) - m22(m) * m31(m))) / d,
    (m02(m) * (m21(m) * m33(m) - m23(m) * m31(m)) - m01(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m03(m) * (m21(m) * m32(m) - m22(m) * m31(m))) / d,
    (m31(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m32(m) * (m01(m) * m13(m) - m03(m) * m11(m)) + m33(m) * (m01(m) * m12(m) - m02(m) * m11(m))) / d,
    (m22(m) * (m01(m) * m13(m) - m03(m) * m11(m)) - m21(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m23(m) * (m01(m) * m12(m) - m02(m) * m11(m))) / d,
    (m12(m) * (m20(m) * m33(m) - m23(m) * m30(m)) - m10(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m13(m) * (m20(m) * m32(m) - m22(m) * m30(m))) / d,
    (m00(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m02(m) * (m20(m) * m33(m) - m23(m) * m30(m)) + m03(m) * (m20(m) * m32(m) - m22(m) * m30(m))) / d,
    (m32(m) * (m00(m) * m13(m) - m03(m) * m10(m)) - m30(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m33(m) * (m00(m) * m12(m) - m02(m) * m10(m))) / d,
    (m20(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m22(m) * (m00(m) * m13(m) - m03(m) * m10(m)) + m23(m) * (m00(m) * m12(m) - m02(m) * m10(m))) / d,
    (m10(m) * (m21(m) * m33(m) - m23(m) * m31(m)) - m11(m) * (m20(m) * m33(m) - m23(m) * m30(m)) + m13(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m01(m) * (m20(m) * m33(m) - m23(m) * m30(m)) - m00(m) * (m21(m) * m33(m) - m23(m) * m31(m)) - m03(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m30(m) * (m01(m) * m13(m) - m03(m) * m11(m)) - m31(m) * (m00(m) * m13(m) - m03(m) * m10(m)) + m33(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
    (m21(m) * (m00(m) * m13(m) - m03(m) * m10(m)) - m20(m) * (m01(m) * m13(m) - m03(m) * m11(m)) - m23(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
    (m11(m) * (m20(m) * m32(m) - m22(m) * m30(m)) - m10(m) * (m21(m) * m32(m) - m22(m) * m31(m)) - m12(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m00(m) * (m21(m) * m32(m) - m22(m) * m31(m)) - m01(m) * (m20(m) * m32(m) - m22(m) * m30(m)) + m02(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m31(m) * (m00(m) * m12(m) - m02(m) * m10(m)) - m30(m) * (m01(m) * m12(m) - m02(m) * m11(m)) - m32(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
    (m20(m) * (m01(m) * m12(m) - m02(m) * m11(m)) - m21(m) * (m00(m) * m12(m) - m02(m) * m10(m)) + m22(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
  ]
}

export const add = (a: Matrix4, b: Matrix4): Matrix4 => a.map((x, i) => x + b[i]) as Matrix4

export const subtract = (a: Matrix4, b: Matrix4): Matrix4 => a.map((x, i) => x - b[i]) as Matrix4

export const scalar = (a: Matrix4, c: number): Matrix4 => a.map((x) => x * c) as Matrix4

export const multiply = (a: Matrix4, b: Matrix4): Matrix4 => [
  m00(a) * m00(b) + m01(a) * m10(b) + m02(a) * m20(b) + m03(a) * m30(b),
  m00(a) * m01(b) + m01(a) * m11(b) + m02(a) * m21(b) + m03(a) * m31(b),
  m00(a) * m02(b) + m01(a) * m12(b) + m02(a) * m22(b) + m03(a) * m32(b),
  m00(a) * m03(b) + m01(a) * m13(b) + m02(a) * m23(b) + m03(a) * m33(b),

  m10(a) * m00(b) + m11(a) * m10(b) + m12(a) * m20(b) + m13(a) * m30(b),
  m10(a) * m01(b) + m11(a) * m11(b) + m12(a) * m21(b) + m13(a) * m31(b),
  m10(a) * m02(b) + m11(a) * m12(b) + m12(a) * m22(b) + m13(a) * m32(b),
  m10(a) * m03(b) + m11(a) * m13(b) + m12(a) * m23(b) + m13(a) * m33(b),

  m20(a) * m00(b) + m21(a) * m10(b) + m22(a) * m20(b) + m23(a) * m30(b),
  m20(a) * m01(b) + m21(a) * m11(b) + m22(a) * m21(b) + m23(a) * m31(b),
  m20(a) * m02(b) + m21(a) * m12(b) + m22(a) * m22(b) + m23(a) * m32(b),
  m20(a) * m03(b) + m21(a) * m13(b) + m22(a) * m23(b) + m23(a) * m33(b),

  m30(a) * m00(b) + m31(a) * m10(b) + m32(a) * m20(b) + m33(a) * m30(b),
  m30(a) * m01(b) + m31(a) * m11(b) + m32(a) * m21(b) + m33(a) * m31(b),
  m30(a) * m02(b) + m31(a) * m12(b) + m32(a) * m22(b) + m33(a) * m32(b),
  m30(a) * m03(b) + m31(a) * m13(b) + m32(a) * m23(b) + m33(a) * m33(b),
]

export const rotateX = (m: Matrix4, rad: number): Matrix4 => multiply(m, rotationMatrix(rad, rx))

export const rotateY = (m: Matrix4, rad: number): Matrix4 => multiply(m, rotationMatrix(rad, ry))

export const rotateZ = (m: Matrix4, rad: number): Matrix4 => multiply(m, rotationMatrix(rad, rz))

const rotationMatrix = (rad: number, fn: (sin: number, cos: number) => Matrix4) => fn(Math.sin(rad), Math.cos(rad))

const rx = (sin: number, cos: number): Matrix4 => [
  1, 0, 0, 0,
  0, cos, -sin, 0,
  0, sin, cos, 0,
  0, 0, 0, 1,
]

const ry = (sin: number, cos: number): Matrix4 => [
  cos, 0, sin, 0,
  0, 1, 0, 0,
  -sin, 0, cos, 0,
  0, 0, 0, 1,
]

const rz = (sin: number, cos: number): Matrix4 => [
  cos, -sin, 0, 0,
  sin, cos, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]

export const translate = (m: Matrix4, x: number, y: number, z: number) => multiply(translation(x, y, z), m)

const translation = (x: number, y: number, z: number): Matrix4 => [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  x, y, z, 1,
]

export const scale = (m: Matrix4, x: number, y: number, z: number) => multiply(m, scaling(x, y, z))

const scaling = (x: number, y: number, z: number): Matrix4 => [
  x, 0, 0, 0,
  0, y, 0, 0,
  0, 0, z, 0,
  0, 0, 0, 1,
]
