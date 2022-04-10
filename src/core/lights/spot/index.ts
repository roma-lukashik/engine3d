import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, PerspectiveCamera } from '../../camera'
import { LightType, LightWithShadow } from '../types'
import { normHex2rgb } from '../../../utils/color'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  color?: number
  castShadow?: boolean
  // The spotlight's strength/intensity value.
  // Takes values between 0 and 1. Default is 1.
  intensity?: number
  // Maximum range of the spotlight.
  // Default is 0 (no limit).
  distance?: number
  // Maximum angle (in radian) of the spotlight dispersion from its direction.
  // Takes values between 0 abd PI/2. Default is PI/3.
  angle?: number
  // Percent of the spotlight cone that is attenuated due to penumbra.
  // Takes values between 0 and 1. Default is 0.
  penumbra?: number
}

export class SpotLight implements LightWithShadow {
  private readonly camera: Camera

  public readonly type: LightType
  public readonly castShadow: boolean
  public color: Vector3
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

  constructor({
    castShadow = true,
    color = 0xFFFFFF,
    intensity = 1,
    distance = 0,
    angle = Math.PI / 3,
    penumbra = 0,
  }: Props = {}) {
    this.type = LightType.SpotLight
    this.color = normHex2rgb(color)
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
