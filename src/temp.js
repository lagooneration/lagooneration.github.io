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
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  vec3 lightColour = vec3(1.0, 1.0, 0.9);
  float dp = max(0.0, dot(lightDir, normal));

// Fiddle with the values to get more or less lighting
// Toon
dp = smoothstep(0.5, 0.505, dp);

  // 3 Colours
  // dp = mix(0.5, 1.0, step(0.2, dp)) * step(0.05, dp);

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