import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget, ComponentType } from "@core/loaders/types"

describe("BufferAttribute", () => {
  describe("constructor", () => {
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
        array: new Uint8Array([9, 0, 1, 2, 3]),
        itemSize: 1,
        normalized: true,
        stride: 1,
        offset: 1,
        target: BufferViewTarget.ElementArrayBuffer,
      })

      expect(bufferAttribute).toMatchObject<Partial<BufferAttribute>>({
        array: new Uint8Array([9, 0, 1, 2, 3]),
        type: ComponentType.Uint8,
        itemSize: 1,
        normalized: true,
        stride: 1,
        offset: 1,
        target: BufferViewTarget.ElementArrayBuffer,
        count: 4,
      })
    })

    it.each([
      [Float32Array, ComponentType.Float32],
      [Uint32Array, ComponentType.Uint32],
      [Int32Array, ComponentType.Int32],
      [Uint16Array, ComponentType.Uint16],
      [Int16Array, ComponentType.Int16],
      [Uint8Array, ComponentType.Uint8],
      [Int8Array, ComponentType.Int8],
    ])("handles type depending on typed array", (Array, type) => {
      const bufferAttribute = new BufferAttribute({
        array: new Array(),
        itemSize: 2,
      })
      expect(bufferAttribute.type).toBe(type)
    })

    it("calculates count taking into account stride", () => {
      const bufferAttribute = new BufferAttribute({
        array: new Uint8Array([9, 9, 0, 1, 0, 0, 2, 3, 0, 0]),
        itemSize: 2,
        offset: 2,
        stride: 4,
      })
      expect(bufferAttribute.count).toBe(2)
    })
  })

  describe("getBufferElement", () => {
    describe("in case when no stride", () => {
      const bufferAttribute = new BufferAttribute({
        array: new Uint8Array([9, 9, 0, 1, 2, 3]),
        itemSize: 2,
        offset: 2,
      })

      it("returns 1th element", () => {
        expect(bufferAttribute.getBufferElement(0)).toEqual(new Uint8Array([0, 1]))
      })

      it("returns 2nd element", () => {
        expect(bufferAttribute.getBufferElement(1)).toEqual(new Uint8Array([2, 3]))
      })
    })

    describe("in case of stride", () => {
      const bufferAttribute = new BufferAttribute({
        array: new Uint8Array([9, 9, 0, 1, 0, 0, 2, 3, 0, 0]),
        itemSize: 2,
        offset: 2,
        stride: 4,
      })

      it("returns 1th element", () => {
        expect(bufferAttribute.getBufferElement(0)).toEqual(new Uint8Array([0, 1]))
      })

      it("returns 2nd element", () => {
        expect(bufferAttribute.getBufferElement(1)).toEqual(new Uint8Array([2, 3]))
      })
    })
  })
})
