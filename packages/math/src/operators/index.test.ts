import { eq, neq, gt, gte, lt, lte, clamp, ceilPowerOfTwo } from "@math/operators"

describe("operators", () => {
  it.each([
    [1, 1],
    [1.001, 1],
    [1, 1.001],
  ])("eq(%d, %d)=true", (x, y) => {
    expect(eq(x, y)).toBe(true)
  })

  it.each([
    [1, 0.998],
    [0.998, 1],
    [1.002, 1],
    [1, 1.002],
  ])("eq(%d, %d)=false", (x, y) => {
    expect(eq(x, y)).toBe(false)
  })

  it.each([
    [1, 0.998],
    [0.998, 1],
    [1.002, 1],
    [1, 1.002],
  ])("neq(%d, %d)=true", (x, y) => {
    expect(neq(x, y)).toBe(true)
  })

  it.each([
    [1, 1],
    [1.001, 1],
    [1, 1.001],
  ])("neq(%d, %d)=false", (x, y) => {
    expect(neq(x, y)).toBe(false)
  })

  it.each([
    [1.002, 1],
    [1, 0.998],
  ])("gt(%d, %d)=true", (x, y) => {
    expect(gt(x, y)).toBe(true)
  })

  it.each([
    [1, 1.002],
    [0.998, 1],
    [1.001, 1],
    [1, 0.9999],
    [1, 1],
  ])("gt(%d, %d)=false", (x, y) => {
    expect(gt(x, y)).toBe(false)
  })

  it.each([
    [1.002, 1],
    [1, 0.998],
    [1.001, 1],
    [1, 0.9999],
    [1, 1],
  ])("gte(%d, %d)=true", (x, y) => {
    expect(gte(x, y)).toBe(true)
  })

  it.each([
    [1, 1.002],
    [0.998, 1],
  ])("gte(%d, %d)=false", (x, y) => {
    expect(gte(x, y)).toBe(false)
  })

  it.each([
    [1, 1.002],
    [0.999, 1],
  ])("lt(%d, %d)=true", (x, y) => {
    expect(lt(x, y)).toBe(true)
  })

  it.each([
    [1, 1.001],
    [1.001, 1],
    [1, 0.9999],
    [1, 1],
  ])("lt(%d, %d)=false", (x, y) => {
    expect(lt(x, y)).toBe(false)
  })

  it.each([
    [1, 1.002],
    [0.999, 1],
    [1, 1.001],
    [1.001, 1],
    [1, 0.9999],
    [1, 1],
  ])("lte(%d, %d)=true", (x, y) => {
    expect(lte(x, y)).toBe(true)
  })

  it.each([
    [1.002, 1],
    [1, 0.998],
  ])("lte(%d, %d)=false", (x, y) => {
    expect(lte(x, y)).toBe(false)
  })

  it.each([
    [2, 1, 3, 2],
    [0, 1, 3, 1],
    [4, 1, 3, 3],
  ])("clamp(%d, %d, %d)=%d", (x, min, max, result) => {
    expect(clamp(x, min, max)).toBe(result)
  })

  it.each([
    [0, 0],
    [1, 1],
    [8, 8],
    [10, 16],
    [31, 32],
    [90, 128],
  ])("ceilPowerOfTwo(%d)=%d", (x, result) => {
    expect(ceilPowerOfTwo(x)).toBe(result)
  })
})
