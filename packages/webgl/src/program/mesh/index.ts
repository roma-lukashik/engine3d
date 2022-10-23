import { Program } from "@webgl/program"
import {
  AMBIENT_LIGHTS_AMOUNT,
  define,
  DIRECTIONAL_LIGHTS_AMOUNT,
  DIRECTIONAL_SHADOW_LIGHTS_AMOUNT,
  ifdef,
  POINT_LIGHTS_AMOUNT,
  replaceValue,
  SPOT_LIGHTS_AMOUNT,
  USE_AMBIENT_LIGHT,
  USE_COLOR_TEXTURE,
  USE_DIRECTIONAL_LIGHT,
  USE_DIRECTIONAL_SHADOW_LIGHT,
  USE_POINT_LIGHT,
  USE_SKINNING,
  USE_SPOT_LIGHT,
} from "@webgl/utils/glsl"
import { MeshAttributes, MeshUniforms } from "@webgl/program/mesh/types"
import { RenderState } from "@webgl/utils/state"

// @ts-ignore
import brdf from "@webgl/shaders/brdf.glsl"
// @ts-ignore
import skeleton from "@webgl/shaders/skeleton.glsl"
// @ts-ignore
import shadow from "@webgl/shaders/shadow.glsl"
// @ts-ignore
import helpers from "@webgl/shaders/helpers.glsl"

type Options = {
  ambientLightsAmount?: number
  pointLightsAmount?: number
  spotLightsAmount?: number
  directionalLightsAmount?: number
  directionalShadowLightsAmount?: number
  useSkinning?: boolean
  useColorTexture?: boolean
}

export class MeshProgram extends Program<MeshUniforms, MeshAttributes> {
  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    {
      ambientLightsAmount = 0,
      pointLightsAmount = 0,
      spotLightsAmount = 0,
      directionalLightsAmount = 0,
      directionalShadowLightsAmount = 0,
      useSkinning = false,
      useColorTexture = false,
    }: Options = {},
  ) {
    const defs = [
      ambientLightsAmount > 0 ? define(USE_AMBIENT_LIGHT) : "",
      pointLightsAmount > 0 ? define(USE_POINT_LIGHT) : "",
      spotLightsAmount > 0 ? define(USE_SPOT_LIGHT) : "",
      directionalLightsAmount > 0 ? define(USE_DIRECTIONAL_LIGHT) : "",
      directionalShadowLightsAmount > 0 ? define(USE_DIRECTIONAL_SHADOW_LIGHT) : "",
      useSkinning ? define(USE_SKINNING) : "",
      useColorTexture ? define(USE_COLOR_TEXTURE) : "",
    ]
    const transform = (shader: string) => {
      shader = addDefs(shader, defs)
      shader = replaceValue(shader, AMBIENT_LIGHTS_AMOUNT, ambientLightsAmount)
      shader = replaceValue(shader, POINT_LIGHTS_AMOUNT, pointLightsAmount)
      shader = replaceValue(shader, SPOT_LIGHTS_AMOUNT, spotLightsAmount)
      shader = replaceValue(shader, DIRECTIONAL_LIGHTS_AMOUNT, directionalLightsAmount)
      shader = replaceValue(shader, DIRECTIONAL_SHADOW_LIGHTS_AMOUNT, directionalShadowLightsAmount)
      return shader
    }
    const vertex = transform(defaultVertex)
    const fragment = transform(defaultFragment)

    super(gl, state, vertex, fragment)
  }
}

const addDefs = (shader: string, defs: string[]): string =>
  defs.filter(Boolean).join("\n") + shader

const defaultVertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec4 skinIndex;
  attribute vec4 skinWeight;
  attribute vec2 uv;

  uniform mat4 projectionMatrix;
  uniform mat4 worldMatrix;
  uniform float boneTextureSize;
  uniform sampler2D boneTexture;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  ${skeleton}

  ${ifdef(USE_AMBIENT_LIGHT, `
    struct AmbientLight {
      vec3 color;
      float intensity;
    };

    uniform AmbientLight ambientLights[${AMBIENT_LIGHTS_AMOUNT}];
    varying vec3 ambientColor;
  `)}

  void main() {
    mat4 worldSkinMatrix = getWorldSkinMatrix();
    vec4 modelPosition = worldSkinMatrix * vec4(position, 1.0);

    vPosition = modelPosition.xyz;
    vNormal = normalize(mat3(worldSkinMatrix) * normal);
    vUv = uv;

    ${ifdef(USE_AMBIENT_LIGHT, `
      ambientColor = vec3(0.0);
      for(int i = 0; i < ${AMBIENT_LIGHTS_AMOUNT}; i++) {
        ambientColor += ambientLights[i].color * ambientLights[i].intensity;
      }
    `)}

    gl_Position = projectionMatrix * modelPosition;
  }
`

const defaultFragment = `
  precision mediump float;

  struct Material {
    float metalness;
    float roughness;
    vec3 color;

    ${ifdef(USE_COLOR_TEXTURE, `
      sampler2D colorTexture;
    `)}
  };

  uniform vec3 cameraPosition;
  uniform Material material;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  ${helpers}
  ${shadow}
  ${brdf}

  ${ifdef(USE_AMBIENT_LIGHT, `
    varying vec3 ambientColor;

    vec3 calcAmbientLight(vec3 tex) {
      return tex * ambientColor;
    }
  `)}

  ${ifdef(USE_DIRECTIONAL_LIGHT, `
    struct DirectionalLight {
      vec3 direction;
      vec3 color;
      float intensity;
    };

    uniform DirectionalLight directionalLights[${DIRECTIONAL_LIGHTS_AMOUNT}];

    vec3 calcDirectionalLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      for(int i = 0; i < ${DIRECTIONAL_LIGHTS_AMOUNT}; i++) {
        DirectionalLight light = directionalLights[i];
        vec3 color = tex;
        vec3 diffuse = BRDF(color, light.direction);
        float NdL = saturate(dot(normal, light.direction));
        diffuseColor += NdL * light.color * light.intensity * diffuse;
      }
      return diffuseColor;
    }
  `)}

  ${ifdef(USE_DIRECTIONAL_SHADOW_LIGHT, `
    struct DirectionalShadowLight {
      vec3 direction;
      vec3 color;
      float intensity;
      float bias;
      mat4 projectionMatrix;
      sampler2D shadowMap;
    };

    uniform DirectionalShadowLight directionalShadowLights[${DIRECTIONAL_SHADOW_LIGHTS_AMOUNT}];

    const mat4 bias = mat4(
      0.5, 0.0, 0.0, 0.0,
      0.0, 0.5, 0.0, 0.0,
      0.0, 0.0, 0.5, 0.0,
      0.5, 0.5, 0.5, 1.0
    );

    vec3 calcDirectionalShadowLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      for(int i = 0; i < ${DIRECTIONAL_SHADOW_LIGHTS_AMOUNT}; i++) {
        mat4 shadowMatrix = bias * directionalShadowLights[i].projectionMatrix;
        vec3 color = tex * getShadow(
          directionalShadowLights[i].shadowMap,
          directionalShadowLights[i].bias,
          shadowMatrix * vec4(vPosition, 1.0)
        );
        vec3 diffuse = BRDF(color, directionalShadowLights[i].direction);
        float NdL = saturate(dot(normal, directionalShadowLights[i].direction));
        vec3 lightColor = directionalShadowLights[i].color * directionalShadowLights[i].intensity;
        diffuseColor += NdL * lightColor * diffuse;
      }
      return diffuseColor;
    }
  `)}

  void main() {
    vec3 tex = material.color;
    ${ifdef(USE_COLOR_TEXTURE, `
      tex = texture2D(material.colorTexture, vUv).rgb;
    `)}

    vec3 ambientLight = vec3(0.0);
    vec3 spotLight = vec3(0.0);
    vec3 directionalLight = vec3(0.0);
    float shadow = 1.0;

    ${ifdef(USE_AMBIENT_LIGHT, `
      ambientLight = calcAmbientLight(tex);
    `)}

    ${ifdef(USE_SPOT_LIGHT, `
      spotLight = calcSpotLight(vNormal, tex);
    `)}

    ${ifdef(USE_DIRECTIONAL_LIGHT, `
      directionalLight += calcDirectionalLight(vNormal, tex);
    `)}

    ${ifdef(USE_DIRECTIONAL_SHADOW_LIGHT, `
      directionalLight += calcDirectionalShadowLight(vNormal, tex);
    `)}

    vec3 s = ambientLight + directionalLight;
    gl_FragColor = vec4(s, 1.0);
  }
`
