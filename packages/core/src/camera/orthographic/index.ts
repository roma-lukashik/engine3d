import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"
import { Camera } from "@core/camera/types"

type Props = {
  left: number
  right: number
  top: number
  bottom: number
  zoom?: number
  near?: number
  far?: number
}

export class OrthographicCamera implements Camera {
  public readonly position: Vector3 = Vector3.zero()
  public readonly target: Vector3 = Vector3.zero()
  public readonly projectionMatrix: Matrix4 = Matrix4.identity()
  public readonly viewMatrix: Matrix4 = Matrix4.identity()

  private readonly orthographicMatrix: Matrix4 = Matrix4.identity()
  private left: number
  private right: number
  private top: number
  private bottom: number
  private zoom: number
  private near: number
  private far: number
  private up: Vector3 = new Vector3(0, 1, 0)

  public constructor({
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
    this.position.copy(cameraPosition)
    this.updateProjectionMatrix()
  }

  public lookAt(target: Vector3): void {
    this.target.copy(target)
    this.updateProjectionMatrix()
  }

  public setOptions(options: Partial<Props>): void {
    Object.assign(this, options)
    this.updateOrthographicMatrix()
    this.updateProjectionMatrix()
  }

  private updateProjectionMatrix(): void {
    if (this.position.equal(this.target)) {
      this.projectionMatrix.identity()
    } else {
      this.viewMatrix.lookAt(this.position, this.target, this.up).invert()
      this.projectionMatrix.copy(this.orthographicMatrix).multiply(this.viewMatrix)
    }
  }

  private updateOrthographicMatrix(): void {
    this.orthographicMatrix.orthographic(
      this.left / this.zoom,
      this.right / this.zoom,
      this.top / this.zoom,
      this.bottom / this.zoom,
      this.near,
      this.far,
    )
  }
}
