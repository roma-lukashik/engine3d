import { BufferAttribute } from '@core/bufferAttribute'
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

    const geometry = new Geometry({
      POSITION: position,
      NORMAL: normal,
      COLOR_0: color,
      TEXCOORD_0: uv,
      TEXCOORD_1: uv2,
      WEIGHTS_0: skinWeight,
      JOINTS_0: skinIndex,
      TANGENT: tangent,
    })

    expect(geometry).toMatchObject<Geometry>({
      position,
      normal,
      color,
      uv,
      uv2,
      skinIndex,
      skinWeight,
      tangent,
    })
  })
})

const createBufferAttribute = () => {
  return new BufferAttribute({ array: new Uint8Array(), itemSize: 1 })
}
