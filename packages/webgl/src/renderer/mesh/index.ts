import { MeshProgram } from "@webgl/program/mesh"
import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import { ShadowMap, ShadowMapRenderer } from "@webgl/renderer/shadow"
import { RenderState } from "@webgl/utils/state"
import { Mesh } from "@core/mesh"
import { RenderCache } from "@webgl/renderer/cache"

export class MeshRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly state: RenderState
  private readonly cache: RenderCache
  private readonly meshPrograms: WeakMap<Mesh, MeshProgram> = new WeakMap()
  private readonly shadowMapRenderer: ShadowMapRenderer

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    cache: RenderCache,
    shadowRenderer: ShadowMapRenderer,
  ) {
    this.gl = gl
    this.state = state
    this.cache = cache
    this.shadowMapRenderer = shadowRenderer
  }

  public render(scene: Scene, camera: Camera): void {
    const shadowMap = this.shadowMapRenderer.create(scene)

    this.gl.depthMask(true)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    scene.objects.forEach((object) => {
      object.meshes.forEach((mesh) => {
        this.renderMesh(mesh, scene, shadowMap, camera)
      })
    })
  }

  private renderMesh(mesh: Mesh, scene: Scene, shadowMap: ShadowMap, camera: Camera): void {
    const program = this.getProgram(mesh, scene)
    program.use()

    const boneTexture = this.cache.getBoneTexture(mesh)
    const colorTexture = this.cache.getColorTexture(mesh)

    boneTexture?.update()

    program.uniforms.setValues({
      worldMatrix: mesh.worldMatrix.elements,
      material: {
        metalness: mesh.material.metalness,
        roughness: mesh.material.roughness,
        color: mesh.material.color.elements,
        colorTexture,
      },
      boneTexture: boneTexture?.texture,
      boneTextureSize: boneTexture?.size,
      projectionMatrix: camera.projectionMatrix.elements,
      ambientLights: scene.ambientLights.map(({ color, intensity }) => {
        return { color: color.elements, intensity }
      }),
      spotLights: scene.spotLights.map(({ color, intensity, position, target, distance, coneCos, penumbraCos }) => {
        return {
          color: color.elements,
          position: position.elements,
          distance,
          intensity,
          target: target.elements,
          coneCos,
          penumbraCos,
        }
      }),
      directionalLights: scene.directionalLights
        .filter((light) => !light.castShadow)
        .map(({ color, intensity, direction }) => {
          return {
            color: color.elements,
            direction: direction.elements,
            intensity,
          }
      }),
      directionalShadowLights: scene.directionalLights
        .filter((light) => light.castShadow)
        .map((light) => {
          const { color, intensity, direction, bias, projectionMatrix } = light
          return {
            color: color.elements,
            direction: direction.elements,
            intensity,
            bias,
            projectionMatrix: projectionMatrix.elements,
            shadowMap: shadowMap.get(light)!,
          }
      }),
      cameraPosition: camera.position.elements,
    })

    program.attributes.update(mesh.geometry)

    this.drawBuffer(mesh)
  }

  private getProgram(mesh: Mesh, scene: Scene): MeshProgram {
    if (!this.meshPrograms.has(mesh)) {
      this.meshPrograms.set(mesh, new MeshProgram(this.gl, this.state, {
        ambientLightsAmount: scene.ambientLights.length,
        pointLightsAmount: scene.pointLights.length,
        spotLightsAmount: scene.spotLights.length,
        directionalLightsAmount: scene.directionalLights.filter((light) => !light.castShadow).length,
        directionalShadowLightsAmount: scene.directionalLights.filter((light) => light.castShadow).length,
        useSkinning: !!mesh.skeleton,
        useColorTexture: !!mesh.material.colorTexture,
      }))
    }
    return this.meshPrograms.get(mesh)!
  }

  private drawBuffer(mesh: Mesh): void {
    const { index, position } = mesh.geometry
    if (index) {
      this.gl.drawElements(this.gl.TRIANGLES, index.count, index.type, index.offset)
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, position.count)
    }
  }
}
