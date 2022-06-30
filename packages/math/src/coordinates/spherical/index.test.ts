import { toSpherical, fromSpherical } from "@math/coordinates/spherical"
import { Vector3 } from "@math/vector3"
import { PI } from "@math/constants"

const PI6 = PI / 6

describe("sphericalCoordinateSystem", () => {
  describe("toSpherical", () => {
    it("works correctly", () => {
      const v = new Vector3(2, 4 * Math.sqrt(3), 2 * Math.sqrt(3))
      const { radius, theta, phi } = toSpherical(v, Vector3.zero())
      expect(radius).toBeCloseTo(8)
      expect(theta).toBeCloseTo(PI6)
      expect(phi).toBeCloseTo(PI6)
    })
  })

  describe("fromSpherical", () => {
    it("works correctly", () => {
      expect(fromSpherical({
        radius: 8,
        theta: PI6,
        phi: PI6,
      })).toValueEqual([
        2,
        4 * Math.sqrt(3),
        2 * Math.sqrt(3),
      ])
    })
  })
})
