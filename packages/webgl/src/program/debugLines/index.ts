import { Matrix4Array } from "@math/matrix4"
import { Vector3Array } from "@math/vector3"
import { Program } from "@webgl/program"
import { RenderState } from "@webgl/utils/state"
import { GeometryAttributes } from "@core/geometry"

type DebugLinesUniforms = {
  projectionMatrix: Matrix4Array
  worldMatrix: Matrix4Array
  color: Vector3Array
}

type DebugLinesAttributes = Pick<GeometryAttributes, "position">

export class DebugLinesProgram extends Program<DebugLinesUniforms, DebugLinesAttributes> {
  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
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

uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`
