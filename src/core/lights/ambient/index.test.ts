import { AmbientLight } from '.'
import { LightType } from '../types'

describe('AmbientLight', () => {
  describe('default props', () => {
    const light = new AmbientLight()

    it('has a correct color', () => {
      expect(light.color).toEqual([1, 1, 1])
    })

    it('has a correct intensity', () => {
      expect(light.intensity).toBe(0.1)
    })

    it('has a correct type', () => {
      expect(light.type).toBe(LightType.Ambient)
    })

    it('does not cast shadow', () => {
      expect(light.castShadow).toBe(false)
    })
  })

  describe('custom props', () => {
    const light = new AmbientLight({ color: 0x333333, intensity: 0.5 })

    it('has a correct color', () => {
      expect(light.color).toEqual([0.2, 0.2, 0.2])
    })

    it('has a correct intensity', () => {
      expect(light.intensity).toBe(0.5)
    })
  })

  describe('intensity validation', () => {
    it('sets a min intensity', () => {
      const light = new AmbientLight({ intensity: -1 })
      expect(light.intensity).toBe(0)
    })

    it('sets a max intensity', () => {
      const light = new AmbientLight({ intensity: 2 })
      expect(light.intensity).toBe(1)
    })
  })
})
