import { DebugBoxRenderer } from "@webgl/debug/renderers/box"
import { RenderObject } from "@core/object3d"
import { Quaternion } from "@math/quaternion"
import { RenderState } from "@webgl/utils/state"
import { RGB } from "@core/color/rgb"

const identityQuaternion = Quaternion.identity()

export class DebugAABBRenderer extends DebugBoxRenderer {
  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: RGB = new RGB(0xDE3E4B),
  ) {
    super(gl, state, color)
  }

  protected override calculateTransformMatrix({ aabb }: RenderObject) {
    this.transformMatrix.compose(identityQuaternion, aabb.getCenter(), aabb.getSize().divideScalar(2))
  }
}
