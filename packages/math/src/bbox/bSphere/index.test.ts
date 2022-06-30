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
})
