import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera, createCamera } from '../../camera'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

export type Lighting = {
  projectionMatrix: Matrix4;
  getPosition: () => Vector3;
  setPosition: (target: Vector3) => void;
  getTarget: () => Vector3;
  lookAt: (target: Vector3) => void;
}

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
  private camera: Camera

  get projectionMatrix(): Matrix4 {
    return this.camera.projectionMatrix
  }

  constructor(options: LightingOptions) {
    this.camera = createCamera(options)
  }

  lookAt(target: Vector3): void {
    this.camera.lookAt(target)
  }

  getPosition(): Vector3 {
    return this.camera.getPosition()
  }

  getTarget(): Vector3 {
    return this.camera.getTarget()
  }

  setPosition(position: Vector3): void {
    this.camera.setPosition(position)
  }
}
