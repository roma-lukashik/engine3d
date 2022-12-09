import { eq, zero } from "@math/operators"
import type { Matrix4 } from "@math/matrix4"
import type { Quaternion } from "@math/quaternion"

export type Vector3Tuple = [x: number, y: number, z: number]

export class Vector3Array extends Float32Array {
  public constructor() {
    super(Vector3.size)
  }
}

export class Vector3 {
  public static readonly size = 3

  public get elements(): Readonly<Vector3Array> {
    return this.array
  }

  private readonly array: Vector3Array = new Vector3Array()

  public constructor()
  public constructor(x: number, y: number, z: number)
  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.set(x, y, z)
  }

  public static zero(): Vector3 {
    return new Vector3(0, 0, 0)
  }

  public static one(): Vector3 {
    return new Vector3(1, 1, 1)
  }

  public static fromArray(array: ArrayLike<number>, offset: number = 0): Vector3 {
    return new Vector3(array[offset], array[offset + 1], array[offset + 2])
  }

  public get x(): number {
    return this.array[0]
  }

  public set x(x: number) {
    this.array[0] = x
  }

  public get y(): number {
    return this.array[1]
  }

  public set y(y: number) {
    this.array[1] = y
  }

  public get z(): number {
    return this.array[2]
  }

  public set z(z: number) {
    this.array[2] = z
  }

  public set(x: number): this
  public set(x: number, y: number, z: number): this
  public set(x: number, y: number = x, z: number = x): this {
    this.array[0] = x
    this.array[1] = y
    this.array[2] = z
    return this
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  public copy(v: Vector3): this {
    return this.set(v.x, v.y, v.z)
  }

  public add(v: Vector3): this {
    this.array[0] += v.x
    this.array[1] += v.y
    this.array[2] += v.z
    return this
  }

  public subtract(v: Vector3): this {
    this.array[0] -= v.x
    this.array[1] -= v.y
    this.array[2] -= v.z
    return this
  }

  public multiply(v: Vector3): this {
    this.array[0] *= v.x
    this.array[1] *= v.y
    this.array[2] *= v.z
    return this
  }

  public divide(v: Vector3): this {
    this.array[0] /= v.x
    this.array[1] /= v.y
    this.array[2] /= v.z
    return this
  }

  public multiplyScalar(c: number): this {
    this.array[0] *= c
    this.array[1] *= c
    this.array[2] *= c
    return this
  }

  public divideScalar(c: number): this {
    this.array[0] /= c
    this.array[1] /= c
    this.array[2] /= c
    return this
  }

  public lengthSquared(): number {
    return this.dot(this)
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared())
  }

  public distanceSquared(v: Vector3): number {
    return this.clone().subtract(v).lengthSquared()
  }

  public distance(v: Vector3): number {
    return Math.sqrt(this.distanceSquared(v))
  }

  public normalize(): this {
    const length = this.length()
    return zero(length) ? this.set(0) : this.divideScalar(length)
  }

  public negate(): this {
    return this.multiplyScalar(-1)
  }

  public abs(): this {
    this.x = Math.abs(this.x)
    this.y = Math.abs(this.y)
    this.z = Math.abs(this.z)
    return this
  }

  public reflect(v: Vector3): this {
    const n = v.clone().normalize()
    return this.subtract(n.multiplyScalar(2 * this.dot(n)))
  }

  public dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  public cross(v: Vector3): this {
    const x = this.y * v.z - this.z * v.y
    const y = this.z * v.x - this.x * v.z
    const z = this.x * v.y - this.y * v.x
    return this.set(x, y, z)
  }

  public lerp(v: Vector3, t: number): this {
    return this.add(v.clone().subtract(this).multiplyScalar(t))
  }

  public transformMatrix4(matrix: Matrix4): this {
    const x = this.x, y = this.y, z = this.z
    const m = matrix.elements
    const w = (m[3] * x + m[7] * y + m[11] * z + m[15]) || 1
    return this.set(
      (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
      (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
      (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
    )
  }

  public rotateByQuaternion(q: Quaternion): this {
    const v = new Vector3(q.x, q.y, q.z)
    const u = v.clone().cross(this)
    const uu = v.cross(u).multiplyScalar(2)
    return this.add(u.multiplyScalar(q.w * 2)).add(uu)
  }

  // TODO tests
  public min(v: Vector3): this {
    return this.set(
      Math.min(this.x, v.x),
      Math.min(this.y, v.y),
      Math.min(this.z, v.z),
    )
  }

  public max(v: Vector3): this {
    return this.set(
      Math.max(this.x, v.x),
      Math.max(this.y, v.y),
      Math.max(this.z, v.z),
    )
  }

  public sign(): this {
    return this.set(Math.sign(this.x), Math.sign(this.y), Math.sign(this.z))
  }

  public equal(v: Vector3): boolean {
    return eq(this.x, v.x) && eq(this.y, v.y) && eq(this.z, v.z)
  }
}
