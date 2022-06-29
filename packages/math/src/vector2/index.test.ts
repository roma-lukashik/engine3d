import { Vector2 } from "@math/vector2"

describe("Vector2", () => {
  const a = new Vector2()
  const b = new Vector2()

  beforeEach(() => {
    a.set(1, 2)
    b.set(3, 4)
  })

  it("constructor with no arguments", () => {
    expect(new Vector2()).toValueEqual([0, 0])
  })

  it("constructor with arguments", () => {
    expect(new Vector2(1, 2)).toValueEqual([1, 2])
  })

  it("x", () => {
    expect(a.x).toBe(1)
  })

  it("y", () => {
    expect(a.y).toBe(2)
  })

  it("zero", () => {
    expect(Vector2.zero()).toValueEqual([0, 0])
  })

  it("one", () => {
    expect(Vector2.one()).toValueEqual([1, 1])
  })

  it("fromArray", () => {
    expect(Vector2.fromArray([0, 1, 2, 3, 4])).toValueEqual([0, 1])
    expect(Vector2.fromArray([0, 1, 2, 3, 4], 3)).toValueEqual([3, 4])
  })

  it("clone", () => {
    expect(a.clone()).toValueEqual([1, 2])
    expect(a.clone()).not.toBe(a)
  })

  it("set(0, 1)", () => {
    expect(a.set(0, 1)).toValueEqual([0, 1])
  })

  it("set(2)", () => {
    expect(a.set(2)).toValueEqual([2, 2])
  })

  it("add", () => {
    expect(a.add(b)).toValueEqual([4, 6])
  })

  it("subtract", () => {
    expect(a.subtract(b)).toValueEqual([-2, -2])
  })

  it("multiply", () => {
    expect(a.multiply(2)).toValueEqual([2, 4])
  })

  it("divide", () => {
    expect(a.divide(2)).toValueEqual([0.5, 1])
  })

  it("lengthSquared", () => {
    expect(b.lengthSquared()).toBe(25)
  })

  it("length", () => {
    expect(b.length()).toBeCloseTo(5)
  })

  it("distanceSquared", () => {
    expect(a.distanceSquared(b)).toBe(8)
  })

  it("distance", () => {
    expect(a.distance(b)).toBeCloseTo(2.828)
  })

  it("normalize", () => {
    expect(b.normalize()).toValueEqual([0.6, 0.8])
  })

  it("negate", () => {
    expect(a.negate()).toValueEqual([-1, -2])
  })

  it("dot", () => {
    expect(a.dot(b)).toBe(11)
  })

  it("cross", () => {
    expect(a.cross(b)).toBe(-2)
  })

  it("perp", () => {
    expect(a.perp()).toValueEqual([2, -1])
  })

  it("angleTo", () => {
    expect(a.angleTo(b)).toBeCloseTo(-0.18)
  })

  it("toArray", () => {
    expect(a.toArray()).toEqual(new Float32Array([1, 2]))
  })

  it("equal", () => {
    expect(a.equal(b)).toBe(false)
    expect(a.equal(a.clone())).toBe(true)
    expect(a.equal(new Vector2(1.0009, 2.0009))).toBe(true)
    expect(a.equal(new Vector2(1.002, 2.002))).toBe(false)
  })
})
