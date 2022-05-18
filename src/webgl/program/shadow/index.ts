import { Program } from '..'
import { Matrix4 } from '../../../math/types'

type ShadowUniforms = {
  projectionMatrix?: Matrix4
  modelMatrix?: Matrix4
}

type Props = {
  gl: WebGLRenderingContext
}

export class ShadowProgram extends Program<ShadowUniforms> {
  constructor({ gl }: Props) {
    super({ gl, vertex, fragment })
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
