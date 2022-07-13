import { Uniforms } from "@webgl/utils/uniforms"
import { Matrix4Array } from "@math/matrix4"
import { WebGLBaseTexture } from "@webgl/textures/types"
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
  let uniforms: Uniforms<TestUniforms>

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

    expect(uniforms.uniforms[0].name).toBe("worldMatrix")
    expect(uniforms.uniforms[0].value).toEqual(new Float32Array([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]))

    expect(uniforms.uniforms[1].name).toBe("boneTextureSize")
    expect(uniforms.uniforms[1].value).toBe(0)

    expect(uniforms.uniforms[2].name).toBe("boneTexture")
    expect(uniforms.uniforms[2].value).toBe(0)

    expect(uniforms.uniforms[3].name).toBe("shadowTextures")
    expect(uniforms.uniforms[3].value).toEqual(0)

    expect(uniforms.uniforms[4].name).toBe("textureMatrices")
    expect(uniforms.uniforms[4].value).toEqual(new Float32Array([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]))
  })
})
