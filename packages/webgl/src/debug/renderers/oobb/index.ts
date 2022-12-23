import { DebugBoxRenderer } from "@webgl/debug/renderers/box"
import { RenderObject } from "@core/object3d"
import { RenderState } from "@webgl/utils/state"
import { RGB } from "@core/color/rgb"

export class DebugOOBBRenderer extends DebugBoxRenderer {
  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: RGB = new RGB(0x22ff00),
  ) {
    super(gl, state, color)
  }

  protected override calculateTransformMatrix({ oobb }: RenderObject) {
    this.transformMatrix.compose(oobb.rotation, oobb.center, oobb.halfSize)
  }
}
