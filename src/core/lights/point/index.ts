import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, PerspectiveCamera } from '../../camera'
import { Light, LightType, LightWithShadow } from '../types'
import { toRadian } from '../../../math/angle'
import { hex2rbgNormalized } from '../../../math/color'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  color?: number
  castShadow?: boolean
}

export class PointLight implements Light, LightWithShadow {
  private readonly camera: Camera

  public readonly type: LightType
  public readonly castShadow: boolean
  public color: Vector3

  public get position(): Vector3 {
    return this.camera.position
  }

  public get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  constructor({
    castShadow = true,
    color = 0xFFFFFF,
  }: Props = {}) {
    this.type = LightType.Point
    this.color = hex2rbgNormalized(color)
    this.castShadow = castShadow
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
