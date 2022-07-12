import { Uniforms } from "@webgl/utils/uniforms"
import { WebGLRenderingContextStub } from "../../../../../tests/stubs/renderingContext"

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
  let uniforms: Uniforms<any>

  beforeEach(() => {
    const gl = new WebGLRenderingContextStub()
    const program = gl.createProgram()!
    const vertex = gl.createShader()!

    gl.shaderSource(vertex, vertexShader)
    gl.attachShader(program, vertex)

    uniforms = new Uniforms({ gl, program })
  })

  it("contains correct uniforms", () => {
    expect(uniforms.uniforms).toHaveLength(5)
    expect(uniforms.uniforms[0].name).toEqual("worldMatrix")
    expect(uniforms.uniforms[1].name).toEqual("boneTextureSize")
    expect(uniforms.uniforms[2].name).toEqual("boneTexture")
    expect(uniforms.uniforms[3].name).toEqual("shadowTextures")
    expect(uniforms.uniforms[4].name).toEqual("textureMatrices")
  })
})
