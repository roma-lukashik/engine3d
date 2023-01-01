import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import type { AABB } from "@geometry/bbox/aabb"
import { timesMap } from "@utils/array"
import { lte } from "@math/operators"

type CornerPoints = [
  Vector3, Vector3, Vector3, Vector3,
  Vector3, Vector3, Vector3, Vector3,
]

export class OBB {
  public readonly center: Vector3 = Vector3.zero()
  public readonly halfSize: Vector3 = Vector3.zero()
  public readonly rotation: Quaternion = Quaternion.identity()

  // Fix creation array for each OBB even if points are not needed
  private readonly array: CornerPoints = timesMap(8, Vector3.zero) as CornerPoints

  public constructor()
  public constructor(center: Vector3, halfSize: Vector3, rotation: Quaternion)
  public constructor(...args: [] | [Vector3, Vector3, Quaternion]) {
    if (args.length === 3) {
      this.center.copy(args[0])
      this.halfSize.copy(args[1])
      this.rotation.copy(args[2])
    }
  }

  public clone(): OBB {
    return new OBB(this.center, this.halfSize, this.rotation)
  }

  public fromAABB(aabb: AABB): this {
    this.center.copy(aabb.getCenter())
    this.halfSize.copy(aabb.getSize()).divideScalar(2)
    this.rotation.identity()
    return this
  }

  public getPoints(): CornerPoints {
    const hs = this.halfSize
    this.array[0].set(hs.x, hs.y, hs.z)
    this.array[1].set(-hs.x, hs.y, hs.z)
    this.array[2].set(-hs.x, -hs.y, hs.z)
    this.array[3].set(-hs.x, -hs.y, -hs.z)
    this.array[4].set(hs.x, -hs.y, -hs.z)
    this.array[5].set(hs.x, hs.y, -hs.z)
    this.array[6].set(-hs.x, hs.y, -hs.z)
    this.array[7].set(hs.x, -hs.y, hs.z)
    this.array.forEach((point) => {
      point.rotateByQuaternion(this.rotation).add(this.center)
    })
    return this.array
  }

  public collide(_obb: OBB): boolean {
    return false
  }

  public containsPoint(point: Vector3): boolean {
    const p = point.clone().subtract(this.center)
    return this.getBasis().every((basis, i) => {
      return lte(Math.abs(basis.dot(p)), this.halfSize.elements[i])
    })
  }

  public getBasis(): [Vector3, Vector3, Vector3] {
    return [
      new Vector3(1, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
    ].map((v) => {
      return v.rotateByQuaternion(this.rotation)
    }) as [Vector3, Vector3, Vector3]
  }

  public reset(): this {
    this.center.zero()
    this.halfSize.zero()
    this.rotation.identity()
    return this
  }
}
