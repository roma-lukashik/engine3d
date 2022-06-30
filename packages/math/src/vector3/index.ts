import { eq } from "@math/operators"

export type Vector3Tuple = [x: number, y: number, z: number]

export class Vector3Array extends Float32Array {
  public constructor() {
    super(Vector3.size)
  }
}

export class Vector3 {
  public static readonly size = 3

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

  public multiply(c: number): this {
    this.array[0] *= c
    this.array[1] *= c
    this.array[2] *= c
    return this
  }

  public divide(c: number): this {
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
    return this.divide(this.length())
  }

  public negate(): this {
    return this.multiply(-1)
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
    return this.add(v.clone().subtract(this).multiply(t))
  }

  public equal(v: Vector3): boolean {
    return eq(this.x, v.x) && eq(this.y, v.y) && eq(this.z, v.z)
  }

  public toArray(): Readonly<Vector3Array> {
    return this.array
  }
}
