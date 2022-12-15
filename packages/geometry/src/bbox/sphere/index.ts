import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"
import { lte } from "@math/operators"
import { EPS_SQRT } from "@math/constants"

export class Sphere {
  public center: Vector3 = Vector3.zero()
  public radius: number = 0

  public constructor(center: Vector3, radius: number)
  public constructor(points: ArrayLike<number>)
  public constructor(...args: [Vector3, number] | [ArrayLike<number>]) {
    if (args.length === 1) {
      this.fromPoints(args[0])
    } else {
      this.center.copy(args[0])
      this.radius = args[1]
    }
  }

  public clone(): Sphere {
    return new Sphere(this.center, this.radius)
  }

  public intersectSphere(sphere: Sphere): boolean {
    const sum = this.radius + sphere.radius
    return lte(this.center.distanceSquared(sphere.center), sum * sum, EPS_SQRT)
  }

  private fromPoints(points: ArrayLike<number>): void {
    const aabb = new AABB(points)
    this.center.copy(aabb.max).add(aabb.min).divideScalar(2)
    this.radius = this.center.distance(aabb.max)
  }
}
