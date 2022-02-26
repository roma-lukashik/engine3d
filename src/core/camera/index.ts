import * as m4 from '../../math/matrix4'
import * as v3 from '../../math/vector3'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type CameraOptions = {
  up?: Vector3;
  near?: number;
  far?: number;
  aspect?: number;
  fovy?: number;
  position?: Vector3;
}

export type Camera = {
  readonly position: Vector3;
  readonly target: Vector3;
  readonly projectionMatrix: Matrix4;
  setPosition(cameraPosition: Vector3): void
  lookAt(target: Vector3): void;
  setOptions(options: CameraOptions): void;
}

export const createCamera = ({
  up = v3.vector3(0, 1, 0),
  near = 0.1,
  far = 2000,
  aspect = 1,
  fovy = toRadian(60),
  position = v3.zero(),
}: CameraOptions): Camera => {
  return new PerspectiveCamera({ up, near, far, aspect, fovy, position })
}

class PerspectiveCamera implements Camera {
  private near: number
  private far: number
  private aspect: number
  private fovy: number
  private up: Vector3
  private perspectiveMatrix: Matrix4

  public position: Vector3
  public target: Vector3 = v3.zero()

  public projectionMatrix: Matrix4 = m4.identity()

  constructor(options: CameraOptions) {
    this.setOptions(options)
  }

  public setPosition(cameraPosition: Vector3): void {
    this.position = cameraPosition
    this.updateProjectionMatrix()
  }

  public lookAt(target: Vector3): void {
    this.target = target
    this.updateProjectionMatrix()
  }

  public setOptions(options: CameraOptions): void {
    Object.assign(this, options)
    this.updatePerspectiveMatrix()
    this.updateProjectionMatrix()
  }

  private updateProjectionMatrix(): void {
    const viewMatrix = m4.invert(m4.lookAt(this.position, this.target, this.up))
    this.projectionMatrix = m4.multiply(this.perspectiveMatrix, viewMatrix)
  }

  private updatePerspectiveMatrix(): void {
    this.perspectiveMatrix = m4.perspective(this.fovy, this.aspect, this.near, this.far)
  }
}

const toRadian = (deg: number): number => deg * Math.PI / 180
