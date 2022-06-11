import {
  AccessorType,
  AnimationChannelPath,
  AnimationInterpolationType,
  BufferViewTarget,
  ComponentType,
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
import { Object3d } from "@core/object3d"
import { Skeleton } from "@core/skeleton"
import { Texture } from "@core/texture"
import { transform } from "@utils/object"
import { nthOption, mapOption, Option } from "@utils/optionable"
import { timesMap } from "@utils/array"
import { Matrix4 } from "@math/types"
import * as m4 from "@math/matrix4"

export const parseGltf = (raw: ArrayBufferLike | string) => {
  const data = typeof raw === "string" ? JSON.parse(raw) as Gltf : parseGlb(raw)
  const version = Number(data.asset?.version ?? 0)
  if (version < 2) {
    throw new Error("Unsupported *.gltf file. Version should be >= 2.0.")
  }
  const nodes = parseNodes(data)
  const scene = parseScene(data, nodes)
  scene.updateWorldMatrix(scene.worldMatrix)
  const animations = parseAnimations(data, nodes)
  return { scene, animations }
}

const parseNodes = (data: Gltf): Object3d[] => {
  return mapOption(data.nodes, ({ translation: position, rotation, scale, matrix, name }) => {
    return new Object3d({ position, rotation, scale, matrix, name })
  })
}

const parseScene = (data: Gltf, nodes: Object3d[]): Object3d => {
  const gltfScene = nthOption(data.scenes, data.scene ?? 0)
  const children = mapOption(gltfScene?.nodes, (nodeId) => parseNode(data, nodes, nodeId))
  const scene = new Object3d({ name: "Scene" })
  scene.add(children)
  return scene
}

const parseNode = (data: Gltf, nodes: Object3d[], nodeId: number): Option<Object3d> => {
  const gltfNode = nthOption(data.nodes, nodeId)
  const node = nthOption(nodes, nodeId)
  const meshes = parseMesh(data, gltfNode?.mesh) ?? []
  node?.add(meshes)
  const skeleton = parseSkin(data, nodes, gltfNode?.skin)
  if (skeleton) {
    meshes.forEach((mesh) => mesh.bindSkeleton(skeleton))
  }
  const nodeChildren = mapOption(gltfNode?.children, (childNodeId) => parseNode(data, nodes, childNodeId))
  node?.add(nodeChildren)
  return node
}

const parseMesh = (data: Gltf, meshIndex: Option<number>): Option<Mesh[]> => {
  const gltfMesh = nthOption(data.meshes, meshIndex)
  return gltfMesh?.primitives.map((primitive) => parsePrimitive(data, primitive))
}

const parsePrimitive = (data: Gltf, primitive: MeshPrimitive): Mesh => {
  const geometryData = transform(primitive.attributes, (accessorIndex) => {
    return parseAttributeAccessor(data, accessorIndex)
  })
  const geometry = new Geometry(geometryData)
  geometry.index = parseAttributeAccessor(data, primitive.indices, BufferViewTarget.ElementArrayBuffer)
  const gltfMaterial = nthOption(data.materials, primitive.material)
  const material = new Material({
    alphaMode: gltfMaterial?.alphaMode,
    alphaCutoff: gltfMaterial?.alphaCutoff,
    color: gltfMaterial?.pbrMetallicRoughness?.baseColorFactor,
    metallic: gltfMaterial?.pbrMetallicRoughness?.metallicFactor,
    roughness: gltfMaterial?.pbrMetallicRoughness?.roughnessFactor,
    emissive: gltfMaterial?.emissiveFactor,
    colorTexture: parseTexture(data, gltfMaterial?.pbrMetallicRoughness?.baseColorTexture?.index),
    metallicRoughnessTexture: parseTexture(data, gltfMaterial?.pbrMetallicRoughness?.metallicRoughnessTexture?.index),
    normalTexture: parseTexture(data, gltfMaterial?.normalTexture?.index),
    occlusionTexture: parseTexture(data, gltfMaterial?.occlusionTexture?.index),
    emissiveTexture: parseTexture(data, gltfMaterial?.emissiveTexture?.index),
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

const parseTexture = (data: Gltf, textureIndex: Option<number>): Option<Texture> => {
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
  return new Texture({ buffer, mimeType: image?.mimeType })
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
  // const elementBytes = TypedArray.BYTES_PER_ELEMENT
  // const itemBytes = elementBytes * itemSize
  const bufferView = nthOption(data.bufferViews, accessor.bufferView)
  const stride = bufferView?.byteStride
  const target = customTarget ?? bufferView?.target
  const arraySize = accessor.count * itemSize
  const arrayBuffer = parseBufferView(data, bufferView)
  const array = arrayBuffer ? new TypedArray(arrayBuffer, byteOffset, arraySize) : new TypedArray(arraySize)
  return new BufferAttribute({ array, itemSize, normalized, stride, target })
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

const TypedArrayByComponentType = {
  [ComponentType.Int8]: Int8Array,
  [ComponentType.Uint8]: Uint8Array,
  [ComponentType.Int16]: Int16Array,
  [ComponentType.Uint16]: Uint16Array,
  [ComponentType.Uint32]: Uint32Array,
  [ComponentType.Float32]: Float32Array,
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

const parseSkin = (data: Gltf, nodes: Object3d[], skinIndex: Option<number>) => {
  const skin = nthOption(data.skins, skinIndex)
  const inverseMatrices = parseAttributeAccessor(data, skin?.inverseBindMatrices)
  if (!skin || !inverseMatrices) {
    return
  }
  const bones = skin.joints.map((joint) => nodes[joint])
  const boneInverses = timesMap(skin.joints.length, (i) => {
    const start = m4.size * i
    return Array.from(inverseMatrices.array.slice(start, start + m4.size)) as Matrix4
  })
  return new Skeleton({ bones, boneInverses })
}

const parseAnimations = (data: Gltf, nodes: Object3d[]): Animation[] => {
  return mapOption(data.animations, (animation, index) => {
    return new Animation(animation.name ?? `animation_${index}`, parseAnimation(data, nodes, animation))
  })
}

const parseAnimation = (data: Gltf, nodes: Object3d[], animation: GltfAnimation) => {
  return mapOption(animation.channels, (channel) => {
    const sampler = animation.samplers[channel.sampler]
    const target = channel.target
    const node = nthOption(nodes, target.node)
    const times = parseAttributeAccessor(data, sampler.input)?.array
    const values = parseAttributeAccessor(data, sampler.output)?.array
    if (!times || !values || !node) {
      return
    }
    const interpolation = sampler.interpolation ?? AnimationInterpolationType.Linear
    // TODO Handle weights is not implemented yet.
    if (target.path === "weights") {
      return
    }
    const transform = TransformType[target.path]
    return { node, times, values, interpolation, transform }
  })
}

const TransformType = {
  [AnimationChannelPath.Position]: "position",
  [AnimationChannelPath.Scale]: "scale",
  [AnimationChannelPath.Rotation]: "rotation",
} as const
