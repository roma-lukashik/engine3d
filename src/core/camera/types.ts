import { Matrix4 } from '../../math/matrix4'
import { Vector3 } from '../../math/vector3'

export type Camera<T extends Record<string, any> = object> = {
  readonly position: Vector3;
  readonly target: Vector3;
  readonly projectionMatrix: Matrix4;
  setPosition(cameraPosition: Vector3): void
  lookAt(target: Vector3): void;
  setOptions(options: T): void;
}
