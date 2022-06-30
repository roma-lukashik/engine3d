import { Vector3 } from "@math/vector3"
import { gte, lte } from "@math/operators"

export class AABB {
  public min: Vector3 = new Vector3()
  public max: Vector3 = new Vector3()
  public center: Vector3 = new Vector3()

  public constructor(min: Vector3, max: Vector3)
  public constructor(points: ArrayLike<number>)
  public constructor(...args: [Vector3, Vector3] | [ArrayLike<number>]) {
    if (args.length === 1) {
      this.calculate(args[0])
    } else {
      this.min = args[0]
      this.max = args[1]
      this.calculateCenter()
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

  private calculate(array: ArrayLike<number>): void {
    this.min.set(Infinity)
    this.max.set(-Infinity)

    for (let i = 0; i < array.length; i += Vector3.size) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      this.min.x = Math.min(x, this.min.x)
      this.min.y = Math.min(y, this.min.y)
      this.min.z = Math.min(z, this.min.z)

      this.max.x = Math.max(x, this.max.x)
      this.max.y = Math.max(y, this.max.y)
      this.max.z = Math.max(z, this.max.z)
    }

    this.calculateCenter()
  }

  private calculateCenter(): void {
    this.center = this.min.clone().add(this.max).divide(2)
  }
}
