import { hexToRgb } from "@utils/color"

describe("ColorUtils", () => {
  describe("#hexToRbg", () => {
    it("converts #000000 into [0, 0, 0]", () => {
      expect(hexToRgb(0x000000)).toEqual([0, 0, 0])
    })

    it("converts #333333 into [0.2, 0.2, 0.2]", () => {
      expect(hexToRgb(0x333333)).toEqual([0.2, 0.2, 0.2])
    })

    it("converts #7f3f19 into [0.5, 0.25, 0.1]", () => {
      expect(hexToRgb(0x7f3f19)).toCloseEqual([0.5, 0.25, 0.1])
    })

    it("converts #ffffff into [1, 1, 1]", () => {
      expect(hexToRgb(0xffffff)).toEqual([1, 1, 1])
    })
  })
})
