import { indexes, positions } from "@webgl/renderer/debugMesh/data"
import { WebglRenderState } from "@webgl/utils/renderState"
import { DebugBoxRenderer } from "@webgl/renderer/debugBox"
import { WebGLMesh } from "@webgl/mesh"
import { Matrix4 } from "@math/matrix4"

export class DebugMeshRenderer extends DebugBoxRenderer {
  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    mesh: WebGLMesh,
  ) {
    const aabb = mesh.computeBoundingBox()
    const scale = aabb.max
      .transformMatrix4(mesh.projectionMatrix)
      .subtract(aabb.min.transformMatrix4(mesh.projectionMatrix))
      .divide(2)
    const translate = aabb.center.transformMatrix4(mesh.projectionMatrix)

    const transform = Matrix4.translation(translate.x, translate.y, translate.z)
      .scale(scale.x, scale.y, scale.z)

    const p = positions.map((v) => v.clone().transformMatrix4(transform).transformMatrix4(mesh.projectionMatrix))
    const points = new Float32Array([
      p[0].x, p[0].y, p[0].z,
      p[1].x, p[1].y, p[1].z,
      p[2].x, p[2].y, p[2].z,
      p[3].x, p[3].y, p[3].z,
      p[4].x, p[4].y, p[4].z,
      p[5].x, p[5].y, p[5].z,
      p[6].x, p[6].y, p[6].z,
      p[7].x, p[7].y, p[7].z,
    ])
    super(gl, state, points, indexes)
  }
}
