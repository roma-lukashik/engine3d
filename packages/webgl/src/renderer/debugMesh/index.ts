import { DebugLinesProgram } from "@webgl/program/debugLines"
import { RenderState } from "@webgl/utils/state"
import { Camera } from "@core/camera"
import { BufferAttribute } from "@core/bufferAttribute"
import { Matrix4 } from "@math/matrix4"
import { BufferViewTarget } from "@core/loaders/types"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { indexes, positions } from "@webgl/renderer/debugMesh/data"
import { RenderObject } from "@core/object3d"
import { RGB } from "@core/color/rgb"

export class DebugMeshRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly color: RGB
  private readonly positionAttribute: BufferAttribute
  private readonly indexAttribute: BufferAttribute

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: RGB = new RGB(0xDE3E4B),
  ) {
    this.gl = gl
    this.color = color
    this.program = new DebugLinesProgram(gl, state)
    this.positionAttribute = new BufferAttribute({
      array: positions,
      itemSize: Vector3.size,
    })
    this.indexAttribute = new BufferAttribute({
      array: indexes,
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    })
  }

  public render(object: RenderObject, camera: Camera): void {
    const min = object.aabb.min
    const max = object.aabb.max
    const translation = max.clone().add(min).divideScalar(2)
    const scale = max.clone().subtract(min).divideScalar(2)
    const transformMatrix = Matrix4.compose(Quaternion.identity(), translation, scale)

    this.program.use()
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.uniforms.setValues({
      worldMatrix: transformMatrix.elements,
      projectionMatrix: camera.projectionMatrix.elements,
      color: this.color.elements,
    })

    this.program.attributes.update({
      position: this.positionAttribute,
      index: this.indexAttribute,
    })

    this.gl.drawElements(
      this.gl.LINES,
      this.indexAttribute.count,
      this.indexAttribute.type,
      this.indexAttribute.offset,
    )
  }
}
