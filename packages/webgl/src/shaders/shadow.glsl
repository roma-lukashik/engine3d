const vec4 inv = 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0);

float unpackRGBA(vec4 v) {
  return dot(v, inv);
}

float texture2DCompare(sampler2D shadowMap, vec2 uv, float depth) {
  return step(depth, unpackRGBA(texture2D(shadowMap, uv)));
}

float PCF_Soft(sampler2D shadowMap, vec2 shadowMapSize, vec4 coord) {
  vec2 texelSize = vec2(1.0) / shadowMapSize;
  float dx = texelSize.x;
  float dy = texelSize.y;

  vec2 uv = coord.xy;
  vec2 f = fract(uv * shadowMapSize + 0.5);
  uv -= f * texelSize;

  return (
    texture2DCompare(shadowMap, uv, coord.z) +
    texture2DCompare(shadowMap, uv + vec2(dx, 0.0), coord.z) +
    texture2DCompare(shadowMap, uv + vec2(0.0, dy), coord.z) +
    texture2DCompare(shadowMap, uv + texelSize, coord.z) +
    mix(
      texture2DCompare(shadowMap, uv + vec2(-dx, 0.0), coord.z),
      texture2DCompare(shadowMap, uv + vec2(2.0 * dx, 0.0), coord.z),
      f.x
    ) +
    mix(
      texture2DCompare(shadowMap, uv + vec2(-dx, dy), coord.z),
      texture2DCompare(shadowMap, uv + vec2(2.0 * dx, dy), coord.z),
      f.x
    ) +
    mix(
      texture2DCompare(shadowMap, uv + vec2(0.0, -dy), coord.z),
      texture2DCompare(shadowMap, uv + vec2(0.0, 2.0 * dy), coord.z),
      f.y
    ) +
    mix(
      texture2DCompare(shadowMap, uv + vec2(dx, -dy), coord.z),
      texture2DCompare(shadowMap, uv + vec2(dx, 2.0 * dy), coord.z),
      f.y
    ) +
    mix(
      mix(
        texture2DCompare(shadowMap, uv + vec2(-dx, -dy), coord.z),
        texture2DCompare(shadowMap, uv + vec2(2.0 * dx, -dy), coord.z),
        f.x
      ),
      mix(
        texture2DCompare(shadowMap, uv + vec2(-dx, 2.0 * dy), coord.z),
        texture2DCompare(shadowMap, uv + vec2(2.0 * dx, 2.0 * dy), coord.z),
        f.x
      ),
      f.y
    )
  ) / 9.0;
}

bool frustumTest(vec4 coord) {
  bvec4 inFrustumVec = bvec4(coord.x >= 0.0, coord.x <= 1.0, coord.y >= 0.0, coord.y <= 1.0);
  bool inFrustum = all(inFrustumVec);
  bvec2 frustumTestVec = bvec2(inFrustum, coord.z <= 1.0);
  return all(frustumTestVec);
}

float getShadow(sampler2D shadowMap, float bias, vec4 coord) {
  coord.xyz /= coord.w;
  coord.z -= bias;

  if (frustumTest(coord)) {
    return PCF_Soft(shadowMap, vec2(1000.0, 1000.0), coord);
//      return texture2DCompare(shadowMap, coord.xy, coord.z);
  } else {
    return 1.0;
  }
}
