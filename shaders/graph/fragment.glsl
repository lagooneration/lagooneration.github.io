precision mediump float;


varying vec2 vUvs;
uniform vec3 wavecolor;
uniform vec3 wavecolor2;
uniform vec3 wavecolor3;
uniform float amp1;
uniform float amp2;
uniform float amp3;
uniform float u_scrollY;
uniform float u_mouseY;
uniform float u_mouseX;
uniform float g_time;  
uniform vec2 v_resolution;




// vec3 wavecolor = vec3(0.0, 0.0, 0.0);
vec3 YELLOW = vec3(1.0, 1.0, 0.5);
vec3 BLUE = vec3(0.0, 0.0, 1.0);
vec3 RED = vec3(1.0, 0.0, 0.0);
vec3 GREEN = vec3(0.35, 1.0, 0.35);
vec3 PURPLE = vec3(1.0, 0.25, 1.0);




float Math_Random(vec2 p)  // replace this by something better
{
  p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
  return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
}

float noise(vec2 coords) {
  vec2 texSize = vec2(1.0);
  vec2 pc = coords * texSize;
  vec2 base = floor(pc);

  float s1 = Math_Random((base + vec2(0.0, 0.0)) / texSize);
  float s2 = Math_Random((base + vec2(1.0, 0.0)) / texSize);
  float s3 = Math_Random((base + vec2(0.0, 1.0)) / texSize);
  float s4 = Math_Random((base + vec2(1.0, 1.0)) / texSize);

  vec2 f = smoothstep(0.0, 1.0, fract(pc));

  float px1 = mix(s1, s2, f.x);
  float px2 = mix(s3, s4, f.x);
  float result = mix(px1, px2, f.y);
  return result;
}

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float sdfLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);

  return length(pa - ba * h);
}

vec3 drawGrid(vec3 colour, vec3 lineColour, float cellSpacing, float lineWidth) {
  vec2 center = vUvs - 0.5;
  vec2 cellPosition = abs(fract(center * v_resolution / vec2(cellSpacing)) - 0.5);
  float distToEdge = (0.5 - max(cellPosition.x, cellPosition.y)) * cellSpacing;
  float lines = smoothstep(0.0, lineWidth, distToEdge);

  colour = mix(lineColour, colour, lines);

  return colour;
}

vec3 BackgroundColour() {
  float distFromCenter = length(abs(vUvs - 0.5));

  float vignette = 1.0 - distFromCenter;
  vignette = smoothstep(0.0, 0.7, vignette);
  vignette = remap(vignette, 0.0, 1.0, 0.3, 1.0);

  return vec3(vignette);
}

float evaluateFunction(float x) {
  float y = 0.0;

  float amplitude = amp1;
  float frequency = 1.0 / 64.0;

  y += noise(vec2(x) * frequency) * amplitude;
  y += noise(vec2(x) * frequency * 2.0) * amplitude * 0.5;
  y += noise(vec2(x) * frequency * 4.0) * amplitude * 0.25;

  return y;
}

float evaluateFunction2(float x) {
  float y = 0.0;

  float amplitude2 = amp2;
  float frequency = 1.0 / 64.0;

  y += noise(vec2(x) * frequency) * amplitude2;
  y += noise(vec2(x) * frequency * 2.0) * amplitude2 * 0.5;
  y += noise(vec2(x) * frequency * 4.0) * amplitude2 * 0.25;

  return y;
}

float evaluateFunction3(float x) {
  float y = 0.0;

  float amplitude3 = amp3;
  float frequency = 1.0 / 64.0;

  y += noise(vec2(x) * frequency) * amplitude3;
  y += noise(vec2(x) * frequency * 2.0) * amplitude3 * 0.5;
  y += noise(vec2(x) * frequency * 4.0) * amplitude3 * 0.25;

  return y;
}

float plotFunction(vec2 p, float px, float curTime) {
  float result = 100000.0;
  
  for (float i = -5.0; i < 5.0; i += 1.0) {
    vec2 c1 = p + vec2(px * i, 0.0);
    vec2 c2 = p + vec2(px * (i + 1.0), 0.0);

    vec2 a = vec2(c1.x, evaluateFunction(c1.x + curTime));
    vec2 b = vec2(c2.x, evaluateFunction(c2.x + curTime));
    result = min(result, sdfLine(p, a, b));
  }

  return result;
}

float plotFunction2(vec2 p, float px, float curTime) {
  float result = 100000.0;
  
  for (float i = -5.0; i < 5.0; i += 1.0) {
    vec2 c1 = p + vec2(px * i, 0.0);
    vec2 c2 = p + vec2(px * (i + 1.0), 0.0);

    vec2 a = vec2(c1.x, evaluateFunction2(c1.x + curTime));
    vec2 b = vec2(c2.x, evaluateFunction2(c2.x + curTime));
    result = min(result, sdfLine(p, a, b));
  }

  return result;
}

float plotFunction3(vec2 p, float px, float curTime) {
  float result = 100000.0;
  
  for (float i = -5.0; i < 5.0; i += 1.0) {
    vec2 c1 = p + vec2(px * i, 0.0);
    vec2 c2 = p + vec2(px * (i + 1.0), 0.0);

    vec2 a = vec2(c1.x, evaluateFunction3(c1.x + curTime));
    vec2 b = vec2(c2.x, evaluateFunction3(c2.x + curTime));
    result = min(result, sdfLine(p, a, b));
  }

  return result;
}





void main() {
  vec2 pixelCoords = (vUvs - 0.5) * v_resolution;

  vec2 pixelCoords3 = (vUvs - 0.2) * v_resolution;

  vec2 pixelCoords2 = (vUvs - 0.8) * v_resolution;

  vec3 colour = BackgroundColour();
  vec3 colour2 = BackgroundColour();
  vec3 colour3 = BackgroundColour();


  // colour = drawGrid(colour, vec3(0.5), 10.0, 0.5);
  colour = drawGrid(colour, vec3(0.7), 100.0, 6.0);

  // Draw a horizontal blue line down at 0
  colour = mix(vec3(0.25, 0.25, 1.0), colour, smoothstep(2.0, 3.0, abs(pixelCoords.y)));
  colour2 = mix(vec3(0.25, 0.25, 1.0), colour, smoothstep(2.0, 3.0, abs(pixelCoords2.y)));
  colour3 = mix(vec3(0.25, 0.25, 1.0), colour, smoothstep(2.0, 3.0, abs(pixelCoords3.y)));

  // Draw graph of our function
  // if(u_scrollY > 1500.0 && u_scrollY < 2400.0) {
  //   if(u_mouseX < 0.0){
  //       if(u_mouseY < -0.2 && u_mouseY > -0.5) {
  //       wavecolor = RED;
  //       } else if(u_mouseY < 0.2 && u_mouseY > -0.1) {
  //       wavecolor = PURPLE;
  //       } else if(u_mouseY > 0.3 && u_mouseY < 0.6) {
  //       wavecolor = BLUE;
  //       } else {
  //       wavecolor = vec3(0.0, 0.0, 0.0);
  //       }
  //       }
  //       else {
  //       wavecolor = vec3(0.0, 0.0, 0.0);
  //       }
  // } 
  float distToFunction = plotFunction(pixelCoords2, 2.0, g_time * 96.0);

  float distToFunction2 = plotFunction2(pixelCoords, 2.0, g_time * 96.0);
  vec3 lineColour2 = wavecolor * mix(1.0, 0.95, smoothstep(0.0, 2.0, distToFunction));
  float lineBorder2 = smoothstep(4.0, 6.0, distToFunction );
  colour2 = mix(lineColour2, colour, lineBorder2);

  vec3 lineColour = wavecolor2 * mix(1.0, 0.95, smoothstep(0.0, 2.0, distToFunction2));
  float lineBorder = smoothstep(4.0, 6.0, distToFunction2);

  

  float distToFunction3 = plotFunction3(pixelCoords3, 2.0, g_time * 96.0);
  vec3 lineColour3 = wavecolor3 * mix(1.0, 0.95, smoothstep(0.0, 2.0, distToFunction3));
  float lineBorder3 = smoothstep(4.0, 6.0, distToFunction3);
  colour3 = mix(lineColour3, colour, lineBorder3);



  colour = mix(lineColour, colour, lineBorder);
  colour2 = mix( lineColour2, colour2,lineBorder2 );
  colour3 = mix(lineColour3, colour3,lineBorder3 );
  
  colour = colour * colour2 * colour3;
  gl_FragColor = vec4(colour, 1.0);
}