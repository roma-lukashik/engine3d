import { lt } from "@math/operators"
import type { Matrix4 } from "@math/matrix4"
import type { Vector3 } from "@math/vector3"

export type QuaternionTuple = Readonly<[x: number, y: number, z: number, w: number]>

export class QuaternionArray extends Float32Array {
  public constructor() {
    super(Quaternion.size)
  }
}

export class Quaternion {
  public static readonly size = 4

  public get elements(): Readonly<QuaternionArray> {
    return this.array
  }

  private readonly array: QuaternionArray = new QuaternionArray()

  public constructor()
  public constructor(x: number, y: number, z: number, w: number)
  public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.set(x, y, z, w)
  }

  public get x(): number {
    return this.array[0]
  }

  public get y(): number {
    return this.array[1]
  }

  public get z(): number {
    return this.array[2]
  }

  public get w(): number {
    return this.array[3]
  }

  public static identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1)
  }

  public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
    const halfTheta = angle / 2
    const sin = Math.sin(halfTheta)
    const cos = Math.cos(halfTheta)
    const vec = axis.clone().multiplyScalar(sin)
    return new Quaternion(vec.x, vec.y, vec.z, cos)
  }

  public static fromRotationMatrix(m: Matrix4): Quaternion {
    const [
      a11, a12, a13, ,
      a21, a22, a23, ,
      a31, a32, a33, ,
    ] = m.elements

    const trace = a11 + a22 + a33

    if (trace > 0) {
      const s = 2 * Math.sqrt(trace + 1.0)
      return new Quaternion(
        (a23 - a32) / s,
        (a31 - a13) / s,
        (a12 - a21) / s,
        0.25 * s,
      )
    } else if (a11 > a22 && a11 > a33) {
      const s = 2 * Math.sqrt(1.0 + a11 - a22 - a33)
      return new Quaternion(
        0.25 * s,
        (a12 + a21) / s,
        (a31 + a13) / s,
        (a23 - a32) / s,
      )
    } else if (a22 > a33) {
      const s = 2 * Math.sqrt(1.0 + a22 - a11 - a33)
      return new Quaternion(
        (a12 + a21) / s,
        0.25 * s,
        (a23 + a32) / s,
        (a31 - a13) / s,
      )
    } else {
      const s = 2 * Math.sqrt(1.0 + a33 - a11 - a22)
      return new Quaternion(
        (a31 + a13) / s,
        (a23 + a32) / s,
        0.25 * s,
        (a12 - a21) / s,
      )
    }
  }

  public static fromArray(array: ArrayLike<number>, offset: number = 0): Quaternion {
    return new Quaternion(array[offset], array[offset + 1], array[offset + 2], array[offset + 3])
  }

  public identity(): this {
    return this.set(0, 0, 0, 1)
  }

  public fromArray(array: ArrayLike<number>, offset: number = 0): this {
    return this.set(array[offset], array[offset + 1], array[offset + 2], array[offset + 3])
  }

  public set(x: number, y: number, z: number, w: number): this {
    this.array[0] = x
    this.array[1] = y
    this.array[2] = z
    this.array[3] = w
    return this
  }

  public clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w)
  }

  public copy(q: Quaternion): this {
    return this.set(q.x, q.y, q.z, q.w)
  }

  public slerp(q: Quaternion, t: number): this {
    const dot = this.dot(q)
    const dotAbs = Math.abs(dot)

    let scale0
    let scale1

    if (lt(dotAbs, 1.0)) {
      const omega = Math.acos(dotAbs)
      const sinOmega = Math.sin(omega)
      scale0 = Math.sin((1 - t) * omega) / sinOmega
      scale1 = Math.sin(t * omega) / sinOmega
    } else {
      scale0 = 1.0 - t
      scale1 = t
    }

    return this.multiplyScalar(scale0).add(quaternionTemp.copy(q).multiplyScalar(scale1 * Math.sign(dot)))
  }

  private add(q: Quaternion): this {
    this.array[0] += q.x
    this.array[1] += q.y
    this.array[2] += q.z
    this.array[3] += q.w
    return this
  }

  private multiplyScalar(c: number): this {
    this.array[0] *= c
    this.array[1] *= c
    this.array[2] *= c
    this.array[3] *= c
    return this
  }

  private dot(q: Quaternion): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w
  }
}

const quaternionTemp = new Quaternion()
