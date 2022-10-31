import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { clamp } from "@math/operators"
import { Camera, OrthographicCamera } from "@core/camera"
import { LightType, LightWithShadow } from "@core/lights/types"
import { RGB } from "@core/color/rgb"

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
  // How much to add or subtract from depth shadow map to reduce shadow acne.
  // Do not set a huge value.
  // Default is 0.001.
  bias?: number
}

export class DirectionalLight implements LightWithShadow {
  public readonly type: LightType
  public readonly castShadow: boolean
  public readonly color: RGB
  public readonly direction: Vector3 = Vector3.zero()
  public intensity: number
  public bias: number

  private readonly camera: Camera

  public get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  public constructor({
    castShadow = false,
    intensity = 1,
    color = 0xFFFFFF,
    bias = 0.001,
  }: Props = {}) {
    this.type = LightType.Directional
    this.color = new RGB(color)
    this.castShadow = castShadow
    this.intensity = clamp(intensity, 0, 1)
    this.bias = bias
    this.camera = new OrthographicCamera({
      left: -1500,
      right: 1500,
      top: 1500,
      bottom: -1500,
      near: 0.5,
      far: 2000,
    })
    this.updateDirection()
  }

  public setPosition(position: Vector3): void {
    this.camera.setPosition(position)
    this.updateDirection()
  }

  public setTarget(target: Vector3): void {
    this.camera.lookAt(target)
    this.updateDirection()
  }

  private updateDirection(): void {
    this.direction.copy(this.camera.position).subtract(this.camera.target).normalize()
  }
}
