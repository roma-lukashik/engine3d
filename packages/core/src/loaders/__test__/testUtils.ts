import { TextEncoder } from "util"

const BYTES_PER_UINT32 = 4

export const createGlb = ({
  magic = 0x46546C67,
  version = 0x2,
  json = {},
  jsonFormat = 0x4E4F534A,
  binary,
  binaryFormat = 0x004E4942,
}: {
  magic?: number
  version?: number
  json?: object
  jsonFormat?: number
  binary?: ArrayBuffer
  binaryFormat?: number
} = {}): ArrayBuffer => {
  const jsonBuffer = new TextEncoder().encode(JSON.stringify(json)).buffer
  const jsonBufferLength = BYTES_PER_UINT32 * Math.ceil(jsonBuffer.byteLength / BYTES_PER_UINT32)
  const headerLength = 5 * BYTES_PER_UINT32
  const length = headerLength + jsonBufferLength + (binary ? 2 * BYTES_PER_UINT32 + binary.byteLength : 0)
  const glb = new DataView(new ArrayBuffer(length))

  writeHeader(glb, magic, version, length)
  writeChunk(glb, jsonBuffer, jsonBufferLength, jsonFormat, 3 * BYTES_PER_UINT32)
  padBuffer(glb, headerLength + jsonBuffer.byteLength, jsonBufferLength - jsonBuffer.byteLength, 0x20)

  if (binary) {
    const binaryLength = BYTES_PER_UINT32 * Math.ceil(binary.byteLength / BYTES_PER_UINT32)
    writeChunk(glb, binary, binaryLength, binaryFormat, headerLength + jsonBufferLength)
  }

  return glb.buffer
}

function writeHeader(dataView: DataView, magic: number, version: number, length: number) {
  dataView.setUint32(0 * BYTES_PER_UINT32, magic, true)
  dataView.setUint32(1 * BYTES_PER_UINT32, version, true)
  dataView.setUint32(2 * BYTES_PER_UINT32, length, true)
}

function writeChunk(dataView: DataView, chunk: ArrayBuffer, chunkLength: number, chunkType: number, offset: number) {
  dataView.setUint32(offset, chunkLength, true)
  dataView.setUint32(offset + BYTES_PER_UINT32, chunkType, true)
  writeArrayBuffer(dataView.buffer, chunk, offset + 2 * BYTES_PER_UINT32, chunk.byteLength)
}

function writeArrayBuffer(target: ArrayBuffer, source: ArrayBuffer, targetOffset: number, byteLength: number) {
  new Uint8Array(target, targetOffset, byteLength).set(new Uint8Array(source, 0, byteLength), 0)
}

function padBuffer(dataView: DataView, offset: number, padCount: number, pad: number) {
  for (let i = 0; i < padCount; i++) {
    dataView.setUint8(offset + i, pad)
  }
}
