import './main.css';
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
} from 'three';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin} from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin) 

import Stats from 'stats.js';

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)


////////////////////////////////////////////////////////////////////////
//// GSAP ANIMATION

/*

const textElements = document.querySelectorAll('.text');

gsap.set(textElements, { opacity: 0, y: 20 });

gsap.timeline({
  scrollTrigger: {
    trigger: '.text-container',
    start: 'top center'
  }
})

.to(textElements, {
  opacity: 1,
  y: 0,
  duration: 1,
  stagger: 0.3,
  ease: 'power3.out'
})

*/



var tl = gsap.timeline(),
  mySplitText = new SplitText("#content", { type: "words,chars" }),
  chars = mySplitText.chars; //an array of all the divs that wrap each character

gsap.set("#content", { perspective: 400 });

console.log(chars);
ScrollTrigger.create({
  trigger: '.neurophones-container',
  start: 'top center',
  onEnter: () => {
    tl.from(chars, {
      duration: 2,
      opacity: 0,
      scale: 0,
      y: 80,
      rotationX: 180,
      transformOrigin: "0% 50% -50",
      ease: "back",
      stagger: 0.01
    });
},
  onLeaveBack: () => {
    gsap.to(mySplitText, {
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }
});



////////////////////////////////////////////////////////////////////////
//// LOADING MANAGER

const ftsLoader = document.querySelector('.loader-roll');
const looadingCover = document.getElementById('loading-text-intro');
const loadingManager = new LoadingManager();

loadingManager.onLoad = function () {
  document.querySelector('.main-container').style.visibility = 'visible';
  document.querySelector("body").style.overflowY = 'auto'

  const yPosition = { y: 0 };

  new TWEEN.Tween(yPosition)
    .to({ y: 100 }, 900)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onUpdate(function () {
      looadingCover.style.setProperty(
        'transform',
        `translate( 0, ${yPosition.y}%)`
      );
    })
    .onComplete(function () {
      looadingCover.parentNode.removeChild(
        document.getElementById('loading-text-intro')
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
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);

const container = document.getElementById('canvas-container-hero');
const containerDetails = document.getElementById('canvas-container-neurophones');
const containerFooter = document.getElementById('canvas-container-plugin');

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
  powerPreference: 'high-performance',
});
renderer.autoClear = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(width, height);
renderer.gammaFactor = 2.2;
renderer.outputEncoding = sRGBEncoding;
container.appendChild(renderer.domElement);

const renderer2 = new WebGLRenderer({ antialias: false });
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer2.setSize(width, height);
renderer2.outputEncoding = sRGBEncoding;
containerDetails.appendChild(renderer2.domElement);

const renderer3 = new WebGLRenderer({ antialias: false });
renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer3.setSize(width, height);
renderer3.outputEncoding = sRGBEncoding;
containerFooter.appendChild(renderer3.domElement);


////////////////////////////////////////////////////////////////////////
//// CMAERA

const cameraGroup = new Group();
scene.add(cameraGroup);

const camera = new PerspectiveCamera(35, width / height, 1, 100);
camera.position.set(19, 1.54, -0.1);
cameraGroup.add(camera);

const camera2 = new PerspectiveCamera(
  35,
  containerDetails.clientWidth / containerDetails.clientHeight,
  1,
  100
);
camera2.position.set(4.9, 1.7, 5.7);
camera2.rotation.set(0, 1.1, 0);
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



////////////////////////////////////////////////////////////////////////
//// resize event listener

window.addEventListener('resize', () => {
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
});



////////////////////////////////////////////////////////////////////////
//// LIGHTS

// const sunLight = new DirectionalLight(0xabadaf, 0.05);
// sunLight.position.set(-100, 0, -100);
// scene.add(sunLight);

const amb = new THREE.AmbientLight(0xabadaf, 0.05);
scene.add(amb);

const fillLight = new PointLight(0xff00f0, 2, 3.2, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);

const fillLight2 = new PointLight(0x0f00ff, 2.7, 4, 3)
fillLight2.position.set(30,3,2.8)
scene.add(fillLight2)



////////////////////////////////////////////////////////////////////////
//// GLTF MODELS 

loader.load('models/gltf/brain.gltf', function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = new MeshPhongMaterial();
    }

  });
  scene.add(gltf.scene);
  gltf.scene.scale.set(1.2,1.2,1.2)
  gltf.scene.position.set(0, 1.13, 0);
  gltf.scene.rotation.set(0, Math.PI/32, 0);
  clearScene();
});

function clearScene() {
  oldMaterial.dispose();
  renderer.renderLists.dispose();
}

loader.load('models/gltf/imp.gltf', function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = new THREE.MeshNormalMaterial();
    }

  });
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.03,0.03,0.03)
  gltf.scene.position.set(0.6, 1.13, 2.2);
  gltf.scene.rotation.set(0, Math.PI/32, 0);
  clearScene();
});

//////////////////////////////////////////////////
//// AUDIO loaders

let audioLoader = new THREE.AudioLoader();
let listener = new THREE.AudioListener();
camera.add( listener );

// SPEACH and MUSIC
const soundS = new THREE.Audio( listener );
const soundM = new THREE.Audio( listener );

// EVENT LISTERNERS
let checkPlay = document.getElementById('start');
let checkStop = document.getElementById('stop');

let checkbox = document.querySelector('.containerR .radio-tile-group .input-container input[type="radio"]');
let checkbox2 = document.querySelector('.play-btn .containerP input[type="checkbox"]');

var musicR = document.getElementById('bike');
var speechR = document.getElementById('walk');


audioLoader.load('audio/s2.mp3', function (audioBuffer) {
        soundM.setBuffer(audioBuffer);
        soundM.setVolume(1.0); // Adjust volume as needed
    },

    // onProgress callback function (optional)
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% music loaded');
    },
    // onError callback function (optional)
    function (err) {
        console.log('An error happened:', err);
    }
);




audioLoader.load('audio/s1.mp3', function (audioBuffer) {
        soundS.setBuffer(audioBuffer);
        soundS.setVolume(0.8); // Adjust volume as needed
    },

    // onProgress callback function (optional)
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% speech loaded');
    },
    // onError callback function (optional)
    function (err) {
        console.log('An error happened:', err);
    },

);


var currentAudio = soundS;


// RADIO BUTTONS FOR SELECTING sound
document.getElementById('musicbtn').addEventListener('click', () => {
    
        soundS.isPlaying && soundS.stop();
	    console.log('music playing')
        currentAudio = soundM;
        currentAudio.play();
        checkbox2.checked = false;
    });
    

document.getElementById('speechbtn').addEventListener('click', () => {
	
		soundM.isPlaying && soundM.stop();
	    console.log('speech playing')
		currentAudio = soundS;
        currentAudio.play();
        checkbox2.checked = false;
});

// PLAY BUTTON 

checkPlay.addEventListener('click', function() {
    if (currentAudio.isPlaying) {
        // Play the current audio
        currentAudio.stop();
        console.log('function checking')
        currentAudio.currentTime = 0;


    } else {
        // Stop the current audio
        currentAudio.play();
        
        // checkbox2.checked = false;
    }
});


// Add an event listener to reset the button when the audio ends
        currentAudio.onEnded = function() {
            checkbox2.checked = true;
            console.log('?????????')
};

soundS.onEnded = function() {
            checkbox2.checked = true;
            console.log('!!!!!!!!!!')          
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
      document.querySelector('.header').classList.add('ended');
      document.querySelector('.hero>p').classList.add('ended');
    });
}


//////////////////////////////////////////////////
//// CLICK LISTENERS
let speech = document.getElementById('speechbtn')
let music = document.getElementById('musicbtn')


//////////////////////////////////////////////////
//// click event listeners
document.getElementById('question').addEventListener('click', () => {
  document.getElementById('question').classList.add('active');
  document.getElementById('neuroSound').classList.remove('active');
  document.getElementById('cochlearSound').classList.remove('active');
  document.getElementById('content').innerHTML =
    'How does it feel like hearing from a cochlear implant?';

  speech.style.visibility = 'hidden'
  music.style.visibility = 'hidden'    

  currentAudio.isPlaying && currentAudio.stop();
  checkbox2.checked = true;

  fillLight.color.set(0xff00f0)
  fillLight2.color.set(0x0f00ff)
  
  animateCamera({ x: 1.9, y: 2.7, z: 2.7 },{ y: 1.1 });
  // animateCamera({ x: 1.9, y: 2.7, z: 2.7 }, { y: 1.1 });
});

document.getElementById('cochlearSound').addEventListener('click', () => {
  document.getElementById('cochlearSound').classList.add('active');
  document.getElementById('question').classList.remove('active');
  document.getElementById('neuroSound').classList.remove('active');
  document.getElementById('content').innerHTML =
    'How does it feel like hearing from a cochlear implant?';

  speech.style.visibility = 'visible'
  music.style.visibility = 'visible'  

  document.getElementById('musicbtn').addEventListener('click', () => {
    fillLight.color.set(0x3c3c3c)
            fillLight2.color.set(0x3c3c3c)
    })
    document.getElementById('speechbtn').addEventListener('click', () => {
    fillLight.color.set(0xff00f0)
            fillLight2.color.set(0x0f00ff)
    })

  animateCamera({ x: -1.7, y: 2.2, z: 12.6 },{ y: -0.1 });
  // animateCamera({ x: -0.9, y: 3.1, z: 2.6 }, { y: -0.1 });
});

document.getElementById('neuroSound').addEventListener('click', () => {
  document.getElementById('neuroSound').classList.add('active');
  document.getElementById('question').classList.remove('active');
  document.getElementById('cochlearSound').classList.remove('active');
  document.getElementById('content').innerHTML =
    'Headphones';

  speech.style.visibility = 'visible'
  music.style.visibility = 'visible'

  currentAudio.isPlaying && currentAudio.stop();
  checkbox2.checked = true;

  fillLight.color.set(0xff00f0)
  fillLight2.color.set(0x0f00ff)
  
  animateCamera({ x: 9.0, y: 3.3, z: 0},{ y: 1.6});
  // animateCamera({ x: -0.4, y: 2.7, z: 1.9 }, { y: -0.6 });
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


  stats.begin();    

  TWEEN.update();

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
  ( (-parallaxY) *9 + fillLight2.position.y -2) * deltaTime;
  

  const parallaxX = cursor.x;
  fillLight.position.x +=
    (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime;

  fillLight2.position.x += 
  ((-parallaxX) *8 - fillLight2.position.x) * 2 * deltaTime;


  cameraGroup.position.z -=
    (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime;
  cameraGroup.position.x +=
    (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime;

  requestAnimationFrame(renderLoop);
  stats.end();
}

// }

// tick()



renderLoop();

// mouse move event listener
document.addEventListener(
  'mousemove',
  (event) => {
    event.preventDefault();

    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;

    handleCursor(event);
  },
  false
);

// intersection observer
const watchedSection = document.querySelector('.neurophones');

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
const btn = document.querySelectorAll('nav > .a')
const customCursor = document.querySelector('.cursor')

function update(e) {
    const span = this.querySelector('span')
    
    if(e.type === 'mouseleave') {
        span.style.cssText = ''
    } else {
        const { offsetX: x, offsetY: y } = e,{ offsetWidth: width, offsetHeight: height } = this,
        walk = 20, xWalk = (x / width) * (walk * 2) - walk, yWalk = (y / height) * (walk * 2) - walk
        span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
    }
}

const handleCursor = (e) => {
    const x = e.clientX
    const y =  e.clientY
    customCursor.style.cssText =`left: ${x}px; top: ${y}px;`
}

btn.forEach(b => b.addEventListener('mousemove', update))
btn.forEach(b => b.addEventListener('mouseleave', update))



