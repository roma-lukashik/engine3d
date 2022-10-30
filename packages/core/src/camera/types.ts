import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"

export type Camera = {
  readonly position: Vector3
  readonly target: Vector3
  readonly projectionMatrix: Matrix4
  readonly viewMatrix: Matrix4
  setPosition(cameraPosition: Vector3): void
  lookAt(target: Vector3): void
  setOptions<T extends object = object>(options: T): void
}
