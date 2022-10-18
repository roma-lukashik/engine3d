import { Matrix4Array } from "@math/matrix4"
import { Vector3Array } from "@math/vector3"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { Vector4Array } from "@math/vector4"
import { WebglVertexAttribute } from "@webgl/utils/attribute"

export type MeshUniforms = {
  worldMatrix?: Matrix4Array
  cameraPosition?: Vector3Array
  textureMatrices?: Matrix4Array[]
  projectionMatrix?: Matrix4Array
  ambientLights?: AmbientLight[]
  pointLights?: PointLight[]
  spotLights?: SpotLight[]
  directionalLights?: DirectionalLight[]
  material?: Material
  shadowTextures?: WebGLBaseTexture[]
  boneTexture?: WebGLBaseTexture
  boneTextureSize?: number
}

export type MeshAttributes = {
  position: WebglVertexAttribute
  normal: WebglVertexAttribute
  skinIndex?: WebglVertexAttribute
  skinWeight?: WebglVertexAttribute
  uv: WebglVertexAttribute
}

type PointLight = {
  color: Vector4Array
  position: Vector3Array
}

type SpotLight = {
  color: Vector4Array
  position: Vector3Array
  target: Vector3Array
  coneCos: number
  penumbraCos: number
  distance: number
}

type AmbientLight = {
  color: Vector4Array
}

type DirectionalLight = {
  color: Vector4Array
  direction: Vector3Array
  bias: number
  castShadow: boolean
}

type Material = {
  metalness: number
  roughness: number
  color: Vector4Array
  colorTexture?: WebGLBaseTexture
}
