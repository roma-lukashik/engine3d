import { Matrix4Array } from "@math/matrix4"
import { Program } from "@webgl/program"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { define, USE_SKINNING } from "@webgl/utils/glsl"
import { RenderState } from "@webgl/utils/state"
import { WebglVertexAttribute } from "@webgl/utils/attribute"

// @ts-ignore
import skeleton from "@webgl/shaders/skeleton.glsl"

export type ShadowUniforms = {
  projectionMatrix?: Matrix4Array
  worldMatrix?: Matrix4Array
  boneTexture?: WebGLBaseTexture
  boneTextureSize?: number
}

export type ShadowAttributes = {
  position: WebglVertexAttribute
  skinIndex?: WebglVertexAttribute
  skinWeight?: WebglVertexAttribute
}

type Options = {
  useSkinning?: boolean
}

export class ShadowProgram extends Program<ShadowUniforms, ShadowAttributes> {
  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    {
      useSkinning = false,
    }: Options = {},
  ) {
    const defs = [
      useSkinning ? define(USE_SKINNING) : "",
    ]
    const transform = (shader: string) => {
      shader = addDefs(shader, defs)
      return shader
    }
    const vertex = transform(shadowVertex)
    const fragment = transform(shadowFragment)

    super(gl, state, vertex, fragment)
  }
}

const addDefs = (shader: string, defs: string[]): string =>
  defs.filter(Boolean).join("\n") + shader

const shadowVertex = `
  attribute vec3 position;
  attribute vec4 skinIndex;
  attribute vec4 skinWeight;

  uniform mat4 projectionMatrix;
  uniform mat4 worldMatrix;
  uniform float boneTextureSize;
  uniform sampler2D boneTexture;

  ${skeleton}

  void main() {
    mat4 worldSkinMatrix = getWorldSkinMatrix();
    vec4 modelPosition = worldSkinMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelPosition;
  }
`

const shadowFragment = `
  precision mediump float;

  vec4 packRGBA(float v) {
    vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
    pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
    return pack;
  }

  void main() {
    gl_FragColor = packRGBA(gl_FragCoord.z);
  }
`
