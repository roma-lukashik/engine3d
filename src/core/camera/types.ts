import { Matrix4 } from '../../math/matrix4'
import { Vector3 } from '../../math/vector3'

export type Camera = {
  readonly position: Vector3;
  readonly target: Vector3;
  readonly projectionMatrix: Matrix4;
  setPosition(cameraPosition: Vector3): void
  lookAt(target: Vector3): void;
  setOptions<T extends Record<string, any> = object>(options: T): void;
}
