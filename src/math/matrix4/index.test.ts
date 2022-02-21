import {
  add,
  det,
  identity,
  invert,
  Matrix4,
  multiply,
  rotateX,
  rotateY,
  rotateZ,
  scalar,
  scale,
  subtract,
  translate,
  transpose,
} from '.'

describe('matrix4', () => {
  describe('#identity', () => {
    it('works correctly', () => {
      expect(identity()).toEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    })
  })

  describe('#det', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(det(m)).toBe(-80)
    })
  })

  describe('#transpose', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(transpose(m)).toEqual([
        1, 4, 4, 3,
        2, 1, 3, 2,
        3, 3, 2, 4,
        4, 2, 1, 1,
      ])
    })
  })

  describe('#invert', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(invert(m)).toPrettyEqual([
        -0.1375, 0.3125, 0.1125, -0.1875,
        0.1125, -0.4375, 0.3625, 0.0625,
        -0.0125, -0.0625, -0.2625, 0.4375,
        0.2375, 0.1875, -0.0125, -0.3125,
      ])
    })

    it('returns zero matrix if det=0', () => {
      const m: Matrix4 = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ]
      expect(invert(m)).toEqual([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ])
    })
  })

  describe('#add', () => {
    it('works correctly', () => {
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
      expect(add(a, b)).toEqual([
        2, 6, 7, 7,
        6, 2, 6, 4,
        7, 6, 4, 5,
        7, 4, 5, 2,
      ])
    })
  })

  describe('#subtract', () => {
    it('works correctly', () => {
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
      expect(subtract(a, b)).toEqual([
        0, -2, -1, 1,
        2, 0, 0, 0,
        1, 0, 0, -3,
        -1, 0, 3, 0,
      ])
    })
  })

  describe('#scalar', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(scalar(m, 2)).toEqual([
        2, 4, 6, 8,
        8, 2, 6, 4,
        8, 6, 4, 2,
        6, 4, 8, 2,
      ])
    })
  })

  describe('#multiply', () => {
    it('works correctly', () => {
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
      expect(multiply(a, b)).toEqual([
        30, 23, 20, 23,
        23, 30, 27, 28,
        20, 27, 30, 27,
        23, 28, 27, 30,
      ])
    })
  })

  describe('#rotateX', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(rotateX(m, Math.PI / 4)).toPrettyEqual([
        1, 3.535, 0.707, 4,
        4, 2.828, 1.414, 2,
        4, 3.535, -0.707, 1,
        3, 4.243, 1.414, 1,
      ])
    })
  })

  describe('#rotateY', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(rotateY(m, Math.PI / 4)).toPrettyEqual([
        -1.414, 2, 2.828, 4,
        0.707, 1, 4.949, 2,
        1.414, 3, 4.243, 1,
        -0.707, 2, 4.949, 1,
      ])
    })
  })

  describe('#rotateZ', () => {
    it('works correctly', () => {
      const m: Matrix4 = [
        1, 2,	3, 4,
        4, 1,	3, 2,
        4, 3,	2, 1,
        3, 2,	4, 1,
      ]
      expect(rotateZ(m, Math.PI / 4)).toPrettyEqual([
        2.121, 0.707, 3, 4,
        3.535, -2.121, 3, 2,
        4.949, -0.707, 2, 1,
        3.535, -0.707, 4, 1,
      ])
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
      expect(translate(m, 2, 3, 4)).toEqual([
        1, 2,	3, 24,
        4, 1,	3, 25,
        4, 3,	2, 26,
        3, 2,	4, 29,
      ])
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
      expect(scale(m, 2, 3, 4)).toEqual([
        2, 6, 12, 4,
        8, 3, 12, 2,
        8, 9, 8, 1,
        6, 6, 16, 1
      ])
    })
  })
})
