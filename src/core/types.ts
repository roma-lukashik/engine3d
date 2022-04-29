import { BufferAttribute } from './loaders/gltf/bufferAttribute'

export type Model = {
  position: BufferAttribute
  normal: BufferAttribute
  uv: BufferAttribute
  index?: BufferAttribute
}
