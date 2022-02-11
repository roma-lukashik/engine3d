import { add, det, identity, invert, Matrix3, scalar, subtract, transpose } from '.'

describe('matrix3', () => {
  describe('#identity', () => {
    it('works correctly', () => {
      expect(identity()).toEqual([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ])
    })
  })

  describe('#det', () => {
    it('works correctly', () => {
      const m: Matrix3 = [
        1, 2, 3,
        0, 1, 4,
        5, 6, 0
      ]
      expect(det(m)).toBe(1)
    })
  })

  describe('#invert', () => {
    it('works correctly', () => {
      const m: Matrix3 = [
        1, 2, 3,
        0, 1, 4,
        5, 6, 0
      ]
      expect(invert(m)).toEqual([
        -24, 18, 5,
        20, -15, -4,
        -5, 4, 1,
      ])
    })

    it('returns null if determinant is zero', () => {
      const m: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      expect(invert(m)).toBeNull()
    })
  })

  describe('#transpose', () => {
    it('works correctly', () => {
      const m: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      expect(transpose(m)).toEqual([
        1, 4, 7,
        2, 5, 8,
        3, 6, 9,
      ])
    })
  })

  describe('#add', () => {
    it('works correctly', () => {
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
      expect(add(a, b)).toEqual([
        2, 6, 10,
        6, 10, 14,
        10, 14, 18,
      ])
    })
  })

  describe('#subtract', () => {
    it('works correctly', () => {
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
      expect(subtract(a, b)).toEqual([
        0, -2, -4,
        2, 0, -2,
        4, 2, 0,
      ])
    })
  })

  describe('#scalar', () => {
    it('works correctly', () => {
      const a: Matrix3 = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ]
      expect(scalar(a, 2)).toEqual([
        2, 4, 6,
        8, 10, 12,
        14, 16, 18,
      ])
    })
  })
})
