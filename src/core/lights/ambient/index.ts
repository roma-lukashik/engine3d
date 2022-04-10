import { Light, LightType } from '../types'
import { normHex2rgb } from '../../../utils/color'
import { Vector3 } from '../../../math/vector3'

type Props = {
  color?: number
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
    this.color = normHex2rgb(color)
    this.intensity = intensity
  }
}
