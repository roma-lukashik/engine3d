import { range } from "@utils/array"

describe("array utils", () => {
  describe("#range", () => {
    it("works correctly #1", () => {
      expect(range(2, 4)).toEqual([2, 3, 4])
    })

    it("works correctly #2", () => {
      expect(range(0, 4)).toEqual([0, 1, 2, 3, 4])
    })

    it("works correctly #2", () => {
      expect(range(0, 0)).toEqual([0])
    })
  })
})
