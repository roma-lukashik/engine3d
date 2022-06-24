import { parseGlb } from "@core/loaders/glb"
import { createGlb } from "@core/loaders/__test__/testUtils"

const simpleBinary = new Uint8Array([0xAA, 0xBB, 0xCC]).buffer

const simpleJson = {
  asset: {
    version: 2.0,
  },
  scene: 0,
  scenes: [
    { name: "Scene" },
  ],
}

describe("parseGLB", () => {
  it("returns correct gltf object", () => {
    const glb = createGlb({ json: simpleJson, binary: simpleBinary })
    expect(parseGlb(glb)).toEqual({
      ...simpleJson,
      buffers: [
        simpleBinary,
      ],
    })
  })

  it("returns correct gltf object with no binary data", () => {
    const glb = createGlb({ json: simpleJson })
    expect(parseGlb(glb)).toEqual(simpleJson)
  })

  it("throws an error if magic is not supported", () => {
    const wrongMagicGlb = createGlb({ json: simpleJson, magic: 0x000 })
    expect(() => parseGlb(wrongMagicGlb)).toThrowError("Unsupported glTF-Binary header.")
  })

  it("throws an error if version is lower than 2", () => {
    const wrongVersionGlb = createGlb({ json: simpleJson, version: 1 })
    expect(() => parseGlb(wrongVersionGlb))
      .toThrowError("Unsupported legacy binary file. Provided version is 1, but supported is 2.0.")
  })

  it("throws an error if wrong json format", () => {
    const wrongJsonFormatGlb = createGlb({ json: simpleJson, jsonFormat: 0x000 })
    expect(() => parseGlb(wrongJsonFormatGlb)).toThrowError("Unexpected GLB layout.")
  })

  it("throws an error if wrong binary format", () => {
    const wrongBinaryFormatGlb = createGlb({ json: simpleJson, binaryFormat: 0x000, binary: simpleBinary })
    expect(() => parseGlb(wrongBinaryFormatGlb)).toThrowError("Unexpected GLB layout.")
  })
})
