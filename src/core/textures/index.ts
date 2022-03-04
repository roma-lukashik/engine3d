import { BasicTexture } from './basic'
import { PixelTexture } from './pixel'
import { DepthTexture } from './depth'

type ExtractOptions<T extends new (...args: any[]) => any> = ExcludeRegister<ConstructorParameters<T>[0]>
type ExcludeRegister<T extends object> = Omit<T, 'register'>

class TextureCreator {
  private textureRegister: number = 0

  public createBasicTexture(options: ExtractOptions<typeof BasicTexture>) {
    return new BasicTexture(this.extendOptions(options))
  }

  public createPixelTexture(options: ExtractOptions<typeof PixelTexture>) {
    return new PixelTexture(this.extendOptions(options))
  }

  public createDepthTexture(options: ExtractOptions<typeof DepthTexture>) {
    return new DepthTexture(this.extendOptions(options))
  }

  private extendOptions<T extends object>(options: T): T & { register: number } {
    return { ...options, register: this.textureRegister++ }
  }
}

export const textureCreator = new TextureCreator()

export type { BasicTexture } from './basic'
export type { PixelTexture } from './pixel'
export type { DepthTexture } from './depth'
