import { toSpherical, fromSpherical } from "@math/coordinates/spherical"
import { vector3, zero } from "@math/vector3"

describe("sphericalCoordinateSystem", () => {
  describe("#toSpherical", () => {
    it("works correctly", () => {
      const v = vector3(2, 4 * Math.sqrt(3), 2 * Math.sqrt(3))
      const { radius, theta, phi } = toSpherical(v, zero())
      expect(radius).toCloseEqual(8)
      expect(theta).toCloseEqual(Math.PI / 6)
      expect(phi).toCloseEqual(Math.PI / 6)
    })
  })

  describe("#fromSpherical", () => {
    it("works correctly", () => {
      const s = {
        radius: 8,
        theta: Math.PI / 6,
        phi: Math.PI / 6,
      }
      expect(fromSpherical(s)).toCloseEqual([
        2,
        4 * Math.sqrt(3),
        2 * Math.sqrt(3),
      ])
    })
  })
})
