import { eq } from "@math/operators"

export type Vector4Tuple = [x: number, Y: number, z: number, w: number]

export class Vector4Array extends Float32Array {
  public constructor() {
    super(Vector4.size)
  }
}

export class Vector4 {
  public static readonly size = 4

  private readonly array: Vector4Array = new Vector4Array()

  public constructor()
  public constructor(x: number, y: number, z: number, w: number)
  public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.set(x, y, z, w)
  }

  public static zero(): Vector4 {
    return new Vector4(0, 0, 0, 0)
  }

  public static one(): Vector4 {
    return new Vector4(1, 1, 1, 1)
  }

  public static fromArray(array: ArrayLike<number>, offset: number = 0): Vector4 {
    return new Vector4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3])
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

  public set(x: number): this
  public set(x: number, y: number, z: number, w: number): this
  public set(x: number, y: number = x, z: number = x, w: number = x): this {
    this.array[0] = x
    this.array[1] = y
    this.array[2] = z
    this.array[3] = w
    return this
  }

  public clone(): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w)
  }

  public add(v: Vector4): this {
    this.array[0] += v.x
    this.array[1] += v.y
    this.array[2] += v.z
    this.array[3] += v.w
    return this
  }

  public subtract(v: Vector4): this {
    this.array[0] -= v.x
    this.array[1] -= v.y
    this.array[2] -= v.z
    this.array[3] -= v.w
    return this
  }

  public multiply(c: number): this {
    this.array[0] *= c
    this.array[1] *= c
    this.array[2] *= c
    this.array[3] *= c
    return this
  }

  public divide(c: number): this {
    this.array[0] /= c
    this.array[1] /= c
    this.array[2] /= c
    this.array[3] /= c
    return this
  }

  public lengthSquared(): number {
    return this.dot(this)
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared())
  }

  public distanceSquared(v: Vector4): number {
    return this.clone().subtract(v).lengthSquared()
  }

  public distance(v: Vector4): number {
    return Math.sqrt(this.distanceSquared(v))
  }

  public normalize(): this {
    return this.divide(this.length())
  }

  public negate(): this {
    return this.multiply(-1)
  }

  public dot(v: Vector4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w
  }

  public equal(v: Vector4): boolean {
    return eq(this.x, v.x) && eq(this.y, v.y) && eq(this.z, v.z) && eq(this.w, v.w)
  }

  public toArray(): Readonly<Vector4Array> {
    return this.array
  }
}
