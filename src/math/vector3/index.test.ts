import * as v from '.'

describe('vector3', () => {
  const a = v.vector3(1, 2, 3)
  const b = v.vector3(2, 3, 1)

  it('#vector3', () => {
    expect(a).toEqual([1, 2, 3])
  })

  it('#copy', () => {
    expect(v.copy(a)).toEqual([1, 2, 3])
    expect(v.copy(a)).not.toBe(a)
  })

  it('#x', () => {
    expect(v.x(a)).toBe(1)
  })

  it('#y', () => {
    expect(v.y(a)).toBe(2)
  })

  it('#z', () => {
    expect(v.z(a)).toBe(3)
  })

  it('#zero', () => {
    expect(v.zero()).toEqual([0, 0, 0])
  })

  it('#add', () => {
    expect(v.add(a, b)).toEqual([3, 5, 4])
  })

  it('#subtract', () => {
    expect(v.subtract(a, b)).toEqual([-1, -1, 2])
  })

  it('#multiply', () => {
    expect(v.multiply(a, 2)).toEqual([2, 4, 6])
  })

  it('#divide', () => {
    expect(v.divide(a, 2)).toEqual([0.5, 1, 1.5])
  })

  it('#lengthSquared', () => {
    expect(v.lengthSquared(a)).toBe(14)
  })

  it('#length', () => {
    expect(v.length(a)).toPrettyEqual(3.7416)
  })

  it('#distanceSquared', () => {
    expect(v.distanceSquared(a, b)).toBe(6)
  })

  it('#distance', () => {
    expect(v.distance(a, b)).toPrettyEqual(2.449)
  })

  it('#normalize', () => {
    expect(v.normalize(a)).toPrettyEqual([0.267, 0.534, 0.802])
  })

  it('#negate', () => {
    expect(v.negate(a)).toEqual([-1, -2, -3])
  })

  it('#dot', () => {
    expect(v.dot(a, b)).toBe(11)
  })

  it('#cross', () => {
    expect(v.cross(a, b)).toEqual([-7, 5, -1])
  })

  it('#equal', () => {
    expect(v.equal(a, b)).toBe(false)
    expect(v.equal(a, v.copy(a))).toBe(true)
    expect(v.equal(a, v.vector3(1.001, 2.001, 3.001))).toBe(true)
    expect(v.equal(a, v.vector3(1.002, 2.002, 3.002))).toBe(false)
  })
})
