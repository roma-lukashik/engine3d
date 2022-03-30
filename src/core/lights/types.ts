import { Matrix4 } from '../../math/matrix4'

export type Light = {
  readonly type: LightType
  readonly castShadow: boolean
}

export type LightWithShadow = {
  readonly projectionMatrix: Matrix4
}

export enum LightType {
  Ambient,
  Point,
  Directional,
}
