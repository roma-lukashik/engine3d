import { MeshProgram } from "@webgl/program/mesh"
import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import * as m4 from "@math/matrix4"
import * as v3 from "@math/vector3"
import { WebGLMesh } from "@webgl/mesh"
import { ShadowRenderer } from "@webgl/shadow"

type Props = {
  canvas?: HTMLCanvasElement
  width: number
  height: number
}

export class Renderer {
  private meshPrograms: WeakMap<WebGLMesh, MeshProgram> = new WeakMap()
  private shadowRenderer: ShadowRenderer

  public readonly gl: WebGLRenderingContext

  constructor({
    canvas = document.createElement("canvas"),
    width,
    height,
  }: Props) {
    const gl = canvas.getContext("webgl", { antialias: true })
    if (!gl) {
      throw new Error("Unable to create WebGL context")
    }
    const ext = gl.getExtension("OES_texture_float")
    if (!ext) {
      throw new Error("Your browser cannot support floating-point pixel types for textures")
    }
    const ext2 = gl.getExtension("OES_element_index_uint")
    if (!ext2) {
      throw new Error("Your browser cannot support floating-point pixel types for textures")
    }
    this.gl = gl
    this.shadowRenderer = new ShadowRenderer({ gl })
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(scene: Scene, camera: Camera): void {
    this.shadowRenderer.render(scene.shadowLights, scene.meshes)

    this.gl.depthMask(true)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    scene.meshes.forEach((mesh, key) => {
      if (!this.meshPrograms.has(mesh)) {
        this.meshPrograms.set(mesh, new MeshProgram({
          gl: this.gl,
          ambientLightsAmount: scene.ambientLights.length,
          pointLightsAmount: scene.pointLights.length,
          spotLightsAmount: scene.spotLights.length,
          directionalLightsAmount: scene.directionalLights.length,
          shadowsAmount: scene.shadowLights.length,
          useSkinning: !!key.skeleton,
        }))
      }
      const meshProgram = this.meshPrograms.get(mesh)!
      this.updateUniforms(meshProgram, scene, camera)
      mesh.render(meshProgram)
    })
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }

  private updateUniforms(program: MeshProgram, scene: Scene, camera: Camera): void {
    const bias = m4.scale(m4.translation(0.5, 0.5, 0.5), 0.5, 0.5, 0.5)

    program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix,
      textureMatrices: scene.shadowLights.map((light) => m4.multiply(bias, light.projectionMatrix)),
      ambientLights: scene.ambientLights.map(({ color, intensity }) => ({ color: v3.multiply(color, intensity) })),
      pointLights: scene.pointLights.map(({ color, position }) => ({ color, position })),
      spotLights: scene.spotLights.map(({ color, intensity, position, target, distance, coneCos, penumbraCos }) => ({ color: v3.multiply(color, intensity), position, distance, target, coneCos, penumbraCos })),
      directionalLights: scene.directionalLights.map(({ color, intensity, direction }) => ({ color: v3.multiply(color, intensity), direction })),
      shadowTextures: scene.shadowLights.map((light) => this.shadowRenderer.depthTextures.get(light)!),
      cameraPosition: camera.position,
    })
  }
}
