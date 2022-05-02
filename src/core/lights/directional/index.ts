import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, OrthographicCamera } from '../../camera'
import { LightType, LightWithShadow } from '../types'
import { hexToNormRgb } from '../../../utils/color'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  // Hexadecimal color of the light.
  // Default is 0xFFFFFF (white).
  color?: number
  // The light's strength/intensity value.
  // Takes values between 0 and 1. Default is 1.
  intensity?: number
  // The flag to enable or disable dynamic shadows.
  // Default if true (shadow is enabled).
  castShadow?: boolean
}

export class DirectionalLight implements LightWithShadow {
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
    this.color = hexToNormRgb(color)
    this.castShadow = castShadow
    this.intensity = intensity
    this.camera = new OrthographicCamera({
      left: -50,
      right: 50,
      top: 50,
      bottom: -50,
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
    this.direction = v3.normalize(v3.subtract(this.camera.position, this.camera.target))
  }
}
