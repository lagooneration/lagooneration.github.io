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
//// draco loader
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
//// scene
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
//// camera config
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
camera2.position.set(1.9, 2.7, 2.7);
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
//// lights
const sunLight = new DirectionalLight(0xabadaf, 0.05);
sunLight.position.set(-100, 0, -100);
scene.add(sunLight);

const fillLight = new PointLight(0xc3c3c3, 2, 3.2, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);





////////////////////////////////////////////////////////////////////////
//// GLTF MODELS 

loader.load('models/gltf/brain.gltf', function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = new THREE.MeshToonMaterial();
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



//////////////////////////////////////////////////
//// intro animation
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

  fillLight.color.set(0xff00f0)
  
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

  fillLight.color.set(0x3c3c3c)

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

  fillLight.color.set(0xff00f0)
  
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

  const parallaxX = cursor.x;
  fillLight.position.x +=
    (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime;

  cameraGroup.position.z -=
    (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime;
  cameraGroup.position.x +=
    (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime;

  requestAnimationFrame(renderLoop);
}

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



