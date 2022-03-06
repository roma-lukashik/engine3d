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
  const defines = [
    useLight ? '#define USE_LIGHT' : '',
    useShadow ? '#define USE_SHADOW' : '',
  ].filter(Boolean).join('\n')
  const vertex = defines + defaultVertex
  const fragment = defines + defaultFragment
  return createProgram({ gl, vertex, fragment })
}

const defaultVertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform vec3 lightPosition;
  uniform vec3 lightViewPosition;

  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 textureMatrix;

  varying vec4 projectedTexcoord;
  varying vec3 vNormal;
  varying vec3 surfaceToLight;
  varying vec3 surfaceToView;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vNormal = mat3(modelMatrix) * normal;
    projectedTexcoord = textureMatrix * modelPosition;
    surfaceToLight = lightPosition - modelPosition.xyz;
    surfaceToView = lightViewPosition - modelPosition.xyz;
    gl_Position = projectionMatrix * modelPosition;
  }
`

const defaultFragment = `
  precision highp float;

  uniform sampler2D modelTexture;
  uniform sampler2D shadowTexture;

  varying vec3 vNormal;
  varying vec4 projectedTexcoord;
  varying vec3 surfaceToLight;
  varying vec3 surfaceToView;
  varying vec2 vUv;

  float unpackRGBA (vec4 v) {
    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
  }

  void main() {
    vec3 normal = normalize(vNormal);

    vec3 surfaceToLightDirection = normalize(surfaceToLight);
    vec3 surfaceToViewDirection = normalize(surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    vec3 lightPosition = projectedTexcoord.xyz / projectedTexcoord.w;
    float bias = 0.001;
    float depth = lightPosition.z - bias;
    float occluder = unpackRGBA(texture2D(shadowTexture, lightPosition.xy));
    float shadow = mix(0.2, 1.0, step(depth, occluder));

    float lighting = dot(normal, surfaceToLightDirection) * 1.9;
    float specular = pow(dot(normal, halfVector), 150.0);

    vec3 tex = texture2D(modelTexture, vUv).rgb;

    gl_FragColor = vec4(tex * lighting * shadow + specular * shadow, 1.0);
  }
`
