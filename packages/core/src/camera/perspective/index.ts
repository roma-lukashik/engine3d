import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { Camera } from "@core/camera/types"

type Props = {
  up?: Vector3
  near?: number
  far?: number
  aspect?: number
  fovy?: number
}

export class PerspectiveCamera implements Camera {
  public readonly position: Vector3 = Vector3.zero()
  public readonly target: Vector3 = Vector3.zero()
  public readonly projectionMatrix: Matrix4 = Matrix4.identity()
  public readonly viewMatrix: Matrix4 = Matrix4.identity()

  private readonly perspectiveMatrix: Matrix4 = Matrix4.identity()
  private near: number
  private far: number
  private aspect: number
  private fovy: number
  private up: Vector3

  public constructor({
    up = new Vector3(0, 1, 0),
    near = 0.1,
    far = 2000,
    aspect = 1,
    fovy = toRadian(60),
  }: Props = {}) {
    this.setOptions({ up, near, far, aspect, fovy })
  }

  public setPosition(cameraPosition: Vector3): void {
    this.position.copy(cameraPosition)
    this.updateProjectionMatrix()
  }

  public lookAt(target: Vector3): void {
    this.target.copy(target)
    this.updateProjectionMatrix()
  }

  public setOptions(options: Props): void {
    Object.assign(this, options)
    this.updatePerspectiveMatrix()
    this.updateProjectionMatrix()
  }

  private updateProjectionMatrix(): void {
    if (this.position.equal(this.target)) {
      this.projectionMatrix.identity()
    } else {
      this.viewMatrix.lookAt(this.position, this.target, this.up).invert()
      this.projectionMatrix.copy(this.perspectiveMatrix).multiply(this.viewMatrix)
    }
  }

  private updatePerspectiveMatrix(): void {
    this.perspectiveMatrix.perspective(this.fovy, this.aspect, this.near, this.far)
  }
}
