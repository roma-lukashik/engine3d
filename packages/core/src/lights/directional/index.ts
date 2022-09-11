import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { clamp } from "@math/operators"
import { Camera, OrthographicCamera } from "@core/camera"
import { LightType, LightWithShadow } from "@core/lights/types"
import { Color } from "@core/color"

type Props = {
  // Hexadecimal color of the light.
  // Default is 0xFFFFFF (white).
  color?: number
  // The light's strength/intensity value.
  // Takes values between 0 and 1. Default is 1.
  intensity?: number
  // The flag to enable or disable dynamic shadows.
  // Default if false (shadow is disabled).
  castShadow?: boolean

  bias?: number
}

export class DirectionalLight implements LightWithShadow {
  private readonly camera: Camera

  public readonly type: LightType
  public readonly castShadow: boolean
  public direction: Vector3
  public color: Vector3
  public intensity: number
  public bias: number

  public get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  constructor({
    castShadow = false,
    intensity = 1,
    color = 0xFFFFFF,
    bias = 0.001,
  }: Props = {}) {
    this.type = LightType.Directional
    this.color = new Color(color).rgb
    this.castShadow = castShadow
    this.intensity = clamp(intensity, 0, 1)
    this.bias = bias
    this.camera = new OrthographicCamera({
      left: -1000,
      right: 1000,
      top: 1000,
      bottom: -1000,
      near: 0.5,
      far: 2000,
    })
    this.updateDirection()
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
    this.updateDirection()
  }

  setTarget(target: Vector3): void {
    this.camera.lookAt(target)
    this.updateDirection()
  }

  private updateDirection(): void {
    this.direction = this.camera.position.clone().subtract(this.camera.target).normalize()
  }
}
