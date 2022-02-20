import * as m4 from '../../math/matrix4'
import * as v3 from '../../math/vector3'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type CameraOptions = {
  zoom?: number;
  up?: Vector3;
  near?: number;
  far?: number;
  aspect?: number;
  fovy?: number;
  position?: Vector3;
}

export type Camera = {
  projectionMatrix: Matrix4;
  getPosition(): Vector3;
  setPosition(cameraPosition: Vector3): void
  getTarget(): Vector3;
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
  private position: Vector3
  private targetPosition: Vector3 = v3.zero()

  public projectionMatrix: Matrix4 = m4.identity()

  constructor(options: CameraOptions) {
    this.setOptions(options)
  }

  public getPosition(): Vector3 {
    return this.position
  }

  public setPosition(cameraPosition: Vector3): void {
    this.position = cameraPosition
    this.updateProjectionMatrix()
  }

  public getTarget(): Vector3 {
    return this.targetPosition
  }

  public lookAt(target: Vector3): void {
    this.targetPosition = target
    this.updateProjectionMatrix()
  }

  public setOptions(options: CameraOptions): void {
    Object.assign(this, options)
    this.updatePerspectiveMatrix()
    this.updateProjectionMatrix()
  }

  private updateProjectionMatrix(): void {
    const viewMatrix = m4.invert(lookAt(this.position, this.targetPosition, this.up))!
    this.projectionMatrix = m4.multiply(viewMatrix, this.perspectiveMatrix)
  }

  private updatePerspectiveMatrix(): void {
    this.perspectiveMatrix = perspective(this.fovy, this.aspect, this.near, this.far)
  }
}

const perspective = (fovy: number, aspect: number, near: number, far: number): Matrix4 => {
  const scaleY = Math.tan((Math.PI - fovy) / 2)
  const scaleX = scaleY / aspect
  const rangeInv = 1.0 / (near - far)

  return [
    scaleX, 0, 0, 0,
    0, scaleY, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  ]
}

const lookAt = (eye: Vector3, target: Vector3, up: Vector3): Matrix4 => {
  const z = v3.normalize(v3.subtract(eye, target))
  const x = v3.normalize(v3.cross(up, z))
  const y = v3.normalize(v3.cross(z, x))

  return [
    ...x, 0,
    ...y, 0,
    ...z, 0,
    ...eye, 1,
  ]
}

const toRadian = (deg: number): number => deg * Math.PI / 180
