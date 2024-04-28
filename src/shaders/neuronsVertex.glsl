
varying vec3 vUv;
varying vec3 vPosition;

void main() {	
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}