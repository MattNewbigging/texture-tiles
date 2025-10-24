out vec4 vWorldPosition;
out vec2 uvA;
out vec2 uvB;
out vec2 vUv;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition;

  // uvA = mod(worldPosition.xz / 2.0, 2.0);
  // uvB = fract(position.xz);

  vUv = uv;

  uvA = vec2(0.0);
  uvB = vec2(0.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
