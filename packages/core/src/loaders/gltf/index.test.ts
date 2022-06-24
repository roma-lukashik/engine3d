import { parseGltf } from "@core/loaders/gltf"
import { animationGltf, simpleGltf } from "@core/loaders/gltf/__test__/gltf"
import { Mesh } from "@core/mesh"
import { AnimationInterpolationType, BufferViewTarget, Gltf } from "@core/loaders/types"
import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"
import { AnimationSample } from "@core/animationSample"
import { Geometry } from "@core/geometry"
import { Material } from "@core/material"
import { BufferAttribute } from "@core/bufferAttribute"

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

  describe("parses animation", () => {
    let animations: Animation[]
    beforeAll(async () => {
      const gltf = await parseGltf(animationGltf)
      animations = gltf.animations
    })

    it("parses correctly", () => {
      const interpolation = AnimationInterpolationType.Linear
      const transform = "rotation"
      const times = new Float32Array([0, 0.25, 0.5, 0.75, 1])
      const values = new Float32Array([
        0, 0, 0, 1,
        0, 0, 0.707, 0.707,
        0, 0, 1, 0,
        0, 0, 0.707, -0.707,
        0, 0, 0, 1,
      ])
      const node = new Object3d()
      const geometry = new Geometry({
        POSITION: new BufferAttribute({
          array: new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
          ]),
          itemSize: 3,
        }),
        index: new BufferAttribute({
          array: new Uint16Array([0, 1, 2]),
          itemSize: 1,
          target: BufferViewTarget.ElementArrayBuffer,
        }),
      })
      const material = new Material()
      const mesh = new Mesh({ geometry, material })
      node.add([mesh])

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
