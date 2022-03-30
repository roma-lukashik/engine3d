import { Program } from '..'
import { Matrix4 } from '../../../math/matrix4'
import { Vector3 } from '../../../math/vector3'
import {
  AMBIENT_LIGHTS_AMOUNT,
  define, DIRECTIONAL_LIGHTS_AMOUNT,
  ifdef, POINT_LIGHTS_AMOUNT,
  replaceValue,
  SHADOWS_AMOUNT,
  USE_AMBIENT_LIGHT,
  USE_DIRECTIONAL_LIGHT,
  USE_POINT_LIGHT,
  USE_SHADOW,
} from '../../glsl'
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
  const defs = [
    ambientLightsAmount > 0 ? define(USE_AMBIENT_LIGHT) : '',
    pointLightsAmount > 0 ? define(USE_POINT_LIGHT) : '',
    directionalLightsAmount > 0 ? define(USE_DIRECTIONAL_LIGHT) : '',
    shadowsAmount > 0 ? define(USE_SHADOW) : '',
  ]
  const transform = (shader: string) => {
    shader = addDefs(shader, defs)
    shader = replaceValue(shader, AMBIENT_LIGHTS_AMOUNT, ambientLightsAmount)
    shader = replaceValue(shader, POINT_LIGHTS_AMOUNT, pointLightsAmount)
    shader = replaceValue(shader, DIRECTIONAL_LIGHTS_AMOUNT, directionalLightsAmount)
    shader = replaceValue(shader, SHADOWS_AMOUNT, shadowsAmount)
    return shader
  }
  const vertex = transform(defaultVertex)
  const fragment = transform(defaultFragment)
  return new Program({ gl, vertex, fragment })
}

const addDefs = (shader: string, defs: string[]): string => {
  return defs.filter(Boolean).join('\n') + shader
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

  ${ifdef(USE_AMBIENT_LIGHT, `
    struct AmbientLight {
      vec3 color;
      float intensity;
    };

    uniform AmbientLight ambientLights[${AMBIENT_LIGHTS_AMOUNT}];
    varying vec3 ambientColor;
  `)}

  ${ifdef(USE_POINT_LIGHT, `
    struct PointLight {
      vec3 position;
      vec3 color;
    };

    uniform PointLight pointLights[${POINT_LIGHTS_AMOUNT}];
    varying vec3 surfaceToLight[${POINT_LIGHTS_AMOUNT}];
    varying float distancesToPointLights[${POINT_LIGHTS_AMOUNT}];
  `)}

  ${ifdef(USE_DIRECTIONAL_LIGHT, `
    struct DirectionalLight {
      vec3 direction;
      vec3 color;
      float intensity;
    };

    uniform DirectionalLight directionalLights[${DIRECTIONAL_LIGHTS_AMOUNT}];
  `)}

  ${ifdef(USE_SHADOW, `
    uniform mat4 textureMatrix[${SHADOWS_AMOUNT}];
    varying vec4 projectedTextureCoordinate[${SHADOWS_AMOUNT}];
  `)}

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vNormal = mat3(modelMatrix) * normal;
    vViewDirection = normalize(cameraPosition - position);

    ${ifdef(USE_AMBIENT_LIGHT, `
      ambientColor = vec3(0.0);
      for(int i = 0; i < ${AMBIENT_LIGHTS_AMOUNT}; i++) {
        ambientColor += ambientLights[i].color * ambientLights[i].intensity;
      }
    `)}

    ${ifdef(USE_POINT_LIGHT, `
      for(int i = 0; i < ${POINT_LIGHTS_AMOUNT}; i++) {
        vec3 direction = pointLights[i].position - modelPosition.xyz;
        surfaceToLight[i] = normalize(direction);
        distancesToPointLights[i] = length(direction);
      }
    `)}

    ${ifdef(USE_SHADOW, `
      for(int i = 0; i < ${SHADOWS_AMOUNT}; i++) {
        projectedTextureCoordinate[i] = textureMatrix[i] * modelPosition;
      }
    `)}

    gl_Position = projectionMatrix * modelPosition;
  }
`

const defaultFragment = `
  precision highp float;

  uniform sampler2D modelTexture;

  varying vec3 vViewDirection;
  varying vec3 vNormal;
  varying vec2 vUv;

  ${ifdef(USE_AMBIENT_LIGHT, `
    varying vec3 ambientColor;

    vec3 calcAmbientLight(vec3 tex) {
      return tex * ambientColor;
    }
  `)}

  ${ifdef(USE_POINT_LIGHT, `
    struct PointLight {
      vec3 position;
      vec3 color;
    };

    uniform PointLight pointLights[${POINT_LIGHTS_AMOUNT}];
    varying vec3 surfaceToLight[${POINT_LIGHTS_AMOUNT}];
    varying float distancesToPointLights[${POINT_LIGHTS_AMOUNT}];

    vec3 calcPointLight(vec3 normal, vec3 tex) {
      vec3 diffuseColor = vec3(0.0);
      vec3 specularColor = vec3(0.0);

      for(int i = 0; i < ${POINT_LIGHTS_AMOUNT}; i++) {
        vec3 reflection = reflect(-surfaceToLight[i], normal);
        float diffuse = max(dot(normal, surfaceToLight[i]), 0.0);
        float specular = pow(max(dot(vViewDirection, reflection), 0.0), 256.0); // TODO: use shininess
        float attenuation = 1.0 / (1.0 + 0.1 * distancesToPointLights[i]); // TODO: use constant, linear, quadratic

        specularColor += pointLights[i].color * specular * attenuation;
        diffuseColor += pointLights[i].color * diffuse * attenuation;
      }
      return tex * (diffuseColor + specularColor);
    }
  `)}

  ${ifdef(USE_SHADOW, `
    uniform sampler2D shadowTexture;
    varying vec4 projectedTextureCoordinate[${SHADOWS_AMOUNT}];

    float unpackRGBA(vec4 v) {
      return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
    }

    float calcShadow() {
      float bias = 0.0001;
      float shadow = 0.0;
      for(int i = 0; i < ${SHADOWS_AMOUNT}; i++) {
        vec3 lightPosition = projectedTextureCoordinate[i].xyz / projectedTextureCoordinate[i].w;
        float depth = lightPosition.z - bias;
        float occluder = unpackRGBA(texture2D(shadowTexture, lightPosition.xy));
        shadow += mix(0.2, 1.0, step(depth, occluder));
      }
      return shadow;
    }
  `)}

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 tex = texture2D(modelTexture, vUv).rgb;

    vec3 ambientLight = vec3(0.0);
    vec3 pointLight = vec3(0.0);
    float shadow = 1.0;

    ${ifdef(USE_AMBIENT_LIGHT, `
      ambientLight = calcAmbientLight(tex);
    `)}

    ${ifdef(USE_POINT_LIGHT, `
      pointLight = calcPointLight(normal, tex);
    `)}

    ${ifdef(USE_SHADOW, `
      shadow = calcShadow();
    `)}

    gl_FragColor = vec4((ambientLight + pointLight) * shadow, 1.0);
  }
`
