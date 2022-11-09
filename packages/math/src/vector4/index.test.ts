import { Vector4 } from "@math/vector4"

describe("Vector4", () => {
  const a = new Vector4()
  const b = new Vector4()

  beforeEach(() => {
    a.set(1, 2, 3, 4)
    b.set(5, 6, 7, 8)
  })

  it("constructor with no arguments", () => {
    expect(new Vector4()).toValueEqual([0, 0, 0, 0])
  })

  it("constructor with arguments", () => {
    expect(new Vector4(1, 2, 3, 4)).toValueEqual([1, 2, 3, 4])
  })

  it("x", () => {
    expect(a.x).toBe(1)
  })

  it("y", () => {
    expect(a.y).toBe(2)
  })

  it("z", () => {
    expect(a.z).toBe(3)
  })

  it("w", () => {
    expect(a.w).toBe(4)
  })

  it("zero", () => {
    expect(Vector4.zero()).toValueEqual([0, 0, 0, 0])
  })

  it("one", () => {
    expect(Vector4.one()).toValueEqual([1, 1, 1, 1])
  })

  it("fromArray", () => {
    expect(Vector4.fromArray([0, 1, 2, 3, 4, 5, 6])).toValueEqual([0, 1, 2, 3])
    expect(Vector4.fromArray([0, 1, 2, 3, 4, 5, 6], 3)).toValueEqual([3, 4, 5, 6])
  })

  it("clone", () => {
    expect(a.clone()).toValueEqual([1, 2, 3, 4])
    expect(a.clone()).not.toBe(a)
  })

  it("copy", () => {
    expect(a.copy(b)).toValueEqual([5, 6, 7, 8])
  })

  it("set(0, 1, 2, 3)", () => {
    expect(a.set(0, 1, 2, 3)).toValueEqual([0, 1, 2, 3])
  })

  it("set(2)", () => {
    expect(a.set(2)).toValueEqual([2, 2, 2, 2])
  })

  it("add", () => {
    expect(a.add(b)).toValueEqual([6, 8, 10, 12])
  })

  it("subtract", () => {
    expect(a.subtract(b)).toValueEqual([-4, -4, -4, -4])
  })

  it("multiply", () => {
    expect(a.multiply(b)).toValueEqual([5, 12, 21, 32])
  })

  it("divide", () => {
    expect(b.divide(a)).toValueEqual([5, 3, 2.333, 2])
  })

  it("multiplyScalar", () => {
    expect(a.multiplyScalar(2)).toValueEqual([2, 4, 6, 8])
  })

  it("divideScalar", () => {
    expect(a.divideScalar(2)).toValueEqual([0.5, 1, 1.5, 2])
  })

  it("dot", () => {
    expect(a.dot(b)).toBe(70)
  })

  it("lengthSquared", () => {
    expect(a.lengthSquared()).toBe(30)
  })

  it("length", () => {
    expect(a.length()).toBeCloseTo(5.477)
  })

  it("distanceSquared", () => {
    expect(a.distanceSquared(b)).toBe(64)
  })

  it("distance", () => {
    expect(a.distance(b)).toBe(8)
  })

  it("normalize", () => {
    expect(a.normalize()).toValueEqual([0.183, 0.365, 0.548, 0.730])
  })

  it("negate", () => {
    expect(a.negate()).toValueEqual([-1, -2, -3, -4])
  })

  it("elements", () => {
    expect(a.elements).toValueEqual([1, 2, 3, 4])
  })

  it("equal", () => {
    expect(a.equal(b)).toBe(false)
    expect(a.equal(a.clone())).toBe(true)
    expect(a.equal(new Vector4(1.00099, 2.00099, 3.00099, 4.00099))).toBe(true)
    expect(a.equal(new Vector4(1.002, 2.002, 3.002, 4.001))).toBe(false)
  })
})
