import { Vector3 } from "@math/vector3"
import { PI } from "@math/constants"
import { Quaternion } from "@math/quaternion"

export type Matrix4Tuple = Readonly<[
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]>

const identity: Matrix4Tuple = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]

const zero: Matrix4Tuple = [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
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
    return new Matrix4().identity()
  }

  public static zero(): Matrix4 {
    return new Matrix4().zero()
  }

  public static fromArray(array: ArrayLike<number>, offset: number = 0): Matrix4 {
    return new Matrix4().fromArray(array, offset)
  }

  public static rotationX(rad: number): Matrix4 {
    return new Matrix4().rotationX(rad)
  }

  public static rotationY(rad: number): Matrix4 {
    return new Matrix4().rotationY(rad)
  }

  public static rotationZ(rad: number): Matrix4 {
    return new Matrix4().rotationZ(rad)
  }

  public static translation(x: number, y: number, z: number): Matrix4 {
    return new Matrix4().translation(x, y, z)
  }

  public static scaling(x: number, y: number, z: number): Matrix4 {
    return new Matrix4().scaling(x, y, z)
  }

  public static perspective(fovy: number, aspect: number, near: number, far: number): Matrix4 {
    return new Matrix4().perspective(fovy, aspect, near, far)
  }

  public static orthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
  ): Matrix4 {
    return new Matrix4().orthographic(left, right, top, bottom, near, far)
  }

  public static lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
    return new Matrix4().lookAt(eye, target, up)
  }

  public static compose(quaternion: Quaternion, translation: Vector3, scale: Vector3): Matrix4 {
    return new Matrix4().compose(quaternion, translation, scale)
  }

  public set(elements: Matrix4Tuple | Matrix4Array): this {
    this.array.set(elements)
    return this
  }

  public identity(): this {
    return this.set(identity)
  }

  public zero(): this {
    return this.set(zero)
  }

  public rotationX(rad: number): this {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    this.identity()
    this.array[5] = cos
    this.array[6] = -sin
    this.array[9] = sin
    this.array[10] = cos
    return this
  }

  public rotationY(rad: number): this {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    this.identity()
    this.array[0] = cos
    this.array[2] = sin
    this.array[8] = -sin
    this.array[10] = cos
    return this
  }

  public rotationZ(rad: number): this {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    this.identity()
    this.array[0] = cos
    this.array[1] = -sin
    this.array[4] = sin
    this.array[5] = cos
    return this
  }

  public translation(x: number, y: number, z: number): this {
    this.identity()
    this.array[12] = x
    this.array[13] = y
    this.array[14] = z
    return this
  }

  public scaling(x: number, y: number, z: number): this {
    this.identity()
    this.array[0] = x
    this.array[5] = y
    this.array[10] = z
    return this
  }

  public perspective(fovy: number, aspect: number, near: number, far: number): this {
    const scaleY = Math.tan((PI - fovy) / 2)
    const scaleX = scaleY / aspect
    const rangeInv = 1.0 / (near - far)
    this.zero()
    this.array[0] = scaleX
    this.array[5] = scaleY
    this.array[10] = (near + far) * rangeInv
    this.array[11] = -1
    this.array[14] = near * far * rangeInv * 2
    return this
  }

  public orthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
  ): this {
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    this.identity()
    this.array[0] = -2 * lr
    this.array[5] = -2 * bt
    this.array[10] = 2 * nf
    this.array[12] = (left + right) * lr
    this.array[13] = (top + bottom) * bt
    this.array[14] = (far + near) * nf
    return this
  }

  public lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
    const z = eye.clone().subtract(target).normalize()
    const x = up.clone().cross(z).normalize()
    const y = z.clone().cross(x).normalize()
    this.identity()
    this.elements.set(x.elements)
    this.elements.set(y.elements, 4)
    this.elements.set(z.elements, 8)
    this.elements.set(eye.elements, 12)
    return this
  }

  public compose(quaternion: Quaternion, translation: Vector3, scale: Vector3): this {
    const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w
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

    this.identity()
    this.array[0] = (1 - (yy + zz)) * scale.x
    this.array[1] = (xy + wz) * scale.x
    this.array[2] = (xz - wy) * scale.x
    this.array[4] = (xy - wz) * scale.y
    this.array[5] = (1 - (xx + zz)) * scale.y
    this.array[6] = (yz + wx) * scale.y
    this.array[8] = (xz + wy) * scale.z
    this.array[9] = (yz - wx) * scale.z
    this.array[10] = (1 - (xx + yy)) * scale.z
    this.array.set(translation.elements, 12)
    return this
  }

  public fromArray(array: ArrayLike<number>, offset: number = 0): this {
    this.array.forEach((_, i) => this.array[i] = array[i + offset])
    return this
  }

  public clone(): Matrix4 {
    return new Matrix4().set(this.array)
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
      return this.set(zero)
    }
    const invDet = 1.0 / det
    this.array[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet
    this.array[1] = (a02 * b10 - a01 * b11 - a03 * b09) * invDet
    this.array[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet
    this.array[3] = (a22 * b04 - a21 * b05 - a23 * b03) * invDet
    this.array[4] = (a12 * b08 - a10 * b11 - a13 * b07) * invDet
    this.array[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet
    this.array[6] = (a32 * b02 - a30 * b05 - a33 * b01) * invDet
    this.array[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet
    this.array[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet
    this.array[9] = (a01 * b08 - a00 * b10 - a03 * b06) * invDet
    this.array[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet
    this.array[11] = (a21 * b02 - a20 * b04 - a23 * b00) * invDet
    this.array[12] = (a11 * b07 - a10 * b09 - a12 * b06) * invDet
    this.array[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet
    this.array[14] = (a31 * b01 - a30 * b03 - a32 * b00) * invDet
    this.array[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet
    return this
  }

  public transpose(): this {
    const [
      , a01, a02, a03,
      a10, , a12, a13,
      a20, a21, , a23,
      a30, a31, a32,
    ] = this.array
    this.array[1] = a10
    this.array[2] = a20
    this.array[3] = a30
    this.array[4] = a01
    this.array[6] = a21
    this.array[7] = a31
    this.array[8] = a02
    this.array[9] = a12
    this.array[11] = a32
    this.array[12] = a03
    this.array[13] = a13
    this.array[14] = a23
    return this
  }

  public add(m: Matrix4): this {
    this.array.forEach((x, i) => this.array[i] = x + m.elements[i])
    return this
  }

  public subtract(m: Matrix4): this {
    this.array.forEach((x, i) => this.array[i] = x - m.elements[i])
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
    this.array[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    this.array[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    this.array[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    this.array[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    this.array[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    this.array[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    this.array[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    this.array[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    this.array[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    this.array[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    this.array[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    this.array[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    this.array[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    this.array[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    this.array[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    this.array[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
    return this
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
    this.array[12] += x * this.array[0] + y * this.array[4] + z * this.array[8]
    this.array[13] += x * this.array[1] + y * this.array[5] + z * this.array[9]
    this.array[14] += x * this.array[2] + y * this.array[6] + z * this.array[10]
    this.array[15] += x * this.array[3] + y * this.array[7] + z * this.array[11]
    return this
  }

  public translateByVector(v: Vector3): this {
    return this.translate(v.x, v.y, v.z)
  }

  public scale(x: number, y: number, z: number): this {
    this.array[0] *= x
    this.array[1] *= x
    this.array[2] *= x
    this.array[3] *= x

    this.array[4] *= y
    this.array[5] *= y
    this.array[6] *= y
    this.array[7] *= y

    this.array[8] *= z
    this.array[9] *= z
    this.array[10] *= z
    this.array[11] *= z
    return this
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
