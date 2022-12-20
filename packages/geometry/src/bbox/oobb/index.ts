import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { AABB } from "@geometry/bbox/aabb"

export class OOBB {
  public readonly center: Vector3 = Vector3.zero()
  public readonly halfSize: Vector3 = Vector3.zero()
  public readonly rotation: Quaternion = Quaternion.identity()

  public constructor()
  public constructor(center: Vector3, halfSize: Vector3)
  public constructor(...args: [] | [Vector3, Vector3]) {
    if (args.length === 2) {
      this.center.copy(args[0])
      this.halfSize.copy(args[1])
    }
  }

  public clone(): OOBB {
    return new OOBB(this.center, this.halfSize)
  }

  public fromAABB(aabb: AABB): this {
    this.center.copy(aabb.getCenter())
    this.halfSize.copy(aabb.getSize()).divideScalar(2)
    this.rotation.identity()
    return this
  }

  public collide(_oobb: OOBB): boolean {
    return false
  }

  public reset(): this {
    this.center.zero()
    this.halfSize.zero()
    this.rotation.identity()
    return this
  }
}
