import { DirectionalLight } from "@core/lights/directional"
import { LightType } from "@core/lights/types"

describe("DirectionalLight", () => {
  describe("default props", () => {
    const light = new DirectionalLight()

    it("has a correct color", () => {
      expect(light.color).toEqual([1, 1, 1])
    })

    it("has a correct intensity", () => {
      expect(light.intensity).toBe(1)
    })

    it("has a correct type", () => {
      expect(light.type).toBe(LightType.Directional)
    })

    it("does not cast shadow", () => {
      expect(light.castShadow).toBe(false)
    })
  })

  describe("custom props", () => {
    const light = new DirectionalLight({
      color: 0x333333,
      intensity: 0.5,
      castShadow: true,
    })

    it("has a correct color", () => {
      expect(light.color).toEqual([0.2, 0.2, 0.2])
    })

    it("has a correct intensity", () => {
      expect(light.intensity).toBe(0.5)
    })

    it("casts shadow", () => {
      expect(light.castShadow).toBe(true)
    })
  })

  describe("intensity validation", () => {
    it("sets a min intensity", () => {
      const light = new DirectionalLight({ intensity: -1 })
      expect(light.intensity).toBe(0)
    })

    it("sets a max intensity", () => {
      const light = new DirectionalLight({ intensity: 2 })
      expect(light.intensity).toBe(1)
    })
  })
})
