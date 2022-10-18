import { forEachKey, mapObject } from "@utils/object"

describe("Object", () => {
  describe("#forEachKey", () => {
    it("calls callback for each non-undefined values", () => {
      const fn = jest.fn()
      const obj = {
        key1: 1,
        key2: undefined,
        key3: 3,
      }
      forEachKey(obj, fn)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenNthCalledWith(1, "key1", 1, obj)
      expect(fn).toHaveBeenNthCalledWith(2, "key3", 3, obj)
    })
  })

  describe("#mapObject", () => {
    it("returns a new object", () => {
      const obj = {
        key1: 1,
        key2: undefined,
        key3: 3,
      }
      expect(mapObject(obj, (x) => x * x)).toEqual({
        key1: 1,
        key3: 9,
      })
    })

    it("returns an empty object", () => {
      expect(mapObject({}, (x) => x * 2)).toEqual({})
    })
  })
})
