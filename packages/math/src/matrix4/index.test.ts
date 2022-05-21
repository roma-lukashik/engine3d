import * as m4 from "@math/matrix4"
import { Matrix4 } from "@math/types"

describe("matrix4", () => {
  describe("#identity", () => {
    it("works correctly", () => {
      expect(m4.identity()).toEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    })
  })

  describe("#det", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.det(m)).toBe(-80)
    })
  })

  describe("#transpose", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.transpose(m)).toEqual([
        1, 4, 4, 3,
        2, 1, 3, 2,
        3, 3, 2, 4,
        4, 2, 1, 1,
      ])
    })
  })

  describe("#invert", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.invert(m)).toCloseEqual([
        -0.1375, 0.3125, 0.1125, -0.1875,
        0.1125, -0.4375, 0.3625, 0.0625,
        -0.0125, -0.0625, -0.2625, 0.4375,
        0.2375, 0.1875, -0.0125, -0.3125,
      ])
    })

    it("returns zero matrix if det=0", () => {
      const m: Matrix4 = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ]
      expect(m4.invert(m)).toEqual([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ])
    })
  })

  describe("#add", () => {
    it("works correctly", () => {
      const a: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      const b: Matrix4 = [
        1, 4,	4, 3,
        2, 1,	3, 2,
        3, 3,	2, 4,
        4, 2,	1, 1,
      ]
      expect(m4.add(a, b)).toEqual([
        2, 6, 7, 7,
        6, 2, 6, 4,
        7, 6, 4, 5,
        7, 4, 5, 2,
      ])
    })
  })

  describe("#subtract", () => {
    it("works correctly", () => {
      const a: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      const b: Matrix4 = [
        1, 4,	4, 3,
        2, 1,	3, 2,
        3, 3,	2, 4,
        4, 2,	1, 1,
      ]
      expect(m4.subtract(a, b)).toEqual([
        0, -2, -1, 1,
        2, 0, 0, 0,
        1, 0, 0, -3,
        -1, 0, 3, 0,
      ])
    })
  })

  describe("#scalar", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.scalar(m, 2)).toEqual([
        2, 4, 6, 8,
        8, 2, 6, 4,
        8, 6, 4, 2,
        6, 4, 8, 2,
      ])
    })
  })

  describe("#multiply", () => {
    it("works correctly", () => {
      const a: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      const b: Matrix4 = [
        1, 4,	4, 3,
        2, 1,	3, 2,
        3, 3,	2, 4,
        4, 2,	1, 1,
      ]
      expect(m4.multiply(a, b)).toEqual([
        42, 24, 35, 19,
        24, 18, 23, 15,
        35, 23, 38, 24,
        19, 15, 24, 22,
      ])
    })
  })

  describe("#rotateX", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.rotateX(m, Math.PI / 4)).toCloseEqual([
        1, 2, 3, 4,
        0, -1.414, 0.707, 0.707,
        5.657, 2.828, 3.535, 2.121,
        3, 2, 4, 1,
      ])
    })
  })

  describe("#rotateY", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.rotateY(m, Math.PI / 4)).toCloseEqual([
        3.535, 3.535, 3.535, 3.535,
        4, 1, 3, 2,
        2.121, 0.707, -0.707, -2.121,
        3, 2, 4, 1,
      ])
    })
  })

  describe("#rotateZ", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.rotateZ(m, Math.PI / 4)).toCloseEqual([
        -2.121, 0.707, 0, 1.414,
        3.535, 2.121, 4.242, 4.242,
        4, 3, 2, 1,
        3, 2, 4, 1,
      ])
    })
  })

  describe("rotationVector", () => {
    it("works correctly", () => {
      const m = m4.compose(
        [0, 0.9238795292366128, 0, 0.38268342717215614],
        [2, 3, 4],
        [2, 3, 4],
      )
      expect(m4.rotationVector(m)).toCloseEqual([0, 0.924, 0, 0.383])
    })
  })

  describe("#translate", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.translate(m, 2, 3, 4)).toEqual([
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        33, 21,	27, 19,
      ])
    })
  })

  describe("#translation", () => {
    it("works correctly", () => {
      expect(m4.translation(2, 2, 2)).toEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        2, 2, 2, 1,
      ])
    })
  })

  describe("#translationVector", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        2, 2, 2, 1,
      ]
      expect(m4.translationVector(m)).toEqual([2, 2, 2])
    })
  })

  describe("#scale", () => {
    it("works correctly", () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(m4.scale(m, 2, 3, 4)).toEqual([
        2, 4, 6, 8,
        12, 3, 9, 6,
        16, 12, 8, 4,
        3, 2, 4, 1,
      ])
    })
  })

  describe("#scaling", () => {
    it("works correctly", () => {
      expect(m4.scaling(2, 3, 4)).toEqual([
        2, 0, 0, 0,
        0, 3, 0, 0,
        0, 0, 4, 0,
        0, 0, 0, 1,
      ])
    })
  })

  describe("#scalingVector", () => {
    it("works correctly", () => {
      const m = m4.compose(
        [0, 0.9238795292366128, 0, 0.38268342717215614],
        [2, 3, 4],
        [2, 3, 4],
      )
      expect(m4.scalingVector(m)).toCloseEqual([2, 3, 4])
    })
  })

  describe("#compose", () => {
    it("works correctly", () => {
      const m = m4.compose(
        [0, 0.9238795292366128, 0, 0.38268342717215614],
        [2, 3, 4],
        [2, 3, 4],
      )
      expect(m).toCloseEqual([
        -1.414, 0, -1.414, 0,
        0, 3, 0, 0,
        2.828, 0, -2.828, 0,
        2, 3, 4, 1,
      ])
    })
  })

  describe("#orthographic", () => {
    it("works correctly", () => {
      const m = m4.orthographic(-10, 10, -10, 10, 1, 100)
      expect(m).toCloseEqual([
        0.1, 0, 0, 0,
        0, -0.1, 0, 0,
        0, 0, -0.02, 0,
        0, 0, -1.02, 1,
      ])
    })
  })

  describe("#perspective", () => {
    it("works correctly", () => {
      const m = m4.perspective(Math.PI / 2, 1, 0.1, 100)
      expect(m).toCloseEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1.002, -1,
        0, 0, -0.2002, 0,
      ])
    })
  })

  describe("#lookAt", () => {
    it("works correctly", () => {
      const m = m4.lookAt([1, 1, 1], [0, 0, 0], [0, 1, 0])
      expect(m).toCloseEqual([
        0.707, 0, -0.707, 0,
        -0.408, 0.816, -0.408, 0,
        0.577, 0.577, 0.577, 0,
        1, 1, 1, 1,
      ])
    })
  })
})
