import { MeshProgram } from "@webgl/program/mesh"
import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import { Matrix4 } from "@math/matrix4"
import { ShadowMaps } from "@webgl/renderer/shadow"
import { RenderState } from "@webgl/utils/state"
import { Mesh } from "@core/mesh"
import { WebGLShadowTexture } from "@webgl/textures/shadow"
import { RenderCache } from "@webgl/renderer/cache"
import { MeshAttributes } from "@webgl/program/mesh/types";
import { WebglVertexAttribute } from "@webgl/utils/attribute";

const bias = Matrix4.translation(0.5, 0.5, 0.5).scale(0.5, 0.5, 0.5)

export class MeshRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly state: RenderState
  private readonly cache: RenderCache
  private readonly meshPrograms: WeakMap<Mesh, MeshProgram> = new WeakMap()
  private readonly shadowMaps: ShadowMaps

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    cache: RenderCache,
    shadowRenderer: ShadowMaps,
  ) {
    this.gl = gl
    this.state = state
    this.cache = cache
    this.shadowMaps = shadowRenderer
  }

  public render(scene: Scene, camera: Camera): void {
    const shadowMap = this.shadowMaps.create(scene)

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

  private renderMesh(mesh: Mesh, scene: Scene, shadowMap: WebGLShadowTexture[], camera: Camera): void {
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
        colorTexture: colorTexture,
      },
      boneTexture: boneTexture?.texture,
      boneTextureSize: boneTexture?.size,
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
      shadowTextures: shadowMap,
      cameraPosition: camera.position.elements,
    })

    const attributes = this.cache.getAttributes(mesh)
    program.attributes.update(attributes)

    this.drawBuffer(attributes)
  }

  private getProgram(mesh: Mesh, scene: Scene): MeshProgram {
    if (!this.meshPrograms.has(mesh)) {
      this.meshPrograms.set(mesh, new MeshProgram(this.gl, this.state, {
        ambientLightsAmount: scene.ambientLights.length,
        pointLightsAmount: scene.pointLights.length,
        spotLightsAmount: scene.spotLights.length,
        directionalLightsAmount: scene.directionalLights.length,
        shadowsAmount: scene.shadowLights.length,
        useSkinning: !!mesh.skeleton,
        useColorTexture: !!mesh.material.colorTexture,
      }))
    }
    return this.meshPrograms.get(mesh)!
  }

  private drawBuffer({ index, position }: Partial<MeshAttributes> & { index?: WebglVertexAttribute; }): void {
    if (index) {
      this.gl.drawElements(this.gl.TRIANGLES, index.count, index.type, index.offset)
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, position?.count ?? 0)
    }
  }
}
