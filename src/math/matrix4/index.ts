import * as v3 from '../vector3'
import { Vector3 } from '../vector3'
import { Quaternion } from '../quaternion'

export type Matrix4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]

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

export const det = (m: Matrix4): number => {
  const [
    a00, a01, a02, a03,
    a10, a11, a12, a13,
    a20, a21, a22, a23,
    a30, a31, a32, a33,
  ] = m
  return (
    (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) -
    (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) +
    (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) +
    (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) -
    (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) +
    (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30)
  )
}

export const transpose = (m: Matrix4): Matrix4 => {
  const [
    a00, a01, a02, a03,
    a10, a11, a12, a13,
    a20, a21, a22, a23,
    a30, a31, a32, a33,
  ] = m
  return [
    a00, a10, a20, a30,
    a01, a11, a21, a31,
    a02, a12, a22, a32,
    a03, a13, a23, a33,
  ]
}

export const invert = (m: Matrix4): Matrix4 => {
  const d = det(m)
  if (d === 0) return zero()
  const [
    a00, a01, a02, a03,
    a10, a11, a12, a13,
    a20, a21, a22, a23,
    a30, a31, a32, a33,
  ] = m
  return [
    (a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31)) / d,
    (a02 * (a21 * a33 - a23 * a31) - a01 * (a22 * a33 - a23 * a32) - a03 * (a21 * a32 - a22 * a31)) / d,
    (a31 * (a02 * a13 - a03 * a12) - a32 * (a01 * a13 - a03 * a11) + a33 * (a01 * a12 - a02 * a11)) / d,
    (a22 * (a01 * a13 - a03 * a11) - a21 * (a02 * a13 - a03 * a12) - a23 * (a01 * a12 - a02 * a11)) / d,
    (a12 * (a20 * a33 - a23 * a30) - a10 * (a22 * a33 - a23 * a32) - a13 * (a20 * a32 - a22 * a30)) / d,
    (a00 * (a22 * a33 - a23 * a32) - a02 * (a20 * a33 - a23 * a30) + a03 * (a20 * a32 - a22 * a30)) / d,
    (a32 * (a00 * a13 - a03 * a10) - a30 * (a02 * a13 - a03 * a12) - a33 * (a00 * a12 - a02 * a10)) / d,
    (a20 * (a02 * a13 - a03 * a12) - a22 * (a00 * a13 - a03 * a10) + a23 * (a00 * a12 - a02 * a10)) / d,
    (a10 * (a21 * a33 - a23 * a31) - a11 * (a20 * a33 - a23 * a30) + a13 * (a20 * a31 - a21 * a30)) / d,
    (a01 * (a20 * a33 - a23 * a30) - a00 * (a21 * a33 - a23 * a31) - a03 * (a20 * a31 - a21 * a30)) / d,
    (a30 * (a01 * a13 - a03 * a11) - a31 * (a00 * a13 - a03 * a10) + a33 * (a00 * a11 - a01 * a10)) / d,
    (a21 * (a00 * a13 - a03 * a10) - a20 * (a01 * a13 - a03 * a11) - a23 * (a00 * a11 - a01 * a10)) / d,
    (a11 * (a20 * a32 - a22 * a30) - a10 * (a21 * a32 - a22 * a31) - a12 * (a20 * a31 - a21 * a30)) / d,
    (a00 * (a21 * a32 - a22 * a31) - a01 * (a20 * a32 - a22 * a30) + a02 * (a20 * a31 - a21 * a30)) / d,
    (a31 * (a00 * a12 - a02 * a10) - a30 * (a01 * a12 - a02 * a11) - a32 * (a00 * a11 - a01 * a10)) / d,
    (a20 * (a01 * a12 - a02 * a11) - a21 * (a00 * a12 - a02 * a10) + a22 * (a00 * a11 - a01 * a10)) / d,
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

export const rotateX = (m: Matrix4, rad: number): Matrix4 => multiply(m, rotationMatrix(rad, rotationX))

export const rotateY = (m: Matrix4, rad: number): Matrix4 => multiply(m, rotationMatrix(rad, rotationY))

export const rotateZ = (m: Matrix4, rad: number): Matrix4 => multiply(m, rotationMatrix(rad, rotationZ))

const rotationMatrix = (rad: number, fn: (sin: number, cos: number) => Matrix4) => fn(Math.sin(rad), Math.cos(rad))

const rotationX = (sin: number, cos: number): Matrix4 => [
  1, 0, 0, 0,
  0, cos, -sin, 0,
  0, sin, cos, 0,
  0, 0, 0, 1,
]

const rotationY = (sin: number, cos: number): Matrix4 => [
  cos, 0, sin, 0,
  0, 1, 0, 0,
  -sin, 0, cos, 0,
  0, 0, 0, 1,
]

const rotationZ = (sin: number, cos: number): Matrix4 => [
  cos, -sin, 0, 0,
  sin, cos, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]

export const translate = (m: Matrix4, x: number, y: number, z: number) => multiply(m, translation(x, y, z))

export const translation = (x: number, y: number, z: number): Matrix4 => [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  x, y, z, 1,
]

export const scale = (m: Matrix4, x: number, y: number, z: number) => multiply(m, scaling(x, y, z))

export const scaling = (x: number, y: number, z: number): Matrix4 => [
  x, 0, 0, 0,
  0, y, 0, 0,
  0, 0, z, 0,
  0, 0, 0, 1,
]

export const compose = (quat: Quaternion, translation: Vector3, scale: Vector3): Matrix4 => {
  const [x, y, z, w] = quat
  const x2 = x + x
  const y2 = y + y
  const z2 = z + z
  const xx = x * x2
  const xy = x * y2
  const xz = x * z2
  const yy = y * y2
  const yz = y * z2
  const zz = z * z2
  const wx = w * x2
  const wy = w * y2
  const wz = w * z2
  const [sx, sy, sz] = scale

  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    translation[0], translation[1], translation[2], 1,
  ]
}

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

export const orthographic = (left: number, right: number, top: number, bottom: number, near: number, far: number): Matrix4 => {
  const lr = 1 / (left - right)
  const bt = 1 / (bottom - top)
  const nf = 1 / (near - far)
  return [
    -2 * lr, 0, 0, 0,
    0, -2 * bt, 0, 0,
    0, 0, 2 * nf, 0,
    (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1,
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
