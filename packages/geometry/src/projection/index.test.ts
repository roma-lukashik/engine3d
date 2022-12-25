import { Projection } from "@geometry/projection"
import { Vector3 } from "@math/vector3"

describe("Projection", () => {
  const points = [
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 1),
    new Vector3(0, 1, 0),
    new Vector3(-1, 1, 0),
    new Vector3(-1, -1, 0),
    new Vector3(-1, -1, 1),
  ]

  it("creates projections with no arguments", () => {
    const p = new Projection()
    expect(p.min).toEqual(Infinity)
    expect(p.max).toEqual(-Infinity)
  })

  it.each<[axis: Vector3, min: number, max: number]>([
    [new Vector3(0, 0, 1), 0, 1],
    [new Vector3(0, 1, 0), -1, 1],
    [new Vector3(1, 0, 0), -1, 0],
    [new Vector3(1, 1, 1).normalize(), -1.155, 0.577],
  ])("creates projection from points and axis %#", (axis, min, max) => {
    const p = new Projection(points, axis)
    expect(p.min).toBeCloseTo(min)
    expect(p.max).toBeCloseTo(max)
  })

  it.each<[axis: Vector3, min: number, max: number]>([
    [new Vector3(0, 0, 1), 0, 1],
    [new Vector3(0, 1, 0), -1, 1],
    [new Vector3(1, 0, 0), -1, 0],
    [new Vector3(1, 1, 1).normalize(), -1.155, 0.577],
  ])("fromPoints %#", (axis, min, max) => {
    const p = new Projection()
    p.fromPoints(points, axis)
    expect(p.min).toBeCloseTo(min)
    expect(p.max).toBeCloseTo(max)
  })
})
