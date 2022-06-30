import { Matrix4Array } from "@math/matrix4"
import { Program } from "@webgl/program"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { define, ifdef, USE_SKINNING } from "@webgl/utils/glsl"

type ShadowUniforms = {
  projectionMatrix?: Matrix4Array
  worldMatrix?: Matrix4Array
  boneTexture?: WebGLBaseTexture
  boneTextureSize?: number
}

type Props = {
  gl: WebGLRenderingContext
  useSkinning?: boolean
}

export class ShadowProgram extends Program<ShadowUniforms> {
  constructor({
    gl,
    useSkinning = false,
  }: Props) {
    const defs = [
      useSkinning ? define(USE_SKINNING) : "",
    ]
    const transform = (shader: string) => {
      shader = addDefs(shader, defs)
      return shader
    }
    const vertex = transform(shadowVertex)
    const fragment = transform(shadowFragment)

    super({ gl, vertex, fragment })
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

  mat4 getBoneMatrix(float i) {
    float j = i * 4.0;
    float dx = 1.0 / boneTextureSize;
    float x = mod(j, boneTextureSize);
    float y = dx * (floor(j / boneTextureSize) + 0.5);

    return mat4(
      texture2D(boneTexture, vec2(dx * (x + 0.5), y)),
      texture2D(boneTexture, vec2(dx * (x + 1.5), y)),
      texture2D(boneTexture, vec2(dx * (x + 2.5), y)),
      texture2D(boneTexture, vec2(dx * (x + 3.5), y))
    );
  }

  void main() {
    mat4 worldSkinMatrix = worldMatrix;

    ${ifdef(USE_SKINNING, `
      mat4 skinMatrix =
        getBoneMatrix(skinIndex.x) * skinWeight.x +
        getBoneMatrix(skinIndex.y) * skinWeight.y +
        getBoneMatrix(skinIndex.z) * skinWeight.z +
        getBoneMatrix(skinIndex.w) * skinWeight.w;

      worldSkinMatrix = worldMatrix * skinMatrix;
    `)}

    vec4 modelPosition = worldSkinMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelPosition;
  }
`

const shadowFragment = `
  precision highp float;

  vec4 packRGBA (float v) {
    vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
    pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
    return pack;
  }

  void main() {
    gl_FragColor = packRGBA(gl_FragCoord.z);
  }
`
