import * as m3 from "@math/matrix3"
import { Matrix3 } from "@math/types"

describe("matrix3", () => {
  describe("#identity", () => {
    it("works correctly", () => {
      expect(m3.identity()).toEqual([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ])
    })
  })

  describe("#det", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        0, 1, 4,
        5, 6, 0,
      ]
      expect(m3.det(m)).toBe(1)
    })
  })

  describe("#invert", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        0, 1, 4,
        5, 6, 0,
      ]
      expect(m3.invert(m)).toEqual([
        -24, 18, 5,
        20, -15, -4,
        -5, 4, 1,
      ])
    })

    it("returns zero matrix if det=0", () => {
      const m: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      expect(m3.invert(m)).toEqual([
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
      ])
    })
  })

  describe("#transpose", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      expect(m3.transpose(m)).toEqual([
        1, 4, 7,
        2, 5, 8,
        3, 6, 9,
      ])
    })
  })

  describe("#add", () => {
    it("works correctly", () => {
      const a: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      const b: Matrix3 = [
        1, 4, 7,
        2, 5, 8,
        3, 6, 9,
      ]
      expect(m3.add(a, b)).toEqual([
        2, 6, 10,
        6, 10, 14,
        10, 14, 18,
      ])
    })
  })

  describe("#subtract", () => {
    it("works correctly", () => {
      const a: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      const b: Matrix3 = [
        1, 4, 7,
        2, 5, 8,
        3, 6, 9,
      ]
      expect(m3.subtract(a, b)).toEqual([
        0, -2, -4,
        2, 0, -2,
        4, 2, 0,
      ])
    })
  })

  describe("#scalar", () => {
    it("works correctly", () => {
      const a: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      expect(m3.scalar(a, 2)).toEqual([
        2, 4, 6,
        8, 10, 12,
        14, 16, 18,
      ])
    })
  })

  describe("#multiply", () => {
    it("works correctly", () => {
      const a: Matrix3 = [
        1, 2, 3,
        3, 2, 1,
        1, 2, 3,
      ]
      const b: Matrix3 = [
        4, 5, 6,
        6, 5, 4,
        4, 6, 5,
      ]
      expect(m3.multiply(a, b)).toEqual([
        28, 33, 29,
        28, 31, 31,
        28, 33, 29,
      ])
    })
  })

  describe("#translate", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        3, 2, 1,
        1, 2, 3,
      ]
      expect(m3.translate(m, 2, 4)).toEqual([
        7, 14, 3,
        5, 6, 1,
        7, 14, 3,
      ])
    })
  })

  describe("#rotateX", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        3, 2, 1,
        1, 2, 3,
      ]
      expect(m3.rotateX(m, Math.PI / 4)).toCloseEqual([
        1, 3.536, 0.707,
        3, 2.121, -0.707,
        1, 3.536, 0.707,
      ])
    })
  })

  describe("#rotateY", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        3, 2, 1,
        1, 2, 3,
      ]
      expect(m3.rotateY(m, Math.PI / 4)).toCloseEqual([
        -1.414, 2, 2.828,
        1.414, 2, 2.828,
        -1.414, 2, 2.828,
      ])
    })
  })

  describe("#rotateZ", () => {
    it("works correctly", () => {
      const m: Matrix3 = [
        1, 2, 3,
        3, 2, 1,
        1, 2, 3,
      ]
      expect(m3.rotateZ(m, Math.PI / 4)).toCloseEqual([
        2.121, 0.707, 3,
        3.536, -0.707, 1,
        2.121, 0.707, 3,
      ])
    })
  })
})