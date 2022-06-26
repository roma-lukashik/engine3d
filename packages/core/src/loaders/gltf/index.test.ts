import { parseGltf } from "@core/loaders/gltf"
import { simpleGltf, advancedGltf } from "@core/loaders/gltf/__test__/gltf"
import { Mesh } from "@core/mesh"
import { AnimationInterpolationType, BufferViewTarget, Gltf } from "@core/loaders/types"
import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"
import { AnimationSample } from "@core/animationSample"
import { Geometry } from "@core/geometry"
import { Material } from "@core/material"
import { BufferAttribute } from "@core/bufferAttribute"
import { Vector3 } from "@math/vector3"
import { Skeleton } from "@core/skeleton"
import { Matrix4 } from "@math/matrix4"

describe("parseGltf", () => {
  describe("simple GLTF", () => {
    let scene: Object3d
    beforeAll(async () => {
      const gltf = await parseGltf(simpleGltf)
      scene = gltf.scene
    })

    describe("scene", () => {
      it("should be defined", () => {
        expect(scene).toBeDefined()
      })

      it("has correct matrix", () => {
        expect(scene.localMatrix).toValueEqual([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ])
      })

      it("has 1 child node", () => {
        expect(scene.children).toHaveLength(1)
      })
    })

    describe("root node", () => {
      let root: Object3d
      beforeAll(() => root = scene.children[0])

      it("should be defined", () => {
        expect(root).toBeDefined()
      })

      it("has correct matrix", () => {
        expect(root.localMatrix).toValueEqual([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ])
      })

      it("has 2 child nodes", () => {
        expect(root.children).toHaveLength(2)
      })
    })

    describe("root node child #1", () => {
      let root: Object3d
      let child: Object3d
      beforeAll(() => {
        root = scene.children[0]
        child = root.children[0]
      })

      it("has a correct matrix", () => {
        expect(child.localMatrix).toValueEqual([
          2, 0, 0, 0,
          0, 0.865838, 0.500388, 0,
          0, -0.250194, 0.432919, 0,
          10, 20, 30, 1,
        ])
      })

      it("has a child", () => {
        expect(child.children).toHaveLength(1)
      })

      describe("its child #1", () => {
        let mesh: Mesh
        beforeAll(() => {
          mesh = child.children[0] as Mesh
        })

        it("should be instance of Mesh class", () => {
          expect(mesh).toBeInstanceOf(Mesh)
        })

        it("has an index geometry", () => {
          const index = mesh.geometry.index
          expect(index?.count).toBe(3)
          expect(index?.target).toBe(BufferViewTarget.ElementArrayBuffer)
          expect(index?.array).toEqual(new Uint16Array([0, 1, 2]))
        })

        it("has a position geometry", () => {
          const position = mesh.geometry.position
          expect(position?.count).toBe(3)
          expect(position?.target).toBe(BufferViewTarget.ArrayBuffer)
          expect(position?.array).toEqual(new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
          ]))
        })

        it("has a material", () => {
          const material = mesh.material
          expect(material.roughness).toBe(0.1)
          expect(material.metalness).toBe(0.5)
          expect(material.color).toValueEqual([1, 0.766, 0.336])
          expect(material.opacity).toBe(1)
        })
      })
    })

    describe("root node child #2", () => {
      let root: Object3d
      let child: Object3d
      beforeAll(() => {
        root = scene.children[0]
        child = root.children[1]
      })

      it("has a correct matrix", () => {
        expect(child.localMatrix).toValueEqual([
          2, 0, 0, 0,
          0, 0.866, 0.5, 0,
          0, -0.25, 0.433, 0,
          10, 20, 30, 1,
        ])
      })

      it("has no child", () => {
        expect(child.children).toHaveLength(0)
      })
    })
  })

  describe("advanced GLTF", () => {
    let scene: Object3d
    let animations: Animation[]
    beforeAll(async () => {
      const gltf = await parseGltf(advancedGltf)
      scene = gltf.scene
      animations = gltf.animations
    })

    it("builds scene hierarchy correctly", () => {
      const root = new Object3d({ name: "Scene" })
      const child1 = new Object3d()
      const child2 = new Object3d()
      const child21 = new Object3d({ position: new Vector3(0, 1, 0) })
      const mesh = new Mesh({
        geometry: new Geometry({
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
        }),
        material: new Material(),
      })
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
      expect(scene).toEqual(root)
    })

    it("build animations correctly", () => {
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

      expect(animations).toEqual([
        new Animation("animation_0", [
          new AnimationSample({ interpolation, times, values, transform, node }),
        ]),
      ])
    })
  })

  describe("errors handling", () => {
    it("throws an error if version is lower than 2", () => {
      const gltf: Gltf = {
        ...simpleGltf,
        asset: {
          version: "1",
        },
      }
      expect(() => parseGltf(gltf)).rejects.toThrowError("Unsupported *.gltf file. Version should be >= 2.0.")
    })
  })
})
