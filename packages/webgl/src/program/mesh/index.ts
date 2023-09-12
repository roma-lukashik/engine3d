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
  SPOT_SHADOW_LIGHTS_AMOUNT,
  USE_AMBIENT_LIGHT,
  USE_COLOR_TEXTURE,
  USE_DIRECTIONAL_LIGHT,
  USE_DIRECTIONAL_SHADOW_LIGHT,
  USE_NORMAL_TEXTURE,
  USE_POINT_LIGHT,
  USE_SKINNING,
  USE_SPOT_LIGHT,
  USE_SPOT_SHADOW_LIGHT,
} from "@webgl/utils/glsl"
import { MeshAttributes, MeshUniforms } from "@webgl/program/mesh/types"
import { RenderState } from "@webgl/utils/state"

import brdf from "@webgl/shaders/brdf.glsl"
import skeleton from "@webgl/shaders/skeleton.glsl"
import shadow from "@webgl/shaders/shadow.glsl"
import helpers from "@webgl/shaders/helpers.glsl"

type Options = {
  ambientLightsAmount?: number
  pointLightsAmount?: number
  spotLightsAmount?: number
  spotShadowLightsAmount?: number
  directionalLightsAmount?: number
  directionalShadowLightsAmount?: number
  useSkinning?: boolean
  useColorTexture?: boolean
  useNormalTexture?: boolean
}

export class MeshProgram extends Program<MeshUniforms, MeshAttributes> {
  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    {
      ambientLightsAmount = 0,
      pointLightsAmount = 0,
      spotLightsAmount = 0,
      spotShadowLightsAmount = 0,
      directionalLightsAmount = 0,
      directionalShadowLightsAmount = 0,
      useSkinning = false,
      useColorTexture = false,
      useNormalTexture = false,
    }: Options = {},
  ) {
    const defs = [
      ambientLightsAmount > 0 ? define(USE_AMBIENT_LIGHT) : "",
      pointLightsAmount > 0 ? define(USE_POINT_LIGHT) : "",
      spotLightsAmount > 0 ? define(USE_SPOT_LIGHT) : "",
      spotShadowLightsAmount > 0 ? define(USE_SPOT_SHADOW_LIGHT) : "",
      directionalLightsAmount > 0 ? define(USE_DIRECTIONAL_LIGHT) : "",
      directionalShadowLightsAmount > 0 ? define(USE_DIRECTIONAL_SHADOW_LIGHT) : "",
      useSkinning ? define(USE_SKINNING) : "",
      useColorTexture ? define(USE_COLOR_TEXTURE) : "",
      useNormalTexture ? define(USE_NORMAL_TEXTURE) : "",
    ]
    const transform = (shader: string) => {
      shader = addDefs(shader, defs)
      shader = replaceValue(shader, AMBIENT_LIGHTS_AMOUNT, ambientLightsAmount)
      shader = replaceValue(shader, POINT_LIGHTS_AMOUNT, pointLightsAmount)
      shader = replaceValue(shader, SPOT_LIGHTS_AMOUNT, spotLightsAmount)
      shader = replaceValue(shader, SPOT_SHADOW_LIGHTS_AMOUNT, spotShadowLightsAmount)
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
  #extension GL_OES_standard_derivatives : enable

  precision highp float;

  struct Material {
    float metalness;
    float roughness;
    vec3 color;

    ${ifdef(USE_COLOR_TEXTURE, `
      sampler2D colorTexture;
    `)}

    ${ifdef(USE_NORMAL_TEXTURE, `
      sampler2D normalTexture;
    `)}
  };

  uniform mat4 viewMatrix;
  uniform vec3 cameraPosition;
  uniform Material material;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  ${helpers}
  ${shadow}
  ${brdf}

  ${ifdef(USE_NORMAL_TEXTURE, `
    vec3 getNormal() {
      vec3 dxPos = dFdx(vPosition);
      vec3 dyPos = dFdy(vPosition);
      vec2 dxTex = dFdx(vUv);
      vec2 dyTex = dFdy(vUv);
      vec3 tangent = normalize(dxPos * dyTex.t - dyPos * dxTex.t);
      vec3 bitangent = normalize(-dxPos * dyTex.s + dyPos * dxTex.s);
      mat3 tbn = mat3(tangent, bitangent, normalize(vNormal));
      vec3 normal = texture2D(material.normalTexture, vUv).rgb * 2.0 - 1.0;
      // Get world normal from view normal
      return normalize((vec4(normalize(tbn * normal), 0.0) * viewMatrix).xyz);
    }
  `)}

  ${ifdef(USE_AMBIENT_LIGHT, `
    varying vec3 ambientColor;

    vec3 calcAmbientLight(vec3 tex) {
      return tex * ambientColor;
    }
  `)}

  #if ${DIRECTIONAL_SHADOW_LIGHTS_AMOUNT} || ${SPOT_SHADOW_LIGHTS_AMOUNT}
    const mat4 bias = mat4(
      0.5, 0.0, 0.0, 0.0,
      0.0, 0.5, 0.0, 0.0,
      0.0, 0.0, 0.5, 0.0,
      0.5, 0.5, 0.5, 1.0
    );
  #endif

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

  ${ifdef(USE_SPOT_LIGHT, `
    struct SpotLight {
      vec3 position;
      vec3 target;
      vec3 color;
      float intensity;
      float coneCos;
      float penumbraCos;
      float distance;
    };

    uniform SpotLight spotLights[${SPOT_LIGHTS_AMOUNT}];

    float getDistanceAttenuation(float lightDistance, float cutoffDistance) {
      if (cutoffDistance > 0.0) {
        return pow(clamp(1.0 - lightDistance / cutoffDistance, 0.0, 1.0), 1.0);
      }
      return 1.0;
    }

    vec3 calcSpotLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      for(int i = 0; i < ${SPOT_LIGHTS_AMOUNT}; i++) {
        vec3 spotLightDirection = normalize(spotLights[i].position - spotLights[i].target);
        vec3 surfaceToSpotLightDirection = spotLights[i].position - vPosition;
        vec3 surfaceToSpotLightNormal = normalize(surfaceToSpotLightDirection);
        float angleCos = dot(surfaceToSpotLightNormal, spotLightDirection);
        float attenuation = smoothstep(spotLights[i].coneCos, spotLights[i].penumbraCos, angleCos);
        if (attenuation > 0.0) {
          float lightDistance = length(surfaceToSpotLightDirection);
          float distanceAttenuation = getDistanceAttenuation(lightDistance, spotLights[i].distance);
          vec3 color = tex;
          vec3 diffuse = BRDF(color, spotLightDirection);
          float NdL = saturate(dot(normal, spotLightDirection));
          vec3 lightColor = spotLights[i].color * spotLights[i].intensity;
          diffuseColor += NdL * lightColor * diffuse * attenuation * distanceAttenuation;
        }
      }
      return diffuseColor;
    }
  `)}

  ${ifdef(USE_SPOT_SHADOW_LIGHT, `
    struct SpotShadowLight {
      vec3 position;
      vec3 target;
      vec3 color;
      float intensity;
      float coneCos;
      float penumbraCos;
      float distance;
      float bias;
      mat4 projectionMatrix;
      sampler2D shadowMap;
    };

    uniform SpotShadowLight spotShadowLights[${SPOT_SHADOW_LIGHTS_AMOUNT}];

    float getDistanceAttenuation(float lightDistance, float cutoffDistance) {
      if (cutoffDistance > 0.0) {
        return pow(saturate(1.0 - lightDistance / cutoffDistance), 0.1);
      }
      return 1.0;
    }

    vec3 calcSpotShadowLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      for(int i = 0; i < ${SPOT_SHADOW_LIGHTS_AMOUNT}; i++) {
        vec3 spotLightDirection = normalize(spotShadowLights[i].position - spotShadowLights[i].target);
        vec3 surfaceToSpotLightDirection = spotShadowLights[i].position - vPosition;
        vec3 surfaceToSpotLightNormal = normalize(surfaceToSpotLightDirection);
        float angleCos = dot(surfaceToSpotLightNormal, spotLightDirection);
        float attenuation = smoothstep(spotShadowLights[i].coneCos, spotShadowLights[i].penumbraCos, angleCos);
        if (attenuation > 0.0) {
          float lightDistance = length(surfaceToSpotLightDirection);
          float distanceAttenuation = getDistanceAttenuation(lightDistance, spotShadowLights[i].distance);
          mat4 shadowMatrix = bias * spotShadowLights[i].projectionMatrix;
          vec3 color = tex * getShadow(
            spotShadowLights[i].shadowMap,
            spotShadowLights[i].bias,
            shadowMatrix * vec4(vPosition, 1.0)
          );
          vec3 diffuse = BRDF(color, spotLightDirection);
          float NdL = saturate(dot(normal, spotLightDirection));
          vec3 lightColor = spotShadowLights[i].color * spotShadowLights[i].intensity;
          diffuseColor += NdL * lightColor * diffuse * attenuation * distanceAttenuation;
        }
      }
      return diffuseColor;
    }
  `)}

  void main() {
    vec3 tex = material.color;
    vec3 normal = vNormal;

    ${ifdef(USE_COLOR_TEXTURE, `
      tex = texture2D(material.colorTexture, vUv).rgb;
    `)}

    ${ifdef(USE_NORMAL_TEXTURE, `
      normal = getNormal();
    `)}

    vec3 ambientLight = vec3(0.0);
    vec3 spotLight = vec3(0.0);
    vec3 directionalLight = vec3(0.0);
    float shadow = 1.0;

    ${ifdef(USE_AMBIENT_LIGHT, `
      ambientLight = calcAmbientLight(tex);
    `)}

    ${ifdef(USE_DIRECTIONAL_LIGHT, `
      directionalLight += calcDirectionalLight(normal, tex);
    `)}

    ${ifdef(USE_DIRECTIONAL_SHADOW_LIGHT, `
      directionalLight += calcDirectionalShadowLight(normal, tex);
    `)}

    ${ifdef(USE_SPOT_LIGHT, `
      spotLight += calcSpotLight(normal, tex);
    `)}

    ${ifdef(USE_SPOT_SHADOW_LIGHT, `
      spotLight += calcSpotShadowLight(normal, tex);
    `)}

    gl_FragColor = vec4(ambientLight + directionalLight + spotLight, 1.0);
  }
`
