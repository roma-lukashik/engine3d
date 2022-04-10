import { Program } from '..'
import { Matrix4 } from '../../../math/matrix4'
import { Vector3 } from '../../../math/vector3'
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
  USE_DIRECTIONAL_LIGHT,
  USE_POINT_LIGHT,
  USE_SHADOW,
  USE_SPOT_LIGHT,
} from '../../utils/glsl'
import { WebGLBaseTexture } from '../../textures/types'

type Props = {
  gl: WebGLRenderingContext
  ambientLightsAmount?: number
  pointLightsAmount?: number
  spotLightsAmount?: number
  directionalLightsAmount?: number
  shadowsAmount?: number
}

type MainUniformValues = {
  modelMatrix?: Matrix4
  textureMatrices?: Matrix4[]
  projectionMatrix?: Matrix4
  ambientLights?: AmbientLight[]
  pointLights?: PointLight[]
  spotLights?: SpotLight[]
  directionalLights?: DirectionalLight[]
  modelTexture?: WebGLBaseTexture
  shadowTextures?: WebGLBaseTexture[]
}

type PointLight = {
  color: Vector3
  position: Vector3
}

type SpotLight = {
  color: Vector3
  position: Vector3
  target: Vector3
  coneCos: number
  penumbraCos: number
  distance: number
}

type AmbientLight = {
  color: Vector3
}

type DirectionalLight = {
  color: Vector3
  direction: Vector3
}

export type MainProgram = Program<MainUniformValues>

export const createMainProgram = ({
  gl,
  ambientLightsAmount = 0,
  pointLightsAmount = 0,
  spotLightsAmount = 0,
  directionalLightsAmount = 0,
  shadowsAmount = 0,
}: Props): MainProgram => {
  const defs = [
    ambientLightsAmount > 0 ? define(USE_AMBIENT_LIGHT) : '',
    pointLightsAmount > 0 ? define(USE_POINT_LIGHT) : '',
    spotLightsAmount > 0 ? define(USE_SPOT_LIGHT) : '',
    directionalLightsAmount > 0 ? define(USE_DIRECTIONAL_LIGHT) : '',
    shadowsAmount > 0 ? define(USE_SHADOW) : '',
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
  return new Program({ gl, vertex, fragment })
}

const addDefs = (shader: string, defs: string[]): string =>
  defs.filter(Boolean).join('\n') + shader

const defaultVertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  ${ifdef(USE_AMBIENT_LIGHT, `
    struct AmbientLight {
      vec3 color;
    };

    uniform AmbientLight ambientLights[${AMBIENT_LIGHTS_AMOUNT}];
    varying vec3 ambientColor;
  `)}

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vPosition = modelPosition.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);

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
  precision highp float;

  uniform sampler2D modelTexture;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

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
        return pow(clamp(1.0 - lightDistance / cutoffDistance, 0.0, 1.0), 1.0);
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
          color += spotLights[i].color * attenuation * getDistanceAttenuation(length(surfaceToSpotLightDirection), spotLights[i].distance);
        }
      }
      return tex * color;
    }
  `)}

  ${ifdef(USE_DIRECTIONAL_LIGHT, `
    struct DirectionalLight {
      vec3 direction;
      vec3 color;
    };

    uniform DirectionalLight directionalLights[${DIRECTIONAL_LIGHTS_AMOUNT}];

    vec3 calcDirectionalLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      for(int i = 0; i < ${DIRECTIONAL_LIGHTS_AMOUNT}; i++) {
        float diffuse = max(dot(normal, directionalLights[i].direction), 0.0);
        diffuseColor += directionalLights[i].color * diffuse;
      }
      return tex * diffuseColor;
    }
  `)}

  ${ifdef(USE_SHADOW, `
    uniform sampler2D shadowTextures[${SHADOWS_AMOUNT}];
    uniform mat4 textureMatrices[${SHADOWS_AMOUNT}];

    float unpackRGBA(vec4 v) {
      return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
    }

    float calcShadow(sampler2D textures[${SHADOWS_AMOUNT}]) {
      float bias = 0.001;
      float shadow = 0.0;
      for(int i = 0; i < ${SHADOWS_AMOUNT}; i++) {
        vec4 projectedTextureCoordinates = textureMatrices[i] * vec4(vPosition, 1.0);
        vec3 lightPosition = projectedTextureCoordinates.xyz / projectedTextureCoordinates.w;
        float depth = lightPosition.z - bias;
        float occluder = unpackRGBA(texture2D(textures[i], lightPosition.xy));
        shadow += mix(0.2, 1.0, step(depth, occluder));
      }
      return shadow;
    }
  `)}

  void main() {
    vec3 tex = texture2D(modelTexture, vUv).rgb;

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
      directionalLight = calcDirectionalLight(vNormal, tex);
    `)}

    ${ifdef(USE_SHADOW, `
      shadow = calcShadow(shadowTextures);
    `)}

    gl_FragColor = vec4(ambientLight + (spotLight + directionalLight) * shadow, 1.0);
  }
`
