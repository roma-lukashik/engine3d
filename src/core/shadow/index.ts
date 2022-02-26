import { createProgram, Program } from '../program'
import { Mesh } from '../mesh'
import { Lighting } from '../lightings/point'
import * as m4 from '../../math/matrix4'
import { DepthTexture } from '../textures/depth'

type Shadow = {
  render: (meshes: Mesh[], lighting: Lighting) => void;
}

type ShadowOptions = {
  gl: WebGLRenderingContext;
}

export const createShadow = (options: ShadowOptions): Shadow => {
  return new ShadowImpl(options)
}

export class ShadowImpl implements Shadow {
  private readonly gl: WebGLRenderingContext
  private readonly program: Program
  private readonly depthTexture: DepthTexture

  constructor({
    gl
  }: ShadowOptions) {
    this.gl = gl
    this.program = createProgram({ gl, vertex, fragment })
    this.depthTexture = new DepthTexture({ gl })
  }

  public render(meshes: Mesh[], lighting: Lighting): void {
    this.gl.depthMask(true)
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.depthTexture.buffer)
    this.gl.viewport(0, 0, this.depthTexture.width, this.depthTexture.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    meshes.forEach((mesh) => mesh.render(this.program, lighting, lighting, m4.identity()))
  }
}

const vertex = `
  attribute vec3 position;

  uniform mat4 projectionMatrix;
  uniform mat4 worldMatrix;

  void main() {
    gl_Position = projectionMatrix * worldMatrix * vec4(position, 1.0);
  }
`;

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
`;
