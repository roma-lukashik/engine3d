import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, createCamera } from '../../camera'
import { Light } from '../types'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type LightOptions = {
  up?: Vector3;
  near?: number;
  far?: number;
  aspect?: number;
  fovy?: number;
  position?: Vector3;
}

export const createPointLight = (options: LightOptions): Light => {
  return new PointLight(options)
}

class PointLight implements Light {
  private readonly camera: Camera

  get position(): Vector3 {
    return this.camera.position
  }

  get target(): Vector3 {
    return this.camera.target
  }

  get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  constructor(options: LightOptions) {
    this.camera = createCamera(options)
  }

  lookAt(target: Vector3): void {
    this.camera.lookAt(target)
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
  }

  setOptions(options: LightOptions): void {
    this.camera.setOptions(options)
  }
}
