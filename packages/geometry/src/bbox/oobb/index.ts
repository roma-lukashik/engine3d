import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { AABB } from "@geometry/bbox/aabb"

export class OOBB {
  public readonly center: Vector3 = Vector3.zero()
  public readonly halfSize: Vector3 = Vector3.zero()
  public readonly rotation: Quaternion = Quaternion.identity()

  public constructor()
  public constructor(center: Vector3, halfSize: Vector3, rotation: Quaternion)
  public constructor(...args: [] | [Vector3, Vector3, Quaternion]) {
    if (args.length === 3) {
      this.center.copy(args[0])
      this.halfSize.copy(args[1])
      this.rotation.copy(args[2])
    }
  }

  public clone(): OOBB {
    return new OOBB(this.center, this.halfSize, this.rotation)
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
