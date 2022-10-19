import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget, ComponentType } from "@core/loaders/types"

describe("BufferAttribute", () => {
  it("to be created with default arguments", () => {
    const bufferAttribute = new BufferAttribute({
      array: new Uint8Array([0, 1, 2, 3]),
      itemSize: 2,
    })

    expect(bufferAttribute).toMatchObject<Partial<BufferAttribute>>({
      array: new Uint8Array([0, 1, 2, 3]),
      type: ComponentType.Uint8,
      itemSize: 2,
      normalized: false,
      stride: 0,
      offset: 0,
      target: BufferViewTarget.ArrayBuffer,
      count: 2,
    })
  })

  it("to be created with custom arguments", () => {
    const bufferAttribute = new BufferAttribute({
      array: new Uint8Array([0, 1, 2, 3]),
      itemSize: 1,
      normalized: true,
      stride: 1,
      offset: 10,
      target: BufferViewTarget.ElementArrayBuffer,
    })

    expect(bufferAttribute).toMatchObject<Partial<BufferAttribute>>({
      array: new Uint8Array([0, 1, 2, 3]),
      type: ComponentType.Uint8,
      itemSize: 1,
      normalized: true,
      stride: 1,
      offset: 10,
      target: BufferViewTarget.ElementArrayBuffer,
      count: 4,
    })
  })
})
