import { Matrix4Array } from "@math/matrix4"
import { Vector3Array } from "@math/vector3"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { Vector4Array } from "@math/vector4"
import { GeometryAttributes } from "@core/geometry"

export type MeshUniforms = {
  worldMatrix?: Matrix4Array
  cameraPosition?: Vector3Array
  projectionMatrix?: Matrix4Array
  ambientLights?: AmbientLight[]
  pointLights?: PointLight[]
  spotLights?: SpotLight[]
  spotShadowLights?: SpotShadowLight[]
  directionalLights?: DirectionalLight[]
  directionalShadowLights?: DirectionalShadowLight[]
  material?: Material
  boneTexture?: WebGLBaseTexture
  boneTextureSize?: number
}

export type MeshAttributes = Pick<
  GeometryAttributes,
  | "position"
  | "normal"
  | "skinIndex"
  | "skinWeight"
  | "uv"
>

type Material = {
  metalness: number
  roughness: number
  color: Vector4Array
  colorTexture?: WebGLBaseTexture
}

type AmbientLight = {
  color: Vector3Array
  intensity: number
}

type DirectionalLight = {
  color: Vector3Array
  direction: Vector3Array
  intensity: number
}

type DirectionalShadowLight = DirectionalLight & ShadowLight

type SpotLight = {
  color: Vector3Array
  position: Vector3Array
  target: Vector3Array
  intensity: number
  coneCos: number
  penumbraCos: number
  distance: number
}

type SpotShadowLight = SpotLight & ShadowLight

type PointLight = {
  color: Vector3Array
  position: Vector3Array
  intensity: number
}

type ShadowLight = {
  bias: number
  projectionMatrix: Matrix4Array
  shadowMap: WebGLBaseTexture
}
