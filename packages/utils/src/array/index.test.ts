import { forEachPair, range, times, timesMap } from "@utils/array"

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

  describe("forEachPair", () => {
    it("calls function for each pair including end with start", () => {
      const fn = jest.fn()
      forEachPair([0, 1, 2, 3], fn)
      expect(fn).toHaveBeenNthCalledWith(1, 0, 1)
      expect(fn).toHaveBeenNthCalledWith(2, 1, 2)
      expect(fn).toHaveBeenNthCalledWith(3, 2, 3)
      expect(fn).toHaveBeenNthCalledWith(4, 3, 0)
    })

    it("to not call callback for an empty array", () => {
      const fn = jest.fn()
      forEachPair([], fn)
      expect(fn).not.toHaveBeenCalled()
    })

    it("to not call callback for an array with 1 element", () => {
      const fn = jest.fn()
      forEachPair([1], fn)
      expect(fn).not.toHaveBeenCalled()
    })
  })
})
