import * as matrix3 from '../../math/matrix3'
import { Camera } from '../camera'

type ProgramProps = {
  gl: WebGL2RenderingContext;
  camera: Camera;
  vertex: string;
  fragment: string;
}

export type Program = {
  program: WebGLProgram;
  getAttributeLocations: () => Map<WebGLActiveInfo, number>;
  use: () => void;
}

export const createProgram = ({
  gl,
  camera,
  vertex,
  fragment,
}: ProgramProps): Program => {
  const vertexShader = compileShader(gl, vertex, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, fragment, gl.FRAGMENT_SHADER)
  const program = gl.createProgram()

  if (!program) {
    throw new Error('Cannot create a program')
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  const uniformLocations = getUniformLocations(gl, program)
  const attributeLocations = getAttributeLocations(gl, program)

  return {
    program,
    getAttributeLocations: () => attributeLocations,
    use: () => use(gl, program, uniformLocations, camera),
  }
}

const compileShader = (gl: WebGL2RenderingContext, source: string, type: number): WebGLShader => {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Cannot create a shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

type Uniform = {
  info: WebGLActiveInfo;
  location: WebGLUniformLocation;
  value: any;
}

const getUniformLocations = (gl: WebGL2RenderingContext, program: WebGLProgram): Uniform[] => {
  const uniformLocations: Uniform[] = []
  const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < activeUniforms; i++) {
    const info = gl.getActiveUniform(program, i)
    const location = info ? gl.getUniformLocation(program, info.name) : null
    if (info && location) {
      uniformLocations.push({ info, location, value: gl.getUniform(program, location) })
    }
  }
  return uniformLocations
}

const getAttributeLocations = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): Map<WebGLActiveInfo, number> => {
  const attributeLocations = new Map<WebGLActiveInfo, number>()
  const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number
  for (let i = 0; i < activeAttributes; i++) {
    const attribute = gl.getActiveAttrib(program, i)
    const location = attribute ? gl.getAttribLocation(program, attribute.name) : null
    if (location !== null) {
      attributeLocations.set(attribute!, location)
    }
  }
  return attributeLocations
}

const use = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniformLocations: Uniform[],
  camera: Camera,
) => {
  gl.useProgram(program)
  uniformLocations.forEach((uniform) => {
    if (uniform.info.name === 'modelViewMatrix') {
      uniform.value = camera.projectionViewMatrix()
    }
    if (uniform.info.name === 'projectionMatrix') {
      uniform.value = camera.projectionMatrix()
    }
    if (uniform.info.name === 'normalMatrix') {
      uniform.value = matrix3.identity()
    }
    setUniform(gl, uniform.info.type, uniform.location, uniform.value)
  })
}

const setUniform = (
  gl: WebGL2RenderingContext,
  type: number,
  location: WebGLUniformLocation,
  value: any,
): void => {
  switch (type) {
    case gl.FLOAT:
      return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value)
    case gl.FLOAT_VEC2:
      return gl.uniform2fv(location, value)
    case gl.FLOAT_VEC3:
      return gl.uniform3fv(location, value)
    case gl.FLOAT_VEC4:
      return gl.uniform4fv(location, value)
    case gl.BOOL:
    case gl.INT:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value)
    case gl.BOOL_VEC2:
    case gl.INT_VEC2:
      return gl.uniform2iv(location, value)
    case gl.BOOL_VEC3:
    case gl.INT_VEC3:
      return gl.uniform3iv(location, value)
    case gl.BOOL_VEC4:
    case gl.INT_VEC4:
      return gl.uniform4iv(location, value)
    case gl.FLOAT_MAT2:
      return gl.uniformMatrix2fv(location, false, value)
    case gl.FLOAT_MAT3:
      return gl.uniformMatrix3fv(location, false, value)
    case gl.FLOAT_MAT4:
      return gl.uniformMatrix4fv(location, false, value)
  }
}
