import { AccessorType, BufferViewTarget, ComponentType, Gltf, MeshPrimitiveMode } from "@core/loaders/types"
import { base64ToBuffer } from "@core/loaders/gltf/__test__/utils"

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
          material : 0,
        },
      ],
    },
    {
      primitives: [],
    },
  ],
  materials : [
    {
      pbrMetallicRoughness: {
        baseColorFactor: [1, 0.766, 0.336, 1],
        metallicFactor: 0.5,
        roughnessFactor: 0.1,
      },
    },
  ],
  accessors : [
    {
      bufferView : 0,
      byteOffset : 0,
      componentType : ComponentType.Uint16,
      count : 3,
      type : AccessorType.Scalar,
    },
    {
      bufferView : 1,
      byteOffset : 0,
      componentType : ComponentType.Float32,
      count : 3,
      type : AccessorType.Vec3,
    },
  ],
  bufferViews : [
    {
      buffer : 0,
      byteOffset : 0,
      byteLength : 6,
      target : BufferViewTarget.ElementArrayBuffer,
    },
    {
      buffer : 0,
      byteOffset : 8,
      byteLength : 36,
    },
  ],
}

export const simpleBuffer = base64ToBuffer("AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=")
