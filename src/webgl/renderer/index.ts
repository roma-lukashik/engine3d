import * as m4 from '../../math/matrix4'
import { Scene } from '../scene'
import { Camera } from '../../core/camera'
import { createMainProgram, MainProgram } from '../program/main'

type Props = {
  canvas?: HTMLCanvasElement;
  width: number;
  height: number;
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
    this.program = createMainProgram({ gl })
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(scene: Scene, camera: Camera): void {
    const shadowLights = scene.shadowLights
    if (scene.dirty) {
      this.program = createMainProgram({
        gl: this.gl,
        ambientLightsAmount: scene.ambientLights.length,
        pointLightsAmount: scene.pointLights.length,
        directionalLightsAmount: scene.directionalLights.length,
        shadowsAmount: shadowLights.length,
      })
      scene.dirty = false
    }
    scene.shadow.render(shadowLights, scene.meshes)

    this.gl.depthMask(true)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    const step = 1 / shadowLights.length
    const textureMatrix = shadowLights.map((light, i) => {
      return m4.multiply(
        m4.scale(m4.translation((0.5 + i) * step, 0.5, 0.5), step / 2, 0.5, 0.5),
        light.projectionMatrix,
      )
    })

    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix,
      textureMatrix: textureMatrix,
      cameraPosition: camera.position,
      ambientLights: scene.ambientLights.map(({ color, intensity }) => ({ color, intensity })),
      pointLights: scene.pointLights.map(({ color, position }) => ({ color, position })),
      directionalLights: scene.directionalLights.map(({ color, intensity, direction }) => ({ color, intensity, direction })),
      shadowTexture: scene.shadow.depthTexture,
    })

    scene.meshes.forEach((mesh) => mesh.render(this.program))
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
}
