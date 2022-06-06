import { nthOption, mapOption } from "@utils/optionable"

describe("Optionable", () => {
  describe("#nthOption", () => {
    it("returns the second element", () => {
      expect(nthOption([0, 1, 2], 1)).toBe(1)
    })

    it("handles undefined index", () => {
      expect(nthOption([0, 1, 2], undefined)).toBeUndefined()
    })

    it("handles undefined array", () => {
      expect(nthOption(undefined, 1)).toBeUndefined()
    })
  })

  describe("#mapOption", () => {
    it("returns the new array", () => {
      expect(mapOption([0, 1, 2], (x) => x * x)).toEqual([0, 1, 4])
    })

    it("skips undefined values", () => {
      expect(mapOption([0, 1, 2], (x) => x < 2 ? undefined : x * x)).toEqual([4])
    })

    it("returns an empty array", () => {
      expect(mapOption(undefined, (x: number) => x * x)).toEqual([])
    })
  })
})
