import { toRadian } from "@math/angle"
import * as m4 from "@math/matrix4"
import * as v3 from "@math/vector3"
import { Matrix4, Vector3 } from "@math/types"
import { Camera } from "@core/camera/types"

type Props = {
  up?: Vector3
  near?: number
  far?: number
  aspect?: number
  fovy?: number
}

export class PerspectiveCamera implements Camera {
  private near: number
  private far: number
  private aspect: number
  private fovy: number
  private up: Vector3
  private perspectiveMatrix: Matrix4 = m4.identity()

  public position: Vector3 = v3.zero()
  public target: Vector3 = v3.zero()
  public projectionMatrix: Matrix4 = m4.identity()

  constructor({
    up = v3.vector3(0, 1, 0),
    near = 0.1,
    far = 2000,
    aspect = 1,
    fovy = toRadian(60),
  }: Props = {}) {
    this.setOptions({ up, near, far, aspect, fovy })
  }

  public setPosition(cameraPosition: Vector3): void {
    this.position = cameraPosition
    this.updateProjectionMatrix()
  }

  public lookAt(target: Vector3): void {
    this.target = target
    this.updateProjectionMatrix()
  }

  public setOptions(options: Props): void {
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
