import { bindTexture } from "@webgl/textures/utils"
import { Uniform } from "@webgl/utils/uniform"
import { TextureSlot } from "@webgl/utils/textureSlot"
import { range } from "@utils/array"

export type UniformValues = Record<string, any>

type Props = {
  gl: WebGLRenderingContext
  program: WebGLProgram
}

export class Uniforms<U extends UniformValues> {
  public readonly uniforms: Uniform[] = []

  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram

  constructor({ gl, program }: Props) {
    this.gl = gl
    this.program = program
    this.extractUniforms()
  }

  public update() {
    const textureSlot = new TextureSlot({ gl: this.gl })

    this.uniforms.forEach((uniform) => {
      if (uniform.isTextureArray()) {
        const firstSlot = textureSlot.current
        uniform.value.forEach((texture) => {
          bindTexture(this.gl, texture.texture, textureSlot.current)
          textureSlot.next()
        })
        uniform.specifyValue(range(firstSlot, textureSlot.current))
        return
      }

      if (uniform.isTexture()) {
        bindTexture(this.gl, uniform.value.texture, textureSlot.current)
        uniform.specifyValue(textureSlot.current)
        textureSlot.next()
        return
      }

      uniform.specifyValue()
    })
  }

  public setValues(values: Partial<U>): void {
    this.uniforms.forEach((uniform) => {
      if (values[uniform.name]) {
        uniform.setValue(values[uniform.name])
      }
    })
  }

  private extractUniforms() {
    const activeUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS) as number
    for (let i = 0; i < activeUniforms; i++) {
      const activeInfo = this.gl.getActiveUniform(this.program, i)
      if (activeInfo === null) {
        continue
      }
      const location = this.gl.getUniformLocation(this.program, activeInfo.name)
      if (location === null) {
        continue
      }
      const value = this.gl.getUniform(this.program, location)
      this.uniforms.push(new Uniform({ gl: this.gl, location, activeInfo, value }))
    }
  }
}
