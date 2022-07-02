import { Vector3 } from "@math/vector3"

export class Plane {
  private normal: Vector3
  private constant: number

  public constructor(normal: Vector3, constant: number = 0) {
    this.set(normal, constant)
  }

  public copy(): Plane {
    return new Plane(this.normal, this.constant)
  }

  public set(normal: Vector3, constant: number): this {
    this.normal = normal
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
    const inverseLength = length ? 1.0 / length : 0
    this.normal.multiply(inverseLength)
    this.constant *= inverseLength
    return this
  }

  public distanceToPoint(point: Vector3): number {
    return this.normal.dot(point) + this.constant
  }
}
