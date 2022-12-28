import { OBB } from "@geometry/bbox/obb"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { AABB } from "@geometry/bbox/aabb"

describe("OBB", () => {
  const center = Vector3.zero()
  const halfSize = new Vector3(2, 4, 1)
  const rotation = new Quaternion(0, 0.707, 0, 0.707)

  it("to be created with no arguments", () => {
    const obb = new OBB()
    expect(obb.center).toValueEqual([0, 0, 0])
    expect(obb.halfSize).toValueEqual([0, 0, 0])
    expect(obb.rotation).toValueEqual([0, 0, 0, 1])
  })

  it("to be created with arguments", () => {
    const obb = new OBB(center, halfSize, rotation)

    expect(obb.center).not.toBe(center)
    expect(obb.center).toValueEqual([0, 0, 0])

    expect(obb.halfSize).not.toBe(halfSize)
    expect(obb.halfSize).toValueEqual([2, 4, 1])

    expect(obb.rotation).not.toBe(rotation)
    expect(obb.rotation).toValueEqual([0, 0.707, 0, 0.707])
  })

  it("clone", () => {
    const obb = new OBB(center, halfSize, rotation)
    const clone = obb.clone()
    expect(clone).toEqual(obb)
    expect(clone).not.toBe(obb)
  })

  it("fromAABB", () => {
    const aabb = new AABB(new Vector3(-1, -1, -1), new Vector3(2, 4, 1))
    const obb = new OBB().fromAABB(aabb)
    expect(obb.center).toValueEqual([0.5, 1.5, 0])
    expect(obb.halfSize).toValueEqual([1.5, 2.5, 1])
    expect(obb.rotation).toValueEqual([0, 0, 0, 1])
  })

  it("getPoints", () => {
    const obb = new OBB(center, halfSize, rotation)
    const points = obb.getPoints()
    expect(points[0]).toValueEqual([1, 4, -2])
    expect(points[1]).toValueEqual([1, 4, 2])
    expect(points[2]).toValueEqual([1, -4, 2])
    expect(points[3]).toValueEqual([-1, -4, 2])
    expect(points[4]).toValueEqual([-1, -4, -2])
    expect(points[5]).toValueEqual([-1, 4, -2])
    expect(points[6]).toValueEqual([-1, 4, 2])
    expect(points[7]).toValueEqual([1, -4, -2])
  })

  it("reset", () => {
    const obb = new OBB(center, halfSize, rotation)
    obb.reset()
    expect(obb.center).toValueEqual([0, 0, 0])
    expect(obb.halfSize).toValueEqual([0, 0, 0])
    expect(obb.rotation).toValueEqual([0, 0, 0, 1])
  })
})
