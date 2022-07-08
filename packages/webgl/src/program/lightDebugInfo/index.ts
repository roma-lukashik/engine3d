import { Matrix4Array } from "@math/matrix4"
import { Program } from "@webgl/program"

type LightDebugInfoUniforms = {
  projectionMatrix: Matrix4Array
  worldMatrix: Matrix4Array
}

type Props = {
  gl: WebGLRenderingContext
}

export class LightDebugInfoProgram extends Program<LightDebugInfoUniforms> {
  public constructor({ gl }: Props) {
    super({ gl, vertex, fragment })
  }
}

const vertex = `
attribute vec3 position;

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * (worldMatrix * vec4(position, 1.0));
}
`

const fragment = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
