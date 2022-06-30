import { Color } from "@core/color"

describe("Color", () => {
  it("to be defined", () => {
    expect(new Color(0xffffff)).toBeDefined()
  })

  it("has 1 opacity by default", () => {
    const c = new Color(0xffffff)
    expect(c.rgba).toValueEqual([1, 1, 1, 1])
  })

  it("has custom opacity", () => {
    const c = new Color(0xffffff, 0.3)
    expect(c.rgba).toValueEqual([1, 1, 1, 0.3])
  })

  it.each([
    [0x000000, 0, 0, 0],
    [0x333333, 0.2, 0.2, 0.2],
    [0x7f3f19, 0.498, 0.247, 0.098],
    [0xffffff, 1, 1, 1],
  ])("converts %s into [%d, %d, %d]", (color, r, g, b) => {
    const c = new Color(color)
    expect(c.rgb).toValueEqual([r, g, b])
  })

  it.each([
    [0x000000, 0, 0, 0],
    [0x333333, 0.2, 0.2, 0.2],
    [0x7f3f19, 0.498, 0.247, 0.098],
    [0xffffff, 1, 1, 1],
  ])("converts %s into [%d, %d, %d, 0.5]", (color, r, g, b) => {
    const c = new Color(color, 0.5)
    expect(c.rgba).toValueEqual([r, g, b, 0.5])
  })
})
