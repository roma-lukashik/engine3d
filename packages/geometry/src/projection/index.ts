import { Vector3 } from "@math/vector3"

export class Projection {
  public min: number = Infinity
  public max: number = -Infinity

  public constructor()
  public constructor(points: Vector3[], axis: Vector3)
  public constructor(...args: [] | [Vector3[], Vector3]) {
    if (args.length === 2) {
      this.fromPoints(args[0], args[1])
    }
  }

  public fromPoints(points: Vector3[], axis: Vector3): this {
    points.forEach((point) => {
      const dot = point.dot(axis)
      this.min = Math.min(this.min, dot)
      this.max = Math.max(this.max, dot)
    })
    return this
  }
}
