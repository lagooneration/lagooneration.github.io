import "./main.css";
import {
    Clock,
    Scene,
    LoadingManager,
    WebGLRenderer,
    Group,
    PerspectiveCamera,
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

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader.js";
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader.js";
import { SobelAnimation } from "./animation/SobelAnimation.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"; 

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, MorphSVGPlugin);

import Fsynapsis from "./shaders/synapsisFragment.glsl";
import Vsynapsis from "./shaders/synapsisVertex.glsl";




// GUI
import GUI from "lil-gui";




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



///////////////////////////////////////////////////////////////////////
// IMAGE SEQUENCER

const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

// if view port is smaller than 600px, change canvas size
if (window.innerWidth < 600) {
    canvas.width = 600;
    canvas.height = 400;
}

const frameCount = 75;
const currentFrame = (index) =>
    `../hp_sequence/${(
        index + 1
    )
        .toString()
        .padStart(4, "0")}.jpg`;

const images = [];
const airpods = {
    frame: 0
};

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

gsap.to(airpods, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".canvas-containerV",
        start: "top top",
        end: "+=3500",
        pin: true,
        scrub: 0.5
    },
    onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
});

images[0].onload = render;

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[airpods.frame], 0, 0);
}

////////////////////////////////////////////////////////////////////////
//// GSAP ANIMATION

// box animation
//gsap.to(".box", {
//    scrollTrigger: ".box",
//    rotation: 360,
//    x: '30vw',
//    y: '-20vw',
//    yPercent: -10,
//    scale: 1.4,
//    duration: 1, 
//});


//// COCHLEAR SOUND TEXT
var tl = gsap.timeline(),
    mySplitText = new SplitText("#content", { type: "words,chars" }),
    chars = mySplitText.chars; //an array of all the divs that wrap each character

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

//// Video text

/////////////////////////////
//// HORIZONTAL SCROLL

const section = document.querySelector('.demo-text'); // Replace '#neurophones' with the specific section ID you want to target
const w = document.querySelector('.wrapper');
const xEnd = (w.scrollWidth - section.offsetWidth) * -1;
gsap.fromTo(w, { x: '100%' }, {
    x: xEnd,
    scrollTrigger: {
        trigger: section,
        scrub: 0.5
    }
});

/////////////////////////////////////
//// OPACITY SCROLL

gsap.to(".hero__headline", {
    scrollTrigger: {
        trigger: ".hero__content",
        scrub: true,
        pin: true,
        start: "top 38%",
        end: "bottom -10%",
        toggleClass: "active",
        ease: "power2"
    }
});





// DEMO BUTTON VISIBILITY

const scrollButton = document.getElementById('scrollButton');

// Calculate the scroll percentage of the section
function getScrollPercentage(section) {
    const scrollPosition = window.scrollY;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const distance = scrollPosition - sectionTop;
    const percentage = distance / sectionHeight * 100;

    return Math.max(0, Math.min(100, percentage));
}

// Show or hide the button based on scroll percentage
function updateButtonVisibility() {
    const scrollSection = document.getElementById('main-c');
    const scrollPercentage = getScrollPercentage(scrollSection);
    
    if (scrollPercentage >= 60) { // Adjust this value as needed
        // Show the button with animation
        gsap.to(scrollButton, { duration: 0.5, opacity: 1,scale:1, y: 0, ease: 'power2.out' });
    } else {
        // Hide the button with animation
        gsap.to(scrollButton, { duration: 0.5, opacity: 0, scale: 0, y: 50, ease: 'power2.in' });
    }
}

// Update button visibility when scrolling
window.addEventListener('scroll', updateButtonVisibility);

// Update button visibility on page load
updateButtonVisibility();


 

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


const spotLight = new THREE.SpotLight(0xffffff, 2,0, .3,1);
spotLight.position.set(0.7, 2.1, 10);
scene.add(spotLight);

const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(25, 2, 0);
scene.add(DirectionalLight);

const fillLight = new PointLight(0xff00f0, 5, 5.2, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

const fillLight2 = new PointLight(0x0f00ff, 4.7, 4, 3);
fillLight2.position.set(30, 3, 1.8);
scene.add(fillLight2);



////////////////////////////////////////////////////////////////////////
//// TEXTURES
const textureLoader = new THREE.TextureLoader(loadingManager);
const fiveTone = textureLoader.load('textures/fourTone.jpg')
fiveTone.minFilter = THREE.NearestFilter
fiveTone.magFilter = THREE.NearestFilter

const imptext = textureLoader.load("textures/asdd.jpg");
imptext.flipY = false;

const skinTexture = textureLoader.load(
    "textures/earTexture.png"
);
skinTexture.wrapS = THREE.RepeatWrapping;
skinTexture.wrapT = THREE.RepeatWrapping;

////////////////////////////////////////////////////////////////////////
//// MATERIALS

const brainMaterial = new THREE.MeshToonMaterial({ color: 0x3c3c3c, gradientMap: fiveTone });
const impMaterials = new THREE.MeshBasicMaterial({ map: imptext, side: THREE.DoubleSide });
const skinMaterial = new THREE.MeshStandardMaterial({ map: skinTexture });

const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3c3c3c,
    wireframe: true,
});
wireMat.opacity = 0.5;

// BRAIN SHADER
const sMat = new THREE.ShaderMaterial({
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
    
    blending: THREE.AdditiveBlending,
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


function clearScene() {
    oldMaterial.dispose();
    renderer.renderLists.dispose();
}


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
    path: [{ x: -0.49, y: 0.85, z: 0.6 }],
};


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

//////////////////////////////////////////////////
//// POST PROCESSING

/// BLOOM

const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight),1, 0.2, 0.1);
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



// composer.addPass(sobelEffect);
// composer.addPass(dotEffect);
composer2.addPass(sobelEffect);
// composer.addPass(bloomPass);
// composer2.addPass(bokehPass);
// composer.addPass(bokehPass);



//////////////////////////////////////////////////
//// AUDIO loaders

let audioLoader = new THREE.AudioLoader(loadingManager);
let listener = new THREE.AudioListener();
camera2.add(listener);

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


function ImplantAnimation() {
    const tween = gsap.timeline({
        defaults: {
            duration: 1,
            ease: "power1.inOut",
            onUpdate: () => {
                // Update the object's position in the 3D scene
            },
            onComplete: () => {
                imp.rotation.set(0, 0, 0);
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
            currentAudio = soundS;
            currentAudio.play();
            checkbox2.checked = false;
            divElement.style.animation = 'none';
        }
    });

    if (!intro) {
        ImplantAnimation();
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

