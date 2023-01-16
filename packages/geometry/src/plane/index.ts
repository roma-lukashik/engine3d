import { Vector3 } from "@math/vector3"
import { zero, sign } from "@math/operators"

export class Plane {
  public readonly normal: Vector3 = Vector3.zero()
  public constant: number = 0

  public constructor(x: number, y: number, z: number, constant: number)
  public constructor(normal: Vector3, constant: number)
  public constructor(...args: [number, number, number, number] | [Vector3, number]) {
    if (args.length === 2) {
      this.set(args[0], args[1])
    } else {
      this.setComponents(args[0], args[1], args[2], args[3])
    }
  }

  public copy(): Plane {
    return new Plane(this.normal, this.constant)
  }

  public set(normal: Vector3, constant: number): this {
    this.normal.copy(normal)
    this.constant = constant
    return this
  }

  public setComponents(x: number, y: number, z: number, constant: number): this {
    this.normal.set(x, y, z)
    this.constant = constant
    return this
  }

  public normalize(): this {
    const length = this.normal.length()
    const inverseLength = zero(length) ? 0 : 1.0 / length
    this.normal.multiplyScalar(inverseLength)
    this.constant *= inverseLength
    return this
  }

  public distanceToPoint(point: Vector3): number {
    return this.normal.dot(point) + this.constant
  }

  public intersectSegment(start: Vector3, end: Vector3): Vector3 | undefined {
    const distanceToStart = this.distanceToPoint(start)
    const distanceToEnd = this.distanceToPoint(end)
    if (sign(distanceToStart) === sign(distanceToEnd)) {
      // Both points lie on one side of a plane.
      return
    }
    const interpolant = Math.abs(distanceToStart / (distanceToStart - distanceToEnd))
    return start.clone().lerp(end, interpolant)
  }
}
