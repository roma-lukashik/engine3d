import { Matrix4 } from '../../math/matrix4'
import { Vector3 } from '../../math/vector3'

export type Light = {
  readonly castShadow: boolean;
  readonly position: Vector3;
  readonly target: Vector3;
  readonly projectionMatrix: Matrix4;
  lookAt(target: Vector3): void;
  setPosition(position: Vector3): void;
}
