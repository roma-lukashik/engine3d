import { Light, LightType } from "@core/lights/types"
import { RGB } from "@core/color/rgb"
import { clamp } from "@math/operators"

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
  public readonly color: RGB
  public intensity: number

  constructor({
    color = 0xFFFFFF,
    intensity = 0.1,
  }: Props = {}) {
    this.type = LightType.Ambient
    this.castShadow = false
    this.color = new RGB(color)
    this.intensity = clamp(intensity, 0, 1)
  }
}
