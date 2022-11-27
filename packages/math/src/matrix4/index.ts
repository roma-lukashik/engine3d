import { Vector3 } from "@math/vector3"
import { PI } from "@math/constants"
import { Quaternion } from "@math/quaternion"

export type Matrix4Tuple = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]

const identity: Matrix4Tuple = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]

export class Matrix4Array extends Float32Array {
  public constructor() {
    super(Matrix4.size)
  }
}

export class Matrix4 {
  public static readonly size = 16

  public get elements(): Readonly<Matrix4Array> {
    return this.array
  }

  private readonly array: Matrix4Array = new Matrix4Array()

  public constructor()
  public constructor(elements: Matrix4Tuple)
  public constructor(elements?: Matrix4Tuple) {
    if (elements) {
      this.set(elements)
    }
  }

  public static identity(): Matrix4 {
    return new Matrix4(identity)
  }

  public static zero(): Matrix4 {
    return new Matrix4()
  }

  public static rotationX(rad: number): Matrix4 {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    return new Matrix4([
      1, 0, 0, 0,
      0, cos, -sin, 0,
      0, sin, cos, 0,
      0, 0, 0, 1,
    ])
  }

  public static rotationY(rad: number): Matrix4 {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    return new Matrix4([
      cos, 0, sin, 0,
      0, 1, 0, 0,
      -sin, 0, cos, 0,
      0, 0, 0, 1,
    ])
  }

  public static rotationZ(rad: number): Matrix4 {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    return new Matrix4([
      cos, -sin, 0, 0,
      sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  public static translation(x: number, y: number, z: number): Matrix4 {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ])
  }

  public static scaling(x: number, y: number, z: number): Matrix4 {
    return new Matrix4([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ])
  }

  public static perspective(fovy: number, aspect: number, near: number, far: number): Matrix4 {
    const scaleY = Math.tan((PI - fovy) / 2)
    const scaleX = scaleY / aspect
    const rangeInv = 1.0 / (near - far)
    return new Matrix4([
      scaleX, 0, 0, 0,
      0, scaleY, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ])
  }

  public static orthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
  ): Matrix4 {
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    return new Matrix4([
      -2 * lr, 0, 0, 0,
      0, -2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1,
    ])
  }

  public static lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
    const z = eye.clone().subtract(target).normalize()
    const x = up.clone().cross(z).normalize()
    const y = z.clone().cross(x).normalize()
    return new Matrix4([
      x.x, x.y, x.z, 0,
      y.x, y.y, y.z, 0,
      z.x, z.y, z.z, 0,
      eye.x, eye.y, eye.z, 1,
    ])
  }

  public static compose(quat: Quaternion, translation: Vector3, scale: Vector3): Matrix4 {
    const x = quat.x, y = quat.y, z = quat.z, w = quat.w
    const sx = scale.x, sy = scale.y, sz = scale.z
    const tx = translation.x, ty = translation.y, tz = translation.z
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

    return new Matrix4([
      (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
      (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
      (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
      tx, ty, tz, 1,
    ])
  }

  public static fromArray(array: ArrayLike<number>, offset: number = 0): Matrix4 {
    const elements = Array.from({ length: Matrix4.size }, (_, i) => array[i + offset]) as Matrix4Tuple
    return new Matrix4(elements)
  }

  public set(elements: Matrix4Tuple | Matrix4Array): this {
    elements.forEach((x, i) => this.array[i] = x)
    return this
  }

  public clone(): Matrix4 {
    return new Matrix4([
      this.array[0], this.array[1], this.array[2], this.array[3],
      this.array[4], this.array[5], this.array[6], this.array[7],
      this.array[8], this.array[9], this.array[10], this.array[11],
      this.array[12], this.array[13], this.array[14], this.array[15],
    ])
  }

  public copy(m: Matrix4): this {
    return this.set(m.elements)
  }

  public det(): number {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,
    ] = this.array

    return (
      (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) -
      (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) +
      (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) +
      (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) -
      (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) +
      (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30)
    )
  }

  public invert(): this {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,
    ] = this.array

    const b00 = a00 * a11 - a01 * a10
    const b01 = a00 * a12 - a02 * a10
    const b02 = a00 * a13 - a03 * a10
    const b03 = a01 * a12 - a02 * a11
    const b04 = a01 * a13 - a03 * a11
    const b05 = a02 * a13 - a03 * a12
    const b06 = a20 * a31 - a21 * a30
    const b07 = a20 * a32 - a22 * a30
    const b08 = a20 * a33 - a23 * a30
    const b09 = a21 * a32 - a22 * a31
    const b10 = a21 * a33 - a23 * a31
    const b11 = a22 * a33 - a23 * a32

    const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
    if (!det) {
      return this.set([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ])
    }

    const invDet = 1.0 / det
    return this.set([
      (a11 * b11 - a12 * b10 + a13 * b09) * invDet,
      (a02 * b10 - a01 * b11 - a03 * b09) * invDet,
      (a31 * b05 - a32 * b04 + a33 * b03) * invDet,
      (a22 * b04 - a21 * b05 - a23 * b03) * invDet,
      (a12 * b08 - a10 * b11 - a13 * b07) * invDet,
      (a00 * b11 - a02 * b08 + a03 * b07) * invDet,
      (a32 * b02 - a30 * b05 - a33 * b01) * invDet,
      (a20 * b05 - a22 * b02 + a23 * b01) * invDet,
      (a10 * b10 - a11 * b08 + a13 * b06) * invDet,
      (a01 * b08 - a00 * b10 - a03 * b06) * invDet,
      (a30 * b04 - a31 * b02 + a33 * b00) * invDet,
      (a21 * b02 - a20 * b04 - a23 * b00) * invDet,
      (a11 * b07 - a10 * b09 - a12 * b06) * invDet,
      (a00 * b09 - a01 * b07 + a02 * b06) * invDet,
      (a31 * b01 - a30 * b03 - a32 * b00) * invDet,
      (a20 * b03 - a21 * b01 + a22 * b00) * invDet,
    ])
  }

  public transpose(): this {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,
    ] = this.array
    return this.set([
      a00, a10, a20, a30,
      a01, a11, a21, a31,
      a02, a12, a22, a32,
      a03, a13, a23, a33,
    ])
  }

  public add(m: Matrix4): this {
    const arr = m.elements
    this.array.forEach((x, i) => this.array[i] = x + arr[i])
    return this
  }

  public subtract(m: Matrix4): this {
    const arr = m.elements
    this.array.forEach((x, i) => this.array[i] = x - arr[i])
    return this
  }

  public scalar(c: number): this {
    this.array.forEach((x, i) => this.array[i] = x * c)
    return this
  }

  public multiply(m: Matrix4): this {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,
    ] = this.array
    const [
      b00, b01, b02, b03,
      b10, b11, b12, b13,
      b20, b21, b22, b23,
      b30, b31, b32, b33,
    ] = m.elements

    return this.set([
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
    ])
  }

  public rotateX(rad: number): this {
    return this.multiply(Matrix4.rotationX(rad))
  }

  public rotateY(rad: number): this {
    return this.multiply(Matrix4.rotationY(rad))
  }

  public rotateZ(rad: number): this {
    return this.multiply(Matrix4.rotationZ(rad))
  }

  public translate(x: number, y: number, z: number): this {
    return this.multiply(Matrix4.translation(x, y, z))
  }

  public translateByVector(v: Vector3): this {
    return this.translate(v.x, v.y, v.z)
  }

  public scale(x: number, y: number, z: number): this {
    return this.multiply(Matrix4.scaling(x, y, z))
  }

  public translationVector(): Vector3 {
    return new Vector3(this.array[12], this.array[13], this.array[14])
  }

  public rotationVector(): Quaternion {
    const [sx, sy, sz] = this.scalingVector().elements

    return Quaternion.fromRotationMatrix(
      new Matrix4([
        this.array[0] / sx, this.array[1] / sx, this.array[2] / sx, this.array[3],
        this.array[4] / sy, this.array[5] / sy, this.array[6] / sy, this.array[7],
        this.array[8] / sz, this.array[9] / sz, this.array[10] / sz, this.array[11],
        this.array[12], this.array[13], this.array[14], this.array[15],
      ]),
    )
  }

  public scalingVector(): Vector3 {
    const [
      m11, m12, m13, ,
      m21, m22, m23, ,
      m31, m32, m33, ,
    ] = this.array
    return new Vector3(
      Math.hypot(m11, m12, m13),
      Math.hypot(m21, m22, m23),
      Math.hypot(m31, m32, m33),
    )
  }
}
