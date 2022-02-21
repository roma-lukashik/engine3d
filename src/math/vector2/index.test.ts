import {
  vector2,
  x,
  y,
  zero,
  add,
  subtract,
  multiply,
  divide,
  lengthSquared,
  length,
  distanceSquared,
  distance,
  normalize,
  dot,
  cross,
  perp,
  negate,
  angleTo,
  equal,
  copy,
} from '.'

describe('vector', () => {
  it('#vector', () => {
    expect(vector2(1, -3.14)).toPrettyEqual([1, -3.14])
  })

  it('#copy', () => {
    const v = vector2(1, -3.14)
    expect(copy(v)).toEqual(v)
    expect(copy(v)).not.toBe(v)
  })

  it('#x', () => {
    expect(x(vector2(1, -3.14))).toBe(1)
  })

  it('#y', () => {
    expect(y(vector2(1, -3.14))).toBe(-3.14)
  })

  it('#zero', () => {
    expect(zero()).toPrettyEqual([0, 0])
  })

  it('#add', () => {
    expect(add(vector2(-1, 3.14), vector2(3.14, -1))).toPrettyEqual([2.14, 2.14])
  })

  it('#subtract', () => {
    expect(subtract(vector2(-1, 3.14), vector2(3.14, -1))).toPrettyEqual([-4.14, 4.14])
  })

  it('#multiply', () => {
    expect(multiply(vector2(-1, 3.14), 2)).toPrettyEqual([-2, 6.28])
  })

  it('#divide', () => {
    expect(divide(vector2(-1, 3.14), 2)).toPrettyEqual([-0.5, 1.57])
  })

  it('#lengthSquared', () => {
    expect(lengthSquared(vector2(-2, 3.14))).toEqual(13.8596)
  })

  it('#length', () => {
    expect(length(vector2(-2, 3.14))).toPrettyEqual(3.722)
  })

  it('#distanceSquared', () => {
    expect(distanceSquared(vector2(-2, 3.14), vector2(-1, 0))).toPrettyEqual(10.8596)
  })

  it('#distance', () => {
    expect(distance(vector2(-2, 3.14), vector2(-1, 0))).toPrettyEqual(3.295)
  })

  it('#normalize', () => {
    expect(normalize(vector2(-2, 3.14))).toPrettyEqual([-0.537, 0.843])
  })

  it('#dot', () => {
    expect(dot(vector2(-2, 3.14), vector2(1, -2))).toPrettyEqual(-8.28)
  })

  it('#cross', () => {
    expect(cross(vector2(-2, 3.14), vector2(1, -2))).toPrettyEqual(0.86)
  })

  it('#perp', () => {
    expect(perp(vector2(-1, 3.14))).toPrettyEqual([3.14, 1])
  })

  it('#negate', () => {
    expect(negate(vector2(-1, 3.14))).toPrettyEqual([1, -3.14])
  })

  it('#angleTo', () => {
    expect(angleTo(vector2(-2, 3.14), vector2(1, -2))).toPrettyEqual(3.038)
  })

  it('#equal', () => {
    expect(equal(vector2(-2, 3.14), vector2(-2, 3.14))).toBe(true)
    expect(equal(vector2(-2, 3.142), vector2(-2, 3.143))).toBe(true)
    expect(equal(vector2(-2.001, 3.142), vector2(-2, 3.143))).toBe(true)
    expect(equal(vector2(-2, 3.141), vector2(-2, 3.143))).toBe(false)
    expect(equal(vector2(-2.002, 3.142), vector2(-2, 3.143))).toBe(false)
  })
})
