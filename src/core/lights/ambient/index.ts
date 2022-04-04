import { Light, LightType } from '../types'
import { Color } from '../../../math/color'

type Props = {
  color?: number
  intensity?: number
}

export class AmbientLight implements Light {
  public readonly type: LightType
  public readonly castShadow: boolean
  public color: Color
  public intensity: number

  constructor({
    color = 0xFFFFFF,
    intensity = 0.1,
  }: Props = {}) {
    this.type = LightType.Ambient
    this.castShadow = false
    this.color = new Color(color)
    this.intensity = intensity
  }
}
