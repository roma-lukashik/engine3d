type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array

export type Attribute<T extends TypedArray = any> = {
  size: number;
  data: T;
  type: number;
  normalized: boolean;
  stride: number;
  offset: number;
  divisor: number;
  target: number;
  count: number;
  buffer: WebGLBuffer | null;
}

type Value<T extends TypedArray> = {
  size: number;
  data: T;
}

export const createAttribute = <T extends TypedArray>(
  gl: WebGL2RenderingContext,
  value: Value<T>
): Attribute<T> => ({
  ...value,
  type: gl.FLOAT,
  normalized: false,
  stride: 0,
  offset: 0,
  divisor: 0,
  target: gl.ARRAY_BUFFER,
  count: value.data.length / value.size,
  buffer: gl.createBuffer(),
})
