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
import { WebGLBaseTexture } from "@webgl/textures/types"
import { Matrix4, Vector3 } from "@math/types"

type Props = {
  gl: WebGLRenderingContext
  ambientLightsAmount?: number
  pointLightsAmount?: number
  spotLightsAmount?: number
  directionalLightsAmount?: number
  shadowsAmount?: number
  useSkinning?: boolean
  useColorTexture?: boolean
}

type MeshUniformValues = {
  worldMatrix?: Matrix4
  cameraPosition?: Vector3
  textureMatrices?: Matrix4[]
  projectionMatrix?: Matrix4
  ambientLights?: AmbientLight[]
  pointLights?: PointLight[]
  spotLights?: SpotLight[]
  directionalLights?: DirectionalLight[]
  material?: Material
  shadowTextures?: WebGLBaseTexture[]
  boneTexture?: WebGLBaseTexture
  boneTextureSize?: number
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

type Material = {
  metalness: number
  roughness: number
  color: Vector3
  colorTexture?: number
}

export class MeshProgram extends Program<MeshUniformValues> {
  constructor({
    gl,
    ambientLightsAmount = 0,
    pointLightsAmount = 0,
    spotLightsAmount = 0,
    directionalLightsAmount = 0,
    shadowsAmount = 0,
    useSkinning = false,
    useColorTexture = false,
  }: Props) {
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

    super({ gl, fragment, vertex })
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

  mat4 getBoneMatrix(float i) {
    float j = i * 4.0;
    float dx = 1.0 / boneTextureSize;
    float x = mod(j, boneTextureSize);
    float y = dx * (floor(j / boneTextureSize) + 0.5);

    return mat4(
      texture2D(boneTexture, vec2(dx * (x + 0.5), y)),
      texture2D(boneTexture, vec2(dx * (x + 1.5), y)),
      texture2D(boneTexture, vec2(dx * (x + 2.5), y)),
      texture2D(boneTexture, vec2(dx * (x + 3.5), y))
    );
  }

  ${ifdef(USE_AMBIENT_LIGHT, `
    struct AmbientLight {
      vec3 color;
    };

    uniform AmbientLight ambientLights[${AMBIENT_LIGHTS_AMOUNT}];
    varying vec3 ambientColor;
  `)}

  void main() {
    mat4 worldSkinMatrix = worldMatrix;

    ${ifdef(USE_SKINNING, `
      mat4 skinMatrix =
        getBoneMatrix(skinIndex.x) * skinWeight.x +
        getBoneMatrix(skinIndex.y) * skinWeight.y +
        getBoneMatrix(skinIndex.z) * skinWeight.z +
        getBoneMatrix(skinIndex.w) * skinWeight.w;

      worldSkinMatrix = worldMatrix * skinMatrix;
    `)}

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
  precision highp float;

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

  const float PI = 3.14159265359;

  float pow2(float x) { return x * x; }
  float saturate(float x) { return clamp(x, 0.0, 1.0); }

  float geometryGGX(float NdV, float NdL, float alpha) {
    float a2 = pow2(alpha);
    float gv = 2.0 * NdL / (NdL + sqrt(a2 + (1.0 - a2) * pow2(NdV)));
    float gl = 2.0 * NdV / (NdV + sqrt(a2 + (1.0 - a2) * pow2(NdV)));
    return gv * gl;
  }

  float distributionGGX(float NdH, float alpha) {
    float a2 = pow2(alpha);
    float f = pow2(NdH) * (a2 - 1.0) + 1.0;
    return a2 / (PI * pow2(f));
  }

  vec3 fresnelSchlick(vec3 r0, vec3 r90, float VdH) {
    return r0 + (r90 - r0) * pow(1.0 - VdH, 5.0);
  }

  // https://learnopengl.com/PBR/Theory
  // https://en.wikipedia.org/wiki/Bidirectional_reflectance_distribution_function
  vec3 BRDF(vec3 baseColor, vec3 lightDirection) {
    float alpha = pow2(material.roughness);
    float metalness = material.metalness;

    vec3 f0 = vec3(0.04);
    vec3 specularColor = mix(f0, baseColor, metalness);
    vec3 diffuseColor = baseColor * (1.0 - f0) * (1.0 - metalness);
    vec3 r0 = specularColor;
    vec3 r90 = vec3(clamp(max(max(specularColor.r, specularColor.g), specularColor.b) * 25.0, 0.0, 1.0));

    vec3 N = vNormal;
    vec3 V = normalize(cameraPosition - vPosition);
    vec3 L = lightDirection;
    vec3 H = normalize(L + V);

    float NdL = saturate(dot(N, L));
    float NdV = saturate(dot(N, V));
    float NdH = saturate(dot(N, H));
    float LdH = saturate(dot(L, H));
    float VdH = saturate(dot(V, H));

    vec3 F = fresnelSchlick(r0, r90, VdH);
    float G = geometryGGX(NdV, NdL, alpha);
    float D = distributionGGX(NdH, alpha);

    vec3 diffuse = (1.0 - F) * (diffuseColor / PI);
    vec3 specular = F * G * D / (4.0 * NdV * NdL);

    // TODO fix ten times multiplier.
    return 10.0 * (diffuse + specular);
  }

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
          float lightDistance = length(surfaceToSpotLightDirection);
          float distanceAttenuation = getDistanceAttenuation(lightDistance, spotLights[i].distance);
          color += spotLights[i].color * attenuation * distanceAttenuation;
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
        vec3 diffuse = BRDF(tex, directionalLights[i].direction);
        float NdL = saturate(dot(normal, directionalLights[i].direction));
        diffuseColor += NdL * directionalLights[i].color * diffuse;
      }
      return diffuseColor;
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
      directionalLight = calcDirectionalLight(vNormal, tex);
    `)}

    ${ifdef(USE_SHADOW, `
      shadow = calcShadow(shadowTextures);
    `)}

    gl_FragColor = vec4(ambientLight + (spotLight + directionalLight) * shadow, 1.0);
  }
`
