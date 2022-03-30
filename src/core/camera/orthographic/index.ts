import * as m4 from '../../../math/matrix4'
import * as v3 from '../../../math/vector3'
import { Camera } from '../types'

type Vector3 = v3.Vector3
type Matrix4 = m4.Matrix4

type Props = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  zoom?: number;
  near?: number;
  far?: number;
}

export class OrthographicCamera implements Camera {
  private left: number
  private right: number
  private top: number
  private bottom: number
  private zoom: number
  private near: number
  private far: number
  private up: Vector3 = v3.vector3(0, 1, 0)
  private orthographicMatrix: Matrix4 = m4.identity()

  public position: Vector3 = v3.vector3(0, 1, 0)
  public target: Vector3 = v3.zero()
  public projectionMatrix: Matrix4 = m4.identity()

  constructor({
    left,
    right,
    top,
    bottom,
    zoom = 1,
    near = 1,
    far = 1000,
  }: Props) {
    this.setOptions({ left, right, top, bottom, zoom, near, far })
  }

  public setPosition(cameraPosition: Vector3): void {
    this.position = cameraPosition
    this.updateProjectionMatrix()
  }

  public lookAt(target: Vector3): void {
    this.target = target
    this.updateProjectionMatrix()
  }

  public setOptions(options: Partial<Props>): void {
    Object.assign(this, options)
    this.updateOrthographicMatrix()
    this.updateProjectionMatrix()
  }

  private updateProjectionMatrix(): void {
    const viewMatrix = m4.invert(m4.lookAt(this.position, this.target, this.up))
    this.projectionMatrix = m4.multiply(this.orthographicMatrix, viewMatrix)
  }

  private updateOrthographicMatrix(): void {
    this.orthographicMatrix = m4.orthographic(
      this.left / this.zoom,
      this.right / this.zoom,
      this.top / this.zoom,
      this.bottom / this.zoom,
      this.near,
      this.far,
    )
  }
}
