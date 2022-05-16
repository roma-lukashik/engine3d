import {
  AccessorType,
  AnimationInterpolationType,
  BufferViewTarget,
  ComponentType,
  Gltf,
  GltfAnimation,
  MeshPrimitive,
  MeshPrimitiveMode,
} from '../types'
import { Animation } from './animation'
import { Material } from './material'
import { Mesh } from './mesh'
import { BufferAttribute } from './bufferAttribute'
import { Geometry } from './geometry'
import { forEachKey } from '../../../utils/object'
import { Object3d } from './object3d'
import { nthOption, mapOption, Option } from '../../../utils/optionable'

export const parseGltf = (data: Gltf, binaryData: ArrayBuffer) => {
  const version = Number(data.asset?.version ?? 0)
  if (version < 2) {
    throw new Error('Unsupported *.gltf file. Version should be >= 2.0.')
  }

  const nodes = parseNodes(data, binaryData)
  const animations = parseAnimations(data, binaryData)
  return { nodes, animations }
}

const parseNodes = (data: Gltf, binaryData: ArrayBuffer): Object3d[] => {
  const scene = nthOption(data.scenes, data.scene ?? 0)
  return mapOption(scene?.nodes, (nodeId) => parseNode(data, nodeId, binaryData))
}

const parseNode = (data: Gltf, nodeId: number, binaryData: ArrayBuffer): Option<Object3d> => {
  const gltfNode = data.nodes?.[nodeId]
  if (!gltfNode) {
    return
  }
  const node = new Object3d(gltfNode)
  const meshes = parseMesh(data, gltfNode.mesh, binaryData) ?? []
  node.add(...meshes)
  // if (gltfNode.skin) {
  //   const skin = parseSkin(data, node, gltfNode.skin, binaryData)
  // }
  const children = mapOption(gltfNode.children, (child) => parseNode(data, child, binaryData))
  node.add(...children)
  return node
}

const parseMesh = (data: Gltf, meshIndex: Option<number>, binaryData: ArrayBuffer): Option<Object3d[]> => {
  const gltfMesh = nthOption(data.meshes, meshIndex)
  return gltfMesh?.primitives.map((primitive) => {
    return parsePrimitive(data, primitive, binaryData)
  })
}

const parsePrimitive = (data: Gltf, primitive: MeshPrimitive, binaryData: ArrayBuffer): Mesh => {
  const geometry = new Geometry()
  forEachKey(primitive.attributes, (attribute, value) => {
    geometry.setAttribute(attribute, parseAttributeAccessor(data, value, binaryData))
  })
  geometry.setIndices(parseAttributeAccessor(data, primitive.indices, binaryData, BufferViewTarget.ElementArrayBuffer))
  const gltfMaterial = nthOption(data.materials, primitive.material)
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
  accessorIndex: Option<number>,
  binaryData: ArrayBuffer,
  target: BufferViewTarget = BufferViewTarget.ArrayBuffer,
): Option<BufferAttribute> => {
  const accessor = nthOption(data.accessors, accessorIndex)
  if (!accessor) {
    return
  }
  const bufferView = parseBufferView(data, accessor.bufferView, binaryData)
  const itemSize = AccessorTypeSizes[accessor.type]
  const TypedArray = TypedArrayByComponentType[accessor.componentType]
  const byteOffset = accessor.byteOffset ?? 0
  const normalized = accessor.normalized === true
  // const elementBytes = TypedArray.BYTES_PER_ELEMENT
  // const itemBytes = elementBytes * itemSize
  const stride = nthOption(data.bufferViews, accessor.bufferView)?.byteStride
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

const parseBufferView = (data: Gltf, bufferViewIndex: Option<number>, binaryData: ArrayBuffer): Option<ArrayBuffer> => {
  const bufferView = nthOption(data.bufferViews, bufferViewIndex)
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
//   if (skin.inverseBindMatrices !== undefined) {
//     s.inverseBindMatrices = parseAttributeAccessor(data, skin.inverseBindMatrices, BufferViewTarget.ArrayBuffer, binaryData)
//   }
//   const jointNodes = skin.joints.map((joint) => parseNode(data, joint, binaryData))
// }

const parseAnimations = (data: Gltf, binaryData: ArrayBuffer): Animation[] => {
  return mapOption(data.animations, (animation, index) => {
    return new Animation(animation.name ?? `animation_${index}`, parseAnimation(data, animation, binaryData))
  })
}

const parseAnimation = (data: Gltf, animation: GltfAnimation, binaryData: ArrayBuffer) => {
  return mapOption(animation.channels, (channel) => {
    const sampler = animation.samplers[channel.sampler]
    const target = channel.target
    const node = nthOption(data.nodes, target.node)
    if (!node) {
      return
    }
    const times = parseAttributeAccessor(data, sampler.input, binaryData)?.array
    const values = parseAttributeAccessor(data, sampler.output, binaryData)?.array
    if (!times || !values) {
      return
    }
    const interpolation = sampler.interpolation ?? AnimationInterpolationType.Linear
    const transform = target.path
    return { node, times, values, interpolation, transform }
  })
}
