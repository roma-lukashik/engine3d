import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import { ShadowMapRenderer } from "@webgl/renderer/shadow"
import { MeshRenderer } from "@webgl/renderer/mesh"
import { DebugLightRenderer } from "@webgl/renderer/debugLight"
import { RenderState } from "@webgl/utils/state"
import { DebugSkeletonRenderer } from "@webgl/renderer/debugSkeleton"
import { DebugMeshRenderer } from "@webgl/renderer/debugMesh"
import { RenderCache } from "@webgl/renderer/cache"
import { getRenderStack } from "@webgl/renderer/utils"

type Props = {
  canvas?: HTMLCanvasElement
  width: number
  height: number
}

export class Renderer {
  public readonly gl: WebGLRenderingContext

  private readonly state: RenderState
  private readonly cache: RenderCache
  private readonly shadowMapRenderer: ShadowMapRenderer
  private readonly meshRenderer: MeshRenderer
  private readonly debugLightRenderer: DebugLightRenderer
  private readonly debugSkeletonRenderer: DebugSkeletonRenderer
  private readonly debugMeshRenderer: DebugMeshRenderer

  public constructor({
    canvas = document.createElement("canvas"),
    width,
    height,
  }: Props) {
    const gl = canvas.getContext("webgl", { antialias: true })
    if (!gl) {
      throw new Error("Unable to create WebGL context")
    }
    if (!gl.getExtension("OES_texture_float")) {
      throw new Error("Your browser cannot support floating-point pixel types for textures")
    }
    if (!gl.getExtension("OES_element_index_uint")) {
      throw new Error("Your browser cannot support uint index element")
    }
    this.gl = gl
    this.state = new RenderState(this.gl)
    this.cache = new RenderCache(this.gl)
    this.shadowMapRenderer = new ShadowMapRenderer(this.gl, this.state, this.cache)
    this.meshRenderer = new MeshRenderer(this.gl, this.state, this.cache, this.shadowMapRenderer)
    this.debugLightRenderer = new DebugLightRenderer(this.gl, this.state)
    this.debugSkeletonRenderer = new DebugSkeletonRenderer(this.gl, this.state)
    this.debugMeshRenderer = new DebugMeshRenderer(this.gl, this.state)
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(scene: Scene, camera: Camera): void {
    const renderStack = getRenderStack(scene, camera)
    this.meshRenderer.render(renderStack, scene, camera)
    this.debugLightRenderer.render(scene, camera)
    renderStack.forEach((object) => {
      this.debugSkeletonRenderer.render(object, camera)
      this.debugMeshRenderer.render(object, camera)
    })
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
}
