import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, OrthographicCamera } from '../../camera'
import { Light, LightType, LightWithShadow } from '../types'
import { hex2rbgNormalized } from '../../../math/color'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  color?: number
  intensity?: number
  castShadow?: boolean
}

export class DirectionalLight implements Light, LightWithShadow {
  private readonly camera: Camera

  public readonly type: LightType
  public readonly castShadow: boolean
  public direction: Vector3
  public color: Vector3
  public intensity: number

  public get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  constructor({
    castShadow = true,
    intensity = 1,
    color = 0xFFFFFF,
  }: Props = {}) {
    this.type = LightType.Directional
    this.color = hex2rbgNormalized(color)
    this.castShadow = castShadow
    this.intensity = intensity
    this.camera = new OrthographicCamera({
      left: -5,
      right: 5,
      top: 5,
      bottom: -5,
      near: 0.5,
      far: 500,
    })
    this.updateDirection()
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
    this.updateDirection();
  }

  setTarget(target: Vector3): void {
    this.camera.lookAt(target)
    this.updateDirection();
  }

  private updateDirection(): void {
    this.direction = v3.subtract(this.camera.position, this.camera.target)
  }
}
