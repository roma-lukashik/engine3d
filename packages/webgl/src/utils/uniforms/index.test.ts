import { Uniforms } from "@webgl/utils/uniforms"
import { Matrix4, Matrix4Array } from "@math/matrix4"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { WebGLDataTexture } from "@webgl/textures/data"
import { WebGLDepthTexture } from "@webgl/textures/depth"
import { WebGLRenderingContextStub } from "../../../../../tests/stubs/renderingContext"

type TestUniforms = {
  worldMatrix: Matrix4Array
  boneTextureSize: number
  boneTexture: WebGLBaseTexture
  shadowTextures: WebGLBaseTexture[]
  textureMatrices: Matrix4Array[]
}

const vertexShader = `
uniform mat4 worldMatrix;
uniform float boneTextureSize;
uniform sampler2D boneTexture;
uniform sampler2D shadowTextures[2];
uniform mat4 textureMatrices[2];

void main() {
  gl_Position = projectionMatrix * modelPosition;
}
`

describe("Uniforms", () => {
  let gl: WebGLRenderingContextStub
  let uniforms: Uniforms<TestUniforms>
  let program: WebGLProgram

  beforeEach(() => {
    gl = new WebGLRenderingContextStub()
    program = gl.createProgram()!

    const vertex = gl.createShader()!

    gl.shaderSource(vertex, vertexShader)
    gl.attachShader(program, vertex)

    uniforms = new Uniforms({ gl, program })
  })

  function getUniformValue(name: string): any {
    const location = gl.getUniformLocation(program, name)
    if (!location) {
      throw new Error(`Program does not contain ${name} uniform.`)
    }
    return gl.getUniform(program, location)
  }

  it("contains correct uniforms", () => {
    expect(getUniformValue("worldMatrix")).toEqual(new Float32Array([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]))
    expect(getUniformValue("boneTextureSize")).toBe(0)
    expect(getUniformValue("boneTexture")).toBe(0)
    expect(getUniformValue("shadowTextures[0]")).toEqual(0)
    expect(getUniformValue("textureMatrices[0]")).toEqual(new Float32Array([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]))
  })

  it("updates uniforms", () => {
    const boneTexture = {} as WebGLDataTexture<Float32Array>
    const shadowTexture1 = {} as WebGLDepthTexture
    const shadowTexture2 = {} as WebGLDepthTexture

    uniforms.setValues({
      worldMatrix: Matrix4.identity().toArray(),
      boneTextureSize: 16,
      boneTexture: boneTexture,
      shadowTextures: [
        shadowTexture1,
        shadowTexture2,
      ],
      textureMatrices: [
        Matrix4.translation(0.5, 0.5, 0.5).scale(0.5, 0.5, 0.5).toArray(),
        Matrix4.identity().toArray(),
      ],
    })

    uniforms.update()

    expect(getUniformValue("worldMatrix")).toValueEqual(new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]))
    expect(getUniformValue("boneTextureSize")).toBe(16)
    expect(getUniformValue("boneTexture")).toBe(0)
    expect(getUniformValue("shadowTextures[0]")).toEqual([1, 2])
    expect(getUniformValue("textureMatrices[0]")).toValueEqual(new Float32Array([
      0.5, 0, 0, 0,
      0, 0.5, 0, 0,
      0, 0, 0.5, 0,
      0.5, 0.5, 0.5, 1,

      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]))
  })
})
