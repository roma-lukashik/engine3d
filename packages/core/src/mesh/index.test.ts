import { Mesh } from "@core/mesh"
import { Geometry } from "@core/geometry"
import { Material } from "@core/material"
import { Object3d } from "@core/object3d"
import { Skeleton } from "@core/skeleton"

describe("Mesh", () => {
  const geometry = new Geometry()
  const material = new Material()

  it("to be created", () => {
    const mesh = new Mesh({ geometry, material })
    expect(mesh).toBeDefined()
  })

  it("to be instance of Object3d", () => {
    const mesh = new Mesh({ geometry, material })
    expect(mesh).toBeInstanceOf(Object3d)
  })

  it("has correct props", () => {
    const mesh = new Mesh({ geometry, material })
    expect(mesh.geometry).toBe(geometry)
    expect(mesh.material).toBe(material)
  })

  it("bind skeleton", () => {
    const mesh = new Mesh({ geometry, material })
    const skeleton = new Skeleton({
      bones: [],
      boneInverses: [],
    })
    mesh.bindSkeleton(skeleton)
    expect(mesh.skeleton).toBe(skeleton)
  })
})
