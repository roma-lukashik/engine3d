import { range, times, timesMap } from "@utils/array"

describe("array utils", () => {
  describe("#times", () => {
    it("calls callback 4 times with correct arguments", () => {
      const fn = jest.fn()
      times(4, fn)
      expect(fn).toHaveBeenCalledTimes(4)
      expect(fn).toHaveBeenNthCalledWith(1, 0)
      expect(fn).toHaveBeenNthCalledWith(2, 1)
      expect(fn).toHaveBeenNthCalledWith(3, 2)
      expect(fn).toHaveBeenNthCalledWith(4, 3)
    })
  })

  describe("#timesMap", () => {
    it("creates an array", () => {
      expect(timesMap(4, (x) => x)).toEqual([0, 1, 2, 3])
    })
  })

  describe("#range", () => {
    it("works correctly #1", () => {
      expect(range(2, 4)).toEqual([2, 3])
    })

    it("works correctly #2", () => {
      expect(range(0, 4)).toEqual([0, 1, 2, 3])
    })

    it("works correctly #2", () => {
      expect(range(0, 0)).toEqual([])
    })
  })
})
