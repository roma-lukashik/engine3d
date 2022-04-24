import { AccessorType, ComponentType, Gltf, MeshPrimitiveMode } from '../types'
import { Material } from './material'
import { Node } from './node'
import { Mesh } from './mesh'
import { BufferAttribute } from './bufferAttribute'

export const parseGltf = (data: Gltf, binaryData: ArrayBuffer) => {
  const version = Number(data.asset?.version ?? 0)
  if (version < 2) {
    throw new Error('Unsupported *.gltf file. Version should be >= 2.0.')
  }

  return [parseScenes(data), parseMeshes(data, binaryData)] as const
}

const parseScenes = (data: Gltf): Node[] => {
  const nodes: Node[] = []
  const scenes = getScenes(data)
  scenes?.forEach((scene) => {
    scene.nodes?.forEach((nodeId) => {
      nodes.push(...parseNode(data, nodeId))
    })
  })
  return nodes
}

const getScenes = (data: Gltf): Gltf['scenes'] => {
  const defaultScene = data.scene !== undefined ? data.scenes?.[data.scene] : undefined
  return defaultScene ? [defaultScene] : data.scenes
}

const parseNode = (data: Gltf, nodeId: number): Node[] => {
  const node = data.nodes?.[nodeId]
  if (!node) {
    return []
  }
  return [new Node(node), ...node.children?.flatMap((id) => parseNode(data, id)) ?? []]
}

const parseMeshes = (data: Gltf, binaryData: ArrayBuffer): Mesh[] => {
  const meshes: Mesh[] = []
  data.meshes?.forEach((mesh) => {
    mesh.primitives.forEach((primitive) => {
      const geometry = {} as Record<string, BufferAttribute | undefined>

      Object.entries(primitive.attributes).forEach(([attribute, value]) => {
        geometry[attribute] = parseAttributeAccessor(data, value, binaryData)
      })

      const gltfMaterial = primitive.material !== undefined ? data.materials?.[primitive.material] : undefined
      const material = new Material(gltfMaterial)
      meshes.push(createMesh(geometry, material))
    })
  })
  return meshes
}

const createMesh = (geometry: any, material: Material, mode?: MeshPrimitiveMode): Mesh => {
  switch (mode) {
    case MeshPrimitiveMode.Triangles:
    case MeshPrimitiveMode.TriangleStrip:
    case MeshPrimitiveMode.TriangleFan:
      return new Mesh(geometry, material)
    case MeshPrimitiveMode.Lines:
      // Not implemented yet.
    case MeshPrimitiveMode.LineLoop:
      // Not implemented yet.
    case MeshPrimitiveMode.LineStrip:
      // Not implemented yet.
    case MeshPrimitiveMode.Points:
      // Not implemented yet.
    default:
      throw new Error(`Unsupported mesh ${mode}`)
  }
}

// Handling sparse has not been implemented yet.
const parseAttributeAccessor = (data: Gltf, accessorIndex: number, binaryData: ArrayBuffer): BufferAttribute | undefined => {
  const accessor = data.accessors?.[accessorIndex]
  if (!accessor) {
    return
  }
  const bufferView = accessor.bufferView !== undefined ? parseBufferView(data, accessor.bufferView, binaryData) : undefined
  const itemSize = AccessorTypeSizes[accessor.type]
  const TypedArray = TypedArrayByComponentType[accessor.componentType]
  const byteOffset = accessor.byteOffset ?? 0
  const normalized = accessor.normalized === true
  // Handle byteStride has not been implemented yet.
  // const elementBytes = TypedArray.BYTES_PER_ELEMENT
  // const itemBytes = elementBytes * itemSize
  // const byteStride = accessor.bufferView !== undefined ? data.bufferViews?.[accessor.bufferView].byteStride : undefined
  const array = bufferView ?
    new TypedArray(bufferView, byteOffset, accessor.count * itemSize) :
    new TypedArray(accessor.count * itemSize)
  return new BufferAttribute(array, itemSize, normalized)
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
    throw new Error('Support for buffer URI is not supported yet.')
  }
}

// const parsePrimitive = () => {
//
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
