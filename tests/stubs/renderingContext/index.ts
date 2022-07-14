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

  private uniforms: WeakMap<WebGLProgram, WebGLActiveInfo[]> = new WeakMap()
  private uniformLocations: WeakMap<WebGLActiveInfo, WebGLUniformLocation> = new WeakMap()
  private uniformValues: WeakMap<WebGLUniformLocation, any> = new WeakMap()

  private attributes: WeakMap<WebGLProgram, WebGLActiveInfo[]> = new WeakMap()
  private attributesLocations: WeakMap<WebGLActiveInfo, GLint> = new WeakMap()

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
    const { uniforms, uniformValues, attributes } = parse(source)
    this.uniforms.set(program, uniforms)
    uniforms.forEach((uniform, i) => {
      const location: WebGLUniformLocation = {}
      this.uniformLocations.set(uniform, location)
      this.uniformValues.set(location, uniformValues[i])
    })
    this.attributes.set(program, attributes)
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

  public texParameteri(_target: GLenum, _pname: GLenum, _param: GLint): void {
    // Stub
  }

  public texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void
  public texImage2D(
    _target: GLenum,
    _level: GLint,
    _internalformat: GLint,
    _width: GLsizei,
    _height: GLsizei,
    _border: GLint,
    _format: GLenum,
    _type: GLenum,
    _pixels: ArrayBufferView | null,
  ): void
  public texImage2D(..._args: any[]){
    // Stub
  }

  public createFramebuffer(): WebGLFramebuffer | null {
    // Stub
    return {}
  }

  public createRenderbuffer(): WebGLRenderbuffer | null {
    // Stub
    return {}
  }

  public bindFramebuffer(_target: GLenum, _framebuffer: WebGLFramebuffer | null): void {
    // Noop
  }

  public bindRenderbuffer(_target: GLenum, _renderbuffer: WebGLRenderbuffer | null) {
    // Noop
  }

  public framebufferTexture2D(
    _target: GLenum,
    _attachment: GLenum,
    _textarget: GLenum,
    _texture: WebGLTexture | null,
    _level: GLint,
  ): void {
    // Noop
  }

  public renderbufferStorage(_target: GLenum, _internalformat: GLenum, _width: GLsizei, _height: GLsizei): void {
    // Noop
  }

  public framebufferRenderbuffer(
    _target: GLenum,
    _attachment: GLenum,
    _renderbuffertarget: GLenum,
    _renderbuffer: WebGLRenderbuffer | null,
  ): void {
    // Noop
  }

  public uniform1fv(location: WebGLUniformLocation | null, v: Float32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform2fv(location: WebGLUniformLocation | null, v: Float32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform3fv(location: WebGLUniformLocation | null, v: Float32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform4fv(location: WebGLUniformLocation | null, v: Float32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform1iv(location: WebGLUniformLocation | null, v: Int32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform2iv(location: WebGLUniformLocation | null, v: Int32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform3iv(location: WebGLUniformLocation | null, v: Int32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform4iv(location: WebGLUniformLocation | null, v: Int32List): void {
    if (location !== null) {
      this.uniformValues.set(location, v)
    }
  }

  public uniform1f(location: WebGLUniformLocation | null, x: GLfloat) {
    if (location !== null) {
      this.uniformValues.set(location, x)
    }
  }

  public uniform1i(location: WebGLUniformLocation | null, x: GLint) {
    if (location !== null) {
      this.uniformValues.set(location, x)
    }
  }

  // TODO Transpose
  public uniformMatrix2fv(location: WebGLUniformLocation | null, _transpose: GLboolean, value: Float32List) {
    if (location !== null) {
      this.uniformValues.set(location, value)
    }
  }

  // TODO Transpose
  public uniformMatrix3fv(location: WebGLUniformLocation | null, _transpose: GLboolean, value: Float32List) {
    if (location !== null) {
      this.uniformValues.set(location, value)
    }
  }

  // TODO Transpose
  public uniformMatrix4fv(location: WebGLUniformLocation | null, _transpose: GLboolean, value: Float32List) {
    if (location !== null) {
      this.uniformValues.set(location, value)
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
      case this.MAX_TEXTURE_IMAGE_UNITS:
        return 8
      default:
        throw new Error(`Getting ${pname} parameter is not supported`)
    }
  }

  public getProgramParameter(program: WebGLProgram, pname: GLenum): any {
    switch (pname) {
      case this.ACTIVE_UNIFORMS:
        return this.uniforms.get(program)?.length ?? null
      case this.ACTIVE_ATTRIBUTES:
        return this.attributes.get(program)?.length ?? null
      default:
        throw new Error(`Getting ${pname} parameter is not supported`)
    }
  }

  public getActiveUniform(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null {
    return this.uniforms.get(program)?.[index] ?? null
  }

  public getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null {
    const uniform = this.uniforms.get(program)?.find((u) => u.name === name)
    return uniform ? this.uniformLocations.get(uniform) ?? null : null
  }

  public getUniform(_program: WebGLProgram, location: WebGLUniformLocation): any {
    return this.uniformValues.get(location) ?? null
  }

  public getActiveAttrib(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null {
    return this.attributes.get(program)?.[index] ?? null
  }

  public getAttribLocation(program: WebGLProgram, name: string): GLint {
    const attrib = this.attributes.get(program)?.find((a) => a.name === name)
    return attrib ? this.attributesLocations.get(attrib) ?? -1 : -1
  }
}

function autoImplement<T>(): new () => T {
  return class { } as any
}

type TextureUnit = {
  TEXTURE_2D: WebGLTexture | null
  TEXTURE_CUBE_MAP: WebGLTexture | null
}
