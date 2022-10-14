import { SingleUniform } from "@webgl/uniforms/single"
import { WebglRenderState } from "@webgl/utils/renderState"
import { WebGLRenderingContextStub } from "../../../../../tests/stubs/renderingContext"

describe("SingleUniform", () => {
  let gl: WebGLRenderingContextStub
  let state: WebglRenderState
  const location = {} as WebGLUniformLocation
  const program = {} as WebGLProgram
  const name = "matrix"

  beforeEach(() => {
    gl = new WebGLRenderingContextStub()
    state = new WebglRenderState(gl)
  })

  it("handles FLOAT_VEC2", () => {
    const uniform = new SingleUniform(gl, state, name, new Float32Array([0, 0]), location, gl.FLOAT_VEC2)
    uniform.setValue(new Float32Array([0, 1]))
    expect(gl.getUniform(program, location)).toEqual(new Float32Array([0, 1]))
  })

  it("handles FLOAT_VEC3", () => {
    const uniform = new SingleUniform(gl, state, name, new Float32Array([0, 0, 0]), location, gl.FLOAT_VEC3)
    uniform.setValue(new Float32Array([0, 1, 2]))
    expect(gl.getUniform(program, location)).toEqual(new Float32Array([0, 1, 2]))
  })

  it("handles FLOAT_VEC4", () => {
    const uniform = new SingleUniform(gl, state, name, new Float32Array([0, 0, 0, 0]), location, gl.FLOAT_VEC4)
    uniform.setValue(new Float32Array([0, 1, 2, 3]))
    expect(gl.getUniform(program, location)).toEqual(new Float32Array([0, 1, 2, 3]))
  })

  it("handles FLOAT", () => {
    const uniform = new SingleUniform(gl, state, name, 0, location, gl.FLOAT)
    uniform.setValue(1.5)
    expect(gl.getUniform(program, location)).toEqual(1.5)
  })

  it("handles INT", () => {
    const uniform = new SingleUniform(gl, state, name, 0, location, gl.INT)
    uniform.setValue(1)
    expect(gl.getUniform(program, location)).toEqual(1)
  })

  it("handles BOOL", () => {
    const uniform = new SingleUniform(gl, state, name, true, location, gl.BOOL)
    uniform.setValue(false)
    expect(gl.getUniform(program, location)).toEqual(false)
  })
})
