import { Matrix4Array } from "@math/matrix4"
import { Program } from "@webgl/program"
import { WebglRenderState } from "@webgl/utils/renderState"

type DebugProgramUniforms = {
  projectionMatrix: Matrix4Array
  worldMatrix: Matrix4Array
}

export class DebugBoxProgram extends Program<DebugProgramUniforms> {
  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    super(gl, state, vertex, fragment)
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
precision lowp float;

void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`
