import { Mesh } from "@core/mesh"
import { Geometry } from "@core/geometry"
import { Material } from "@core/material"
import { Node } from "@core/node"
import { Skeleton } from "@core/skeleton"
import { BufferAttribute } from "@core/bufferAttribute"

describe("Mesh", () => {
  const geometry = new Geometry({
    POSITION: new BufferAttribute({ array: new Uint8Array(), itemSize: 1 }),
  })
  const material = new Material()

  it("to be created", () => {
    const mesh = new Mesh({ geometry, material })
    expect(mesh).toBeDefined()
  })

  it("to be instance of Node", () => {
    const mesh = new Mesh({ geometry, material })
    expect(mesh).toBeInstanceOf(Node)
  })

  it("has correct props", () => {
    const mesh = new Mesh({ geometry, material })
    expect(mesh.geometry).toBe(geometry)
    expect(mesh.material).toBe(material)
  })

  it("bind skeleton", () => {
    const mesh = new Mesh({ geometry, material })
    const skeleton = new Skeleton([], [])
    mesh.bindSkeleton(skeleton)
    expect(mesh.skeleton).toBe(skeleton)
  })
})
