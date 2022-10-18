import { WebGLMesh } from "@webgl/mesh"
import { MeshProgram } from "@webgl/program/mesh"
import { Scene } from "@webgl/scene"
import { Camera } from "@core/camera"
import { Matrix4 } from "@math/matrix4"
import { ShadowMaps } from "@webgl/renderer/shadow"
import { WebglRenderState } from "@webgl/utils/renderState"
import { Mesh } from "@core/mesh"
import { WebGLDepthTexture } from "@webgl/textures/depth"

const bias = Matrix4.translation(0.5, 0.5, 0.5).scale(0.5, 0.5, 0.5)

export class MeshRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly state: WebglRenderState
  private readonly meshPrograms: WeakMap<Mesh, MeshProgram> = new WeakMap()
  private readonly webglMeshes: WeakMap<Mesh, WebGLMesh> = new WeakMap()
  private readonly shadowMaps: ShadowMaps

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    shadowRenderer: ShadowMaps,
  ) {
    this.gl = gl
    this.state = state
    this.shadowMaps = shadowRenderer
  }

  public render(scene: Scene, camera: Camera): void {
    const shadowMaps = this.shadowMaps.create(scene)

    this.gl.depthMask(true)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    scene.objects.forEach((object) => {
      object.meshes.forEach((mesh) => {
        const meshProgram = this.getProgram(mesh, scene)
        meshProgram.use()

        if (!this.webglMeshes.get(mesh)) {
          this.webglMeshes.set(mesh, new WebGLMesh(this.gl, mesh))
        }
        const webglMesh = this.webglMeshes.get(mesh)!
        this.updateProgram(meshProgram, mesh, webglMesh, scene, shadowMaps, camera)
        webglMesh.render()
      })
    })
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

  private updateProgram(
    program: MeshProgram,
    mesh: Mesh,
    webglMesh: WebGLMesh,
    scene: Scene,
    shadowMaps: WebGLDepthTexture[],
    camera: Camera,
  ): void {
    program.uniforms.setValues({
      worldMatrix: mesh.worldMatrix.elements,
      material: {
        metalness: mesh.material.metalness,
        roughness: mesh.material.roughness,
        color: mesh.material.color.elements,
        colorTexture: webglMesh.colorTexture,
      },
      boneTexture: webglMesh.boneTexture,
      boneTextureSize: webglMesh.boneTextureSize,
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
      shadowTextures: shadowMaps,
      cameraPosition: camera.position.elements,
    })
    program.attributes.update(webglMesh.attributes)
  }
}
