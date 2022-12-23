import { RGB } from "@core/color/rgb"
import { RenderState } from "@webgl/utils/state"
import { Scene } from "@webgl/scene"

export interface DebugRendererConstructor {
  new (gl: WebGLRenderingContext, state: RenderState, color?: RGB): DebugRenderer
}

export interface DebugRenderer {
  render(scene: Scene): void
}
