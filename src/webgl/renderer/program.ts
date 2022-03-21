import { BaseProgram, Program } from '../program'
import { Matrix4 } from '../../math/matrix4'
import { Vector3 } from '../../math/vector3'
import { WebGLBaseTexture } from '../textures/types'

type Props = {
  gl: WebGLRenderingContext;
  lightsAmount?: number;
  shadowsAmount?: number;
}

export type MainUniformValues = {
  modelMatrix?: Matrix4;
  textureMatrix?: Matrix4[];
  projectionMatrix?: Matrix4;
  lightPosition?: Vector3[];
  lightViewPosition?: Vector3[];
  modelTexture?: WebGLBaseTexture;
  shadowTexture?: WebGLBaseTexture;
}

export const createMainProgram = ({
  gl,
  lightsAmount = 0,
  shadowsAmount = 0,
}: Props): Program<MainUniformValues> => {
  const useLight = lightsAmount > 0
  const useShadow = shadowsAmount > 0
  const transform = (shader: string) => {
    shader = addDefs(shader, { useLight, useShadow })
    shader = replaceShadowsAmount(shader, shadowsAmount)
    shader = replaceLightsAmount(shader, lightsAmount)
    return shader
  }
  const vertex = transform(defaultVertex)
  const fragment = transform(defaultFragment)
  return new BaseProgram({ gl, vertex, fragment })
}

const replaceLightsAmount = (shader: string, lightsAmount: number): string => {
  return shader.replace(/LIGHTS_AMOUNT/g, lightsAmount.toString())
}

const replaceShadowsAmount = (shader: string, shadowsAmount: number): string => {
  return shader.replace(/SHADOWS_AMOUNT/g, shadowsAmount.toString())
}

const addDefs = (shader: string, options: { useLight: boolean; useShadow: boolean; }): string => {
  return defs(options) + shader
}

const defs = ({ useLight, useShadow }: { useLight: boolean; useShadow: boolean; }): string => {
  const defs = [
    useLight ? '#define USE_LIGHT' : '',
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

  #ifdef USE_LIGHT
    uniform vec3 lightPosition[LIGHTS_AMOUNT];
    uniform vec3 lightViewPosition[LIGHTS_AMOUNT];

    varying vec3 surfaceToLight[LIGHTS_AMOUNT];
    varying vec3 surfaceToView[LIGHTS_AMOUNT];
  #endif

  #ifdef USE_SHADOW
    uniform mat4 textureMatrix[SHADOWS_AMOUNT];
    varying vec4 projectedTexcoord[SHADOWS_AMOUNT];
  #endif

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vNormal = mat3(modelMatrix) * normal;

    #ifdef USE_LIGHT
      for(int i = 0; i < LIGHTS_AMOUNT; i++) {
        surfaceToLight[i] = normalize(lightPosition[i] - modelPosition.xyz);
        surfaceToView[i] = normalize(lightViewPosition[i] - modelPosition.xyz);
      }
    #endif

    #ifdef USE_SHADOW
      for(int i = 0; i < SHADOWS_AMOUNT; i++) {
        projectedTexcoord[i] = textureMatrix[i] * modelPosition;
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

  #ifdef USE_LIGHT
    varying vec3 surfaceToLight[LIGHTS_AMOUNT];
    varying vec3 surfaceToView[LIGHTS_AMOUNT];
  #endif

  #ifdef USE_SHADOW
    uniform sampler2D shadowTexture;
    varying vec4 projectedTexcoord[SHADOWS_AMOUNT];
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

    #ifdef USE_LIGHT
      for(int i = 0; i < LIGHTS_AMOUNT; i++) {
        vec3 halfVector = normalize(surfaceToLight[i] + surfaceToView[i]);
        light += max(dot(normal, surfaceToLight[i]), 0.0) * 0.5;
        specular += pow(dot(normal, halfVector), 150.0) * 0.15;
      }
    #endif

    #ifdef USE_SHADOW
      float bias = 0.0001;
      for(int i = 0; i < SHADOWS_AMOUNT; i++) {
        vec3 lightPosition = projectedTexcoord[i].xyz / projectedTexcoord[i].w;
        float depth = lightPosition.z - bias;
        float occluder = unpackRGBA(texture2D(shadowTexture, lightPosition.xy));
        shadow += mix(0.2, 1.0, step(depth, occluder));
      }
    #endif

    gl_FragColor = vec4(tex * light * shadow + specular * shadow, 1.0);
  }
`
