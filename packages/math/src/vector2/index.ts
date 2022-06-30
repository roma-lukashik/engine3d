import { eq } from "@math/operators"

export type Vector2Tuple = [x: number, y: number]

export class Vector2Array extends Float32Array {
  public constructor() {
    super(Vector2.size)
  }
}

export class Vector2 {
  public static readonly size = 2

  private readonly array: Vector2Array = new Vector2Array()

  public constructor()
  public constructor(x: number, y: number)
  public constructor(x: number = 0, y: number = 0) {
    this.set(x, y)
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0)
  }

  public static one(): Vector2 {
    return new Vector2(1, 1)
  }

  public static fromArray(array: ArrayLike<number>, offset: number = 0): Vector2 {
    return new Vector2(array[offset], array[offset + 1])
  }

  public get x(): number {
    return this.array[0]
  }

  public get y(): number {
    return this.array[1]
  }

  public set(x: number): this
  public set(x: number, y: number): this
  public set(x: number, y: number = x): this {
    this.array[0] = x
    this.array[1] = y
    return this
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  public add(v: Vector2): this {
    this.array[0] += v.x
    this.array[1] += v.y
    return this
  }

  public subtract(v: Vector2): this {
    this.array[0] -= v.x
    this.array[1] -= v.y
    return this
  }

  public multiply(c: number): this {
    this.array[0] *= c
    this.array[1] *= c
    return this
  }

  public divide(c: number): this {
    this.array[0] /= c
    this.array[1] /= c
    return this
  }

  public lengthSquared(): number {
    return this.dot(this)
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared())
  }

  public distanceSquared(v: Vector2): number {
    return this.clone().subtract(v).lengthSquared()
  }

  public distance(v: Vector2): number {
    return Math.sqrt(this.distanceSquared(v))
  }

  public normalize(): this {
    return this.divide(this.length())
  }

  public negate(): this {
    return this.multiply(-1)
  }

  public perp(): this {
    return this.set(this.y, -this.x)
  }

  public angleTo(v: Vector2): number {
    return Math.atan2(this.cross(v), this.dot(v))
  }

  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y
  }

  public cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x
  }

  public equal(v: Vector2): boolean {
    return eq(this.x, v.x) && eq(this.y, v.y)
  }

  public toArray(): Readonly<Vector2Array> {
    return this.array
  }
}
