uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D texture1;
float PI=3.141592653589793238;

void main(){
    vUv=uv;
    vec4 mvPostition=modelViewMatrix*vec4(position,1.);
    gl_PointSize=1000.*(1./-mvPostition.z);
    gl_Position=projectionMatrix*mvPostition;
}