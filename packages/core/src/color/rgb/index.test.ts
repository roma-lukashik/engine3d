import { RGB } from "@core/color/rgb"

describe("RGB", () => {
  it("to be defined", () => {
    expect(new RGB(0xffffff)).toBeDefined()
  })

  it.each([
    [0, 0, 0, 0x000000],
    [0.2, 0.2, 0.2, 0x333333],
    [0.498, 0.247, 0.098, 0x7f3f19],
    [1, 1, 1, 0xffffff],
  ])("creates rgb color [%d, %d, %d] by %s", (r, g, b, color) => {
    const rgb = new RGB(color)
    expect(rgb.elements).toValueEqual([r, g, b])
  })

  it.each([
    [0, 0, 0],
    [0.2, 0.2, 0.2],
    [0.498, 0.247, 0.098],
    [1, 1, 1],
  ])("creates rgb color by 3 numbers [%d, %d, %d]", (r, g, b) => {
    const rgb = new RGB(r, g, b)
    expect(rgb.elements).toValueEqual([r, g, b])
  })

  it("r", () => {
    const rgb = new RGB(0x7f3f19)
    expect(rgb.r).toBeCloseTo(0.498)
  })

  it("g", () => {
    const rgb = new RGB(0x7f3f19)
    expect(rgb.g).toBeCloseTo(0.247)
  })

  it("b", () => {
    const rgb = new RGB(0x7f3f19)
    expect(rgb.b).toBeCloseTo(0.098)
  })

  it("clone", () => {
    const rgb = new RGB(0xffffff)
    const clone = rgb.clone()
    expect(clone).not.toBe(rgb)
    expect(clone.elements).toValueEqual(rgb.elements)
  })

  it("set", () => {
    const rgb = new RGB(0xffffff)
    rgb.set(0.2, 0.2, 0.2)
    expect(rgb.elements).toValueEqual([0.2, 0.2, 0.2])
  })
})
