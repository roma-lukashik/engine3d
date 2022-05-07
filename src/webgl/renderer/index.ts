import * as m4 from '../../math/matrix4'
import * as v3 from '../../math/vector3'
import { Scene } from '../scene'
import { Camera } from '../../core/camera'
import { MainProgram } from '../program/main'

type Props = {
  canvas?: HTMLCanvasElement
  width: number
  height: number
}

export class Renderer {
  private program: MainProgram

  public readonly gl: WebGLRenderingContext

  constructor({
    canvas = document.createElement('canvas'),
    width,
    height,
  }: Props) {
    const gl = canvas.getContext('webgl', { antialias: true })
    if (!gl) {
      throw new Error('Unable to create WebGL context')
    }
    this.gl = gl
    this.program = new MainProgram({ gl })
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(scene: Scene, camera: Camera): void {
    if (scene.dirty) {
      this.program = new MainProgram({
        gl: this.gl,
        ambientLightsAmount: scene.ambientLights.length,
        pointLightsAmount: scene.pointLights.length,
        spotLightsAmount: scene.spotLights.length,
        directionalLightsAmount: scene.directionalLights.length,
        shadowsAmount: scene.shadows.length,
      })
      scene.dirty = false
    }
    scene.shadows.forEach((shadow) => shadow.render(scene.meshes))

    this.gl.depthMask(true)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.updateUniforms(scene, camera)

    scene.meshes.forEach((mesh) => mesh.render(this.program))
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }

  private updateUniforms(scene: Scene, camera: Camera): void {
    const bias = m4.scale(m4.translation(0.5, 0.5, 0.5), 0.5, 0.5, 0.5)

    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix,
      textureMatrices: scene.shadowLights.map((light) => m4.multiply(bias, light.projectionMatrix)),
      ambientLights: scene.ambientLights.map(({ color, intensity }) => ({ color: v3.multiply(color, intensity) })),
      pointLights: scene.pointLights.map(({ color, position }) => ({ color, position })),
      spotLights: scene.spotLights.map(({ color, intensity, position, target, distance, angle, penumbra }) => ({ color: v3.multiply(color, intensity), position, distance, target, coneCos: Math.cos(angle), penumbraCos: Math.cos(angle * (1 - penumbra)) })),
      directionalLights: scene.directionalLights.map(({ color, intensity, direction }) => ({ color: v3.multiply(color, intensity), direction })),
      shadowTextures: scene.shadows.map(({ depthTexture }) => depthTexture),
      cameraPosition: camera.position,
    })
  }
}
