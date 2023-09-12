import { Vector3 } from "@math/vector3"
import { gte, lte } from "@math/operators"

export class AABB {
  public readonly min: Vector3 = new Vector3(Infinity, Infinity, Infinity)
  public readonly max: Vector3 = new Vector3(-Infinity, -Infinity, -Infinity)

  private readonly center: Vector3 = Vector3.zero()
  private readonly size: Vector3 = new Vector3(Infinity, Infinity, Infinity)

  public constructor()
  public constructor(min: Vector3, max: Vector3)
  public constructor(points: ArrayLike<number>)
  public constructor(...args: [Vector3, Vector3] | [ArrayLike<number>] | []) {
    if (args.length === 1) {
      this.calculateMinMax(args[0])
    } else if (args.length === 2) {
      this.min.copy(args[0])
      this.max.copy(args[1])
    }
  }

  public getCenter(): Vector3 {
    return this.center.copy(this.max).add(this.min).divideScalar(2)
  }

  public getSize(): Vector3 {
    return this.size.copy(this.max).subtract(this.min)
  }

  public clone(): AABB {
    return new AABB(this.min, this.max)
  }

  public collide(aabb: AABB): boolean {
    return (
      lte(this.min.x, aabb.max.x) && gte(this.max.x, aabb.min.x) &&
      lte(this.min.y, aabb.max.y) && gte(this.max.y, aabb.min.y) &&
      lte(this.min.z, aabb.max.z) && gte(this.max.z, aabb.min.z)
    )
  }

  public expandByPoint(point: Vector3): this {
    this.min.min(point)
    this.max.max(point)
    return this
  }

  public reset(): void {
    this.min.set(Infinity, Infinity, Infinity)
    this.max.set(-Infinity, -Infinity, -Infinity)
  }

  private calculateMinMax(array: ArrayLike<number>): void {
    for (let i = 0; i < array.length; i += Vector3.size) {
      const x = array[i], y = array[i + 1], z = array[i + 2]
      this.min.set(Math.min(this.min.x, x), Math.min(this.min.y, y), Math.min(this.min.z, z))
      this.max.set(Math.max(this.max.x, x), Math.max(this.max.y, y), Math.max(this.max.z, z))
    }
  }
}
