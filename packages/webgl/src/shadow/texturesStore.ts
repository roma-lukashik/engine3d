import { WebGLDepthTexture } from "@webgl/textures/depth"

export class TexturesStore<T extends object> {
  private readonly store: WeakMap<T, WebGLDepthTexture> = new WeakMap()

  constructor(private gl: WebGLRenderingContext) {
  }

  public getOrCreate(key: T): WebGLDepthTexture {
    if (!this.store.has(key)) {
      this.store.set(key, new WebGLDepthTexture({ gl: this.gl }))
    }
    return this.store.get(key)!
  }
}
