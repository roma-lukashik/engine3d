import { Gltf } from '../types'

const BINARY_HEADER_LENGTH = 12
const UINT_SIZE = 4
const BINARY_HEADER_MAGIC = 0x46546C67
const BINARY_CHUNK_JSON_TYPES = 0x4E4F534A
const BINARY_CHUNK_BIN_TYPES = 0x004E4942

type Glb = {
  json: Gltf
  data?: ArrayBuffer
}

// GLB contains 12 byte header:
// - magic (unsigned char[4])
// - version (uint32)
// - length (uint32)
// Next it contains contents in the following format:
// - contentLength (uint32)
// - contentFormat (uint32)
// - json or binary data
export const parseGlb = (buffer: ArrayBufferLike): Glb => {
  const [magic, version] = new Uint32Array(buffer, 0, BINARY_HEADER_LENGTH / UINT_SIZE)
  if (magic !== BINARY_HEADER_MAGIC) {
    throw new Error('Unsupported glTF-Binary header.')
  }
  if (version < 2.0) {
    throw new Error(`Unsupported legacy binary file. Provided version is ${version}, but supported is 2.0.`)
  }

  const [jsonLength, jsonFormat] = getHeader(buffer, BINARY_HEADER_LENGTH)
  if (jsonFormat !== BINARY_CHUNK_JSON_TYPES) {
    throw new Error('Unexpected GLB layout.')
  }
  const jsonOffset = BINARY_HEADER_LENGTH + 2 * UINT_SIZE
  const jsonBuffer = buffer.slice(jsonOffset, jsonOffset + jsonLength)
  const json = JSON.parse(decodeText(jsonBuffer))

  const [binaryLength, binaryFormat] = getHeader(buffer, jsonOffset + jsonLength)
  if (binaryFormat !== BINARY_CHUNK_BIN_TYPES) {
    throw new Error('Unexpected GLB layout.')
  }
  const binaryOffset = jsonOffset + jsonLength + 2 * UINT_SIZE
  const data = buffer.slice(binaryOffset, binaryOffset + binaryLength)

  return { json, data }
}

const getHeader = (buffer: ArrayBufferLike, offset: number): [length: number, format: number] => {
  return [...new Uint32Array(buffer, offset, 2)] as [number, number]
}

const decodeText = (buffer: ArrayBufferLike): string => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(buffer)
  }
  const string = new Uint8Array(buffer).reduce((text, c) => text + String.fromCharCode(c), '')
  return decodeURIComponent(string)
}
