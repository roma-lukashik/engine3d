import { bindTexture } from '../../textures/utils'
import { Uniform } from '../uniform'
import { TextureSlot } from '../textureSlot'

export type UniformValues = {
  [key: string]: any;
}

type Props = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
}

export class Uniforms<U extends UniformValues> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram
  private readonly data: Uniform[] = []

  constructor({ gl, program }: Props) {
    this.gl = gl
    this.program = program
    this.extractUniforms()
  }

  public update() {
    const textureSlot = new TextureSlot({ gl: this.gl })

    this.data.forEach((uniform) => {
      if (uniform.isTextureArray()) {
        const slots: number[] = []
        uniform.value.forEach((texture) => {
          const slot = textureSlot.next()
          bindTexture(this.gl, texture.texture, slot)
          slots.push(slot)
        })
        uniform.specifyValue(slots)
        return
      }

      if (uniform.isTexture()) {
        const slot = textureSlot.next()
        bindTexture(this.gl, uniform.value.texture, slot)
        uniform.specifyValue(slot)
        return
      }

      uniform.specifyValue()
    })
  }

  public setValues(values: U): void {
    this.data.forEach((uniform) => {
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
        return
      }
      const location = this.gl.getUniformLocation(this.program, activeInfo.name)
      if (location === null) {
        return
      }
      const value = this.gl.getUniform(this.program, location)
      this.data.push(new Uniform({ gl: this.gl, location, activeInfo, value }))
    }
  }
}
