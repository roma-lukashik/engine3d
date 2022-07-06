import { Plane } from "@geometry/plane"
import { Vector3 } from "@math/vector3"

const up = new Vector3(0, 1, 0)

describe("Plane", () => {
  it("to be created", () => {
    const plane = new Plane(up, 2)
    expect(plane.normal).toValueEqual([0, 1, 0])
    expect(plane.constant).toBe(2)
  })

  it("fromComponents", () => {
    const plane = Plane.fromComponents(1, 2, 3, 4)
    expect(plane.normal).toValueEqual([1, 2, 3])
    expect(plane.constant).toBe(4)
  })

  it("copy", () => {
    const plane = new Plane(up, 2)
    const copy = plane.copy()
    expect(copy).toEqual(plane)
    expect(copy).not.toBe(plane)
  })

  it("set", () => {
    const plane = new Plane(up, 2)
    plane.set(Vector3.one(), 1)
    expect(plane.normal).toValueEqual([1, 1, 1])
    expect(plane.constant).toBe(1)
  })

  it("setComponents", () => {
    const plane = new Plane(up, 2)
    plane.setComponents(1, 1, 1, 1)
    expect(plane.normal).toValueEqual([1, 1, 1])
    expect(plane.constant).toBe(1)
  })

  it("normalize", () => {
    const plane = new Plane(new Vector3(1, 2, 3), 5)
    plane.normalize()
    expect(plane.normal).toValueEqual([0.267, 0.534, 0.802])
    expect(plane.constant).toBeCloseTo(1.336)
  })

  it("normalize in case when zero vector", () => {
    const plane = new Plane(Vector3.zero(), 10)
    plane.normalize()
    expect(plane.normal).toValueEqual([0, 0, 0])
    expect(plane.constant).toBe(0)
  })

  it("distanceToPoint", () => {
    const plane = new Plane(up, 10)
    expect(plane.distanceToPoint(new Vector3(3, 2, 3))).toBeCloseTo(18)
  })
})
