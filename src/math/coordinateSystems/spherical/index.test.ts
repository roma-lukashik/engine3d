import {
  cartesian2spherical,
  spherical2cartesian,
} from '.'
import { vector3, zero } from '../../vector3'

describe('sphericalCoordinateSystem', () => {
  describe('#cartesian2spherical', () => {
    it('works correctly', () => {
      const v = vector3(2, 4 * Math.sqrt(3), 2 * Math.sqrt(3))
      const { radius, theta, phi } = cartesian2spherical(v, zero())
      expect(radius).toPrettyEqual(8)
      expect(theta).toPrettyEqual(Math.PI / 6)
      expect(phi).toPrettyEqual(Math.PI / 6)
    })
  })

  describe('#spherical2cartesian', () => {
    it('works correctly', () => {
      const s = {
        radius: 8,
        theta: Math.PI / 6,
        phi: Math.PI / 6,
      }
      expect(spherical2cartesian(s)).toPrettyEqual([
        2,
        4 * Math.sqrt(3),
        2 * Math.sqrt(3)
      ])
    })
  })
})
