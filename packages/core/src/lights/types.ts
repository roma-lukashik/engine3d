import { Camera } from "@core/camera"

export type Light = {
  readonly type: LightType
  readonly castShadow: boolean
  intensity: number
}

export type LightWithShadow = Light & {
  readonly camera: Camera
}

export enum LightType {
  Ambient,
  Point,
  SpotLight,
  Directional,
}
