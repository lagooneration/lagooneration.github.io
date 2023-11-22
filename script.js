import * as THREE from 'three'
import * as dat from 'lil-gui'

import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AudioListener, Audio, AudioLoader, AudioAnalyser, Clock } from 'three';
import { Vector3 } from 'three';
import { createSculptureWithGeometry } from 'https://unpkg.com/shader-park-core/dist/shader-park-core.esm.js';
import { spCode } from '/audio/sp-code.js';
import { spCode2 } from '/audio/sp-code2.js';
import { LoadingManager } from 'three';

import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { LensDistortionShader } from './shaders/LensDistortionShader'


THREE.ColorManagement.enabled = false

// import img from './shaders/image/img.jpg';
// import { snoise } from 'glsl-noise';

import Stats from 'stats.js'




import BrainvertexShader from './shaders/brain/vertex.glsl'
import BrainfragmentShader from './shaders/brain/fragment.glsl'

import graphvertexShader from './shaders/graph/vertex.glsl'
import graphfragmentShader from './shaders/graph/fragment.glsl'
import sky from './img/sky8.jpg';

// Basic
const objectsDistance = 4;

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {}
parameters.BrainColor = '#ffffff';
parameters.showDots = true;
parameters.showLines = true;
parameters.minDistance = 70;
parameters.limitConnections = false;
parameters.maxConnections = 20;
parameters.particleCount = 140;

/**
 * Stats
 */
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() =>
//     {
//         material.color.set(parameters.materialColor)
//         particlesMaterial.color.set(parameters.materialColor)
//     })

/**
 * Scroll for Get Started Button
 */


document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector('.button');
  

  button.addEventListener('click', function () {
    window.scrollTo({ top: document.getElementById("section2").offsetTop, behavior: 'smooth' });
  });
});






      


// let titles = [...document.querySelectorAll('h2')];

// titles.forEach(title => {
//  let mySplitText = new SplitText(title, {type:"chars"});
//   gsap.to(mySplitText.chars, {duration: 0.5, opacity: 1, stagger: 0.1});
// });
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Overlay
 */
// const overlayMaterial = new THREE.ShaderMaterial({
//   transparent: true,
//   uniforms:{
//     uAlpha: {value: .5}
//   },

//   vertexShader: `
//       void main()
//       {
//           gl_Position = vec4(position, 1.0);
//       }
//   `,
//   fragmentShader: `
//       uniform float uAlpha;
//       void main()
//       {
//           gl_FragColor = vec4(0.0, 0.0, 0.0,uAlpha);
//       }
//   `
// })

// const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
// const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
// scene.add(overlay)



/**
 * Loaders
 */
// let progressRatio;
// const loadingBarElement = document.querySelector('.loading-bar')
// const loadingManager = new LoadingManager(
//   // Loaded
//   () =>
//   {   
//     gsap.delayedCall(0.5, () =>
//     {
//       gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

//       loadingBarElement.classList.add('ended')
//       loadingBarElement.style.transform = ''
//     })

   
      
//   },

//   // Progress
//   (itemUrl, itemsLoaded, itemsTotal) =>
//   {   
    
//         progressRatio = itemsLoaded / itemsTotal
//         loadingBarElement.style.transform = `scaleX(${progressRatio})`
//         console.log(progressRatio)
    
//       console.log('progress')
      
//   }
   
// )





/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const iconTexture = textureLoader.load('./img/d.jpg') ;
const bassT = textureLoader.load('./img/b.jpg') ;
const pianoT = textureLoader.load('./img/p.jpg') ;
// const brainTexture = textureLoader.load('/textures/btext.png');

const speakerM = textureLoader.load('textures/speakers/Speakers_m_Base_color.png');
const speakerN = textureLoader.load('textures/speakers/Speakers_m_Normal_GL.png');
const speakerR = textureLoader.load('textures/speakers/Speakers_m_Roughness.png');




/**
 * Materials
 */
const speakerMat = new THREE.MeshStandardMaterial({
  map: speakerM,
  normalMap: speakerN,
  roughnessMap: speakerR,
})

// const basicMaterial = new THREE.MeshBasicMaterial();




//////////////////////////////////////////////////////
/**
 * Brain Model
 */


let group;
let brain;
let initialYPosition = 0; // Initial Y position of the model
let initialRotation = 0; // Initial rotation of the model
const lerpFactor = 0.1; // Adjust the factor to control the animation speed


const brainMaterial = new THREE.ShaderMaterial({
   
  uniforms: {
    
    
    u_time: { type: "f", value: 0 },
    sky: {type: "t", value: new THREE.TextureLoader().load(sky)},
    resolution: { type: "v4" , value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader: BrainvertexShader,
  fragmentShader: BrainfragmentShader,
});




// Load the 3D model
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/brot.gltf', (gltf) => {
  
  
  
  brain = gltf.scene;
  
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = brainMaterial
    }});
  
  
  brain.scale.set(.34,.34,.34)
  // brain.position.set(0,-4,0);
  brain.position.set(0,-.2,0);
  brain.rotation.set(0,0,0)
  // brain.rotation.set(Math.PI/2,-Math.PI/2,-Math.PI/2)
});






/////////////////////////////////////////////////////////////////////////

//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
// const loader = new GLTFLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
gltfLoader.setDRACOLoader(dracoLoader)


/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
gltfLoader.load('/models/aaa.gltf', (gltf) => {
    
  gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
          sampler = new MeshSurfaceSampler(obj).build()
      }
  })

  transformMesh()
})











/**
 * Headphone Model
 */


let EEG;
// const gltfLoader2 = new GLTFLoader(loadingManager)
gltfLoader.load(
    '/models/hp.gltf',
    (gltf) =>
    { 
      EEG = gltf.scene;
      EEG.scale.set(7.2, 7.2, 7.2)
      
      gltf.scene.rotation.set(Math.PI/4,Math.PI/2,0)
      EEG.position.set(0 ,-12.85, 0)
        // gltf.scene.rotation.set(0,Math.PI/4, 0)
        
      
      // gltf.scene.traverse((child) => {
      //   if (child.isMesh) {
      //     child.material = new THREE.MeshNormalMaterial();
      //   }
      // });
      scene.add(EEG)
    }  

)


/**
 * Speakers
 */
// const gltfLoader3 = new GLTFLoader()
gltfLoader.load(
    '/models/speaker.gltf',
    (gltf) =>
    { 
      gltf.scene.scale.set(14, 14, 14)
      
      // gltf.scene.rotation.set(0,Math.PI/4,Math.PI/2)
        gltf.scene.position.set(-2 ,-5, 0)
        gltf.scene.rotation.set(0,Math.PI/18, 0)
        
      
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = speakerMat
        }
      });
      scene.add(gltf.scene)
    }  

)

// const gltfLoader4 = new GLTFLoader()
gltfLoader.load(
    '/models/speaker.gltf',
    (gltf) =>
    { 
      gltf.scene.scale.set(14, 14, 14)
      
      // gltf.scene.rotation.set(0,Math.PI/4,Math.PI/2)
        gltf.scene.position.set(2 ,-5, 0)
        gltf.scene.rotation.set(0,-Math.PI/18, 0)
        
      
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = speakerMat
        }
      });
      scene.add(gltf.scene)
    }  

)

// torus
const torusGeometry = new THREE.TorusGeometry( 0.5, 0.1, 16, 100 );
const torusMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
const torus = new THREE.Mesh( torusGeometry, torusMaterial );
torus.position.set(-1.78,-4.2,1)
torus.scale.set(0.7,0.7,0.7  )
scene.add( torus );

const torus2 = new THREE.Mesh( torusGeometry, torusMaterial );
torus2.position.set(1.78,-4.2,1)
torus2.scale.set(0.7,0.7,0.7  )
scene.add( torus2 );

const planeG = new THREE.PlaneGeometry( 3.6, 5, 1, 10 );
const planeM = new THREE.MeshBasicMaterial( {color: 0x000000} );
const plane = new THREE.Mesh( planeG, planeM );

plane.position.set(0,-13.4,-4)
scene.add( plane );



/**
 * Helper Guide
 */

// const size = 10;
// const divisions = 10;

// const gridHelper = new THREE.GridHelper( size, divisions );
// gridHelper.rotation.set(Math.PI/2,0,0)
// scene.add( gridHelper );






/**
 * Lights
 */
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);


const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

// const directionalLight2 = new THREE.SpotLight('#ffffff', 1)
// directionalLight2.position.set(-2, -1, 0)
// scene.add(directionalLight2)

// const directionalLight3 = new THREE.SpotLight('#ffffff', 1)
// directionalLight3.position.set(2, -8, 0)

// scene.add(directionalLight3)

const directionalLight4 = new THREE.PointLight('#f9b3f7', 14,8)
directionalLight4.position.set(3, -12.8, 2)



scene.add(directionalLight4)



const directionalLight5 = new THREE.PointLight('#ffffff', 15,8)
directionalLight5.position.set(1, -14, 3)


scene.add(directionalLight5)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Graph sizes
    graphMaterial.uniforms.v_resolution.value.x = sizes.width;
    graphMaterial.uniforms.v_resolution.value.y = sizes.height;
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)





// Animation clock for main function (tick)
let clock = new Clock();

/**
 * Audio Shader
 */

// Adding AudioListener to the camera with an Audio source
const listener = new AudioListener();
camera.add( listener );

const sound = new Audio( listener );

// Adding second AudioListener to the camera with an Audio source
const listener2 = new AudioListener();
camera.add( listener2 );

const sound2 = new Audio( listener2 );


// Main button to start both audios
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector('.mainbutton');
    button.innerHTML = "Loading Audio...";

    let isPlaying = false; // Variable to track whether the audio is currently playing
  

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new AudioLoader();

    audioLoader.load( './audio/Audio.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            // sound.setLoop(true);
            sound.setVolume(0.5);
            button.innerHTML = "Start the cocktail party ⏯︎";
        
    });



    // Shader Park Sculpture
    let Amesh = createSculptureWithGeometry(Ageometry, spCode(), () => ( {
        time: state.time,
        pointerDown: state.pointerDown,
        audio: state.audio,
        mouse: state.mouse,
        _scale : .1
    } ));
    Amesh.position.set(-1.8,-4.2,0.9 )
    Amesh.scale.set(0.16,0.16,0.16)
    scene.add(Amesh);

    /**
     * Audio 2
     */

    // load a sound and set it as the Audio object's buffer
    const audioLoader2 = new AudioLoader();
        audioLoader2.load( './audio/Audio2.mp3', function( buffer ) {
            sound2.setBuffer( buffer );
            // sound2.setLoop(true);
            sound2.setVolume(0.5);
            
            
    });

    // // // Create Shader Park Sculpture
    let A2mesh = createSculptureWithGeometry(A2geometry, spCode2(), () => ( {
        time: state2.time,
        pointerDown: state2.pointerDown,
        audio: state2.audio,
        mouse: state2.mouse,
        _scale : .1
    } ));
    A2mesh.position.set(1.8,-4.2,0.9)
    A2mesh.scale.set(0.16,0.16,0.16)
    scene.add(A2mesh);


    // Event listener to the button

    button.addEventListener('pointerdown', () => {
        if (isPlaying) {
            // Pause the audio
            sound.pause();
            sound2.pause();
            button.innerHTML = "Play Audio ⏯︎";
        } else {
            // Play the audio
            sound.play();
            sound2.play();
            button.innerHTML = "Pause Audio ⏸︎";

            // Event listeners to detect when audio completes
            sound.addEventListener('ended', handleAudioEnded);
            sound2.addEventListener('ended', handleAudioEnded);
        }

        // Toggle the isPlaying variable
        isPlaying = !isPlaying;
    
    }, false);

});

// Audios

// AudioAnalyser, passing in the sound and desired fftSize

const analyser = new AudioAnalyser( sound, 32 );

const analyser2 = new AudioAnalyser( sound2, 32 );

let state = {
  mouse : new Vector3(),
  currMouse : new Vector3(),
  pointerDown: 0.0,
  currPointerDown: 0.0,
  audio: 0.0,
  currAudio: 0.0,
  time: 0.0
}

let state2 = {
  mouse : new Vector3(),
  currMouse : new Vector3(),
  pointerDown: 0.0,
  currPointerDown: 0.0,
  audio: 0.0,
  currAudio: 0.0,
  time: 0.0
}

window.addEventListener( 'pointermove', (event) => {
  state.currMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	state.currMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  state2.currMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	state2.currMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}, false );

window.addEventListener( 'pointerdown', (event) => state.currPointerDown = 1.0, false );
window.addEventListener( 'pointerup', (event) => state.currPointerDown = 0.0, false );

window.addEventListener( 'pointerdown', (event) => state2.currPointerDown = 1.0, false );
window.addEventListener( 'pointerup', (event) => state2.currPointerDown = 0.0, false );


let Ageometry  = new THREE.SphereGeometry(2, 45, 45); 
let A2geometry  = new THREE.SphereGeometry(2, 45, 45);




// Function to handle the audio completion event
function handleAudioEnded() {
    // Reset the button text to "Play Audio"
    button.innerHTML = "Play Audio ⏯︎";
    
    // Remove event listeners to avoid memory leaks
    sound.removeEventListener('ended', handleAudioEnded);
    sound2.removeEventListener('ended', handleAudioEnded);
}



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



////////////////////// controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = false; // Disable controls by default


/////////////////////////////////////////////////////////////////////////
///// TRANSFORM MESH INTO POINTS
let vfx = new THREE.Points();
let sampler
let uniforms = { mousePos: {value: new THREE.Vector3()}}
let pointsGeometry = new THREE.BufferGeometry()
const cursor = {x:0, y:0}
const vertices = []
const tempPosition = new THREE.Vector3()
let braincolor = new THREE.Color(0xf9b3f7);

function transformMesh(){
  // Loop to sample a coordinate for each points
  for (let i = 0; i < 99000; i ++) {
      // Sample a random position in the model
      sampler.sample(tempPosition)
      // Push the coordinates of the sampled coordinates into the array
      vertices.push(tempPosition.x, tempPosition.y, tempPosition.z)
  }
  
  // Define all points positions from the previously created array
  pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

  // Define the matrial of the points
  const pointsMaterial = new THREE.PointsMaterial({
      color: braincolor,
      size: 0.04,
      blending: THREE.AdditiveBlending   ,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      sizeAttenuation: true,
      alphaMap: new THREE.TextureLoader().load('./particle-texture.jpg')
  })

  // Create the custom vertex shader injection
  pointsMaterial.onBeforeCompile = function(shader) {
      shader.uniforms.mousePos = uniforms.mousePos
      
      shader.vertexShader = `
        uniform vec3 mousePos;
        varying float vNormal;
        
        ${shader.vertexShader}`.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>   
          vec3 seg = position - mousePos;
          vec3 dir = normalize(seg);
          float dist = length(seg);
          if (dist < 1.5){
            float force = clamp(1.0 / (dist * dist), -0., .5);
            transformed += dir * force * 0.2;
            vNormal = force /0.5;
          }
        `
      )
  }

  // Create an instance of points based on the geometry & material
  vfx = new THREE.Points(pointsGeometry, pointsMaterial)

  vfx.rotation.set(Math.PI/2,0,Math.PI/2)
  vfx.position.set(0 ,-.2, 0)
  vfx.scale.set(1.5,1.5,1.5)



  // Add them into the main group
  scene.add(vfx)
  // group.add(vfx);
  controls.target = vfx.position;

  
}













// Icon audio
const listener3 = new AudioListener();
camera.add( listener3 );
const mainSound = new Audio( listener3 );

const drums = new AudioListener();
camera.add( drums );
const drumSound = new Audio( drums );

const bassS = new AudioListener();
camera.add( bassS );
const bassSound = new Audio( bassS );

const pianoS = new AudioListener();
camera.add( pianoS );
const pianoSound = new Audio( pianoS );

// Main button to start both audios
document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector('.audiobutton');
  button.innerHTML = "Loading Audio...";

  let isPlaying2 = false; // Variable to track whether the audio is currently playing

 
  // load a sound and set it as the Audio object's buffer

  const drumloader = new AudioLoader();
  drumloader.load('./audio/song/drums.mp3', function (buffer){
    drumSound.setBuffer(buffer);
    drumSound.setVolume(0.05);
  });

  const bassloader = new AudioLoader();
  bassloader.load('./audio/song/bass.mp3', function (buffer){
    bassSound.setBuffer(buffer);
    bassSound.setVolume(0.05);
  });

  const pianoloader = new AudioLoader();
  pianoloader.load('./audio/song/strings.mp3', function (buffer){
    pianoSound.setBuffer(buffer);
    pianoSound.setVolume(0.05);
  });


  const mainSloader = new AudioLoader();

  mainSloader.load( './audio/song/main_stem.mp3', function( buffer ) {
    mainSound.setBuffer( buffer );
          // sound.setLoop(true);
          mainSound.setVolume(0.8);
          button.innerHTML = "Play ⏯︎";
      
  });

  button.addEventListener('pointerdown', () => {
    if (isPlaying2) {
        // Pause the audio
        mainSound.pause();
        bassSound.pause();
        drumSound.pause();
        pianoSound.pause();
        
        button.innerHTML = "Play Audio ⏯︎";

        

    } else {
        // Play the audio
        mainSound.play();
        drumSound.play();
        bassSound.play();
        pianoSound.play();
        
        button.innerHTML = "Pause Audio ⏸︎";

        // Update button text
        // updateButtonText();
        // Add an event listener for the audio playback completion
    }

    // Toggle the isPlaying variable
    isPlaying2 = !isPlaying2;
    
}, false);

});









/**
 * Icons
 */
const iconGeometry = new THREE.CylinderGeometry(0.25,0.3,0.05);


// const iconGeometry = new THREE.CircleGeometry(0.5);
const drumM = new THREE.MeshBasicMaterial();
const drum = new THREE.Mesh(iconGeometry, drumM);
drum.position.set(-2,-7.6,0);
drum.rotation.set(Math.PI/2,Math.PI/2,0);

scene.add(drum);


const bassM = new THREE.MeshBasicMaterial();
const bass = new THREE.Mesh(iconGeometry, bassM);
bass.position.set(-2,-8.3,0);
bass.rotation.set(Math.PI/2,Math.PI/2,0);
scene.add(bass);

const pianoM = new THREE.MeshBasicMaterial();
const piano = new THREE.Mesh(iconGeometry, pianoM);
piano.position.set(-2,-9,0);
piano.rotation.set(Math.PI/2,Math.PI/2,0);
scene.add(piano);


// LOGO 
const cirle = new THREE.CircleGeometry(0.23);
const circleM = new THREE.MeshBasicMaterial({ map: iconTexture, side: THREE.DoubleSide});
const circle = new THREE.Mesh(cirle, circleM);
circle.position.set(-1.94,-7.63,0.2);
circle.scale.set(0.9,0.9,0.9);
scene.add(circle);

const bassCM =  new THREE.MeshBasicMaterial({ map: bassT, side: THREE.DoubleSide});
const bassC = new THREE.Mesh(cirle, bassCM);  
bassC.position.set(-1.94,-8.3,0.2);
bassC.scale.set(0.9,0.9,0.9);
scene.add(bassC);

const pianoCM = new THREE.MeshBasicMaterial({ map: pianoT, side: THREE.DoubleSide});
const pianoc = new THREE.Mesh(cirle, pianoCM);
pianoc.position.set(-1.94,-8.97,0.2);
pianoc.scale.set(0.8,0.8,0.8);
scene.add(pianoc);


/**
 * Graph Shader
 */
let a1 = 108.0;
let a2 = 108.0;
let a3 = 108.0;
const gc = new THREE.Color(0x000000);
const graphGeometry = new THREE.PlaneGeometry(1.6,1,1,10); // Adjust the size as needed
const graphMaterial = new THREE.ShaderMaterial({
    uniforms: {
      wavecolor: { value: gc},
      wavecolor2: {value: gc},
      wavecolor3: {value: gc},
      amp1: { value: a1 },
      amp2: { value: a2 },
      amp3: { value: a3 },
      g_time: { value: 0.1 },
      v_resolution: { value:  new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: graphvertexShader,
    fragmentShader: graphfragmentShader,
  });
const graph = new THREE.Mesh(graphGeometry, graphMaterial);
graph.position.set(2,-8.2,0)
scene.add(graph);


// initiate raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// Handle scroll and mouse move
document.addEventListener('scroll', onScroll);
  function onScroll() {
    // console.log(window.scrollY);
  }

document.addEventListener('mousemove', onMouseMove);
function onMouseMove(event) {
    // Normalize mouse position to a range between -1 and 1
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    
}



// Handle mouse click
document.addEventListener('click', onMouseClick);

function onMouseClick(event) {
    // Calculate normalized mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}







/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION USING TWEEN
function introAnimation() {
  controls.enabled = false //disable orbit controls to animate the camera
  
  new TWEEN.Tween(camera.position.set(0,-1,0 )).to({ // from camera position
      x: 0, //desired x position to go
      y: 0, //desired y position to go
      z: 6.1 //desired z position to go
  }, 3500) // time take to animate
  .easing(TWEEN.Easing.Quadratic.InOut).start() // define delay, easing
  .onComplete(function () { //on finish animation
      controls.enabled = false //enable orbit controls
      document.querySelector('#my-text').classList.add('ended')
      setOrbitControlsLimits() //enable controls limits
      TWEEN.remove(this) // remove the animation from memory
  })
}


// if(progressRatio === 1) {
// // call intro animation on start
// }

  introAnimation(); 


/////////////////////////////////////////////////////////////////////////
//// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits(){
  controls.enableDamping = true
  controls.dampingFactor = 0.04
  controls.minDistance = 0.5
  controls.maxDistance = 9
  controls.enableRotate = false
  controls.enableZoom = true
  controls.zoomSpeed = 0.5
  // controls.autoRotate = true
}

/////////////////////////////////////////////////////////////////////////
///// POST PROCESSING EFFECTS
let width = window.innerWidth
let height = window.innerHeight
const renderPass = new RenderPass( scene, camera )
const renderTarget = new THREE.WebGLRenderTarget( width, height,
  {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
  }
)

const composer = new EffectComposer(renderer, renderTarget)
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/////DISTORT PASS //////////////////////////////////////////////////////////////
const distortPass = new ShaderPass( LensDistortionShader )
distortPass.material.defines.CHROMA_SAMPLES = 4
distortPass.enabled = true
distortPass.material.uniforms.baseIor.value = 0.9310
distortPass.material.uniforms.bandOffset.value = 0.0009
distortPass.material.uniforms.jitterIntensity.value = 20.7
distortPass.material.defines.BAND_MODE = 2

composer.addPass( renderPass )
composer.addPass( distortPass )




/**
 * Cursor
 */
// const cursor = {}
// cursor.x = 0
// cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;

    /**
     * Color change
     */

    // Define colors for the extremes
    const blueColor = new THREE.Color(0x0000ff); // Blue
    const redColor = new THREE.Color(0xff0000); // Red

    // Interpolate between red and blue based on cursor.x
    const lerpedColor = new THREE.Color().lerpColors(redColor, blueColor, cursor.x + 0.5);
    // console.log(lerpedColor.getStyle());
    // Update the material color
    // pt.color.copy(lerpedColor);
    // wiremat.color.copy(lerpedColor);
    
    

  

    /**
     * Volume change
     */

    // Define maximum and minimum volumes
    const maxVolume = 0.5; // Adjust this value to set the maximum volume
    const minVolume = 0.1; // Adjust this value to set the minimum volume

    // Interpolate volumes based on cursor position
    const volume1 = THREE.MathUtils.lerp(minVolume, maxVolume, -cursor.x + 0.5);
    const volume2 = THREE.MathUtils.lerp(minVolume, maxVolume, cursor.x + 0.5);

    // Update the volume of each audio
    sound.setVolume(volume1);
    sound2.setVolume(volume2);
}) 


/**
 * Interative Text
 */

import { intext } from './text';
intext();

// import {Neurons} from './neurons';
// Neurons();

gui.addColor(parameters, 'BrainColor').onChange(() => {
    braincolor = new THREE.Color(parameters.BrainColor);
    vfx.material.color = braincolor;
    graphMaterial.uniforms.wavecolor.value = braincolor;

}
);



///////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////



  
  let container;
  const particlesData = [];
  
  let positions, colors;
  let particles;
  let pointCloud;
  let particlePositions;
  let linesMesh;
  
  const maxParticleCount = 1000;
  let particleCount = 500;
  const r = 800;
  const rHalf = r / 2;
  
  const effectController = {
      showDots: true,
      showLines: true,
      minDistance: 90,
      limitConnections: false,
      maxConnections: 20,
      particleCount: 220
  };
  
  
  
      // function initGUI() {
  
      //     const gui = new GUI();
  
          gui.add( effectController, 'showDots' ).onChange( function ( value ) {
  
              pointCloud.visible = value;
  
          } );
          gui.add( effectController, 'showLines' ).onChange( function ( value ) {
  
              linesMesh.visible = value;
  
          } );
          gui.add( effectController, 'minDistance', 10, 300 );
          gui.add( effectController, 'limitConnections' );
          gui.add( effectController, 'maxConnections', 0, 30, 1 );
          gui.add( effectController, 'particleCount', 0, maxParticleCount, 1 ).onChange( function ( value ) {
  
              particleCount = value;
              particles.setDrawRange( 0, particleCount );
  
          } );
  
      // }
  
  
          // initGUI();
  
          // container = document.getElementById( 'container' );
  
          // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
          // camera.position.z = 6;
  
          
  
          // scene = new THREE.Scene();
  
  
          group = new THREE.Group();
          scene.add( group );
          
          group.scale.set( .03, .0008, 0.03 );
          
          group.position.set(0,-14,-2);
  
          // const helper = new THREE.BoxHelper(  new THREE.Mesh( new THREE.BoxGeometry( r, r, r) ) );
          // helper.material.color.setHex( 0xff0000 );
          // helper.material.blending = THREE.AdditiveBlending;
          // helper.material.transparent = true;
          // group.add( helper );
  
          const segments = maxParticleCount * maxParticleCount;
  
          positions = new Float32Array( segments * 3 );
          colors = new Float32Array( segments * 3 );
  
          const pMaterial = new THREE.PointsMaterial( {
              color: 0x00ffff,
              size: 3,
              blending: THREE.AdditiveBlending,
              transparent: true,
              sizeAttenuation: false
          } );

          
            
          particles = new THREE.BufferGeometry();
          particlePositions = new Float32Array( maxParticleCount * 3 );
            
          for ( let i = 0; i < maxParticleCount; i ++ ) {
  
              const x = Math.random() * r - r / 2;
              const y = Math.random() * r - r / 2;
              const z = Math.random() * r - r / 2;
  
              particlePositions[ i * 3 ] = x;
              particlePositions[ i * 3 + 1 ] = y;
              particlePositions[ i * 3 + 2 ] = z;
  
              // add it to the geometry
              particlesData.push( {
                  velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
                  numConnections: 0
              } );
  
          }
  
          particles.setDrawRange( 0, particleCount );
          particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
          
          // create the particle system
          pointCloud = new THREE.Points( particles, pMaterial );
          // pointCloud.scale.set( .001, .001, 0.001 );
          group.add( pointCloud );
  
          const geometry = new THREE.BufferGeometry();
  
          geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
          geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );
          
          geometry.computeBoundingSphere();
  
          geometry.setDrawRange( 0, 0 );
  
          const material = new THREE.LineBasicMaterial( {
              vertexColors: true,
              color: 0x0000ff,
              blending: THREE.AdditiveBlending ,
              transparent: true
          } );
  
          linesMesh = new THREE.LineSegments( geometry, material );
          // linesMesh.scale.set( .001, .001, 0.001 );
          group.add( linesMesh );
  
          //
  
          // renderer = new THREE.WebGLRenderer( { antialias: true } );
          // renderer.setPixelRatio( window.devicePixelRatio );
          // renderer.setSize( window.innerWidth, window.innerHeight );
  
          // container.appendChild( renderer.domElement );
  
          //
  
          // stats = new Stats();
          // container.appendChild( stats.dom );
  
         
  
      
  
      // function onWindowResize() {
  
      //     camera.aspect = window.innerWidth / window.innerHeight;
      //     camera.updateProjectionMatrix();
  
      //     renderer.setSize( window.innerWidth, window.innerHeight );
  
      // }
  
      function animate() {
  
          let vertexpos = 0;
          let colorpos = 0;
          let numConnected = 0;
  
          for ( let i = 0; i < particleCount; i ++ )
              particlesData[ i ].numConnections = 0;
  
          for ( let i = 0; i < particleCount; i ++ ) {
  
              // get the particle
              const particleData = particlesData[ i ];
  
              particlePositions[ i * 3 ] += particleData.velocity.x*0.3;
              particlePositions[ i * 3 + 1 ] += particleData.velocity.y*0.3;
              particlePositions[ i * 3 + 2 ] += particleData.velocity.z*0.3;
  
              if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
                  particleData.velocity.y = - particleData.velocity.y;
  
              if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
                  particleData.velocity.x = - particleData.velocity.x;
  
              if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
                  particleData.velocity.z = - particleData.velocity.z;
  
              if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
                  continue;
  
              // Check collision
              for ( let j = i + 1; j < particleCount; j ++ ) {
  
                  const particleDataB = particlesData[ j ];
                  if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
                      continue;
  
                  const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
                  const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
                  const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
                  const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );
  
                  if ( dist < effectController.minDistance ) {
  
                      particleData.numConnections ++;
                      particleDataB.numConnections ++;
  
                      const alpha = 1.0 - dist / effectController.minDistance;
  
                      positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
                      positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
                      positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];
  
                      positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
                      positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
                      positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];
  
                      colors[ colorpos ++ ] = alpha;
                      colors[ colorpos ++ ] = alpha;
                      colors[ colorpos ++ ] = alpha;
  
                      colors[ colorpos ++ ] = alpha;
                      colors[ colorpos ++ ] = alpha;
                      colors[ colorpos ++ ] = alpha;
  
                      numConnected ++;
  
                  }
  
              }
  
          }
  
  
          linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
          linesMesh.geometry.attributes.position.needsUpdate = true;
          linesMesh.geometry.attributes.color.needsUpdate = true;
  
          pointCloud.geometry.attributes.position.needsUpdate = true;
  
          // requestAnimationFrame( animate );
  
          // // stats.update();
          // renderer();
  
      }


////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


/**
 * Animate
 */
// const clock = new THREE.Clock()
let previousTime = 0
composer.render()

const tick = () =>
{
    stats.begin()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    
    // Update controls
    // controls.update()

    brainMaterial.uniforms.u_time.value += 0.01;

    // Shade
    // pt.color.setRGB(red, 0, blue);

    // Update Graph material
    graphMaterial.uniforms.g_time.value += 0.007;

    
    // EEG.rotationZ = elapsedTime;

    TWEEN.update() // update animations

  //   // Update controls only when enabled
  //   if (controls.target == vfx.position) {
  //     controls.update();
  //     controls.enabled = false;
  // }
     
    // points.rotation.set(Math.PI/2,0,Math.PI/2*(elapsedTime*0.1))
    // m.uniforms.iTime.value = elapsedTime; 

    
    // Update position and rotation based on scroll
    if (vfx && brain ) {
    
    const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // Update position based on scroll
    const targetYPosition =   initialYPosition - scrollPercentage * 5; // Adjust the factor as needed
    vfx.position.y = THREE.MathUtils.lerp(vfx.position.y, targetYPosition, lerpFactor);
    brain.position.y = THREE.MathUtils.lerp(brain.position.y, targetYPosition, lerpFactor);
  

    // // Update rotation based on scroll
    const targetYRotation = initialRotation - scrollPercentage * 5; // Adjust the factor as needed
    vfx.rotation.y =  THREE.MathUtils.lerp(vfx.rotation.y, targetYRotation, lerpFactor);
    brain.rotation.y =  THREE.MathUtils.lerp(brain.rotation.y, targetYRotation, lerpFactor);
  

    // Rotate 90 degrees on y and x axis based on scroll
    // const rotationZ = (Math.PI/2 + scrollPercentage*4);
    const rotationY = -(Math.PI/2  * scrollPercentage)*4  ;
    const rotationX = (Math.PI/2  * scrollPercentage)* 5;
    const positionY = -(Math.PI  * scrollPercentage) * 5.2;
      
      let rotx = 0;
      if(scrollY>1000) {
        // rotx = -Math.log(scrollPercentage,2);
        rotx = Math.PI/2 ;
      }

      
      
        // setTimeout(() => {
        //   scene.add(brain)
        //   brain.material.opacity += elapsedTime * 0.1;

        // }, 3000);
        if(camera.position.z > 6){
          scene.add(brain)
        }
        
      
      
      
      
    vfx.rotation.set(rotationX - (rotx*scrollPercentage), rotationY   , -  (rotx  * scrollPercentage)*4.2);
    brain.rotation.set(rotationX - rotx, rotationY   , -  (rotx  * scrollPercentage)*4.2);

    vfx.position.set(0,positionY -.2 ,0);
    brain.position.set(0,positionY -.2 ,0);

    
    if(scrollY >= 2950){
      vfx.rotation.set(0,Math.PI/2 + (elapsedTime*.4),0);
      brain.rotation.set(0,Math.PI/2 + (elapsedTime*.4),0);
      vfx.position.set(0 ,-12.65, 0);
      brain.position.set(0 ,-12.65, 0);
    }
    
    }
    
    // points
    animate();


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


    

    // const time = Date.now() * 0.001;

    //     group.rotation.y = time * 0.1;
    
    // Icon Hover
    
    raycaster.setFromCamera( mouse, camera );

    const drumIntersect = raycaster.intersectObject(drum);
    const bassIntersect = raycaster.intersectObject(bass);
    const pianoIntersect = raycaster.intersectObject(piano);

    
    if (drumIntersect.length > 0) {
       
        drum.material.color.set(0xff00aa);
        graphMaterial.uniforms.wavecolor.value = new THREE.Color(0xff00aa);
        graphMaterial.uniforms.amp1.value = 128.0;
        drumSound.setVolume(0.8);
        mainSound.setVolume(0.2);

        document.getElementById('aad').innerHTML = 'Auditory Attention on: <span class="hover-word">Drums</span>';
        
    } else if (bassIntersect.length > 0){
        bassM.color.set(0x3e47bb);
        graphMaterial.uniforms.wavecolor2.value = new THREE.Color(0x000fff);
        graphMaterial.uniforms.amp2.value = 128.0;
        bassSound.setVolume(0.8);
        mainSound.setVolume(0.2);

        document.getElementById('aad').innerHTML = 'Auditory Attention on: <span class="hover-word2">Bass</span>';

    } else if (pianoIntersect.length > 0){
        pianoM.color.set(0x800080);
        graphMaterial.uniforms.wavecolor3.value = new THREE.Color(0xaa00ff);
        graphMaterial.uniforms.amp3.value = 128.0;
        pianoSound.setVolume(0.8);
        mainSound.setVolume(0.2);

        document.getElementById('aad').innerHTML = 'Auditory Attention on: <span class="hover-word3">Strings</span>';

    } else if (bassIntersect.length == 0 || drumIntersect.length == 0 || pianoIntersect.length == 0) {
      bassM.color.set(0xffffff);
      drumM.color.set(0xffffff);
      pianoM.color.set(0xffffff);
      graphMaterial.uniforms.wavecolor.value = new THREE.Color(0x000000);
      graphMaterial.uniforms.wavecolor2.value = new THREE.Color(0x000000);
      graphMaterial.uniforms.wavecolor3.value = new THREE.Color(0x000000);
      graphMaterial.uniforms.amp1.value = 76.0;
      graphMaterial.uniforms.amp2.value = 76.0;
      graphMaterial.uniforms.amp3.value = 76.0;
      
      mainSound.setVolume(0.8);
      drumSound.setVolume(0.05);
      bassSound.setVolume(0.05);
      pianoSound.setVolume(0.05);

      document.getElementById('aad').innerHTML = 'Auditory Attention Detection';
    }

  


    // if (bassIntersect.length > 0) {
       
    //   bass.material.color.set(0x00ffff);
      
    //   graphMaterial.uniforms.wavecolor.value = new THREE.Color(0x00ffff);
    //   console.log('Mouse Hovering over Cylinder');
    //   // console.log(graphMaterial.uniforms.wavecolor.value);
    //   } else if (bassIntersect.length == 0){
    //       bassM.color.set(0xffffff);
    //       // graphMaterial.uniforms.wavecolor.value = new THREE.Color(0x000000);
    //   }
    

    /**
     *  Update audio analyser 
     */
    
    state.time += deltaTime;
    state2.time += deltaTime;
    // controls.update();
    if(analyser) {
        state.currAudio += Math.pow((analyser.getFrequencyData()[2] / 255) * .81, 8) + clock.getDelta() * .5;
        state.audio = .2 * state.currAudio + .8 * state.audio;
    }
    state.pointerDown = .1 * state.currPointerDown + .9 * state.pointerDown;
    state.mouse.lerp(state.currMouse, .05 );

    if(analyser2) {
        state2.currAudio += Math.pow((analyser2.getFrequencyData()[2] / 255) * .81, 8) + clock.getDelta() * .5;
        state2.audio = .2 * state2.currAudio + .8 * state2.audio;
    }
    state2.pointerDown = .1 * state2.currPointerDown + .9 * state2.pointerDown;
    state2.mouse.lerp(state2.currMouse, .05 );


    // Render
    renderer.render(scene, camera)

    
    /////////////////////////////////////////////////////////////
    // composer.render() //render the scene with the composer
    distortPass.material.uniforms.jitterOffset.value += 0.01
    // m.uniforms.iTime.value = 0.1;
    
    // Update Tween
    // TWEEN.update();

    if(vfx.position.y && brain.position.y == -12.65) {
      EEG.rotation.set(0,Math.PI/2 + (elapsedTime*.4),0);
    }
    
    
    
    stats.end()
}

tick()


//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
  event.preventDefault()
  cursor.x = event.clientX / window.innerWidth -0.5
  cursor.y = event.clientY / window.innerHeight -0.5
  uniforms.mousePos.value.set(cursor.x, cursor.y, 0)
  // m.uniforms.mousePos.value.set(cursor.x, cursor.y)

}, false)