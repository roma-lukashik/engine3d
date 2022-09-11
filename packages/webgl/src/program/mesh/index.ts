import { Program } from "@webgl/program"
import {
  AMBIENT_LIGHTS_AMOUNT,
  define,
  DIRECTIONAL_LIGHTS_AMOUNT,
  ifdef,
  POINT_LIGHTS_AMOUNT,
  replaceValue,
  SHADOWS_AMOUNT,
  SPOT_LIGHTS_AMOUNT,
  USE_AMBIENT_LIGHT,
  USE_COLOR_TEXTURE,
  USE_DIRECTIONAL_LIGHT,
  USE_POINT_LIGHT,
  USE_SHADOW,
  USE_SKINNING,
  USE_SPOT_LIGHT,
} from "@webgl/utils/glsl"
import { MeshUniformValues } from "@webgl/program/mesh/types"
import { WebglRenderState } from "@webgl/utils/renderState"

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
  shadowsAmount?: number
  useSkinning?: boolean
  useColorTexture?: boolean
}

export class MeshProgram extends Program<MeshUniformValues> {
  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    {
      ambientLightsAmount = 0,
      pointLightsAmount = 0,
      spotLightsAmount = 0,
      directionalLightsAmount = 0,
      shadowsAmount = 0,
      useSkinning = false,
      useColorTexture = false,
    }: Options = {},
  ) {
    const defs = [
      ambientLightsAmount > 0 ? define(USE_AMBIENT_LIGHT) : "",
      pointLightsAmount > 0 ? define(USE_POINT_LIGHT) : "",
      spotLightsAmount > 0 ? define(USE_SPOT_LIGHT) : "",
      directionalLightsAmount > 0 ? define(USE_DIRECTIONAL_LIGHT) : "",
      shadowsAmount > 0 ? define(USE_SHADOW) : "",
      useSkinning ? define(USE_SKINNING) : "",
      useColorTexture ? define(USE_COLOR_TEXTURE) : "",
    ]
    const transform = (shader: string) => {
      shader = addDefs(shader, defs)
      shader = replaceValue(shader, AMBIENT_LIGHTS_AMOUNT, ambientLightsAmount)
      shader = replaceValue(shader, POINT_LIGHTS_AMOUNT, pointLightsAmount)
      shader = replaceValue(shader, SPOT_LIGHTS_AMOUNT, spotLightsAmount)
      shader = replaceValue(shader, DIRECTIONAL_LIGHTS_AMOUNT, directionalLightsAmount)
      shader = replaceValue(shader, SHADOWS_AMOUNT, shadowsAmount)
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
        ambientColor += ambientLights[i].color;
      }
    `)}

    gl_Position = projectionMatrix * modelPosition;
  }
`

const defaultFragment = `
  precision mediump float;

  #ifdef USE_COLOR_TEXTURE
    struct Material {
      float metalness;
      float roughness;
      vec3 color;
      sampler2D colorTexture;
    };
  #else
    struct Material {
      float metalness;
      float roughness;
      vec3 color;
    };
  #endif

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

  ${ifdef(USE_SPOT_LIGHT, `
    struct SpotLight {
      vec3 position;
      vec3 target;
      vec3 color;
      float coneCos;
      float penumbraCos;
      float distance;
    };

    uniform SpotLight spotLights[${SPOT_LIGHTS_AMOUNT}];

    float getDistanceAttenuation(float lightDistance, float cutoffDistance) {
      if (cutoffDistance > 0.0) {
        return pow(saturate(1.0 - lightDistance / cutoffDistance), 1.0);
      }
      return 1.0;
    }

    vec3 calcSpotLight(vec3 normal, vec3 tex) {
      vec3 color = vec3(0.0);

      for(int i = 0; i < ${SPOT_LIGHTS_AMOUNT}; i++) {
        vec3 spotLightDirection = normalize(spotLights[i].position - spotLights[i].target);
        vec3 surfaceToSpotLightDirection = spotLights[i].position - vPosition;
        vec3 surfaceToSpotLightNormal = normalize(surfaceToSpotLightDirection);
        float angleCos = dot(surfaceToSpotLightNormal, spotLightDirection);
        float attenuation = smoothstep(spotLights[i].coneCos, spotLights[i].penumbraCos, angleCos);

        if (attenuation > 0.0) {
          float lightDistance = length(surfaceToSpotLightDirection);
          float distanceAttenuation = getDistanceAttenuation(lightDistance, spotLights[i].distance);
          color += spotLights[i].color * attenuation * distanceAttenuation;
        }
      }
      return tex * color;
    }
  `)}

  ${ifdef(USE_SHADOW, `
    uniform sampler2D shadowTextures[${SHADOWS_AMOUNT}];
    uniform mat4 textureMatrices[${SHADOWS_AMOUNT}];
  `)}

  ${ifdef(USE_DIRECTIONAL_LIGHT, `
    struct DirectionalLight {
      vec3 direction;
      vec3 color;
      float bias;
    };

    uniform DirectionalLight directionalLights[${DIRECTIONAL_LIGHTS_AMOUNT}];

    #ifdef USE_SHADOW
    vec3 calcDirectionalLight(vec3 normal, vec3 tex, sampler2D shadowMaps[${SHADOWS_AMOUNT}]) {
      vec3 diffuseColor = vec3(0.0);
      for(int i = 0; i < ${DIRECTIONAL_LIGHTS_AMOUNT}; i++) {
        DirectionalLight light = directionalLights[i];
        vec3 color = tex * getShadow(shadowMaps[i], light.bias, textureMatrices[i] * vec4(vPosition, 1.0));
        vec3 diffuse = BRDF(color, light.direction);
        float NdL = saturate(dot(normal, light.direction));
        diffuseColor += NdL * light.color * diffuse;
      }
      return diffuseColor;
    }
    #else
    vec3 calcDirectionalLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      vec3 color = tex;
      for(int i = 0; i < ${DIRECTIONAL_LIGHTS_AMOUNT}; i++) {
        DirectionalLight light = directionalLights[i];
        vec3 diffuse = BRDF(color, light.direction);
        float NdL = saturate(dot(normal, light.direction));
        diffuseColor += NdL * light.color * diffuse;
      }
      return diffuseColor;
    }
    #endif
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
      #ifdef USE_SHADOW
      directionalLight = calcDirectionalLight(vNormal, tex, shadowTextures);
      #else
      directionalLight = calcDirectionalLight(vNormal, tex);
      #endif
    `)}

    vec3 s = ambientLight + directionalLight;
    gl_FragColor = vec4(s, 1.0);
  }
`
