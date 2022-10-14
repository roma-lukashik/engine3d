import { WebGLMesh } from "@webgl/mesh"
import { MeshProgram } from "@webgl/program/mesh"
import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import { Matrix4 } from "@math/matrix4"
import { ShadowRenderer } from "@webgl/renderer/shadow"
import { WebglRenderState } from "@webgl/utils/renderState"

const bias = Matrix4.translation(0.5, 0.5, 0.5).scale(0.5, 0.5, 0.5)

export class MeshRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly state: WebglRenderState
  private readonly meshPrograms: WeakMap<WebGLMesh, MeshProgram> = new WeakMap()
  private readonly shadowRenderer: ShadowRenderer

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    shadowRenderer: ShadowRenderer,
  ) {
    this.gl = gl
    this.state = state
    this.shadowRenderer = shadowRenderer
  }

  public render(scene: Scene, camera: Camera): void {
    this.gl.depthMask(true)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    scene.meshes.forEach((mesh, key) => {
      if (!this.meshPrograms.has(mesh)) {
        this.meshPrograms.set(mesh, new MeshProgram(this.gl, this.state, {
          ambientLightsAmount: scene.ambientLights.length,
          pointLightsAmount: scene.pointLights.length,
          spotLightsAmount: scene.spotLights.length,
          directionalLightsAmount: scene.directionalLights.length,
          shadowsAmount: scene.shadowLights.length,
          useSkinning: !!key.skeleton,
          useColorTexture: !!mesh.colorTexture,
        }))
      }
      const meshProgram = this.meshPrograms.get(mesh)!
      this.updateUniforms(meshProgram, scene, camera)
      mesh.render(meshProgram)
    })
  }

  private updateUniforms(program: MeshProgram, scene: Scene, camera: Camera): void {
    program.use()
    program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix.elements,
      textureMatrices: scene.shadowLights.map((light) => {
        return bias.clone().multiply(light.projectionMatrix).elements
      }),
      ambientLights: scene.ambientLights.map(({ color, intensity }) => {
        return { color: color.clone().multiply(intensity).elements }
      }),
      spotLights: scene.spotLights.map(({ color, intensity, position, target, distance, coneCos, penumbraCos }) => {
        return {
          color: color.clone().multiply(intensity).elements,
          position: position.elements,
          distance,
          target: target.elements,
          coneCos,
          penumbraCos,
        }
      }),
      directionalLights: scene.directionalLights.map(({ color, intensity, direction, bias, castShadow }) => {
        return {
          color: color.clone().multiply(intensity).elements,
          direction: direction.elements,
          bias,
          castShadow,
        }
      }),
      shadowTextures: scene.shadowLights.map((light) => {
        return this.shadowRenderer.texturesStore.getOrCreate(light)
      }),
      cameraPosition: camera.position.elements,
    })
  }
}
