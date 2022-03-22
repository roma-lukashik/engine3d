import { Program } from '..'
import { Matrix4 } from '../../../math/matrix4'
import { Vector3 } from '../../../math/vector3'
import { WebGLBaseTexture } from '../../textures/types'

type Props = {
  gl: WebGLRenderingContext;
  pointLightsAmount?: number;
  shadowsAmount?: number;
}

export type MainUniformValues = {
  modelMatrix?: Matrix4;
  textureMatrix?: Matrix4[];
  projectionMatrix?: Matrix4;
  pointLights?: PointLight[];
  modelTexture?: WebGLBaseTexture;
  shadowTexture?: WebGLBaseTexture;
}

type PointLight = {
  position: Vector3;
  target: Vector3;
}

export const createMainProgram = ({
  gl,
  pointLightsAmount = 0,
  shadowsAmount = 0,
}: Props): Program<MainUniformValues> => {
  const usePointLights = pointLightsAmount > 0
  const useShadow = shadowsAmount > 0
  const transform = (shader: string) => {
    shader = addDefs(shader, { usePointLights, useShadow })
    shader = replaceShadowsAmount(shader, shadowsAmount)
    shader = replaceLightsAmount(shader, pointLightsAmount)
    return shader
  }
  const vertex = transform(defaultVertex)
  const fragment = transform(defaultFragment)
  return new Program({ gl, vertex, fragment })
}

const replaceLightsAmount = (shader: string, lightsAmount: number): string => {
  return shader.replace(/POINT_LIGHTS_AMOUNT/g, lightsAmount.toString())
}

const replaceShadowsAmount = (shader: string, shadowsAmount: number): string => {
  return shader.replace(/SHADOWS_AMOUNT/g, shadowsAmount.toString())
}

const addDefs = (shader: string, options: { usePointLights: boolean; useShadow: boolean; }): string => {
  return defs(options) + shader
}

const defs = ({ usePointLights, useShadow }: { usePointLights: boolean; useShadow: boolean; }): string => {
  const defs = [
    usePointLights ? '#define USE_POINT_LIGHT' : '',
    useShadow ? '#define USE_SHADOW' : '',
  ]
  return defs.filter(Boolean).join('\n')
}

const defaultVertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;

  varying vec3 vNormal;
  varying vec2 vUv;

  struct PointLight {
    vec3 position;
    vec3 target;

    // float constant;
    // float linear;
    // float quadratic;
    //
    // vec3 ambient;
    // vec3 diffuse;
    // vec3 specular;
  };

  #ifdef USE_POINT_LIGHT
    uniform PointLight pointLights[POINT_LIGHTS_AMOUNT];

    varying vec3 surfaceToLight[POINT_LIGHTS_AMOUNT];
    varying vec3 surfaceToView[POINT_LIGHTS_AMOUNT];
  #endif

  #ifdef USE_SHADOW
    uniform mat4 textureMatrix[SHADOWS_AMOUNT];
    varying vec4 projectedTextureCoordinate[SHADOWS_AMOUNT];
  #endif

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vNormal = mat3(modelMatrix) * normal;

    #ifdef USE_POINT_LIGHT
      for(int i = 0; i < POINT_LIGHTS_AMOUNT; i++) {
        surfaceToLight[i] = normalize(pointLights[i].position - modelPosition.xyz);
        surfaceToView[i] = normalize(pointLights[i].target - modelPosition.xyz);
      }
    #endif

    #ifdef USE_SHADOW
      for(int i = 0; i < SHADOWS_AMOUNT; i++) {
        projectedTextureCoordinate[i] = textureMatrix[i] * modelPosition;
      }
    #endif

    gl_Position = projectionMatrix * modelPosition;
  }
`

const defaultFragment = `
  precision highp float;

  uniform sampler2D modelTexture;

  varying vec3 vNormal;
  varying vec2 vUv;

  #ifdef USE_POINT_LIGHT
    varying vec3 surfaceToLight[POINT_LIGHTS_AMOUNT];
    varying vec3 surfaceToView[POINT_LIGHTS_AMOUNT];
  #endif

  #ifdef USE_SHADOW
    uniform sampler2D shadowTexture;
    varying vec4 projectedTextureCoordinate[SHADOWS_AMOUNT];
  #endif

  float unpackRGBA (vec4 v) {
    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
  }

  void main() {
    float light = 0.0;
    float specular = 0.0;
    float shadow = 0.0;

    vec3 normal = normalize(vNormal);
    vec3 tex = texture2D(modelTexture, vUv).rgb;

    #ifdef USE_POINT_LIGHT
      for(int i = 0; i < POINT_LIGHTS_AMOUNT; i++) {
        vec3 halfVector = normalize(surfaceToLight[i] + surfaceToView[i]);
        light += max(dot(normal, surfaceToLight[i]), 0.0) * 0.5;
        specular += pow(dot(normal, halfVector), 150.0) * 0.15;
      }
    #endif

    #ifdef USE_SHADOW
      float bias = 0.0001;
      for(int i = 0; i < SHADOWS_AMOUNT; i++) {
        vec3 lightPosition = projectedTextureCoordinate[i].xyz / projectedTextureCoordinate[i].w;
        float depth = lightPosition.z - bias;
        float occluder = unpackRGBA(texture2D(shadowTexture, lightPosition.xy));
        shadow += mix(0.2, 1.0, step(depth, occluder));
      }
    #endif

    gl_FragColor = vec4(tex * light * shadow + specular * shadow, 1.0);
  }
`
