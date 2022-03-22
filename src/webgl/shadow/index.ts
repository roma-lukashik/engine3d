import { BaseProgram, Program } from '../program'
import { WebGLMesh } from '../mesh'
import { WebGLDepthTexture } from '../textures/depth'
import { Matrix4 } from '../../math/matrix4'
import { Light } from '../../core/lights'
import { Mesh } from '../../core/mesh'

type Props = {
  gl: WebGLRenderingContext;
}

type ShadowUniforms = {
  projectionMatrix: Matrix4;
  modelMatrix: Matrix4;
}

export class Shadow {
  private readonly gl: WebGLRenderingContext
  private readonly program: Program<ShadowUniforms>

  public readonly depthTexture: WebGLDepthTexture

  constructor({ gl }: Props) {
    this.gl = gl
    this.program = new BaseProgram({ gl, vertex, fragment })
    this.depthTexture = new WebGLDepthTexture({ gl })
  }

  public render(lights: Light[], meshes: Map<Mesh, WebGLMesh>): void {
    this.gl.depthMask(true)
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.depthTexture.buffer)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    const width = this.depthTexture.width / lights.length

    lights.forEach((light, i) => {
      this.gl.viewport(width * i, 0, width, this.depthTexture.height)
      meshes.forEach((mesh) => {
        mesh.render(this.program, { projectionMatrix: light.projectionMatrix })
      })
    })
  }
}

const vertex = `
  attribute vec3 position;

  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;

  void main() {
    gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
  }
`

const fragment = `
  precision highp float;

  vec4 packRGBA (float v) {
    vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
    pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
    return pack;
  }

  void main() {
    gl_FragColor = packRGBA(gl_FragCoord.z);
  }
`
