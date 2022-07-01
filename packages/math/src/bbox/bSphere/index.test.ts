import { BSphere } from "@math/bbox/bSphere"
import { Vector3 } from "@math/vector3"

describe("BSphere", () => {
  it("to be defined", () => {
    expect(new BSphere(Vector3.zero(), 10)).toBeDefined()
  })

  it("to be created by points", () => {
    const sphere = new BSphere([
      0, 0, 0,
      1, 1, 1,
      2, 1, 3,
      -1, 0, 4,
    ])
    expect(sphere.center).toValueEqual([0.5, 0.5, 2])
    expect(sphere.radius).toBeCloseTo(2.55)
  })

  it("to be created by center point and radius", () => {
    const sphere = new BSphere(new Vector3(0.5, 0.5, 2), 2.55)
    expect(sphere.center).toValueEqual([0.5, 0.5, 2])
    expect(sphere.radius).toBeCloseTo(2.55)
  })

  it("clone", () => {
    const sphere = new BSphere(new Vector3(0.5, 0.5, 2), 2.55)
    const clone = sphere.clone()
    expect(clone).toEqual(sphere)
    expect(clone).not.toBe(sphere)
  })

  it.each([
    [new Vector3(0, 0, 0), 5], // B inside A
    [new Vector3(0, 0, 0), 11], // A inside B
    [new Vector3(0, 0, 0), 10], // A equal B
    [new Vector3(12, 12, 12), 15], // intersect
    [new Vector3(11, 0, 0), 1], // touch
    [new Vector3(11, 0, 0), 1.001], // touch with precision
    [new Vector3(11, 0, 0), 0.999], // touch with precision
  ])("to be intersect %#", (center, radius) => {
    const a = new BSphere(Vector3.zero(), 10)
    const b = new BSphere(center, radius)
    expect(a.intersectBSphere(b)).toBe(true)
  })

  it.each([
    [new Vector3(12, 0, 0), 1],
    [new Vector3(11, 0, 0), 0.998],
  ])("to not be intersect %#", (center, radius) => {
    const a = new BSphere(Vector3.zero(), 10)
    const b = new BSphere(center, radius)
    expect(a.intersectBSphere(b)).toBe(false)
  })
})
