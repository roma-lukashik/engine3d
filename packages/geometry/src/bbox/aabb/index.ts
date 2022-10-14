import { Vector3 } from "@math/vector3"
import { gte, lte } from "@math/operators"
import { minmax } from "@math/utils"

export class AABB {
  public min: Vector3 = new Vector3()
  public max: Vector3 = new Vector3()

  public constructor(min: Vector3, max: Vector3)
  public constructor(points: ArrayLike<number>)
  public constructor(...args: [Vector3, Vector3] | [ArrayLike<number>]) {
    if (args.length === 1) {
      this.calculateMinMax(args[0])
    } else {
      this.min = args[0]
      this.max = args[1]
    }
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

  public expandByAABB(aabb: AABB): this {
    this.min.min(aabb.min)
    this.max.max(aabb.max)
    return this
  }

  public expandByPoint(point: Vector3): this {
    this.min.min(point)
    this.max.max(point)
    return this
  }

  private calculateMinMax(array: ArrayLike<number>): void {
    const [min, max] = minmax(array, Vector3.size)
    this.min.set(min[0], min[1], min[2])
    this.max.set(max[0], max[1], max[2])
  }
}
