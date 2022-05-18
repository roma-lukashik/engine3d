import * as v2 from '.'

describe('vector', () => {
  it('#vector', () => {
    expect(v2.vector2(1, -3.14)).toCloseEqual([1, -3.14])
  })

  it('#copy', () => {
    const v = v2.vector2(1, -3.14)
    expect(v2.copy(v)).toEqual(v)
    expect(v2.copy(v)).not.toBe(v)
  })

  it('#x', () => {
    expect(v2.x(v2.vector2(1, -3.14))).toBe(1)
  })

  it('#y', () => {
    expect(v2.y(v2.vector2(1, -3.14))).toBe(-3.14)
  })

  it('#zero', () => {
    expect(v2.zero()).toCloseEqual([0, 0])
  })

  it('#add', () => {
    expect(v2.add(v2.vector2(-1, 3.14), v2.vector2(3.14, -1))).toCloseEqual([2.14, 2.14])
  })

  it('#subtract', () => {
    expect(v2.subtract(v2.vector2(-1, 3.14), v2.vector2(3.14, -1))).toCloseEqual([-4.14, 4.14])
  })

  it('#multiply', () => {
    expect(v2.multiply(v2.vector2(-1, 3.14), 2)).toCloseEqual([-2, 6.28])
  })

  it('#divide', () => {
    expect(v2.divide(v2.vector2(-1, 3.14), 2)).toCloseEqual([-0.5, 1.57])
  })

  it('#lengthSquared', () => {
    expect(v2.lengthSquared(v2.vector2(-2, 3.14))).toEqual(13.8596)
  })

  it('#length', () => {
    expect(v2.length(v2.vector2(-2, 3.14))).toCloseEqual(3.722)
  })

  it('#distanceSquared', () => {
    expect(v2.distanceSquared(v2.vector2(-2, 3.14), v2.vector2(-1, 0))).toCloseEqual(10.8596)
  })

  it('#distance', () => {
    expect(v2.distance(v2.vector2(-2, 3.14), v2.vector2(-1, 0))).toCloseEqual(3.295)
  })

  it('#normalize', () => {
    expect(v2.normalize(v2.vector2(-2, 3.14))).toCloseEqual([-0.537, 0.843])
  })

  it('#dot', () => {
    expect(v2.dot(v2.vector2(-2, 3.14), v2.vector2(1, -2))).toCloseEqual(-8.28)
  })

  it('#cross', () => {
    expect(v2.cross(v2.vector2(-2, 3.14), v2.vector2(1, -2))).toCloseEqual(0.86)
  })

  it('#perp', () => {
    expect(v2.perp(v2.vector2(-1, 3.14))).toCloseEqual([3.14, 1])
  })

  it('#negate', () => {
    expect(v2.negate(v2.vector2(-1, 3.14))).toCloseEqual([1, -3.14])
  })

  it('#angleTo', () => {
    expect(v2.angleTo(v2.vector2(-2, 3.14), v2.vector2(1, -2))).toCloseEqual(3.038)
  })

  it('#equal', () => {
    expect(v2.equal(v2.vector2(-2, 3.14), v2.vector2(-2, 3.14))).toBe(true)
    expect(v2.equal(v2.vector2(-2, 3.142), v2.vector2(-2, 3.143))).toBe(true)
    expect(v2.equal(v2.vector2(-2.001, 3.142), v2.vector2(-2, 3.143))).toBe(true)
    expect(v2.equal(v2.vector2(-2, 3.141), v2.vector2(-2, 3.143))).toBe(false)
    expect(v2.equal(v2.vector2(-2.002, 3.142), v2.vector2(-2, 3.143))).toBe(false)
  })
})
