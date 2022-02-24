import { TypedArray } from '../../types'

export type Attribute = {
  location: number;
  info: WebGLActiveInfo;
}

export const extractAttributes = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): Record<string, Attribute> => {
  const attributeLocations: Record<string, Attribute> = {}
  const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number
  for (let i = 0; i < activeAttributes; i++) {
    const info = gl.getActiveAttrib(program, i)
    const location = info ? gl.getAttribLocation(program, info.name) : null
    if (location !== null && info !== null) {
      attributeLocations[info.name] = { info, location }
    }
  }
  return attributeLocations
}

export type ExtendedAttribute<T extends TypedArray = any> = {
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

export const createExtendedAttribute = <T extends TypedArray>(
  gl: WebGL2RenderingContext,
  value: {
    size: number,
    data: T,
  },
): ExtendedAttribute<T> => ({
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
