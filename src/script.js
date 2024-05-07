import "./main.css";
import {
    Clock,
    Scene,
    LoadingManager,
    WebGLRenderer,
    Group,
    PerspectiveCamera,
    PointLight,
    SpotLight,
    WebGLRenderTarget,
    TextureLoader,
    MeshToonMaterial,
    MeshBasicMaterial,
    MeshStandardMaterial,
    ShaderMaterial,
    AudioLoader,
    AudioListener,
    Audio,
    LinearFilter,
    RGBAFormat,
    NearestFilter,
    RepeatWrapping,
    AdditiveBlending,
} from "three";

import { animationGSAP, ImplantAnimation } from "./animation.js";
// import  from "./animation.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { LensDistortionShader } from "./shaders/LensDistortionShader.js";
import { SobelAnimation } from "./animation/SobelAnimation.js";


import { gsap } from "gsap";


import Fsynapsis from "./shaders/synapsisFragment.glsl";
import Vsynapsis from "./shaders/synapsisVertex.glsl";

import gradientMap from "../static/textures/fourTone.jpg";
import impTextureMap from "../static/textures/asdd.jpg"
import earTextureMap from "../static/textures/earTexture.png";

// GUI
// import GUI from "lil-gui";




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


////////////////////////////////////////////////////////////////////////
//// GLOBAL VARIABLES
let oldMaterial;
let secondContainer = false;
const cursor = { x: 0, y: 0 };
let width = container.clientWidth;
let height = container.clientHeight;
let iTime;
let brain;
let imp;
let isChecked = false;
let intro = false;
let implantRotation = false;

// parallax config
const clock = new Clock();
let previousTime = 0;


///// GSAP ANIMATION 
animationGSAP();

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
container.appendChild(renderer.domElement);


const renderer2 = new WebGLRenderer({ antialias: false });
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer2.setSize(width, height);
containerDetails.appendChild(renderer2.domElement);


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


/////////////////////////////////////////////////////////////////////////
///// POST PROCESSING EFFECTS

const renderPass = new RenderPass(scene, camera);
const renderPass2 = new RenderPass(scene, camera2);

const renderTarget = new WebGLRenderTarget(width, height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
});

const renderTarget2 = new WebGLRenderTarget(
    containerDetails.clientWidth,
    containerDetails.clientHeight,
    {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
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
composer2.addPass(renderPass2);
composer.addPass( distortPass )



////////////////////////////////////////////////////////////////////////
//// resize event listener

window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight;
    camera2.updateProjectionMatrix();


    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer2.setSize(
        containerDetails.clientWidth,
        containerDetails.clientHeight
    );
    

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));


     composer.setSize(container.clientWidth, container.clientHeight);
     composer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight);
});


////////////////////////////////////////////////////////////////////////
//// LIGHTS


const spotLight = new SpotLight(0xffffff, 2,0, .3,1);
spotLight.position.set(0.7, 2.1, 10);
scene.add(spotLight);

const fillLight = new PointLight(0xff00f0, 5, 5.2, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

const fillLight2 = new PointLight(0x0f00ff, 4.7, 4, 3);
fillLight2.position.set(30, 3, 1.8);
scene.add(fillLight2);



////////////////////////////////////////////////////////////////////////
//// TEXTURES
const textureLoader = new TextureLoader(loadingManager);
const fiveTone = textureLoader.load(gradientMap)
fiveTone.minFilter = NearestFilter
fiveTone.magFilter = NearestFilter

const imptext = textureLoader.load(impTextureMap);
imptext.flipY = false;

const skinTexture = textureLoader.load(earTextureMap);
skinTexture.wrapS = RepeatWrapping;
skinTexture.wrapT = RepeatWrapping;

////////////////////////////////////////////////////////////////////////
//// MATERIALS

const brainMaterial = new MeshToonMaterial({ color: 0x3c3c3c, gradientMap: fiveTone });
const impMaterials = new MeshBasicMaterial({ map: imptext });
const skinMaterial = new MeshStandardMaterial({ map: skinTexture });

const wireMat = new MeshBasicMaterial({
    color: 0x3c3c3c,
    wireframe: true,
});
wireMat.opacity = 0.5;

// BRAIN SHADER
const sMat = new ShaderMaterial({
    uniforms: {
        iTime: { value: iTime },
        iMouse: { value: cursor },
    },
    vertexShader: Vsynapsis,
    fragmentShader: Fsynapsis,
    // side: THREE.DoubleSide,
    transparent: true,
    depthTest: true,
    depthWrite: true,
    
    blending: AdditiveBlending,
    wireframe: true
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
    gltf.scene.scale.set(1.21, 1.21, 1.21);
    gltf.scene.position.set(0, 1.13, 0);
    gltf.scene.rotation.set(0, Math.PI / 32, 0);
    clearScene();
});


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




loader.load("models/gltf/implant_scene.glb", function (gltf) {
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            oldMaterial = obj.material;
            obj.material = impMaterials;
        }
    });
    imp = gltf.scene;
    scene.add(imp);
    imp.scale.set(1.33, 1.53, 0.93);
    imp.position.set(-0.2, 1.17, 9.2);
    clearScene();
});




loader.load("models/gltf/earMat.gltf", function (gltf) {
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            oldMaterial = obj.material;
            obj.material = skinMaterial;
        }
    });
    gltf.scene;
    scene.add(gltf.scene);
    gltf.scene.scale.set(1.1, 1.1, 1.1);
    gltf.scene.position.set(-0.7, 0.33, 0.27);
    clearScene();
});

loader.load("models/gltf/wireFace.gltf", function (gltf) {
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            oldMaterial = obj.material;
            obj.material = wireMat;
        }
    });

    scene.add(gltf.scene);
    gltf.scene.scale.set(1, 1, 0.9);
    gltf.scene.position.set(-0.3, 1.23, 0);
    clearScene();
});

function clearScene() {
    oldMaterial.dispose();
    renderer.renderLists.dispose();
}

//////////////////////////////////////////////////
//// POST PROCESSING

/// SOBEL

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

composer2.addPass(sobelEffect);



//////////////////////////////////////////////////
//// AUDIO loaders

let audioLoader = new AudioLoader(loadingManager);
let listener = new AudioListener();
camera2.add(listener);

// SPEACH and MUSIC
const soundS = new Audio(listener);
const soundM = new Audio(listener);

// EVENT LISTERNERS
let checkPlay = document.getElementById("start");

let checkbox2 = document.querySelector(
    '.play-btn .containerP input[type="checkbox"]'
);

audioLoader.load(
    "audio/s2.mp3",
    function (audioBuffer) {
        soundM.setBuffer(audioBuffer);
        soundM.setVolume(1.0); 
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% music loaded");
    },
    function (err) {
        console.log("An error happened:", err);
    }
);

audioLoader.load(
    "audio/s1.mp3",
    function (audioBuffer) {
        soundS.setBuffer(audioBuffer);
        soundS.setVolume(0.8);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% speech loaded");
    },
    // onError callback function (optional)
    function (err) {
        console.log("An error happened:", err);
    }
);

var currentAudio = soundS;


//////////////////////////////////////////////////
//// CLICK LISTENERS
const toggleButton = document.getElementById("checkbox_toggle");
const divElement = document.getElementById('cochlearSound');
divElement.style.animation = '1.2s cubic-bezier(0.8, 0, 0, 1) 0s infinite normal none running pulse';



// PLAY BUTTON

checkPlay.addEventListener("click", function () {
    if (currentAudio.isPlaying) {
        // Play the current audio
        currentAudio.stop();
        console.log("function checking");
        currentAudio.currentTime = 0;
        removeSobelEffect();
        divElement.style.animation = '1.2s cubic-bezier(0.8, 0, 0, 1) 0s infinite normal none running pulse';

    } else {
        // Stop the current audio
        currentAudio.play();
        divElement.style.animation = 'none';

        // checkbox2.checked = false;
    }
});

// Add an event listener to reset the button when the audio ends
currentAudio.onEnded = function () {
    checkbox2.checked = true;

};

soundS.onEnded = function () {
    checkbox2.checked = true;
};

//////////////////////////////////////////////////
//// INTRO ANIMATION

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
let radioBtns = document.getElementById("optionR");
let tooltip = document.getElementById("q1");
let tooltip2 = document.getElementById("q2");

document.getElementById('scrollButton').addEventListener('click', function () {
    // Get the link element
    var link = document.createElement('a');
    link.href = 'https://neurophones.netlify.app/'; // Replace with the URL you want to open in a new tab
    link.target = '_blank'; // Set the target attribute to open in a new tab

    // Simulate clicking the link to open it in a new tab
    link.click();
})

function handleMouseMoveR(event) {
    const rotationX = (event.clientY / window.innerHeight - 0.5) * 0.1; // Adjust the factor as needed
    const rotationY =
        Math.PI / 4 + -(event.clientX / window.innerWidth - 0.5) * 0.1; // Adjust the factor as needed

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


// ImplantAnimation();

//////////////////////////////////////////////////
//// click event listeners

document.getElementById("question").addEventListener("click", () => {
    document.getElementById("question").classList.add("active");
    document.getElementById("cochlearSound").classList.remove("active");
    document.getElementById("content").innerHTML =
        "How does it feel like hearing from a cochlear implant?";

    radioBtns.style.visibility = "hidden";
    currentAudio.isPlaying && currentAudio.stop();
    checkbox2.checked = true;
    removeSobelEffect();
       

    animateCamera({ x: -2.3, y: 1, z: 7.7 }, { y: -0.2 });
});

document.getElementById("cochlearSound").addEventListener("click", () => {
    document.getElementById("cochlearSound").classList.add("active");
    document.getElementById("question").classList.remove("active");
    tooltip.style.visibility = "hidden";
    tooltip2.style.visibility = "hidden";
    document.getElementById("content").innerHTML =
        "How does it feel like hearing from a cochlear implant?";

    radioBtns.style.visibility = "visible";
    

    // RADIO FOR MUSIC & SPEECH
    toggleButton.addEventListener('change', () => {
        
        isChecked = toggleButton.checked;
        
        if (isChecked) {
            console.log('Toggle switch is checked');
                if (!Sobel) {
                    addSobelEffect();
                    Sobel = true;
                }
            soundS.isPlaying && soundS.stop();
            console.log("music playing");
            // currentAudio.stop();
            currentAudio = soundM;
            currentAudio.play();
            checkbox2.checked = false;
            divElement.style.animation = 'none';


        } else {

            if (Sobel) {
                removeSobelEffect();
                Sobel = false;
            }
            soundM.isPlaying && soundM.stop();
            console.log("speech playing");
            // currentAudio.stop();
            currentAudio = soundS;
            currentAudio.play();
            checkbox2.checked = false;
            divElement.style.animation = 'none';
        }
    });

    if (!intro) {
        ImplantAnimation(imp);
        stopRotation();
        intro = true;
    }

    animateCamera({ x: -2.8, y: 1.45, z: 12.6 }, { y: -0.1 });
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




////////////////////////////////////////////////////////////////////////
//// render loop function

function renderLoop() {
  TWEEN.update();

  

  if (secondContainer) {
    renderer2.render(scene, camera2);
  } else {
    renderer.render(scene, camera);
  }
  

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



    sMat.uniforms.iTime.value = elapsedTime;


      composer.render();
      composer2.render();
      // distortPass.material.uniforms.jitterOffset.value += 0.01;
  // Render scene without bloom

  requestAnimationFrame(renderLoop);
  
}


renderLoop();




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

