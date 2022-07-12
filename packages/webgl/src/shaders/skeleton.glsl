// Require:

// sampler2D boneTexture
// float boneTextureSize
// vec4 skinIndex
// vec4 skinWeight
// mat4 worldMatrix

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

mat4 getWorldSkinMatrix() {
  mat4 worldSkinMatrix = worldMatrix;

  #ifdef USE_SKINNING
  mat4 skinMatrix =
    getBoneMatrix(skinIndex.x) * skinWeight.x +
    getBoneMatrix(skinIndex.y) * skinWeight.y +
    getBoneMatrix(skinIndex.z) * skinWeight.z +
    getBoneMatrix(skinIndex.w) * skinWeight.w;

    worldSkinMatrix = worldMatrix * skinMatrix;
  #endif

  return worldSkinMatrix;
}
