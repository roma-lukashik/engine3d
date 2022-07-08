import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import { ShadowRenderer } from "@webgl/renderer/shadow"
import { MeshRenderer } from "@webgl/renderer/mesh"
import { LightDebugInfoRenderer } from "@webgl/renderer/lightDebugInfo"

type Props = {
  canvas?: HTMLCanvasElement
  width: number
  height: number
}

export class Renderer {
  public readonly gl: WebGLRenderingContext

  private readonly shadowRenderer: ShadowRenderer
  private readonly meshRenderer: MeshRenderer
  private readonly lightDebugInfoRenderer: LightDebugInfoRenderer

  constructor({
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
    this.shadowRenderer = new ShadowRenderer({ gl })
    this.meshRenderer = new MeshRenderer({ gl, shadowRenderer: this.shadowRenderer })
    this.lightDebugInfoRenderer = new LightDebugInfoRenderer({ gl })
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(scene: Scene, camera: Camera): void {
    this.shadowRenderer.render(scene.shadowLights, scene.meshes)
    this.meshRenderer.render(scene, camera)
    this.lightDebugInfoRenderer.render(scene.shadowLights, camera)
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
}
