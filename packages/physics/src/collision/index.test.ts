import { detectContinuousCollision, CollisionBox } from "@physics/collision"
import { Vector3 } from "@math/vector3"
import { AABB } from "@geometry/bbox/aabb"
import { OBB } from "@geometry/bbox/obb"
import { Quaternion } from "@math/quaternion"

describe("collision", () => {
  describe("detectContinuousCollision", () => {
    it("should not collide if AABBs are not intersected", () => {
      const a = createCollisionBox(
        new Vector3(0, 0.5, 0),
        new Vector3(1, 0.5, 1),
      )
      const b = createCollisionBox(
        new Vector3(0, 0.5, 4),
        new Vector3(1, 0.5, 1),
      )
      expect(detectContinuousCollision(a, b, new Vector3(0, 0, 2))).toBeUndefined()
    })

    it("should not collide if there is an axis with no overlap", () => {
      const a = createCollisionBox(
        new Vector3(2, 1, 2),
        new Vector3(1.41, 1, 0.705),
        Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4),
      )
      const b = createCollisionBox(
        new Vector3(0, 0.5, 0),
        new Vector3(1, 0.5, 1),
      )

      expect(detectContinuousCollision(a, b, new Vector3(0, 0, 0.5))).toBeUndefined()
    })

    it("should collide simple case", () => {
      const a = createCollisionBox(
        new Vector3(0, 0.5, 0),
        new Vector3(1, 0.5, 1),
      )
      const b = createCollisionBox(
        new Vector3(-0.5, 0.5, 2),
        new Vector3(1, 0.5, 1),
      )
      const collision = detectContinuousCollision(a, b, new Vector3(0, 0, 0.5))
      expect(collision?.contactNormal).toValueEqual([0, 0, 1])
      expect(collision?.penetration).toBeCloseTo(0.5)
      expect(collision?.contactPoints[0]).toValueEqual([0.5, 0, 1])
      expect(collision?.contactPoints[1]).toValueEqual([0.5, 1, 1])
      expect(collision?.contactPoints[2]).toValueEqual([-1, 1, 1])
      expect(collision?.contactPoints[3]).toValueEqual([-1, 0, 1])
    })

    it("should collide simple case (reverse)", () => {
      const a = createCollisionBox(
        new Vector3(-0.5, 0.5, 2),
        new Vector3(1, 0.5, 1),
      )
      const b = createCollisionBox(
        new Vector3(0, 0.5, 0),
        new Vector3(1, 0.5, 1),
      )
      const collision = detectContinuousCollision(a, b, new Vector3(0, 0, -0.5))
      expect(collision?.contactNormal).toValueEqual([0, 0, -1])
      expect(collision?.penetration).toBeCloseTo(0.5)
      expect(collision?.contactPoints[0]).toValueEqual([0.5, 0, 0.5])
      expect(collision?.contactPoints[1]).toValueEqual([0.5, 1, 0.5])
      expect(collision?.contactPoints[2]).toValueEqual([-1, 1, 0.5])
      expect(collision?.contactPoints[3]).toValueEqual([-1, 0, 0.5])
    })

    it("should collide with rotated box", () => {
      const a = createCollisionBox(
        new Vector3(2, 0, -1),
        new Vector3(1.414, 1, 1.414),
        Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4),
      )
      const b = createCollisionBox(
        new Vector3(0, 0, 2),
        new Vector3(1, 1, 1),
      )
      const collision = detectContinuousCollision(a, b, new Vector3(-1, 0, 1))
      expect(collision?.contactNormal).toValueEqual([-0.707, 0, 0.707])
      expect(collision?.penetration).toBeCloseTo(0.707)
      expect(collision?.contactPoints[0]).toValueEqual([0, -1, 1])
      expect(collision?.contactPoints[1]).toValueEqual([0, 1, 1])
      expect(collision?.contactPoints[2]).toValueEqual([1, 1, 2])
      expect(collision?.contactPoints[3]).toValueEqual([1, -1, 2])
    })
  })
})

function createCollisionBox(center: Vector3, halfSize: Vector3, rotation = Quaternion.identity()): CollisionBox {
  const obb = new OBB(center, halfSize, rotation)
  const aabb = new AABB()
  obb.getPoints().forEach((point) => aabb.expandByPoint(point))
  return { aabb, obb }
}
