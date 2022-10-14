import { indexes, positions } from "@webgl/renderer/debugLight/data"
import { WebglRenderState } from "@webgl/utils/renderState"
import { DebugBoxRenderer } from "@webgl/renderer/debugBox"

export class DebugLightRenderer extends DebugBoxRenderer {
  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    super(gl, state, positions, indexes)
  }
}
