import {
  AccessorType,
  AnimationChannelPath,
  AnimationInterpolationType,
  BufferViewTarget,
  ComponentType,
  Gltf,
  MeshPrimitiveMode,
} from "@core/loaders/types"
import { base64ToUInt8Array } from "@core/loaders/gltf/__test__/utils"

export const simpleGltf: Gltf = {
  asset: {
    version: "2.0",
  },
  scene: 0,
  scenes: [
    {
      nodes: [0],
    },
  ],
  nodes: [
    {
      matrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
      children: [1, 2],
    },
    {
      translation: [10, 20, 30],
      rotation: [0.259, 0, 0, 0.966],
      scale: [2.0, 1.0, 0.5],
      mesh: 0,
    },
    {
      matrix: [
        2, 0, 0, 0,
        0, 0.866, 0.5, 0,
        0, -0.25, 0.433, 0,
        10, 20.0, 30.0, 1.0,
      ],
      mesh: 1,
    },
  ],
  meshes: [
    {
      primitives: [
        {
          mode: MeshPrimitiveMode.Triangles,
          attributes: {
            POSITION: 1,
          },
          indices: 0,
          material: 0,
        },
      ],
    },
    {
      primitives: [],
    },
  ],
  materials: [
    {
      pbrMetallicRoughness: {
        baseColorFactor: [1, 0.766, 0.336, 1],
        metallicFactor: 0.5,
        roughnessFactor: 0.1,
      },
    },
  ],
  accessors: [
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: ComponentType.Uint16,
      count: 3,
      type: AccessorType.Scalar,
    },
    {
      bufferView: 1,
      byteOffset: 0,
      componentType: ComponentType.Float32,
      count: 3,
      type: AccessorType.Vec3,
    },
  ],
  bufferViews: [
    {
      buffer: 0,
      byteOffset: 0,
      byteLength: 6,
      target: BufferViewTarget.ElementArrayBuffer,
    },
    {
      buffer: 0,
      byteOffset: 8,
      byteLength: 36,
    },
  ],
  buffers: [
    base64ToUInt8Array("AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA="),
  ],
}

export const animationGltf: Gltf = {
  scene: 0,
  scenes: [
    {
      nodes: [0],
    },
  ],
  nodes: [
    {
      mesh: 0,
      rotation: [0.0, 0.0, 0.0, 1.0],
    },
  ],
  meshes: [
    {
      primitives: [{
        attributes: {
          POSITION: 1,
        },
        indices: 0,
      }],
    },
  ],
  animations: [
    {
      samplers: [
        {
          input: 2,
          interpolation: AnimationInterpolationType.Linear,
          output: 3,
        },
      ],
      channels: [{
        sampler: 0,
        target: {
          node: 0,
          path: AnimationChannelPath.Rotation,
        },
      }],
    },
  ],
  buffers: [
    base64ToUInt8Array("AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA="),
    base64ToUInt8Array("AAAAAAAAgD4AAAA/AABAPwAAgD8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAD0/TQ/9P00PwAAAAAAAAAAAACAPwAAAAAAAAAAAAAAAPT9ND/0/TS/AAAAAAAAAAAAAAAAAACAPw=="),
  ],
  bufferViews: [
    {
      buffer: 0,
      byteOffset: 0,
      byteLength: 6,
      target: 34963,
    },
    {
      buffer: 0,
      byteOffset: 8,
      byteLength: 36,
      target: 34962,
    },
    {
      buffer: 1,
      byteOffset: 0,
      byteLength: 100,
    },
  ],
  accessors: [
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: 5123,
      count: 3,
      type: AccessorType.Scalar,
      max: [2],
      min: [0],
    },
    {
      bufferView: 1,
      byteOffset: 0,
      componentType: 5126,
      count: 3,
      type: AccessorType.Vec3,
      max: [1.0, 1.0, 0.0],
      min: [0.0, 0.0, 0.0],
    },
    {
      bufferView: 2,
      byteOffset: 0,
      componentType: 5126,
      count: 5,
      type: AccessorType.Scalar,
      max: [1.0],
      min: [0.0],
    },
    {
      bufferView: 2,
      byteOffset: 20,
      componentType: 5126,
      count: 5,
      type: AccessorType.Vec4,
      max: [0.0, 0.0, 1.0, 1.0],
      min: [0.0, 0.0, 0.0, -0.707],
    },
  ],
  asset: {
    version: "2.0",
  },
}
