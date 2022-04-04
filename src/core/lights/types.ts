import { Matrix4 } from '../../math/matrix4'

export type Light = {
  readonly type: LightType
  readonly castShadow: boolean
  intensity: number
}

export type LightWithShadow = Light & {
  readonly projectionMatrix: Matrix4
}

export enum LightType {
  Ambient,
  Point,
  Directional,
}
