import "./main.css";
import {
  Clock,
  Scene,
  LoadingManager,
  WebGLRenderer,
  sRGBEncoding,
  Group,
  PerspectiveCamera,
  DirectionalLight,
  PointLight,
  MeshPhongMaterial,
} from "three";
import * as THREE from "three";

import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { LensDistortionShader } from "../static/shaders/LensDistortionShader.js";

// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader.js";
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader.js";
import { SobelAnimation } from "./animation/SobelAnimation.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
// import { TextPlugin} from 'gsap/TextPlugin';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { CSSPlugin } from 'gsap/CSSPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

import Fsynapsis from "./shaders/synapsisFragment.glsl";
import Vsynapsis from "./shaders/synapsisVertex.glsl";
import Fbloom from "./shaders/bloomFragment.glsl";
import Vbloom from "./shaders/bloomVertex.glsl";

// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
// DEBUG

import Stats from "stats.js";

const stats = new Stats();
document.body.appendChild(stats.dom);
// Show specific panels using showPanel method
stats.showPanel(0); // Show FPS panel

// GUI
import GUI from "lil-gui";
const gui = new GUI();

// Create parameters object
const params = {
  focus: 7.91, // Default focus distance
  aperture: 0.0004, // Default aperture size
  maxblur: 0.04, // Default maximum blur strength
  shape: 1, // Default bokeh shape (1 for circular)
};

// VIDEO

/// /////////// Scroll Control!


const video = document.querySelector(".video");

let tV = gsap.timeline({
  scrollTrigger: {
    trigger: "video",
    start: "top top",
    end: "bottom+=200% bottom",
    scrub: true,
    markers: true,
  },
});

// wait until video metadata is loaded, so we can grab the proper duration before adding the onscroll animation. Might need to add a loader for loonng videos
video.onloadedmetadata = function () {
  tV.to(video, { currentTime: video.duration });
};

// Dealing with devices
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.msMaxTouchPoints > 0 ||
    navigator.maxTouchPoints > 0
  );
}
if (isTouchDevice()) {
  video.play();
  video.pause();
}


/* ---------------------------------- */

////////////////////////////////////////////////////////////////////////
//// GSAP ANIMATION

// box animation
gsap.to(".box", {
    scrollTrigger: ".box",
    rotation: 360,
    x: '30vw',
    y: '-20vw',
    
    yPercent: -10,
    scale: 1.4,
    // special properties
    duration: 1, // how long the animation lasts

    // repeat: -1, // the number of repeats - this will play 3 times
    // yoyo: true, // this will alternate back and forth on each repeat. Like a yoyo
});

var tl = gsap.timeline(),
  mySplitText = new SplitText("#content", { type: "words,chars" }),
  chars = mySplitText.chars; //an array of all the divs that wrap each character

// gsap.set("#content", { perspective: 400 });

// console.log(chars);
function init() {
  ScrollTrigger.create({
    trigger: ".neurophones-container",
    start: "top center",
    onEnter: () => {
      tl.from(chars, {
        duration: 2,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.01,
      });
    },
    onLeaveBack: () => {
      gsap.to(mySplitText, {
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });
    },
  });
}
window.addEventListener("load", init);

////////////////////////////////////////////////////////////////////////
//// LOADING MANAGER

const ftsLoader = document.querySelector(".loader-roll");
const looadingCover = document.getElementById("loading-text-intro");
const loadingManager = new LoadingManager();

loadingManager.onLoad = function () {
  document.querySelector(".main-container").style.visibility = "visible";
  document.querySelector("body").style.overflowY = "auto";

  const yPosition = { y: 0 };

  new TWEEN.Tween(yPosition)
    .to({ y: 100 }, 900)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onUpdate(function () {
      looadingCover.style.setProperty(
        "transform",
        `translate( 0, ${yPosition.y}%)`
      );
    })
    .onComplete(function () {
      looadingCover.parentNode.removeChild(
        document.getElementById("loading-text-intro")
      );
      TWEEN.remove(this);
    });

  introAnimation();
  ftsLoader.parentNode.removeChild(ftsLoader);

  window.scroll(0, 0);
};

//loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
//    console.log('Loading file: ' + url + '.\nLoaded  files.');
//};

////////////////////////////////////////////////////////////////////////
//// DRACO LOADER

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
dracoLoader.setDecoderConfig({ type: "js" });
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);

const container = document.getElementById("canvas-container-hero");
const containerDetails = document.getElementById(
  "canvas-container-neurophones"
);
const containerFooter = document.getElementById("canvas-container-plugin");

let oldMaterial;
let secondContainer = false;
let width = container.clientWidth;
let height = container.clientHeight;

////////////////////////////////////////////////////////////////////////
//// RENDERER AND SCENE

const scene = new Scene();

// renderer
const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.autoClear = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(width, height);
// renderer.gammaFactor = 1.2;
renderer.outputColorSpace = sRGBEncoding;
container.appendChild(renderer.domElement);
console.log(renderer.info);

const renderer2 = new WebGLRenderer({ antialias: false });
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer2.setSize(width, height);
renderer2.outputColorSpace = sRGBEncoding;
containerDetails.appendChild(renderer2.domElement);

const renderer3 = new WebGLRenderer({ antialias: false });
renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer3.setSize(width, height);
renderer3.outputColorSpace = sRGBEncoding;
containerFooter.appendChild(renderer3.domElement);

////////////////////////////////////////////////////////////////////////
//// CMAERA

const cameraGroup = new Group();
scene.add(cameraGroup);

const camera = new PerspectiveCamera(35, width / height, 1, 100);
camera.position.set(19, -1.54, -0.1);
cameraGroup.add(camera);

const camera2 = new PerspectiveCamera(
  35,
  containerDetails.clientWidth / containerDetails.clientHeight,
  1,
  100
);
camera2.position.set(6.3, 1.4, 11.7);
camera2.rotation.set(0, 1.3, 0);
scene.add(camera2);

const camera3 = new PerspectiveCamera(
  35,
  containerFooter.clientWidth / containerFooter.clientHeight,
  1,
  100
);
camera3.position.set(-2.2, 2.7, 1.9);
camera3.rotation.set(0, -0.8, 0);
scene.add(camera3);

/////////////////////////////////////////////////////////////////////////
///// POST PROCESSING EFFECTS
/////////////////////////////////////////////////////////////////////////
///// POST PROCESSING EFFECTS

const renderPass = new RenderPass(scene, camera);
const renderPass2 = new RenderPass(scene, camera2);

const renderTarget = new THREE.WebGLRenderTarget(width, height, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

const renderTarget2 = new THREE.WebGLRenderTarget(
  containerDetails.clientWidth,
  containerDetails.clientHeight,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }
);

const composer = new EffectComposer(renderer, renderTarget);
composer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

const composer2 = new EffectComposer(renderer2, renderTarget2);
composer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));

/////DISTORT PASS //////////////////////////////////////////////////////////////
const distortPass = new ShaderPass(LensDistortionShader);
distortPass.material.defines.CHROMA_SAMPLES = 4;
distortPass.enabled = true;
distortPass.material.uniforms.baseIor.value = 0.91;
distortPass.material.uniforms.bandOffset.value = 0.0019;
distortPass.material.uniforms.jitterIntensity.value = 6.7;
distortPass.material.defines.BAND_MODE = 2;

composer.addPass(renderPass);
// composer2.addPass( distortPass )

/*
/////BLOOM PASS //////////////////////////////////////////////////////////////
const BLOOM_SCENE = 1;

            const bloomLayer = new THREE.Layers();
            bloomLayer.set( BLOOM_SCENE );

            const params = {
                threshold: 0,
                strength: 1,
                radius: 0.5,
                exposure: 1
            };
const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
            const materials = {};

function nonBloomed(obj) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
    }
}

function restoreMaterial(obj) {
    if(materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
    }
}



const renderScene = new RenderPass( scene, camera2 );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( containerDetails.clientWidth, containerDetails.clientHeight ), 1.5, 0.4, 0.85 );
const bloomComposer = new EffectComposer( renderer2 );
            bloomComposer.renderToScreen = false;
            bloomComposer.addPass( renderScene );
            bloomComposer.addPass( bloomPass );

const mixPass = new ShaderPass(
                new THREE.ShaderMaterial( {
                    uniforms: {
                        baseTexture: { value: null },
                        bloomTexture: { value: bloomComposer.renderTarget2.texture }
                    },
                	
                    fragmentShader: Fbloom,
                    vertexShader: Vbloom,
                    defines: {}
                } ), 'baseTexture'
            );
            mixPass.needsSwap = true;

const finalPass = new OutputPass();
// bloomComposer.addPass( finalPass );

const finalComposer = new EffectComposer( renderer2 );
            finalComposer.addPass( renderScene );
            finalComposer.addPass( mixPass );
            finalComposer.addPass( finalPass );

*/

////////////////////////////////////////////////////////////////////////
//// resize event listener

window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight;
  camera2.updateProjectionMatrix();

  camera3.aspect = containerFooter.clientWidth / containerFooter.clientHeight;
  camera3.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer2.setSize(
    containerDetails.clientWidth,
    containerDetails.clientHeight
  );
  renderer3.setSize(containerFooter.clientWidth, containerFooter.clientHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 1));

  // composer.setSize(container.clientWidth, container.clientHeight);
  // composer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight);
  // bloomComposer.setSize(containerDetails.clientWidth, containerDetails.clientHeight);
});

////////////////////////////////////////////////////////////////////////
//// LIGHTS

//const sunLight = new PointLight(0xabadaf, 1.05);
//sunLight.position.set(100, 50, 100);
//scene.add(sunLight);

// const amb = new THREE.AmbientLight(0xabadaf, 0.05);
// scene.add(amb);

// const dir = new THREE.SpotLight (0xffffff , 1.5, 0, Math.PI/2, 0.5, 1);
// dir.position.set(10, 15, 10);
// scene.add(dir);

// const hemilight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
// hemilight.position.set(4, 4, 4);
// scene.add(hemilight);

const fillLight = new PointLight(0xff00f0, 2, 3.2, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

const fillLight2 = new PointLight(0x0f00ff, 2.7, 4, 3);
fillLight2.position.set(30, 3, 2.8);
scene.add(fillLight2);

////////////////////////////////////////////////////////////////////////
//// TEXTURES

let iTime;
let iMouse = new THREE.Vector2();
let iResolution = new THREE.Vector2(width, height);

// get mouse location
document.addEventListener("mousemove", (event) => {
  iMouse.x = event.clientX;
  iMouse.y = event.clientY;
});

const sMat = new THREE.ShaderMaterial({
  uniforms: {
    iTime: { value: iTime },
    iMouse: { value: iMouse },
  },
  vertexShader: Vsynapsis,
  fragmentShader: Fsynapsis,
  // side: THREE.DoubleSide,
  transparent: true,
  depthTest: true,
  depthWrite: true,
  wireframe: false,
  blending: THREE.AdditiveBlending,
  // wireframe: true
});

////////////////////////////////////////////////////////////////////////
//// GLTF MODELS

loader.load("models/gltf/brain.gltf", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = sMat;
    }
  });
  scene.add(gltf.scene);
  gltf.scene.scale.set(1.23, 1.23, 1.23);
  gltf.scene.position.set(0, 1.13, 0);
  gltf.scene.rotation.set(0, Math.PI / 32, 0);
  clearScene();
});

let brain;
let brainMaterial = new MeshPhongMaterial({ color: 0x3c3c3c });
loader.load("models/gltf/brain.gltf", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = brainMaterial;
    }
  });
  brain = gltf.scene;
  scene.add(brain);
  brain.scale.set(1.2, 1.2, 1.2);
  brain.position.set(0, 1.13, 0);
  brain.rotation.set(0, Math.PI / 32, 0);
  clearScene();
});

console.log(brain);

function clearScene() {
  oldMaterial.dispose();
  renderer.renderLists.dispose();
}

let imp;
let tempImp;
let impMaterial = new THREE.MeshStandardMaterial({
  depthTest: true,
  depthWrite: true,
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.5,
});

loader.load("models/implant.gltf", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      //obj.material = impMaterial;
    }
  });
  imp = gltf.scene;
  //tempImp = gltf.scene;
  scene.add(imp);
  //console.log(imp);
  // imp.scale.set(0,0,0)
  imp.scale.set(1.33, 1.53, 0.93);
  // imp.position.set(-0.2, -0.17, 2.2);
  imp.position.set(-0.2, -0.17, 9.2);
  // imp.rotation.set(0, Math.PI + Math.PI/8, 0);
  clearScene();

  console.log("IMPLANT LOADING");
});

const flightPathUp = {
  curviness: 0.5,
  path: [{ x: -0.2, y: -0.17, z: 9.2 }],
};

const flightPathUp2 = {
  curviness: 1,
  path: [{ x: 0.1, y: 0.4, z: 6.2 }],
};

const flightPathUp3 = {
  curviness: 0.8,
  path: [{ x: 0.1, y: 0.17, z: 4.3 }],
};

const flightPathUp4 = {
  curviness: 0.5,
  path: [{ x: -0.17, y: -0.17, z: 2.2 }],
};

let skinTexture = new THREE.TextureLoader(loadingManager).load(
  "models/earTexture.png"
);
skinTexture.wrapS = THREE.RepeatWrapping;
skinTexture.wrapT = THREE.RepeatWrapping;

const skinMaterial = new THREE.MeshStandardMaterial({ map: skinTexture });
let ear;

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x3c3c3c,
  wireframe: true,
});
wireMat.opacity = 0.5;

loader.load("models/earMat.gltf", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      // obj.material = impMaterial;
      obj.material = skinMaterial;
    }
  });
  ear = gltf.scene;
  scene.add(ear);
  // console.log(imp);
  // imp.scale.set(0,0,0)
  ear.scale.set(1.1, 1.1, 1.1);
  ear.position.set(-0.7, 0.33, 0.27);
  // ear.rotation.set(0, Math.PI, 0);
  clearScene();

  console.log("Ear LOADING");
});

// const cube = new THREE.Mesh(new THREE.BoxGeometry(1,5), new THREE.MeshBasicMaterial({color: 0x3c3c3c}));
// scene.add(cube);

loader.load("models/wireFace.gltf", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      // obj.material = impMaterial;
      obj.material = wireMat;
    }
  });

  scene.add(gltf.scene);
  // console.log(imp);
  // imp.scale.set(0,0,0)
  gltf.scene.scale.set(1, 1, 0.9);
  gltf.scene.position.set(-0.3, 1.23, 0);
  // ear.rotation.set(0, Math.PI, 0);
  clearScene();

  console.log("Face LOADING");
});

//////////////////////////////////////////////////
//// POST PROCESSING

/// BLOOM

// const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight),1, 0.2, 0.1);
// bloomPass.ignoreMesh(cube);

let sobelEffect = new ShaderPass(SobelAnimation);
sobelEffect.uniforms["resolution"].value.x =
  container.clientWidth * window.devicePixelRatio;
sobelEffect.uniforms["resolution"].value.y =
  container.clientHeight * window.devicePixelRatio;
sobelEffect.uniforms["mixRatio"].value = 0;
// Function to add Sobel effect
let Sobel = false;
function addSobelEffect() {
  composer2.addPass(sobelEffect);
  gsap.to(sobelEffect.uniforms["mixRatio"], {
    value: 0.8,
    duration: 2.5,
    onComplete: () => {
      console.log("Dark life");
      Sobel = true;
    },
  });
}

// Function to remove Sobel effect
function removeSobelEffect() {
  gsap.to(sobelEffect.uniforms["mixRatio"], {
    value: 0,
    duration: 1,
    onComplete: () => {
      console.log("back to colors");
      composer2.removePass(sobelEffect);
      Sobel = false;
    },
  });
}

const dotEffect = new ShaderPass(DotScreenShader);
dotEffect.uniforms["scale"].value = 2;

// Create a BokehPass
const bokehPass = new BokehPass(scene, camera2, {
  focus: 5.0, // Focus distance
  aperture: 0.05, // Aperture size
  maxblur: 0.005, // Maximum blur strength
  width: width,
  height: height,
});

// Add parameters to GUI
gui.add(params, "focus", 0, 10).onChange((value) => {
  bokehPass.uniforms["focus"].value = value;
});
gui.add(params, "aperture", 0, 0.1).onChange((value) => {
  bokehPass.uniforms["aperture"].value = value;
});
gui.add(params, "maxblur", 0, 0.1).onChange((value) => {
  bokehPass.uniforms["maxblur"].value = value;
});
gui
  .add(params, "shape", { Circular: 1, Hexagon: 2, Octagon: 3 })
  .onChange((value) => {
    bokehPass.uniforms["shape"].value = value;
  });

composer2.addPass(renderPass2);

// composer.addPass(sobelEffect);
// composer.addPass(dotEffect);
composer2.addPass(sobelEffect);
// composer2.addPass(bloomPass);
composer2.addPass(bokehPass);

/*
loader.load('models/gltf/hp_opt.gltf', function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = new THREE.MeshStandardMaterial();
    }

  });
  scene.add(gltf.scene);
  gltf.scene.scale.set(18,18,18)
  gltf.scene.position.set(0, 1.3, 0);
  gltf.scene.rotation.set(0, Math.PI/32, 0);
  clearScene();
});


ear.scale.set(0.73,0.73,0.73)
    ear.position.set(-0.2, 1.27, 1.95);
    ear.rotation.set(0, Math.PI, 0);

*/

//////////////////////////////////////////////////
//// AUDIO loaders

let audioLoader = new THREE.AudioLoader();
let listener = new THREE.AudioListener();
camera.add(listener);

// SPEACH and MUSIC
const soundS = new THREE.Audio(listener);
const soundM = new THREE.Audio(listener);

// EVENT LISTERNERS
let checkPlay = document.getElementById("start");

let checkbox2 = document.querySelector(
  '.play-btn .containerP input[type="checkbox"]'
);

audioLoader.load(
  "audio/s2.mp3",
  function (audioBuffer) {
    soundM.setBuffer(audioBuffer);
    soundM.setVolume(1.0); // Adjust volume as needed
  },

  // onProgress callback function (optional)
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% music loaded");
  },
  // onError callback function (optional)
  function (err) {
    console.log("An error happened:", err);
  }
);

audioLoader.load(
  "audio/s1.mp3",
  function (audioBuffer) {
    soundS.setBuffer(audioBuffer);
    soundS.setVolume(0.8); // Adjust volume as needed
  },

  // onProgress callback function (optional)
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% speech loaded");
  },
  // onError callback function (optional)
  function (err) {
    console.log("An error happened:", err);
  }
);

var currentAudio = soundS;

// RADIO BUTTONS FOR SELECTING sound
document.getElementById("musicbtn").addEventListener("click", () => {
  soundS.isPlaying && soundS.stop();
  console.log("music playing");
  currentAudio = soundM;
  currentAudio.play();
  checkbox2.checked = false;
});

document.getElementById("speechbtn").addEventListener("click", () => {
  soundM.isPlaying && soundM.stop();
  console.log("speech playing");
  currentAudio = soundS;
  currentAudio.play();
  checkbox2.checked = false;
});

// PLAY BUTTON

checkPlay.addEventListener("click", function () {
  if (currentAudio.isPlaying) {
    // Play the current audio
    currentAudio.stop();
    console.log("function checking");
    currentAudio.currentTime = 0;
  } else {
    // Stop the current audio
    currentAudio.play();

    // checkbox2.checked = false;
  }
});

// Add an event listener to reset the button when the audio ends
currentAudio.onEnded = function () {
  checkbox2.checked = true;
  console.log("?????????");
};

soundS.onEnded = function () {
  checkbox2.checked = true;
  console.log("!!!!!!!!!!");
};

//////////////////////////////////////////////////
//// INTRO ANIMATION
let implantRotation = false;
function introAnimation() {
  new TWEEN.Tween(camera.position.set(0, 4, 2.7))
    .to({ x: 0, y: 2.4, z: 8.8 }, 3500)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
      document.querySelector(".header").classList.add("ended");
      document.querySelector(".hero>p").classList.add("ended");
    });

  implantRotation = true;
}

//////////////////////////////////////////////////
//// CLICK LISTENERS
let speech = document.getElementById("speechbtn");
let music = document.getElementById("musicbtn");

function handleMouseMoveR(event) {
  // Calculate rotation angles based on mouse movement
  const rotationX = (event.clientY / window.innerHeight - 0.5) * 0.5; // Adjust the factor as needed
  const rotationY =
    Math.PI + Math.PI / 4 + -(event.clientX / window.innerWidth - 0.5) * 0.5; // Adjust the factor as needed

  // Apply rotation using GSAP
  if (implantRotation) {
    gsap.to(imp.rotation, {
      x: rotationX,
      y: rotationY,
      duration: 0.5, // Adjust the duration as needed
      ease: "power2.out", // Adjust the easing function as needed
    });
  }
}

// Add the event listener to track mouse movement
document.addEventListener("mousemove", handleMouseMoveR);

// Function to stop rotation when button is pressed
function stopRotation() {
  // Remove the event listener
  document.removeEventListener("mousemove", handleMouseMoveR);
}

let intro = false;
function ImplantAnimation() {
  const tween = gsap.timeline({
    defaults: {
      duration: 1,
      ease: "power1.inOut",
      onUpdate: () => {
        // Update the object's position in the 3D scene
      },
      onComplete: () => {
        imp.rotation.set(0, Math.PI, 0);
        stopRotation();
      },
    },
  });

  tween
    .to(imp.position, { motionPath: flightPathUp, opacity: 1 })
    .to(imp.position, { motionPath: flightPathUp2, opacity: 1 })

    .to(imp.position, { motionPath: flightPathUp4, opacity: 0.1 });
}

//////////////////////////////////////////////////
//// click event listeners

document.getElementById("question").addEventListener("click", () => {
  document.getElementById("question").classList.add("active");
  document.getElementById("cochlearSound").classList.remove("active");
  document.getElementById("content").innerHTML =
    "How does it feel like hearing from a cochlear implant?";

  speech.style.visibility = "hidden";
  music.style.visibility = "hidden";

  currentAudio.isPlaying && currentAudio.stop();
  checkbox2.checked = true;

  removeSobelEffect();

  brainMaterial.wireframe = false;

  animateCamera({ x: -2.3, y: 1, z: 7.7 }, { y: -0.2 });
  // animateCamera({ x: 1.9, y: 2.7, z: 2.7 }, { y: 1.1 });
});

document.getElementById("cochlearSound").addEventListener("click", () => {
  document.getElementById("cochlearSound").classList.add("active");
  document.getElementById("question").classList.remove("active");
  document.getElementById("content").innerHTML =
    "How does it feel like hearing from a cochlear implant?";

  speech.style.visibility = "visible";
  music.style.visibility = "visible";

  document.getElementById("musicbtn").addEventListener("click", () => {
    if (!Sobel) {
      addSobelEffect();
      Sobel = true;
    }
  });
  document.getElementById("speechbtn").addEventListener("click", () => {
    if (Sobel) {
      removeSobelEffect();
      Sobel = false;
    }
  });

  if (!intro) {
    ImplantAnimation();
    intro = true;
  }

  animateCamera({ x: -1.7, y: 1.45, z: 12.6 }, { y: -0.1 });
  // animateCamera({ x: -0.9, y: 3.1, z: 2.6 }, { y: -0.1 });
});

document.getElementById("question2").addEventListener("click", () => {
  document.getElementById("question2").classList.add("active");
  document.getElementById("speech2").classList.remove("active");
  document.getElementById("music2").classList.remove("active");
  document.getElementById("content2").innerHTML =
    "Move your cursor to shift your attention!";
});

document.getElementById("speech2").addEventListener("click", () => {
  document.getElementById("speech2").classList.add("active");
  document.getElementById("question2").classList.remove("active");
  document.getElementById("music2").classList.remove("active");
  document.getElementById("content2").innerHTML = "testing";
});

document.getElementById("music2").addEventListener("click", () => {
  document.getElementById("music2").classList.add("active");
  document.getElementById("question2").classList.remove("active");
  document.getElementById("speech2").classList.remove("active");
  document.getElementById("content2").innerHTML = "testing";
});

////////////////////////////////////////////////////////////////////////
//// camera animation function
function animateCamera(position, rotation) {
  new TWEEN.Tween(camera2.position)
    .to(position, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
  new TWEEN.Tween(camera2.rotation)
    .to(rotation, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
}

// parallax config
const cursor = { x: 0, y: 0 };
const clock = new Clock();
let previousTime = 0;

////////////////////////////////////////////////////////////////////////
//// render loop function

function renderLoop() {
  TWEEN.update();

  stats.begin();

  if (secondContainer) {
    renderer2.render(scene, camera2);
  } else {
    renderer.render(scene, camera);
  }
  renderer3.render(scene, camera3);

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  const parallaxY = cursor.y;
  fillLight.position.y -=
    (parallaxY * 9 + fillLight.position.y - 2) * deltaTime;

  fillLight2.position.y -=
    (-parallaxY * 9 + fillLight2.position.y - 2) * deltaTime;

  const parallaxX = cursor.x;
  fillLight.position.x +=
    (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime;

  fillLight2.position.x +=
    (-parallaxX * 8 - fillLight2.position.x) * 2 * deltaTime;

  cameraGroup.position.z -=
    (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime;
  cameraGroup.position.x +=
    (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime;

  // cube.rotation.set(0,Math.PI * elapsedTime,0);

  sMat.uniforms.iTime.value = elapsedTime;

  // composer.render()
  // composer2.render() //render the scene with the composer
  //

  // scene.traverse(nonBloomed);
  // bloomComposer.render();
  // scene.traverse(restoreMaterial);
  // finalComposer.render();

  composer.render();
  composer2.render();
  distortPass.material.uniforms.jitterOffset.value += 0.01;
  // Render scene without bloom

  requestAnimationFrame(renderLoop);
  stats.end();
}

// }

// tick()

renderLoop();

/*
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onPointerDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rayCaster.setFromCamera(mouse, camera2);
const intersects = rayCaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const object = intersects[0].object;
        object.layers.toggle(BLOOM_SCENE);
    }

}
window.addEventListener('pointerdown', onPointerDown);
*/

// mouse move event listener
document.addEventListener(
  "mousemove",
  (event) => {
    event.preventDefault();

    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;

    handleCursor(event);
  },
  false
);

// intersection observer
const watchedSection = document.querySelector(".neurophones");

function obCallback(payload) {
  if (payload[0].intersectionRatio > 0.05) {
    secondContainer = true;
  } else {
    secondContainer = false;
  }
}

const ob = new IntersectionObserver(obCallback, {
  threshold: 0.05,
});

ob.observe(watchedSection);

//////////////////////////////////////////////////
//// MAGNETIC MENU
const btn = document.querySelectorAll("nav > .a");
const customCursor = document.querySelector(".cursor");

function update(e) {
  const span = this.querySelector("span");

  if (e.type === "mouseleave") {
    span.style.cssText = "";
  } else {
    const { offsetX: x, offsetY: y } = e,
      { offsetWidth: width, offsetHeight: height } = this,
      walk = 20,
      xWalk = (x / width) * (walk * 2) - walk,
      yWalk = (y / height) * (walk * 2) - walk;
    span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`;
  }
}

const handleCursor = (e) => {
  const x = e.clientX;
  const y = e.clientY;
  customCursor.style.cssText = `left: ${x}px; top: ${y}px;`;
};

btn.forEach((b) => b.addEventListener("mousemove", update));
btn.forEach((b) => b.addEventListener("mouseleave", update));

// // create a function to be called by GUI
const updateG = function () {
  var colorObj = new THREE.Color(params.color);
  var colorObj4 = new THREE.Color(params.color4);
  sunLight.color.set(colorObj);
  fillLight.color.set(colorObj4);
};

params.color4 = fillLight.color.getHex();

gui.add(camera2.position, "x").min(-20).max(20).step(0.1).name("Dir X pos");
gui.add(camera2.position, "y").min(-20).max(20).step(0.1).name("Dir Y pos");
gui.add(camera2.position, "z").min(-20).max(20).step(0.1).name("Dir Z pos");
gui.add(camera2.rotation, "x").step(0.1).name("Rot X pos");
gui.add(camera2.rotation, "y").step(0.1).name("Rot Y pos");
gui.add(camera2.rotation, "z").step(0.1).name("Rot Z pos");

// // gui.add(fillLight.position, 'x').min(-100).max(100).step(0.00001).name('Dir X pos')
// // gui.add(fillLight.position, 'y').min(0).max(100).step(0.00001).name('Dir Y pos')
// // gui.add(fillLight.position, 'z').min(-100).max(100).step(0.00001).name('Dir Z pos')

// gui.addColor(params,'color').name('Dir color').onChange(update)
gui.addColor(params, "color4").name("FillColor color").onChange(updateG);


