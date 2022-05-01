import { BufferAttribute } from '../../../core/loaders/gltf/bufferAttribute'

export type ExtendedAttribute = {
  size: number;
  data: BufferAttribute['array'];
  type: number;
  normalized: boolean;
  stride: number;
  offset: number;
  target: number;
  count: number;
  buffer: WebGLBuffer | null;
}

export const createExtendedAttribute = (
  gl: WebGLRenderingContext,
  value: BufferAttribute,
  target: number,
): ExtendedAttribute => ({
  size: value.itemSize,
  data: value.array,
  type: value.array.constructor === Float32Array ?
    gl.FLOAT :
    value.array.constructor === Uint16Array ?
      gl.UNSIGNED_SHORT :
      gl.UNSIGNED_INT,
  normalized: value.normalized,
  stride: value.stride,
  offset: value.offset,
  target: target,
  count: value.count,
  buffer: gl.createBuffer(),
})
