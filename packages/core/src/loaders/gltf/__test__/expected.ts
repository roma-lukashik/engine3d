import { Object3d } from "@core/object3d"
import { Vector3 } from "@math/vector3"
import { Mesh } from "@core/mesh"
import { Geometry } from "@core/geometry"
import { BufferAttribute } from "@core/bufferAttribute"
import { AnimationInterpolationType, BufferViewTarget } from "@core/loaders/types"
import { Material } from "@core/material"
import { Skeleton } from "@core/skeleton"
import { Matrix4 } from "@math/matrix4"
import { Animation } from "@core/animation"
import { AnimationSample } from "@core/animationSample"
import { Vector4 } from "@math/vector4"

export const expectedGltf = (): Object3d => {
  const root = new Object3d({ name: "Scene" })
  const child1 = new Object3d()
  const child2 = new Object3d()
  const child21 = new Object3d({ position: new Vector3(0, 1, 0) })

  const geometry = new Geometry({
    index: new BufferAttribute({
      array: new Uint16Array([0, 1, 3, 0, 3, 2, 2, 3, 5, 2, 5, 4, 4, 5, 7, 4, 7, 6, 6, 7, 9, 6, 9, 8]),
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    }),
    POSITION: new BufferAttribute({
      array: new Float32Array([
        -0.5, 0, 0,
        0.5, 0, 0,
        -0.5, 0.5, 0,
        0.5, 0.5, 0,
        -0.5, 1, 0,
        0.5, 1, 0,
        -0.5, 1.5, 0,
        0.5, 1.5, 0,
        -0.5, 2, 0,
        0.5, 2, 0,
      ]),
      itemSize: 3,
    }),
    JOINTS_0: new BufferAttribute({
      array: new Uint16Array([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
      ]),
      itemSize: 4,
      stride: 16,
    }),
    WEIGHTS_0: new BufferAttribute({
      array: new Float32Array([
        1, 0, 0, 0,
        1, 0, 0, 0,
        0.75, 0.25, 0, 0,
        0.75, 0.25, 0, 0,
        0.5, 0.5, 0, 0,
        0.5, 0.5, 0, 0,
        0.25, 0.75, 0, 0,
        0.25, 0.75, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
      ]),
      itemSize: 4,
      stride: 16,
    }),
  })
  const material = new Material({
    color: new Vector4(1, 0.766, 0.336, 1),
    metallic: 0.5,
    roughness: 0.1,
  })
  const mesh = new Mesh({ geometry, material })

  const skeleton = new Skeleton({
    bones: [child2, child21],
    boneInverses: [
      Matrix4.identity(),
      new Matrix4([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 1,
      ]),
    ],
  })

  root.add([child1, child2])
  child1.add([mesh])
  child2.add([child21])
  root.updateWorldMatrix()
  mesh.bindSkeleton(skeleton)
  mesh.updateSkeleton()

  return root
}

export const expectedAnimation = (): Animation => {
  const interpolation = AnimationInterpolationType.Linear
  const transform = "rotation"
  const times = new Float32Array([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5])
  const values = new Float32Array([
    0, 0, 0, 1,
    0, 0, 0.382999986410141, 0.9240000247955322,
    0, 0, 0.7070000171661377, 0.7070000171661377,
    0, 0, 0.7070000171661377, 0.7070000171661377,
    0, 0, 0.382999986410141, 0.9240000247955322,
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, -0.382999986410141, 0.9240000247955322,
    0, 0, -0.7070000171661377, 0.7070000171661377,
    0, 0, -0.7070000171661377, 0.7070000171661377,
    0, 0, -0.382999986410141, 0.9240000247955322,
    0, 0, 0, 1,
  ])
  const node = new Object3d({ position: new Vector3(0, 1, 0) })
  node.updateWorldMatrix()

  return new Animation("animation_0", [
    new AnimationSample({ interpolation, times, values, transform, node }),
  ])
}
