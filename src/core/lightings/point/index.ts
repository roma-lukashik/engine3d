import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, createCamera } from '../../camera'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

export type Lighting = Camera

type LightingOptions = {
  up?: Vector3;
  near?: number;
  far?: number;
  aspect?: number;
  fovy?: number;
  position?: Vector3;
}

export const createLighting = (options: LightingOptions): Lighting => {
  return new PointLighting(options)
}

class PointLighting implements Lighting {
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

  constructor(options: LightingOptions) {
    this.camera = createCamera(options)
  }

  lookAt(target: Vector3): void {
    this.camera.lookAt(target)
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
  }

  setOptions(options: LightingOptions): void {
    this.camera.setOptions(options)
  }
}
