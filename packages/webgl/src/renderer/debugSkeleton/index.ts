import { DebugBoxProgram } from "@webgl/program/debugBox"
import { WebglRenderState } from "@webgl/utils/renderState"
import { Skeleton } from "@core/skeleton"
import { Camera } from "@core/camera"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { Matrix4 } from "@math/matrix4"
import { BufferViewTarget } from "@core/loaders/types"
import { range } from "@utils/array"

export class DebugSkeletonRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugBoxProgram

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    this.gl = gl
    this.program = new DebugBoxProgram(gl, state)
  }

  public render(skeleton: Skeleton, camera: Camera): void {
    this.program.use()
    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix.toArray(),
    })

    // TODO why the first is not needed?
    const [, ...rest] = skeleton.bones
    const positions = rest.flatMap((bone) => {
      const start = bone.worldMatrix.translationVector()
      const end = bone.parent!.worldMatrix.translationVector()
      return [...start.toArray(), ...end.toArray()]
    })

    const attr = {
      position: new WebglVertexAttribute(this.gl, new BufferAttribute({
        array: new Float32Array(positions),
        itemSize: 3,
      })),
      index: new WebglVertexAttribute(this.gl, new BufferAttribute({
        array: new Uint16Array(range(0, positions.length / 3)),
        itemSize: 1,
        target: BufferViewTarget.ElementArrayBuffer,
      })),
    }

    this.program.attributes.update(attr)
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.uniforms.setValues({
      worldMatrix: Matrix4.identity().toArray(),
    })

    this.gl.drawElements(this.gl.LINES, attr.index.count, attr.index.type, attr.index.offset)
  }
}
