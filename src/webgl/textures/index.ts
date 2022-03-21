import { WebGLImageTexture } from './image'
import { WebGLPixelTexture } from './pixel'
import { ImageTexture, PixelTexture, Texture, TextureType } from '../../core/textures'
import { WebGLBaseTexture } from './types'

export const createWebGLTexture = (gl: WebGLRenderingContext, texture: Texture): WebGLBaseTexture => {
  if (isImageTexture(texture)) {
    return new WebGLImageTexture({ gl, image: texture.image })
  }
  if (isPixelTexture(texture)) {
    return new WebGLPixelTexture({ gl, color: texture.color })
  }
  throw new Error(`Unknown texture type ${texture.type}`)
}

const isImageTexture = (texture: Texture): texture is ImageTexture =>
  texture.type === TextureType.Image

const isPixelTexture = (texture: Texture): texture is PixelTexture =>
  texture.type === TextureType.Pixel
