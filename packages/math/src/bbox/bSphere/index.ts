import { Vector3 } from "@math/vector3"
import { AABB } from "@math/bbox/aabb"
import { lte } from "@math/operators"

export class BSphere {
  public center: Vector3
  public radius: number

  public constructor(center: Vector3, radius: number)
  public constructor(points: ArrayLike<number>)
  public constructor(...args: [Vector3, number] | [ArrayLike<number>]) {
    if (args.length === 1) {
      this.fromPoints(args[0])
    } else {
      this.center = args[0]
      this.radius = args[1]
    }
  }

  public clone(): BSphere {
    return new BSphere(this.center, this.radius)
  }

  public intersectBSphere(bSphere: BSphere): boolean {
    return lte(this.center.distanceSquared(bSphere.center), this.radius * this.radius + bSphere.radius * bSphere.radius)
  }

  private fromPoints(points: ArrayLike<number>): void {
    const aabb = new AABB(points)
    this.center = aabb.center
    this.radius = aabb.center.distance(aabb.max)
  }
}
