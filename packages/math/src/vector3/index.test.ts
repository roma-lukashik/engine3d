import * as v3 from "@math/vector3"

describe("vector3", () => {
  const a = v3.vector3(1, 2, 3)
  const b = v3.vector3(2, 3, 1)

  it("#vector3", () => {
    expect(a).toEqual([1, 2, 3])
  })

  it("#copy", () => {
    expect(v3.copy(a)).toEqual([1, 2, 3])
    expect(v3.copy(a)).not.toBe(a)
  })

  it("#x", () => {
    expect(v3.x(a)).toBe(1)
  })

  it("#y", () => {
    expect(v3.y(a)).toBe(2)
  })

  it("#z", () => {
    expect(v3.z(a)).toBe(3)
  })

  it("#zero", () => {
    expect(v3.zero()).toEqual([0, 0, 0])
  })

  it("#add", () => {
    expect(v3.add(a, b)).toEqual([3, 5, 4])
  })

  it("#subtract", () => {
    expect(v3.subtract(a, b)).toEqual([-1, -1, 2])
  })

  it("#multiply", () => {
    expect(v3.multiply(a, 2)).toEqual([2, 4, 6])
  })

  it("#divide", () => {
    expect(v3.divide(a, 2)).toEqual([0.5, 1, 1.5])
  })

  it("#lengthSquared", () => {
    expect(v3.lengthSquared(a)).toBe(14)
  })

  it("#length", () => {
    expect(v3.length(a)).toCloseEqual(3.7416)
  })

  it("#distanceSquared", () => {
    expect(v3.distanceSquared(a, b)).toBe(6)
  })

  it("#distance", () => {
    expect(v3.distance(a, b)).toCloseEqual(2.449)
  })

  it("#normalize", () => {
    expect(v3.normalize(a)).toCloseEqual([0.267, 0.534, 0.802])
  })

  it("#negate", () => {
    expect(v3.negate(a)).toEqual([-1, -2, -3])
  })

  it("#dot", () => {
    expect(v3.dot(a, b)).toBe(11)
  })

  it("#cross", () => {
    expect(v3.cross(a, b)).toEqual([-7, 5, -1])
  })

  it("#equal", () => {
    expect(v3.equal(a, b)).toBe(false)
    expect(v3.equal(a, v3.copy(a))).toBe(true)
    expect(v3.equal(a, v3.vector3(1.001, 2.001, 3.001))).toBe(true)
    expect(v3.equal(a, v3.vector3(1.002, 2.002, 3.002))).toBe(false)
  })
})
