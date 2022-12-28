import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"

describe("AABB", () => {
  let aabb: AABB
  beforeEach(() => {
    aabb = new AABB([
      0, 0, 0,
      1, 1, 1,
      2, 1, 3,
      -1, 0, 4,
    ])
  })

  it("to be created by points", () => {
    expect(aabb).toBeDefined()
  })

  it("to be created by min and max", () => {
    expect(new AABB(Vector3.zero(), Vector3.one())).toBeDefined()
  })

  it("to be created with empty arguments", () => {
    const aabb = new AABB()
    expect(aabb.min).toValueEqual([Infinity, Infinity, Infinity])
    expect(aabb.max).toValueEqual([-Infinity, -Infinity, -Infinity])
  })

  it("min", () => {
    expect(aabb.min).toValueEqual([-1, 0, 0])
  })

  it("max", () => {
    expect(aabb.max).toValueEqual([2, 1, 4])
  })

  it("getCenter", () => {
    expect(aabb.getCenter()).toValueEqual([0.5, 0.5, 2])
  })

  it("getSize", () => {
    expect(aabb.getSize()).toValueEqual([3, 1, 4])
  })

  it("clone", () => {
    const clone = aabb.clone()
    expect(clone).toEqual(aabb)
    expect(clone).not.toBe(aabb)
  })

  it("copies min and max vectors when clone", () => {
    const clone = aabb.clone()
    expect(clone.min).not.toBe(aabb.min)
    expect(clone.max).not.toBe(aabb.max)
  })

  it.each([
    [[-1, -1, -1, 1, 1, 1]], // left intersect
    [[1, 1, 1, 3, 3, 3]], // right intersect
    [[0.5, 0.5, 0.5, 1.5, 1.5, 1.5]], // B inside A
    [[-1, -1, -1, 3, 3, 3]], // A inside B
    [[0, 0, 0, 2, 2, 2]], // A equals B
    [[2, 2, 2, 4, 4, 4]], // A touches B by right face
    [[-2, -2, -2, 0, 0, 0]], // A touches B by left face
    [[2.001, 2.001, 2.001, 4, 4, 4]], // A touches B by right face with precision
    [[-2, -2, -2, -0.0009, -0.0009, -0.0009]], // A touches B by left face with precision
  ])("to be collide %#", (points) => {
    const a = new AABB([0, 0, 0, 2, 2, 2])
    const b = new AABB(points)
    expect(a.collide(b)).toBe(true)
  })

  it.each([
    [[3, 3, 3, 5, 5, 5]],
    [[-3, -3, -3, -1, -1, -1]],
    [[2.002, 2.002, 2.002, 4, 4, 4]],
    [[-2, -2, -2, -0.002, -0.002, -0.002]],
  ])("to not be collide %#", (points) => {
    const a = new AABB([0, 0, 0, 2, 2, 2])
    const b = new AABB(points)
    expect(a.collide(b)).toBe(false)
  })

  it("expandByPoint", () => {
    aabb.expandByPoint(new Vector3(-2, 2, 0))
    expect(aabb.min).toValueEqual([-2, 0, 0])
    expect(aabb.max).toValueEqual([2, 2, 4])
  })

  it("reset", () => {
    aabb.reset()
    expect(aabb.min).toValueEqual([Infinity, Infinity, Infinity])
    expect(aabb.max).toValueEqual([-Infinity, -Infinity, -Infinity])
  })
})
