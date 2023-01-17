import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import type { AABB } from "@geometry/bbox/aabb"
import { timesMap } from "@utils/array"
import { lte } from "@math/operators"

type CornerPoints = [
  Vector3, Vector3, Vector3, Vector3,
  Vector3, Vector3, Vector3, Vector3,
]

type Face = [Vector3, Vector3, Vector3, Vector3]

type Faces = [
  front: Face,
  right: Face,
  back: Face,
  left: Face,
  top: Face,
  bottom: Face,
]

export class OBB {
  public readonly center: Vector3 = Vector3.zero()
  public readonly halfSize: Vector3 = Vector3.zero()
  public readonly rotation: Quaternion = Quaternion.identity()

  public readonly faces: Faces

  // Fix creation array for each OBB even if points are not needed
  private readonly points: CornerPoints = timesMap(8, Vector3.zero) as CornerPoints

  public constructor()
  public constructor(center: Vector3, halfSize: Vector3, rotation: Quaternion)
  public constructor(...args: [] | [Vector3, Vector3, Quaternion]) {
    if (args.length === 3) {
      this.center.copy(args[0])
      this.halfSize.copy(args[1])
      this.rotation.copy(args[2])
    }
    this.faces = this.calculateFaces()
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
    this.points[0].set(hs.x, hs.y, hs.z)
    this.points[1].set(-hs.x, hs.y, hs.z)
    this.points[2].set(-hs.x, hs.y, -hs.z)
    this.points[3].set(hs.x, hs.y, -hs.z)
    this.points[4].set(hs.x, -hs.y, hs.z)
    this.points[5].set(-hs.x, -hs.y, hs.z)
    this.points[6].set(-hs.x, -hs.y, -hs.z)
    this.points[7].set(hs.x, -hs.y, -hs.z)
    this.points.forEach((point) => {
      point.rotateByQuaternion(this.rotation).add(this.center)
    })
    return this.points
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

  private calculateFaces(): Faces {
    return [
      [this.points[2], this.points[6], this.points[7], this.points[3]],
      [this.points[3], this.points[7], this.points[4], this.points[0]],
      [this.points[0], this.points[4], this.points[5], this.points[1]],
      [this.points[1], this.points[5], this.points[6], this.points[2]],
      [this.points[0], this.points[1], this.points[2], this.points[3]],
      [this.points[4], this.points[7], this.points[6], this.points[5]],
    ]
  }
}
