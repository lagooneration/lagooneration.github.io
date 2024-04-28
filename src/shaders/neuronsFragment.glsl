
varying vec3 vUv;
varying vec3 vPosition;
uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iResolution;
// uniform float deltaTime;


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}


void main()
{
   vec3 modelColour = vec3(0.5);
  vec3 lighting = vec3(0.0);

  vec3 normal = normalize(vUv);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Ambient
  vec3 ambient = vec3(1.0);

  // Hemi
  vec3 skyColour = vec3(0.0, 0.3, 0.6);
  vec3 groundColour = vec3(0.6, 0.3, 0.1);

  vec3 hemi = mix(groundColour, skyColour, remap(normal.y, -1.0, 1.0, 0.0, 1.0));

  
  
  // Diffuse lighting
    // float parallaxX = iMouse.x;
    // float parallaxY = iMouse.y;
  //fillLight.position.y -=
  //  (parallaxY * 9 + fillLight.position.y - 2) * deltaTime;
  
  // vec3 lightDir = vec3(iMouse.x,-iMouse.y,0.0);
  // float x = (parallaxX * 8 - lightDir.x) * 2 * deltaTime;
  // float y = (parallaxY * 9.0 + lightDir.y - 2.0) * deltaTime;
  // float z = lightDir.z;
  vec2 mouseNorm = iMouse / iResolution;
  // Define parallax parameters
    float parallaxAmount = 2.0; // Adjust this value to control the strength of the parallax effect
    float delayAmount = 0.1;    // Adjust this value to control the delay effect

    // Calculate parallax effect based on mouse movement
    vec2 currentMouse = iMouse / iResolution;
    vec2 prevMouse = vec2(0.5); // Assuming initial mouse position is at the center of the screen
    vec2 parallax = mix(currentMouse, prevMouse, delayAmount) - currentMouse;
    parallax *= parallaxAmount;

    // Modify light direction based on parallax effect
    vec3 lightDir = vec3(-parallax.x, parallax.y, 0.05); // Z component is assumed constant for directional light
    

  // lightDir = vec3(x,y,0.5);

  // vec3 lightDir = normalize(vec3(1.0, 1.0, 0.0));
  vec3 lightColour = vec3(0.9, 0.2, 0.3);
  float dp = max(0.0, dot(lightDir, normal));

// Fiddle with the values to get more or less lighting
// Toon
// dp = smoothstep(0.5, 0.505, dp);

  // 3 Colours
  dp = mix(0.5, 1.0, step(0.2, dp)) * step(0.05, dp);

// Light position


   

    

  vec3 specular = vec3(0.0);
  vec3 diffuse = dp * lightColour;

  // Specular
  vec3 r = normalize(reflect(-lightDir, normal));
  float phongValue = max(0.0, dot(viewDir, r));
phongValue = pow(phongValue, 128.0);

  // Fresnel
  float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
fresnel = pow(fresnel, 2.0);
fresnel = step(0.7, fresnel);

specular += phongValue;
specular = smoothstep(0.5, 0.51, specular);

lighting = hemi * (fresnel + 0.2) + diffuse * 0.8;

  vec3 colour = modelColour * lighting + specular;

  

  

gl_FragColor = vec4(pow(colour, vec3(1.0 / 2.2)), 1.0);


}