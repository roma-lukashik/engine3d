const vec4 inv = 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0);

float unpackRGBA(vec4 v) {
  return dot(v, inv);
}

float texture2DCompare(sampler2D depths, vec2 uv, float compare) {
  return step(compare, unpackRGBA(texture2D(depths, uv)));
}

float getShadow(sampler2D shadowMap, float bias, vec4 coord) {
  vec3 projected = coord.xyz / coord.w;
  float depth = projected.z - bias;
  return texture2DCompare(shadowMap, projected.xy, depth);
}
