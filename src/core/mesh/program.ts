import { createProgram } from '../program'

type ProgramOptions = {
  gl: WebGLRenderingContext;
  useLight?: boolean;
  useShadow?: boolean;
}

export const createMeshProgram = ({
  gl,
  useLight = true,
  useShadow = true,
}: ProgramOptions) => {
  const defs = definitions({ useLight, useShadow })
  const vertex = defs + defaultVertex
  const fragment = defs + defaultFragment
  return createProgram({ gl, vertex, fragment })
}

const definitions = ({ useLight, useShadow }: Pick<ProgramOptions, 'useLight' | 'useShadow'>) => {
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
  uniform mat4 textureMatrix;

  varying vec3 vNormal;
  varying vec2 vUv;

  #ifdef USE_LIGHT
    uniform vec3 lightPosition;
    uniform vec3 lightViewPosition;

    varying vec3 surfaceToLight;
    varying vec3 surfaceToView;
  #endif

  #ifdef USE_SHADOW
    varying vec4 projectedTexcoord;
  #endif

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vNormal = mat3(modelMatrix) * normal;

    #ifdef USE_LIGHT
      surfaceToLight = lightPosition - modelPosition.xyz;
      surfaceToView = lightViewPosition - modelPosition.xyz;
    #endif

    #ifdef USE_SHADOW
      projectedTexcoord = textureMatrix * modelPosition;
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
    varying vec3 surfaceToLight;
    varying vec3 surfaceToView;
  #endif

  #ifdef USE_SHADOW
    uniform sampler2D shadowTexture;
    varying vec4 projectedTexcoord;
  #endif

  float unpackRGBA (vec4 v) {
    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
  }

  void main() {
    float lighting = 1.0;
    float specular = 0.0;
    float shadow = 1.0;

    vec3 normal = normalize(vNormal);
    vec3 tex = texture2D(modelTexture, vUv).rgb;

    #ifdef USE_LIGHT
      vec3 surfaceToLightDirection = normalize(surfaceToLight);
      vec3 surfaceToViewDirection = normalize(surfaceToView);
      vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
      lighting = dot(normal, surfaceToLightDirection) * 1.9;
      specular = pow(dot(normal, halfVector), 150.0);
    #endif

    #ifdef USE_SHADOW
      vec3 lightPosition = projectedTexcoord.xyz / projectedTexcoord.w;
      float bias = 0.001;
      float depth = lightPosition.z - bias;
      float occluder = unpackRGBA(texture2D(shadowTexture, lightPosition.xy));
      shadow = mix(0.2, 1.0, step(depth, occluder));
    #endif

    gl_FragColor = vec4(tex * lighting * shadow + specular * shadow, 1.0);
  }
`
