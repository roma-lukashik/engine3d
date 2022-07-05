import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"

describe("Vector3", () => {
  const a = new Vector3()
  const b = new Vector3()

  beforeEach(() => {
    a.set(1, 2, 3)
    b.set(2, 3, 1)
  })

  it("constructor with no arguments", () => {
    expect(new Vector3()).toValueEqual([0, 0, 0])
  })

  it("constructor with arguments", () => {
    expect(new Vector3(1, 2, 3)).toValueEqual([1, 2, 3])
  })

  it("get x", () => {
    expect(a.x).toBe(1)
  })

  it("get y", () => {
    expect(a.y).toBe(2)
  })

  it("get z", () => {
    expect(a.z).toBe(3)
  })

  it("set x", () => {
    a.x = 0
    expect(a).toValueEqual([0, 2, 3])
  })

  it("set y", () => {
    a.y = 0
    expect(a).toValueEqual([1, 0, 3])
  })

  it("set z", () => {
    a.z = 0
    expect(a).toValueEqual([1, 2, 0])
  })

  it("zero", () => {
    expect(Vector3.zero()).toValueEqual([0, 0, 0])
  })

  it("one", () => {
    expect(Vector3.one()).toValueEqual([1, 1, 1])
  })

  it("fromArray", () => {
    expect(Vector3.fromArray([0, 1, 2, 3, 4, 5])).toValueEqual([0, 1, 2])
    expect(Vector3.fromArray([0, 1, 2, 3, 4, 5], 3)).toValueEqual([3, 4, 5])
  })

  it("clone", () => {
    expect(a.clone()).toValueEqual([1, 2, 3])
    expect(a.clone()).not.toBe(a)
  })

  it("set(0, 1, 2)", () => {
    expect(a.set(0, 1, 2)).toValueEqual([0, 1, 2])
  })

  it("set(2)", () => {
    expect(a.set(2)).toValueEqual([2, 2, 2])
  })

  it("add", () => {
    expect(a.add(b)).toValueEqual([3, 5, 4])
  })

  it("subtract", () => {
    expect(a.subtract(b)).toValueEqual([-1, -1, 2])
  })

  it("multiply", () => {
    expect(a.multiply(2)).toValueEqual([2, 4, 6])
  })

  it("divide", () => {
    expect(a.divide(2)).toValueEqual([0.5, 1, 1.5])
  })

  it("lengthSquared", () => {
    expect(a.lengthSquared()).toBe(14)
  })

  it("length", () => {
    expect(a.length()).toBeCloseTo(3.7416)
  })

  it("distanceSquared", () => {
    expect(a.distanceSquared(b)).toBe(6)
  })

  it("distance", () => {
    expect(a.distance(b)).toBeCloseTo(2.449)
  })

  it("normalize", () => {
    expect(a.normalize()).toValueEqual([0.267, 0.534, 0.802])
  })

  it("negate", () => {
    expect(a.negate()).toValueEqual([-1, -2, -3])
  })

  it("dot", () => {
    expect(a.dot(b)).toBe(11)
  })

  it("cross", () => {
    expect(a.cross(b)).toValueEqual([-7, 5, -1])
  })

  it.each<[number, [number, number, number]]>([
    [0, [1, 1, 1]],
    [0.25, [2, 3.25, 1.25]],
    [0.5, [3, 5.5, 1.5]],
    [0.75, [4, 7.75, 1.75]],
    [1, [5, 10, 2]],
  ])("lerp", (t, result) => {
    const a = new Vector3(1, 1, 1)
    const b = new Vector3(5, 10, 2)
    expect(a.lerp(b, t)).toValueEqual(result)
  })

  it("transformMatrix4", () => {
    const m = new Matrix4([
      1, 2, 3, 4,
      4, 3, 2, 1,
      5, 6, 7, 8,
      8, 7, 6, 5,
    ])
    expect(a.transformMatrix4(m)).toValueEqual([])
  })

  it("toArray", () => {
    expect(a.toArray()).toValueEqual([1, 2, 3])
  })

  it("equal", () => {
    expect(a.equal(b)).toBe(false)
    expect(a.equal(a.clone())).toBe(true)
    expect(a.equal(new Vector3(1.0009, 2.0009, 3.0009))).toBe(true)
    expect(a.equal(new Vector3(1.002, 2.002, 3.002))).toBe(false)
  })
})
