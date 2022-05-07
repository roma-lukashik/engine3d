import { AccessorType, BufferViewTarget, ComponentType, Gltf, MeshPrimitive, MeshPrimitiveMode } from '../types'
import { Material } from './material'
import { Mesh } from './mesh'
import { BufferAttribute } from './bufferAttribute'
import { Geometry } from './geometry'
import { forEachKey } from '../../../utils/object'
import { Object3d } from './object3d'
import { mapOption } from '../../../utils/array'

export const parseGltf = (data: Gltf, binaryData: ArrayBuffer) => {
  const version = Number(data.asset?.version ?? 0)
  if (version < 2) {
    throw new Error('Unsupported *.gltf file. Version should be >= 2.0.')
  }

  const nodes = parseNodes(data, binaryData)
  return nodes
}

const parseNodes = (data: Gltf, binaryData: ArrayBuffer): Object3d[] => {
  const scenes = getScenes(data) ?? []
  return scenes?.flatMap((scene) => {
    const nodes = scene.nodes ?? []
    return nodes.flatMap((nodeId) => parseNode(data, nodeId, binaryData) ?? [])
  })
}

const getScenes = (data: Gltf): Gltf['scenes'] => {
  const defaultScene = data.scene !== undefined ? data.scenes?.[data.scene] : undefined
  return defaultScene ? [defaultScene] : data.scenes
}

const parseNode = (data: Gltf, nodeId: number, binaryData: ArrayBuffer): Object3d | undefined => {
  const gltfNode = data.nodes?.[nodeId]
  if (!gltfNode) {
    return
  }
  const node = new Object3d(gltfNode)
  if (gltfNode.mesh !== undefined) {
    const mesh = parseMesh(data, gltfNode.mesh, binaryData)
    if (mesh) {
      node.add(mesh)
    }
  }
  // if (gltfNode.skin) {
  //   const skin = parseSkin(data, node, gltfNode.skin, binaryData)
  // }
  const children = mapOption(gltfNode.children, (child) => parseNode(data, child, binaryData))
  node.add(...children)
  return node
}

const parseMesh = (data: Gltf, meshIndex: number, binaryData: ArrayBuffer): Object3d | undefined => {
  const gltfMesh = data.meshes?.[meshIndex]
  if (!gltfMesh) {
    return
  }
  const meshes = gltfMesh.primitives.map((primitive) => {
    return parsePrimitive(data, primitive, binaryData)
  })
  const object3d = new Object3d()
  object3d.add(...meshes)
  return object3d
}

const parsePrimitive = (data: Gltf, primitive: MeshPrimitive, binaryData: ArrayBuffer): Mesh => {
  const geometry = new Geometry()
  forEachKey(primitive.attributes, (attribute, value) => {
    geometry.setAttribute(attribute, parseAttributeAccessor(data, value, BufferViewTarget.ArrayBuffer, binaryData))
  })
  if (primitive.indices !== undefined) {
    geometry.setIndices(parseAttributeAccessor(data, primitive.indices, BufferViewTarget.ElementArrayBuffer, binaryData))
  }
  const gltfMaterial = primitive.material !== undefined ? data.materials?.[primitive.material] : undefined
  const material = new Material(gltfMaterial)
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

// Handling sparse has not been implemented yet.
const parseAttributeAccessor = (
  data: Gltf,
  accessorIndex: number,
  target: BufferViewTarget,
  binaryData: ArrayBuffer,
): BufferAttribute | undefined => {
  const accessor = data.accessors?.[accessorIndex]
  if (!accessor) {
    return
  }
  const bufferView = accessor.bufferView !== undefined ? parseBufferView(data, accessor.bufferView, binaryData) : undefined
  const itemSize = AccessorTypeSizes[accessor.type]
  const TypedArray = TypedArrayByComponentType[accessor.componentType]
  const byteOffset = accessor.byteOffset ?? 0
  const normalized = accessor.normalized === true
  // const elementBytes = TypedArray.BYTES_PER_ELEMENT
  // const itemBytes = elementBytes * itemSize
  const stride = accessor.bufferView !== undefined ? data.bufferViews?.[accessor.bufferView].byteStride : undefined
  const array = bufferView ?
    new TypedArray(bufferView, byteOffset, accessor.count * itemSize) :
    new TypedArray(accessor.count * itemSize)
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

const parseBufferView = (data: Gltf, bufferViewIndex: number, binaryData: ArrayBuffer): ArrayBuffer | undefined => {
  const bufferView = data.bufferViews?.[bufferViewIndex]
  if (!bufferView) {
    return
  }
  const { buffer, byteOffset = 0, byteLength = 0 } = bufferView
  const arrayBuffer = parseBuffer(data, buffer, binaryData)
  return arrayBuffer.slice(byteOffset, byteOffset + byteLength)
}

const parseBuffer = (data: Gltf, bufferIndex: number, binaryData: ArrayBuffer): ArrayBuffer => {
  const buffer = data.buffers?.[bufferIndex]
  if (!buffer?.uri) {
    return binaryData
  } else {
    throw new Error('Getting buffer from URI is not supported yet.')
  }
}

// const parseSkin = (data: Gltf, node: Object3d, skinIndex: number, binaryData: ArrayBuffer) => {
//   const skin = data.skins?.[skinIndex]
//   if (!skin) {
//     return
//   }
//   const s: any = {
//     joints: skin.joints,
//   }
//   if (skin.inverseBindMatrices) {
//     s.inverseBindMatrices = parseAttributeAccessor(data, skin.inverseBindMatrices, binaryData)
//   }
//   const jointNodes = skin.joints.map((joint) => parseNode(data, joint, binaryData))
// }

// const parseAnimations = (data: Gltf) => {
//   data.animations?.forEach((animation) => {
//     animation.channels.forEach((channel) => {
//       const sampler = animation.samplers[channel.sampler]
//       const target = channel.target
//       const name = target.node ?? target.id
//     })
//   })
// }
