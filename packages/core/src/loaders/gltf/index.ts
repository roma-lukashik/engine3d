import {
  AccessorType,
  AnimationChannel,
  AnimationChannelPath,
  BufferViewTarget,
  Gltf,
  GltfAnimation,
  GltfBufferView,
  MeshPrimitive,
  MeshPrimitiveMode,
} from "@core/loaders/types"
import { parseGlb } from "@core/loaders/glb"
import { Animation } from "@core/animation"
import { Material } from "@core/material"
import { Mesh } from "@core/mesh"
import { BufferAttribute } from "@core/bufferAttribute"
import { Geometry } from "@core/geometry"
import { Node } from "@core/node"
import { Skeleton } from "@core/skeleton"
import { Texture } from "@core/texture"
import { loadImage } from "@core/loaders/image"
import { mapObject } from "@utils/object"
import { nthOption, mapOption, mapOptionAsync, Option } from "@utils/optionable"
import { timesMap } from "@utils/array"
import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { Vector4 } from "@math/vector4"
import { AnimationSample } from "@core/animationSample"
import { TypedArrayByComponentType } from "@core/bufferAttribute/utils"

export type ParsedGltf<K extends string> = {
  node: Node
  animations: Record<K, Animation>
}

export const parseGltf = async <K extends string>(raw: ArrayBufferLike | string | Gltf): Promise<ParsedGltf<K>> => {
  const data = typeof raw === "string" ? JSON.parse(raw) as Gltf : "byteLength" in raw ? parseGlb(raw) : raw
  const version = Number(data.asset?.version ?? 0)
  if (version < 2) {
    throw new Error("Unsupported *.gltf file. Version should be >= 2.0.")
  }
  const nodes = parseNodes(data)
  const scene = await parseScene(data, nodes)
  const animations = parseAnimations<K>(data, nodes)
  return {
    node: scene,
    animations,
  }
}

const parseNodes = (data: Gltf): Node[] => {
  return mapOption(data.nodes, ({ translation, rotation, scale, matrix, name }) =>
    new Node({
      position: translation && Vector3.fromArray(translation),
      rotation: rotation && Quaternion.fromArray(rotation),
      scale: scale && Vector3.fromArray(scale),
      matrix: matrix && Matrix4.fromArray(matrix),
      name,
    }),
  )
}

const parseScene = async (data: Gltf, nodes: Node[]): Promise<Node>=> {
  const scene = new Node({ name: "Scene" })
  const gltfScene = nthOption(data.scenes, data.scene ?? 0)
  const children = await mapOptionAsync(gltfScene?.nodes, (nodeId) => parseNode(data, nodes, nodeId))
  scene.add(children)
  return scene
}

const parseNode = async (data: Gltf, nodes: Node[], nodeId: number): Promise<Option<Node>> => {
  const gltfNode = nthOption(data.nodes, nodeId)
  const node = nthOption(nodes, nodeId)
  const meshes = await parseMesh(data, gltfNode?.mesh) ?? []
  node?.add(meshes)
  const skeleton = parseSkin(data, nodes, gltfNode?.skin)
  if (skeleton) {
    meshes.forEach((mesh) => mesh.bindSkeleton(skeleton))
  }
  const nodeChildren = await mapOptionAsync(gltfNode?.children, (childNodeId) => parseNode(data, nodes, childNodeId))
  node?.add(nodeChildren)
  return node
}

const parseMesh = async (data: Gltf, meshIndex: Option<number>): Promise<Option<Mesh[]>> => {
  const gltfMesh = nthOption(data.meshes, meshIndex)
  return mapOptionAsync(gltfMesh?.primitives, (primitive) => parsePrimitive(data, primitive))
}

const parsePrimitive = async (data: Gltf, primitive: MeshPrimitive): Promise<Mesh> => {
  const geometryData = mapObject(primitive.attributes, (accessorIndex) => {
    return parseAttributeAccessor(data, accessorIndex)
  })
  const geometry = new Geometry({
    ...geometryData,
    index: parseAttributeAccessor(data, primitive.indices, BufferViewTarget.ElementArrayBuffer),
  })
  const gltfMaterial = nthOption(data.materials, primitive.material) ?? {}

  const [
    colorTexture,
    metallicRoughnessTexture,
    normalTexture,
    occlusionTexture,
    emissiveTexture,
  ] = await Promise.all([
    parseTexture(data, gltfMaterial.pbrMetallicRoughness?.baseColorTexture?.index),
    parseTexture(data, gltfMaterial.pbrMetallicRoughness?.metallicRoughnessTexture?.index),
    parseTexture(data, gltfMaterial.normalTexture?.index),
    parseTexture(data, gltfMaterial.occlusionTexture?.index),
    parseTexture(data, gltfMaterial.emissiveTexture?.index),
  ])

  const {
    alphaMode,
    alphaCutoff,
    emissiveFactor,
    pbrMetallicRoughness: {
      baseColorFactor,
      metallicFactor,
      roughnessFactor,
    } = {},
  } = gltfMaterial

  const material = new Material({
    alphaMode,
    alphaCutoff,
    color: baseColorFactor && Vector4.fromArray(baseColorFactor),
    metallic: metallicFactor,
    roughness: roughnessFactor,
    emissive: emissiveFactor && Vector3.fromArray(emissiveFactor),
    colorTexture,
    metallicRoughnessTexture,
    normalTexture,
    occlusionTexture,
    emissiveTexture,
  })

  return createMesh(geometry, material, primitive.mode)
}

const createMesh = (geometry: Geometry, material: Material, mode?: MeshPrimitiveMode): Mesh => {
  switch (mode) {
    case MeshPrimitiveMode.Triangles:
    case MeshPrimitiveMode.TriangleStrip:
    case MeshPrimitiveMode.TriangleFan:
      return new Mesh({ geometry, material })
    case MeshPrimitiveMode.Lines:
      // Not implemented yet.
    case MeshPrimitiveMode.LineLoop:
      // Not implemented yet.
    case MeshPrimitiveMode.LineStrip:
      // Not implemented yet.
    case MeshPrimitiveMode.Points:
      // Not implemented yet.
    default:
      return new Mesh({ geometry, material })
  }
}

const parseTexture = async (data: Gltf, textureIndex: Option<number>): Promise<Option<Texture>> => {
  const texture = nthOption(data.textures, textureIndex)
  const image = nthOption(data.images, texture?.source)
  if (image?.uri) {
    throw new Error("Getting texture by uri is not implemented yet.")
  }
  const bufferView = nthOption(data.bufferViews, image?.bufferView)
  const buffer = parseBufferView(data, bufferView)
  if (!buffer) {
    return
  }
  const source = await loadImage(buffer, image?.mimeType)
  return new Texture({ source })
}

// Handling sparse has not been implemented yet.
const parseAttributeAccessor = (
  data: Gltf,
  accessorIndex: Option<number>,
  customTarget?: BufferViewTarget,
): Option<BufferAttribute> => {
  const accessor = nthOption(data.accessors, accessorIndex)
  if (!accessor) {
    return
  }
  const itemSize = AccessorTypeSizes[accessor.type]
  const TypedArray = TypedArrayByComponentType[accessor.componentType]
  const byteOffset = accessor.byteOffset ?? 0
  const normalized = accessor.normalized === true
  const elementBytes = TypedArray.BYTES_PER_ELEMENT
  const itemBytes = elementBytes * itemSize
  const bufferView = nthOption(data.bufferViews, accessor.bufferView)
  const target = customTarget ?? bufferView?.target
  const arrayBuffer = parseBufferView(data, bufferView)
  const stride = bufferView?.byteStride
  const isInterleaved = !!stride && stride !== itemBytes
  const offset = isInterleaved ? byteOffset % stride / elementBytes : 0
  const arraySize = isInterleaved ? accessor.count * stride / elementBytes : accessor.count * itemSize
  const array = arrayBuffer
    ? isInterleaved
      ? new TypedArray(arrayBuffer, Math.floor(byteOffset / stride) * stride, arraySize)
      : new TypedArray(arrayBuffer, byteOffset, arraySize)
        : new TypedArray(arraySize)
  return new BufferAttribute({ array, itemSize, normalized, stride, target, offset })
}

const AccessorTypeSizes = {
  [AccessorType.Scalar]: 1,
  [AccessorType.Vec2]: 2,
  [AccessorType.Vec3]: 3,
  [AccessorType.Vec4]: 4,
  [AccessorType.Mat2]: 4,
  [AccessorType.Mat3]: 9,
  [AccessorType.Mat4]: 16,
}

const parseBufferView = (data: Gltf, bufferView: Option<GltfBufferView>): Option<ArrayBuffer> => {
  const { buffer, byteOffset = 0, byteLength = 0 } = bufferView ?? {}
  const arrayBuffer = parseBuffer(data, buffer)
  return arrayBuffer?.slice(byteOffset, byteOffset + byteLength)
}

const parseBuffer = (data: Gltf, bufferIndex: Option<number>): Option<ArrayBuffer> => {
  const buffer = nthOption(data.buffers, bufferIndex)
  if (!buffer) {
    return
  }
  if (buffer instanceof ArrayBuffer) {
    return buffer
  }
  throw new Error("Getting buffer from URI is not supported yet.")
}

const parseSkin = (data: Gltf, nodes: Node[], skinIndex: Option<number>) => {
  const skin = nthOption(data.skins, skinIndex)
  const inverseMatrices = parseAttributeAccessor(data, skin?.inverseBindMatrices)
  if (!skin || !inverseMatrices) {
    return
  }
  const bones = skin.joints.map((joint) => nodes[joint])
  const boneInverses = timesMap(bones.length, (i) => {
    return Matrix4.fromArray(inverseMatrices.array, Matrix4.size * i)
  })
  return new Skeleton({ bones, boneInverses })
}

const parseAnimations = <K extends string>(data: Gltf, nodes: Node[]): Record<K, Animation> => {
  const array = mapOption(data.animations, (animation, index) => {
    return new Animation(animation.name ?? `animation_${index}`, parseAnimation(data, nodes, animation))
  })
  return Object.fromEntries(array.map((x) => [x.name, x])) as Record<K, Animation>
}

const parseAnimation = (data: Gltf, nodes: Node[], animation: GltfAnimation) => {
  return mapOption(animation.channels, (channel) => {
    return parseAnimationSample(data, nodes, animation, channel)
  })
}

const parseAnimationSample = (
  data: Gltf,
  nodes: Node[],
  animation: GltfAnimation,
  channel: AnimationChannel,
): Option<AnimationSample> => {
  const sampler = animation.samplers[channel.sampler]
  const target = channel.target
  const node = nthOption(nodes, target.node)
  const times = parseAttributeAccessor(data, sampler.input)?.array
  const values = parseAttributeAccessor(data, sampler.output)?.array
  if (!times || !values || !node) {
    return
  }
  // TODO Handle weights is not implemented yet.
  if (target.path === "weights") {
    return
  }
  const interpolation = sampler.interpolation
  const transform = TransformType[target.path]
  return new AnimationSample({ node, times, values, interpolation, transform })
}

const TransformType = {
  [AnimationChannelPath.Position]: "position",
  [AnimationChannelPath.Scale]: "scale",
  [AnimationChannelPath.Rotation]: "rotation",
} as const
