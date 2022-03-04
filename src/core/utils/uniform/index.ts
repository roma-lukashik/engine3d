export type Uniform = {
  info: WebGLActiveInfo;
  location: WebGLUniformLocation;
  value: any;
}

export const extractUniforms = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const uniforms: Record<string, Uniform> = {}
  const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < activeUniforms; i++) {
    const info = gl.getActiveUniform(program, i)
    const location = info ? gl.getUniformLocation(program, info.name) : null
    if (info && location) {
      uniforms[info.name] = { info, location, value: gl.getUniform(program, location) }
    }
  }
  return uniforms
}

export const setUniform = (
  gl: WebGLRenderingContext,
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
