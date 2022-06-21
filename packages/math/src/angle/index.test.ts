import { toRadian } from "@math/angle"
import { PI } from "@math/constants"

describe("Angle", () => {
  describe("toRadian", () => {
    it.each([
      [0, 0],
      [30, PI / 6],
      [45, PI / 4],
      [180, PI],
      [-60, -PI / 3],
    ])("toRadian(%d)=%d", (deg, rad) => {
      expect(toRadian(deg)).toBeCloseTo(rad)
    })
  })
})
