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
  vec3 r90 = vec3(saturate(max(max(specularColor.r, specularColor.g), specularColor.b) * 25.0));

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

  // TODO fix 5 times multiplier.
  return 5.0 * (diffuse + specular);
}
