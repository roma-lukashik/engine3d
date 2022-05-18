import { Vector3, Vector4, Matrix4, Quaternion } from '../../math/types'

export type Gltf = {
  asset?: GltfAsset
  accessors?: Accessor[]
  buffers?: GltfBuffer[]
  bufferViews?: GltfBufferView[]
  scene?: ResourceId
  scenes?: GltfScene[]
  meshes?: GltfMesh[]
  nodes?: GltfNode[]
  materials?: GltfMaterial[]
  skins?: GltfSkin[]
  animations?: GltfAnimation[]
  textures?: GltfTexture[]
  images?: GltfImage[]
}

type GltfAsset = {
  generator?: string
  version?: string
}

type Accessor = {
  bufferView?: ResourceId
  byteOffset?: number
  componentType: ComponentType
  normalized?: boolean
  count: number
  type: AccessorType
  max?: number[]
  min?: number[]
  sparse?: AccessorSparse
  name?: string
  extensions?: any
  extras?: any
}

export enum AccessorType {
  Scalar = 'SCALAR',
  Vec2 = 'VEC2',
  Vec3 = 'VEC3',
  Vec4 = 'VEC4',
  Mat2 = 'MAT2',
  Mat3 = 'MAT3',
  Mat4 = 'MAT4',
}

export enum ComponentType {
  Int8 = 5120,
  Uint8 = 5121,
  Int16 = 5122,
  Uint16 = 5123,
  Uint32 = 5125,
  Float32 = 5126,
}

type AccessorSparse = {
  // TODO
}

type GltfBuffer = {
  uri?: string
  byteLength: number
}

export type GltfBufferView = {
  buffer: ResourceId
  byteLength: number
  byteOffset: number
  byteStride?: number
  target?: BufferViewTarget
}

export enum BufferViewTarget {
  ArrayBuffer = 34962,
  ElementArrayBuffer = 34963,
}

export type GltfScene = {
  name?: string
  extensions?: any[] // not used yet
  nodes?: ResourceId[] // node ids
}

type GltfMesh = {
  primitives: MeshPrimitive[]
  weights?: number[]
  name?: string
  extensions?: any
  extras?: any
}

export enum MeshPrimitiveMode {
  Points,
  Lines,
  LineLoop,
  LineStrip,
  Triangles,
  TriangleStrip,
  TriangleFan,
}

export type MeshPrimitive = {
  indices?: ResourceId // The index of the accessor that contains the indices.
  material?: ResourceId
  mode?: MeshPrimitiveMode
  targets?: Array<Record<string, ResourceId>>
  attributes: MeshPrimitiveAttributes
  extensions?: any
  extras?: any
}

export type MeshPrimitiveAttributes = {
  POSITION?: ResourceId
  NORMAL?: ResourceId
  TANGENT?: ResourceId
  TEXCOORD_0?: ResourceId
  TEXCOORD_1?: ResourceId
  COLOR_0?: ResourceId
  WEIGHTS_0?: ResourceId
  JOINTS_0?: ResourceId
}

export type GltfNode = {
  name?: string
  translation?: Vector3
  rotation?: Quaternion
  scale?: Vector3
  matrix?: Matrix4
  children?: ResourceId[]
  mesh?: ResourceId
  skin?: ResourceId
  camera?: ResourceId
}

export type GltfMaterial = {
  name?: string
  extensions?: any
  extras?: any
  pbrMetallicRoughness?: MaterialPbrMetallicRoughness
  normalTexture?: MaterialNormalTextureInfo
  occlusionTexture?: MaterialOcclusionTextureInfo
  emissiveTexture?: TextureInfo
  emissiveFactor?: Vector3
  alphaMode?: 'OPAQUE' | 'MASK' | 'BLEND' | string
  alphaCutoff?: number
  doubleSided?: boolean
}

type MaterialPbrMetallicRoughness = {
  baseColorFactor?: Vector4
  baseColorTexture?: TextureInfo
  metallicFactor?: number
  roughnessFactor?: number
  metallicRoughnessTexture?: TextureInfo
  extensions?: any
  extras?: any
}

type MaterialOcclusionTextureInfo = {
  index?: any
  texCoord?: any
  strength?: number
  extensions?: any
  extras?: any
}

type TextureInfo = {
  index: ResourceId
  texCoord?: number
  extensions?: any
  extras?: any
}

type MaterialNormalTextureInfo = {
  index?: any
  texCoord?: any
  scale?: number
  extensions?: any
  extras?: any
}

type GltfSkin = {
  inverseBindMatrices?: ResourceId
  skeleton?: ResourceId
  joints: ResourceId[]
  name?: string
  extensions?: any
  extras?: any
}

export type GltfAnimation = {
  name?: string
  channels: AnimationChannel[]
  samplers: AnimationSampler[]
  extensions?: any
  extras?: any
}

type AnimationChannel = {
  sampler: ResourceId
  target: AnimationChannelTarget
  extensions?: any
  extras?: any
}

type AnimationChannelTarget = {
  node?: ResourceId
  id?: ResourceId // deprecated
  path: AnimationChannelPath
  extensions?: any
  extras?: any
}

type AnimationSampler = {
  input: ResourceId
  interpolation?: AnimationInterpolationType
  output: ResourceId
  extensions?: any
  extras?: any
}

export enum AnimationInterpolationType {
  Linear = 'LINEAR',
  Step = 'STEP',
  CubicSpline = 'CUBICSPLINE',
}

export enum AnimationChannelPath {
  Position = 'translation',
  Rotation = 'rotation',
  Scale = 'scale',
  Weight = 'weights',
}

type GltfTexture = {
  name?: string
  extensions?: any
  extras?: any
  sampler?: ResourceId
  source?: ResourceId
}

type GltfImage = {
  name?: string
  extensions?: any
  extras?: any
  uri?: string
  mimeType?: 'image/jpeg' | 'image/png' | string
  bufferView?: ResourceId
}

type ResourceId = number
