import { add, det, identity, invert, Matrix4, scalar, subtract, transpose } from '.'

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
})
