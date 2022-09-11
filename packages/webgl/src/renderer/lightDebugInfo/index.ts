import { indexes, positions } from "@webgl/renderer/lightDebugInfo/data"
import { WebglRenderState } from "@webgl/utils/renderState"
import { DebugBoxRenderer } from "@webgl/renderer/debugBoxRenderer"

export class LightDebugInfoRenderer extends DebugBoxRenderer {
  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    super(gl, state, positions, indexes)
  }
}
