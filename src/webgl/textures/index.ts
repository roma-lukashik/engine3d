import { WebGLImageTexture } from './image'
import { WebGLColorTexture } from './color'
import { ImageTexture, ColorTexture, Texture, TextureType } from '../../core/textures'
import { WebGLBaseTexture } from './types'

export const createWebGLTexture = (gl: WebGLRenderingContext, texture: Texture): WebGLBaseTexture => {
  if (isImageTexture(texture)) {
    return new WebGLImageTexture({ gl, image: texture.image })
  }
  if (isColorTexture(texture)) {
    return new WebGLColorTexture({ gl, color: texture.color })
  }
  throw new Error(`Unknown texture type ${texture.type}`)
}

const isImageTexture = (texture: Texture): texture is ImageTexture =>
  texture.type === TextureType.Image

const isColorTexture = (texture: Texture): texture is ColorTexture =>
  texture.type === TextureType.Color
