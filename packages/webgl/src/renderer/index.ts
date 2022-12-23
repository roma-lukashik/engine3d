import { Scene } from "@webgl/scene"
import { ShadowMapRenderer } from "@webgl/renderer/shadow"
import { MeshRenderer } from "@webgl/renderer/mesh"
import { RenderState } from "@webgl/utils/state"
import { RenderCache } from "@webgl/renderer/cache"
import { DebugRenderer, DebugRendererConstructor } from "@webgl/debug/renderers/types"

type Props = {
  width: number
  height: number
  canvas?: HTMLCanvasElement
  debugRenderers?: DebugRendererConstructor[]
}

export class Renderer {
  public readonly gl: WebGLRenderingContext

  private readonly state: RenderState
  private readonly cache: RenderCache
  private readonly shadowMapRenderer: ShadowMapRenderer
  private readonly meshRenderer: MeshRenderer
  private readonly debugRenderers: DebugRenderer[]

  public constructor({
    canvas = document.createElement("canvas"),
    width,
    height,
    debugRenderers = [],
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
    if (!gl.getExtension("OES_standard_derivatives")) {
      throw new Error("Your browser cannot support standard derivatives extension")
    }
    this.gl = gl
    this.state = new RenderState(this.gl)
    this.cache = new RenderCache(this.gl)
    this.shadowMapRenderer = new ShadowMapRenderer(this.gl, this.state, this.cache)
    this.meshRenderer = new MeshRenderer(this.gl, this.state, this.cache, this.shadowMapRenderer)
    this.debugRenderers = debugRenderers.map((DebugRendererConstructor) => {
      return new DebugRendererConstructor(this.gl, this.state)
    })
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(scene: Scene): void {
    this.meshRenderer.render(scene)
    this.debugRenderers.forEach((renderer) => renderer.render(scene))
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
}
