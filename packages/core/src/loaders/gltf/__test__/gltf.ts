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

export const advancedGltf: Gltf = {
  scene: 0,
  scenes: [
    {
      nodes: [0, 1],
    },
  ],
  nodes: [
    {
      skin: 0,
      mesh: 0,
    },
    {
      children: [2],
    },
    {
      translation: [0.0, 1.0, 0.0],
      rotation: [0.0, 0.0, 0.0, 1.0],
    },
  ],
  meshes: [{
    primitives: [{
      attributes: {
        POSITION: 1,
        JOINTS_0: 2,
        WEIGHTS_0: 3,
      },
      indices: 0,
    }],
  }],
  skins: [{
    inverseBindMatrices: 4,
    joints: [1, 2],
  }],
  animations: [{
    channels: [{
      sampler: 0,
      target: {
        node: 2,
        path: AnimationChannelPath.Rotation,
      },
    }],
    samplers: [{
      input: 5,
      interpolation: AnimationInterpolationType.Linear,
      output: 6,
    }],
  }],
  buffers: [
    base64ToUInt8Array("AAABAAMAAAADAAIAAgADAAUAAgAFAAQABAAFAAcABAAHAAYABgAHAAkABgAJAAgAAAAAvwAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAvwAAAD8AAAAAAAAAPwAAAD8AAAAAAAAAvwAAgD8AAAAAAAAAPwAAgD8AAAAAAAAAvwAAwD8AAAAAAAAAPwAAwD8AAAAAAAAAvwAAAEAAAAAAAAAAPwAAAEAAAAAA"),
    base64ToUInt8Array("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAgD8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAABAPwAAgD4AAAAAAAAAAAAAQD8AAIA+AAAAAAAAAAAAAAA/AAAAPwAAAAAAAAAAAAAAPwAAAD8AAAAAAAAAAAAAgD4AAEA/AAAAAAAAAAAAAIA+AABAPwAAAAAAAAAAAAAAAAAAgD8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAA="),
    base64ToUInt8Array("AACAPwAAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAAAAAAAAgD8AAAAAAAAAAAAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAAAAAAAAAAACAPwAAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAIC/AAAAAAAAgD8="),
    base64ToUInt8Array("AAAAAAAAAD8AAIA/AADAPwAAAEAAACBAAABAQAAAYEAAAIBAAACQQAAAoEAAALBAAAAAAAAAAAAAAAAAAACAPwAAAAAAAAAAkxjEPkSLbD8AAAAAAAAAAPT9ND/0/TQ/AAAAAAAAAAD0/TQ/9P00PwAAAAAAAAAAkxjEPkSLbD8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAAAAAAAkxjEvkSLbD8AAAAAAAAAAPT9NL/0/TQ/AAAAAAAAAAD0/TS/9P00PwAAAAAAAAAAkxjEvkSLbD8AAAAAAAAAAAAAAAAAAIA/"),
  ],
  bufferViews: [{
    buffer: 0,
    byteLength: 48,
    target: 34963,
  }, {
    buffer: 0,
    byteOffset: 48,
    byteLength: 120,
    target: 34962,
  }, {
    buffer: 1,
    byteLength: 320,
    byteStride: 16,
  }, {
    buffer: 2,
    byteLength: 128,
  }, {
    buffer: 3,
    byteLength: 240,
  }],
  accessors: [{
    bufferView: 0,
    componentType: 5123,
    count: 24,
    type: AccessorType.Scalar,
  }, {
    bufferView: 1,
    componentType: 5126,
    count: 10,
    type: AccessorType.Vec3,
    max: [0.5, 2.0, 0.0],
    min: [-0.5, 0.0, 0.0],
  }, {
    bufferView: 2,
    componentType: 5123,
    count: 10,
    type: AccessorType.Vec4,
  }, {
    bufferView: 2,
    byteOffset: 160,
    componentType: 5126,
    count: 10,
    type: AccessorType.Vec4,
  }, {
    bufferView: 3,
    componentType: 5126,
    count: 2,
    type: AccessorType.Mat4,
  }, {
    bufferView: 4,
    componentType: 5126,
    count: 12,
    type: AccessorType.Scalar,
    max: [5.5],
    min: [0.0],
  }, {
    bufferView: 4,
    byteOffset: 48,
    componentType: 5126,
    count: 12,
    type: AccessorType.Vec4,
    max: [0.0, 0.0, 0.707, 1.0],
    min: [0.0, 0.0, -0.707, 0.707],
  }],
  asset: {
    version: "2.0",
  },
}

