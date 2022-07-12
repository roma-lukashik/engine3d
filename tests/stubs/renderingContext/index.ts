import { WebGLConstant } from "./constants"
import { parse } from "./glslParser"

export class WebGLRenderingContextStub extends autoImplement<WebGLRenderingContext>() {
  public canvas: HTMLCanvasElement = {
    width: 300,
    height: 150,
    // @ts-expect-error
    getContext: () => this,
  }

  private activeTextureUnit = WebGLConstant.TEXTURE0
  private textureUnits: TextureUnit[] = []
  private programParameters: WeakMap<WebGLProgram, WebglProgramParameters> = new WeakMap()
  private shaderSources: WeakMap<WebGLShader, string> = new WeakMap()

  public constructor() {
    super()
    Object.assign(this, WebGLConstant)
  }

  public activeTexture(unit: GLenum) {
    this.activeTextureUnit = unit - this.TEXTURE0
  }

  public createTexture(): WebGLTexture | null {
    // stub
    return {} as WebGLTexture
  }

  public createShader(): WebGLShader | null {
    // Stub
    return {} as WebGLShader
  }

  public createProgram(): WebGLProgram | null {
    // Stub
    return {} as WebGLProgram
  }

  public shaderSource(shader: WebGLShader, source: string) {
    this.shaderSources.set(shader, source)
  }

  public attachShader(program: WebGLProgram, shader: WebGLShader) {
    const source = this.shaderSources.get(shader)
    if (!source) {
      throw new Error("Cannot find a source for the shader")
    }
    this.programParameters.set(program, parse(source))
  }

  public bindTexture(target: GLenum, texture: WebGLTexture | null) {
    if (!this.textureUnits[this.activeTextureUnit]) {
      this.textureUnits[this.activeTextureUnit] = {
        TEXTURE_2D: null,
        TEXTURE_CUBE_MAP: null,
      }
    }
    const unit = this.textureUnits[this.activeTextureUnit]
    switch (target) {
      case this.TEXTURE_2D:
        unit.TEXTURE_2D = texture
        break
      case this.TEXTURE_CUBE_MAP:
        unit.TEXTURE_CUBE_MAP = texture
        break
      default:
        throw new Error(`Unprocessed target ${target}`)
    }
  }

  public getParameter(pname: GLenum): any {
    switch (pname) {
      case this.ACTIVE_TEXTURE:
        return this.activeTextureUnit
      case this.TEXTURE_BINDING_2D:
        return this.textureUnits[this.activeTextureUnit]?.TEXTURE_2D ?? null
      case this.TEXTURE_BINDING_CUBE_MAP:
        return this.textureUnits[this.activeTextureUnit]?.TEXTURE_CUBE_MAP ?? null
      default:
        throw new Error(`Getting ${pname} parameter is not supported`)
    }
  }

  public getProgramParameter(program: WebGLProgram, pname: GLenum): any {
    switch (pname) {
      case this.ACTIVE_UNIFORMS:
        return this.programParameters.get(program)?.uniforms.length ?? null
      case this.ACTIVE_ATTRIBUTES:
        return this.programParameters.get(program)?.attributes.length ?? null
      default:
        throw new Error(`Getting ${pname} parameter is not supported`)
    }
  }

  public getActiveUniform(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null {
    return this.programParameters.get(program)?.uniforms[index] ?? null
  }

  public getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null {
    const params = this.programParameters.get(program)
    const uniform = params?.uniforms.find((u) => u.name === name)
    return uniform ? params?.uniformLocations.get(uniform) ?? null : null
  }

  public getUniform(program: WebGLProgram, location: WebGLUniformLocation): any {
    const params = this.programParameters.get(program)
    return params?.uniforms.find((u) => params?.uniformLocations.get(u) === location) ?? null
  }
}

function autoImplement<T>(): new () => T {
  return class { } as any
}

type WebglProgramParameters = {
  uniforms: WebGLActiveInfo[]
  attributes: WebGLActiveInfo[]
  uniformLocations: WeakMap<WebGLActiveInfo, WebGLUniformLocation>
}

type TextureUnit = {
  TEXTURE_2D: WebGLTexture | null
  TEXTURE_CUBE_MAP: WebGLTexture | null
}
