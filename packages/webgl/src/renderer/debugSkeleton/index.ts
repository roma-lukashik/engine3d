import { DebugLinesProgram } from "@webgl/program/debugLines"
import { WebglRenderState } from "@webgl/utils/renderState"
import { Camera } from "@core/camera"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { Matrix4 } from "@math/matrix4"
import { BufferViewTarget } from "@core/loaders/types"
import { range } from "@utils/array"
import { Vector3 } from "@math/vector3"
import { Gltf } from "@core/gltf"

export class DebugSkeletonRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly color: Vector3

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    color: Vector3 = new Vector3(0, 0.8, 0.1),
  ) {
    this.gl = gl
    this.color = color
    this.program = new DebugLinesProgram(gl, state)
  }

  public render(object: Gltf<any>, camera: Camera): void {
    if (!object.skeletons.length) {
      return
    }
    const pointsAmount = object.skeletons.reduce((amount, skeleton) => {
      return amount + (skeleton.bones.length - 1) * Vector3.size * 2
    }, 0)
    const positions = new Float32Array(pointsAmount)

    let i = 0
    object.skeletons.map((skeleton) => {
      skeleton.bones.slice(1).forEach((bone) => {
        const start = bone.worldMatrix.translationVector()
        const end = bone.parent!.worldMatrix.translationVector()
        positions.set(start.elements, i)
        positions.set(end.elements, i + 3)
        i += 6
      })
    })

    const positionAttribute = new WebglVertexAttribute(this.gl, new BufferAttribute({
      array: positions,
      itemSize: 3,
    }))
    const indexAttribute = new WebglVertexAttribute(this.gl, new BufferAttribute({
      array: new Uint16Array(range(0, positions.length / Vector3.size)),
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    }))

    this.program.use()
    this.program.attributes.update({
      position: positionAttribute,
      index: indexAttribute,
    })
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.uniforms.setValues({
      worldMatrix: Matrix4.identity().elements,
      projectionMatrix: camera.projectionMatrix.elements,
      color: this.color.elements,
    })

    this.gl.drawElements(this.gl.LINES, indexAttribute.count, indexAttribute.type, indexAttribute.offset)
  }
}
