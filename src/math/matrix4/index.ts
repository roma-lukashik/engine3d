import * as v3 from '../vector3'

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

export const zero = (): Matrix4 => [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
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

export const invert = (m: Matrix4): Matrix4 => {
  const d = det(m)
  if (d === 0) return zero()
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

export const multiply = (a: Matrix4, b: Matrix4): Matrix4 => {
  const [
    a00, a01, a02, a03,
    a10, a11, a12, a13,
    a20, a21, a22, a23,
    a30, a31, a32, a33,
  ] = a
  const [
    b00, b01, b02, b03,
    b10, b11, b12, b13,
    b20, b21, b22, b23,
    b30, b31, b32, b33,
  ] = b
  return [
    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
  ]
}

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

export const translate = (m: Matrix4, x: number, y: number, z: number) => multiply(m, translation(x, y, z))

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

export const perspective = (fovy: number, aspect: number, near: number, far: number): Matrix4 => {
  const scaleY = Math.tan((Math.PI - fovy) / 2)
  const scaleX = scaleY / aspect
  const rangeInv = 1.0 / (near - far)

  return [
    scaleX, 0, 0, 0,
    0, scaleY, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  ]
}

export const lookAt = (eye: v3.Vector3, target: v3.Vector3, up: v3.Vector3): Matrix4 => {
  const z = v3.normalize(v3.subtract(eye, target))
  const x = v3.normalize(v3.cross(up, z))
  const y = v3.normalize(v3.cross(z, x))

  return [
    ...x, 0,
    ...y, 0,
    ...z, 0,
    ...eye, 1,
  ]
}
