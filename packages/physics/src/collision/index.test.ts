import { detectContinuousCollision, CollisionBox } from "@physics/collision"
import { Vector3 } from "@math/vector3"
import { AABB } from "@geometry/bbox/aabb"
import { OBB } from "@geometry/bbox/obb"
import { Quaternion } from "@math/quaternion"

describe("collision", () => {
  describe("detectContinuousCollision", () => {
    it("should not collide if AABBs are not intersected", () => {
      const a = createCollisionBoxByAABB(new AABB(new Vector3(-1, 0, -1), new Vector3(1, 1, 1)))
      const b = createCollisionBoxByAABB(new AABB(new Vector3(0, 0, 4), new Vector3(1, 1, 5)))
      expect(detectContinuousCollision(a, b, new Vector3(0, 0, 2))).toBeUndefined()
    })

    it("should not collide of there is an axis with no overlap", () => {
      const a = createCollisionBoxByAABB(new AABB(
        new Vector3(-1, 0, -1),
        new Vector3(1, 1, 1),
      ))
      const b = createCollisionBoxByOBB(new OBB(
        new Vector3(2, 1, 2),
        new Vector3(1.41, 1, 0.705),
        Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4),
      ))
      expect(detectContinuousCollision(a, b, new Vector3(0, 0, 0.5))).toBeUndefined()
    })
  })
})

function createCollisionBoxByAABB(aabb: AABB): CollisionBox {
  return {
    aabb,
    obb: new OBB().fromAABB(aabb),
  }
}

function createCollisionBoxByOBB(obb: OBB): CollisionBox {
  const aabb = new AABB()
  obb.getPoints().forEach((point) => aabb.expandByPoint(point))
  return { aabb, obb }
}
