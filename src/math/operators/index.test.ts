import { eq, neq, gt, gte, lt, lte, clamp } from '.'

describe('operators', () => {
  it('#eq', () => {
    expect(eq(1, 1)).toBe(true)
    expect(eq(1.001, 1)).toBe(true)
    expect(eq(1.002, 1)).toBe(false)
    expect(eq(1, 1.001)).toBe(true)
    expect(eq(1, 1.002)).toBe(false)
  })

  it('#neq', () => {
    expect(neq(1, 1)).toBe(false)
    expect(neq(1.001, 1)).toBe(false)
    expect(neq(1.002, 1)).toBe(true)
    expect(neq(1, 1.001)).toBe(false)
    expect(neq(1, 1.002)).toBe(true)
  })

  it('#gt', () => {
    expect(gt(1, 1)).toBe(false)
    expect(gt(1.001, 1)).toBe(false)
    expect(gt(1.002, 1)).toBe(true)
    expect(gt(1, 1.001)).toBe(false)
    expect(gt(1, 1.002)).toBe(false)
  })

  it('#gte', () => {
    expect(gte(1, 1)).toBe(true)
    expect(gte(1.001, 1)).toBe(true)
    expect(gte(1.002, 1)).toBe(true)
    expect(gte(1, 1.001)).toBe(true)
    expect(gte(1, 1.002)).toBe(false)
  })

  it('#lt', () => {
    expect(lt(1, 1)).toBe(false)
    expect(lt(1.001, 1)).toBe(false)
    expect(lt(1.002, 1)).toBe(false)
    expect(lt(1, 1.001)).toBe(false)
    expect(lt(1, 1.002)).toBe(true)
  })

  it('#lte', () => {
    expect(lte(1, 1)).toBe(true)
    expect(lte(1.001, 1)).toBe(true)
    expect(lte(1.002, 1)).toBe(false)
    expect(lte(1, 1.001)).toBe(true)
    expect(lte(1, 1.002)).toBe(true)
  })

  it('#clamp', () => {
    expect(clamp(2, 1, 3)).toBe(2)
    expect(clamp(0, 1, 3)).toBe(1)
    expect(clamp(4, 1, 3)).toBe(3)
  })
})
