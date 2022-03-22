import { bindTexture } from '../../textures/utils'
import { Uniform } from '../uniform'

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
    let textureSlot = 0
    this.data.forEach((uniform) => {
      if (uniform.isTexture()) {
        bindTexture(this.gl, uniform.value.texture, textureSlot)
        uniform.specifyValue(textureSlot)
        textureSlot++
      } else {
        uniform.specifyValue()
      }
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
