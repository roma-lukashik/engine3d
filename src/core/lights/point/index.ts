import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, PerspectiveCamera } from '../../camera'
import { Light } from '../types'
import { toRadian } from '../../../math/angle'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  castShadow?: boolean;
}

export class PointLight implements Light {
  private readonly camera: Camera

  public readonly castShadow: boolean

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
  }: Props = {}) {
    this.castShadow = castShadow
    this.camera = new PerspectiveCamera({
      near: 0.5,
      far: 500,
      fovy: toRadian(90),
    })
  }

  lookAt(target: Vector3): void {
    this.camera.lookAt(target)
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
  }
}
