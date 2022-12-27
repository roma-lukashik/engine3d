import { BufferAttribute } from "@core/bufferAttribute"
import { Geometry } from "@core/geometry"

describe("Geometry", () => {
  it("contains correct attributes", () => {
    const position = createBufferAttribute()
    const normal = createBufferAttribute()
    const color = createBufferAttribute()
    const uv = createBufferAttribute()
    const uv2 = createBufferAttribute()
    const skinWeight = createBufferAttribute()
    const skinIndex = createBufferAttribute()
    const tangent = createBufferAttribute()
    const index = createBufferAttribute()

    const geometry = new Geometry({
      POSITION: position,
      NORMAL: normal,
      COLOR_0: color,
      TEXCOORD_0: uv,
      TEXCOORD_1: uv2,
      WEIGHTS_0: skinWeight,
      JOINTS_0: skinIndex,
      TANGENT: tangent,
      index,
    })

    expect(geometry).toMatchObject<Partial<Geometry>>({
      position,
      normal,
      color,
      uv,
      uv2,
      skinIndex,
      skinWeight,
      tangent,
      index,
    })
  })

  describe("positionPoints", () => {
    const positionBufferAttribute = new BufferAttribute({
      array: new Float32Array([
        -5, 0, 1,
        -5, 5, 1,
        5, 5, 1,
        5, 0, 1,
        -5, 0, -1,
        -5, 5, -1,
        5, 5, -1,
        5, 0, -1,
      ]),
      itemSize: 3,
    })

    it("non indexed attribute", () => {
      const geometry = new Geometry({
        POSITION: positionBufferAttribute,
      })
      expect(geometry.positionPoints).toEqual(new Float32Array([
        -5, 0, 1,
        -5, 5, 1,
        5, 5, 1,
        5, 0, 1,
        -5, 0, -1,
        -5, 5, -1,
        5, 5, -1,
        5, 0, -1,
      ]))
    })

    it("indexed attribute", () => {
      const geometry = new Geometry({
        POSITION: positionBufferAttribute,
        index: new BufferAttribute({
          array: new Uint8Array([0, 2, 4, 6, 1, 3, 5, 7]),
          itemSize: 1,
        }),
      })
      expect(geometry.positionPoints).toEqual(new Float32Array([
        -5, 0, 1,
        5, 5, 1,
        -5, 0, -1,
        5, 5, -1,
        -5, 5, 1,
        5, 0, 1,
        -5, 5, -1,
        5, 0, -1,
      ]))
    })
  })
})

const createBufferAttribute = () => {
  return new BufferAttribute({ array: new Uint8Array(), itemSize: 1 })
}
