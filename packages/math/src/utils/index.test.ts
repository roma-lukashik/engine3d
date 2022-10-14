import { minmax } from "@math/utils"

describe("utils", () => {
  describe("minmax", () => {
    const data = new Float32Array([
      10, 5, 15, 7, 8, 9, 6, 14, 24, 27, 23, 1, 0, 12, 29, 22,
      11, 19, 4, 31, 3, 18, 20, 2, 28, 17, 16, 30, 21, 26, 13, 25,
    ])

    it("returns min max values for 1 dimensional data", () => {
      const [min, max] = minmax(data, 1)
      expect(min).toEqual([0])
      expect(max).toEqual([31])
    })

    it("returns min max values for 2 dimensional data", () => {
      const [min, max] = minmax(data, 2)
      expect(min).toEqual([0, 1])
      expect(max).toEqual([29, 31])
    })

    it("returns min max values for 4 dimensional data", () => {
      const [min, max] = minmax(data, 4)
      expect(min).toEqual([0, 5, 4, 1])
      expect(max).toEqual([28, 27, 29, 31])
    })
  })
})
