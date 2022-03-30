import { Program } from '..'
import { Matrix4 } from '../../../math/matrix4'
import { Vector3 } from '../../../math/vector3'
import { WebGLBaseTexture } from '../../textures/types'

type Props = {
  gl: WebGLRenderingContext
  ambientLightsAmount?: number
  pointLightsAmount?: number
  directionalLightsAmount?: number
  shadowsAmount?: number
}

type MainUniformValues = {
  modelMatrix?: Matrix4
  textureMatrix?: Matrix4[]
  projectionMatrix?: Matrix4
  cameraPosition?: Vector3
  ambientLights?: AmbientLight[]
  pointLights?: PointLight[]
  directionalLight?: DirectionalLight[]
  modelTexture?: WebGLBaseTexture
  shadowTexture?: WebGLBaseTexture
}

type PointLight = {
  color: Vector3
  position: Vector3
}

type AmbientLight = {
  color: Vector3
  intensity: number
}

type DirectionalLight = {
  color: Vector3
  intensity: number
  direction: Vector3
}

export type MainProgram = Program<MainUniformValues>

export const createMainProgram = ({
  gl,
  ambientLightsAmount = 0,
  pointLightsAmount = 0,
  directionalLightsAmount = 0,
  shadowsAmount = 0,
}: Props): MainProgram => {
  const transform = (shader: string) => {
    shader = addDefs(shader, { ambientLightsAmount, pointLightsAmount, directionalLightsAmount, shadowsAmount })
    shader = replaceShadowsAmount(shader, shadowsAmount)
    shader = replacePointLightsAmount(shader, pointLightsAmount)
    shader = replaceDirectionalLightsAmount(shader, pointLightsAmount)
    shader = replaceAmbientLightsAmount(shader, ambientLightsAmount)
    return shader
  }
  const vertex = transform(defaultVertex)
  const fragment = transform(defaultFragment)
  return new Program({ gl, vertex, fragment })
}

const replacePointLightsAmount = (shader: string, lightsAmount: number): string => {
  return shader.replace(/POINT_LIGHTS_AMOUNT/g, lightsAmount.toString())
}

const replaceDirectionalLightsAmount = (shader: string, lightsAmount: number): string => {
  return shader.replace(/DIRECTIONAL_LIGHTS_AMOUNT/g, lightsAmount.toString())
}

const replaceAmbientLightsAmount = (shader: string, lightsAmount: number): string => {
  return shader.replace(/AMBIENT_LIGHTS_AMOUNT/g, lightsAmount.toString())
}

const replaceShadowsAmount = (shader: string, shadowsAmount: number): string => {
  return shader.replace(/SHADOWS_AMOUNT/g, shadowsAmount.toString())
}

type DefsOptions = {
  usePointLights: boolean
  useAmbientLights: boolean
  useDirectionalLights: boolean
  useShadow: boolean
}

const addDefs = (shader: string, props: Omit<Required<Props>, 'gl'>): string => {
  const options: DefsOptions = {
    useAmbientLights: props.ambientLightsAmount > 0,
    usePointLights: props.pointLightsAmount > 0,
    useDirectionalLights: props.directionalLightsAmount > 0,
    useShadow: props.shadowsAmount > 0,
  }
  return defs(options) + shader
}

const defs = ({ useAmbientLights, usePointLights, useDirectionalLights, useShadow }: DefsOptions): string => {
  const defs = [
    useAmbientLights ? '#define USE_AMBIENT_LIGHT' : '',
    usePointLights ? '#define USE_POINT_LIGHT' : '',
    useDirectionalLights ? '#define USE_DIRECTIONAL_LIGHT' : '',
    useShadow ? '#define USE_SHADOW' : '',
  ]
  return defs.filter(Boolean).join('\n')
}

const defaultVertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform vec3 cameraPosition;
  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;

  varying vec3 vViewDirection;
  varying vec3 vNormal;
  varying vec2 vUv;

  #ifdef USE_AMBIENT_LIGHT
  struct AmbientLight {
    vec3 color;
    float intensity;
  };

  uniform AmbientLight ambientLights[AMBIENT_LIGHTS_AMOUNT];
  varying vec3 ambientColor;
  #endif

  #ifdef USE_POINT_LIGHT
  struct PointLight {
    vec3 position;
    vec3 color;

    // float constant;
    // float linear;
    // float quadratic;
    //
    // vec3 ambient;
    // vec3 diffuse;
    // vec3 specular;
  };
  uniform PointLight pointLights[POINT_LIGHTS_AMOUNT];
  varying vec3 surfaceToLight[POINT_LIGHTS_AMOUNT];
  varying float distancesToPointLights[POINT_LIGHTS_AMOUNT];
  #endif

  #ifdef USE_SHADOW
  uniform mat4 textureMatrix[SHADOWS_AMOUNT];
  varying vec4 projectedTextureCoordinate[SHADOWS_AMOUNT];
  #endif

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vNormal = mat3(modelMatrix) * normal;
    vViewDirection = normalize(cameraPosition - position);

    #ifdef USE_AMBIENT_LIGHT
    ambientColor = vec3(0.0);
    for(int i = 0; i < AMBIENT_LIGHTS_AMOUNT; i++) {
      ambientColor += ambientLights[i].color * ambientLights[i].intensity / 255.0;
    }
    #endif

    #ifdef USE_POINT_LIGHT
    for(int i = 0; i < POINT_LIGHTS_AMOUNT; i++) {
      vec3 direction = pointLights[i].position - modelPosition.xyz;
      surfaceToLight[i] = normalize(direction);
      distancesToPointLights[i] = length(direction);
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

  varying vec3 vViewDirection;
  varying vec3 vNormal;
  varying vec2 vUv;

  #ifdef USE_AMBIENT_LIGHT
  varying vec3 ambientColor;

  vec3 calcAmbientLight(vec3 tex) {
    return tex * ambientColor;
  }
  #endif

  #ifdef USE_POINT_LIGHT
  struct PointLight {
    vec3 position;
    vec3 color;
  };

  uniform PointLight pointLights[POINT_LIGHTS_AMOUNT];
  varying vec3 surfaceToLight[POINT_LIGHTS_AMOUNT];
  varying float distancesToPointLights[POINT_LIGHTS_AMOUNT];

  vec3 calcPointLight(vec3 normal, vec3 tex) {
    vec3 diffuseColor = vec3(0.0);
    vec3 specularColor = vec3(0.0);

    for(int i = 0; i < POINT_LIGHTS_AMOUNT; i++) {
      vec3 reflection = reflect(-surfaceToLight[i], normal);
      float diffuse = max(dot(normal, surfaceToLight[i]), 0.0);
      float specular = pow(max(dot(vViewDirection, reflection), 0.0), 256.0); // TODO: use shininess
      float attenuation = 1.0 / (1.0 + 0.1 * distancesToPointLights[i]); // TODO: use constant, linear, quadratic

      specularColor += pointLights[i].color / 255.0 * specular * attenuation;
      diffuseColor += pointLights[i].color / 255.0 * diffuse * attenuation;
    }
    return tex * (diffuseColor + specularColor);
  }
  #endif

  #ifdef USE_SHADOW
  uniform sampler2D shadowTexture;
  varying vec4 projectedTextureCoordinate[SHADOWS_AMOUNT];

  float unpackRGBA(vec4 v) {
    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
  }

  float calcShadow() {
    float bias = 0.0001;
    float shadow = 0.0;
    for(int i = 0; i < SHADOWS_AMOUNT; i++) {
      vec3 lightPosition = projectedTextureCoordinate[i].xyz / projectedTextureCoordinate[i].w;
      float depth = lightPosition.z - bias;
      float occluder = unpackRGBA(texture2D(shadowTexture, lightPosition.xy));
      shadow += mix(0.2, 1.0, step(depth, occluder));
    }
    return shadow;
  }
  #endif

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 tex = texture2D(modelTexture, vUv).rgb;

    vec3 ambientLight = vec3(0.0);
    vec3 pointLight = vec3(0.0);
    float shadow = 1.0;

    #ifdef USE_AMBIENT_LIGHT
    ambientLight = calcAmbientLight(tex);
    #endif

    #ifdef USE_POINT_LIGHT
    pointLight = calcPointLight(normal, tex);
    #endif

    #ifdef USE_SHADOW
    shadow = calcShadow();
    #endif

    gl_FragColor = vec4((ambientLight + pointLight) * shadow, 1.0);
  }
`
