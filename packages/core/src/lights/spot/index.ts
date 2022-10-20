import { Camera, PerspectiveCamera } from "@core/camera"
import { LightType, LightWithShadow } from "@core/lights/types"
import { RGB } from "@core/color/rgb"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"

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
  // Maximum range of the light.
  // Default is 0 (no limit).
  distance?: number
  // Maximum angle (in radian) of the light dispersion from its direction.
  // Takes values between 0 abd PI/2. Default is PI/3.
  angle?: number
  // Percent of the light cone that is attenuated due to penumbra.
  // Takes values between 0 and 1. Default is 0.
  penumbra?: number
}

export class SpotLight implements LightWithShadow {
  public readonly type: LightType
  public readonly castShadow: boolean
  public readonly color: RGB
  public intensity: number
  public distance: number
  public angle: number
  public penumbra: number

  public get position(): Vector3 {
    return this.camera.position
  }

  public get target(): Vector3 {
    return this.camera.target
  }

  public get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  public get coneCos(): number {
    return Math.cos(this.angle)
  }

  public get penumbraCos(): number {
    return Math.cos(this.angle * (1 - this.penumbra))
  }

  private readonly camera: Camera

  public constructor({
    castShadow = true,
    color = 0xFFFFFF,
    intensity = 1,
    distance = 0,
    angle = Math.PI / 3,
    penumbra = 0,
  }: Props = {}) {
    this.type = LightType.SpotLight
    this.color = new RGB(color)
    this.castShadow = castShadow
    this.intensity = intensity
    this.distance = distance
    this.angle = angle
    this.penumbra = penumbra
    this.camera = new PerspectiveCamera({
      near: 0.5,
      far: distance || 100,
      fovy: 2 * angle,
    })
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
  }

  setTarget(target: Vector3): void {
    this.camera.lookAt(target)
  }
}
