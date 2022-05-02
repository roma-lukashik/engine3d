import { Light, LightType } from '../types'
import { hexToNormRgb } from '../../../utils/color'
import { Vector3 } from '../../../math/vector3'

type Props = {
  // Hexadecimal color of the light.
  // Default is 0xFFFFFF (white).
  color?: number
  // The light's strength/intensity value.
  // Takes values between 0 and 1. Default is 0.1.
  intensity?: number
}

export class AmbientLight implements Light {
  public readonly type: LightType
  public readonly castShadow: boolean
  public color: Vector3
  public intensity: number

  constructor({
    color = 0xFFFFFF,
    intensity = 0.1,
  }: Props = {}) {
    this.type = LightType.Ambient
    this.castShadow = false
    this.color = hexToNormRgb(color)
    this.intensity = intensity
  }
}
