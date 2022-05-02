import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, PerspectiveCamera } from '../../camera'
import { LightType, LightWithShadow } from '../types'
import { toRadian } from '../../../math/angle'
import { hexToNormRgb } from '../../../utils/color'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  color?: number
  castShadow?: boolean
  intensity?: number
}

// Don't use it.
export class PointLight implements LightWithShadow {
  private readonly camera: Camera

  public readonly type: LightType
  public readonly castShadow: boolean
  public color: Vector3
  public intensity: number

  public get position(): Vector3 {
    return this.camera.position
  }

  public get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  constructor({
    castShadow = true,
    color = 0xFFFFFF,
    intensity = 1,
  }: Props = {}) {
    this.type = LightType.Point
    this.color = hexToNormRgb(color)
    this.castShadow = castShadow
    this.intensity = intensity
    this.camera = new PerspectiveCamera({
      near: 0.5,
      far: 500,
      fovy: toRadian(90),
    })
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
  }
}
