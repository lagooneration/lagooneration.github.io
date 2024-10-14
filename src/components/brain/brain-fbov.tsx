// import { Color, Vector2, Vector3, Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Object3D, MathUtils, Raycaster, LoadingManager } from 'three';
// // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
// import gsap from 'gsap';
// import { extend} from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
// import { Brainmodell } from './Brainmodel.tsx';
// import React, { useRef } from 'react';
// import { useEffect } from 'react';



// const BrainVisualization: React.FC = () => {
//     const containerRef = useRef<HTMLDivElement | null>(null);
//     const hover = useRef(false);
//     const colors = useRef<Color[]>([
//       new Color(0x963CBD),
//       new Color(0xFF6F61),
//       new Color(0xC5299B),
//       new Color(0xFEAE51),
//     ]);
//     const uniforms = useRef({ uHover: 0 });
//     const scene = useRef<Scene | null>(null);
//     const camera = useRef<PerspectiveCamera | null>(null);
//     const renderer = useRef<WebGLRenderer | null>(null);
//     const instancedMesh = useRef<InstancedUniformsMesh | BrainfboMaterial>(null);
//     const brain = useRef<any>(null);
//     const raycaster = useRef<Raycaster | null>(null);
//     const mouse = useRef<Vector2 | null>(null);
//     const point = useRef<Vector3 | null>(null);
//     const isMobile = useRef(false);
  
//     useEffect(() => {
//       const container = containerRef.current;
//       if (!container) return;
  
//       const init = () => {
//         scene.current = new Scene();
//         createCamera();
//         createRenderer();
//         createRaycaster();
//         createLoader();
//         checkMobile();
  
//         loadModel().then(() => {
//           addListeners();
//           if (renderer.current && camera.current) {
//             renderer.current.setAnimationLoop(() => {
//               update();
//               renderScene();
//             });
//           }
//         });
//       };
  
//       const createCamera = () => {
//         if (!container) return;
//         camera.current = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
//         camera.current.position.set(0, 0, 1.2);
//       };
  
//       const createRenderer = () => {
//         if (!container) return;
//         renderer.current = new WebGLRenderer({
//           alpha: true,
//           antialias: window.devicePixelRatio === 1,
//         });
//         container.appendChild(renderer.current.domElement);
//         renderer.current.setSize(container.clientWidth, container.clientHeight);
//         renderer.current.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
//         renderer.current.physicallyCorrectLights = true;
//       };
  
//       const createRaycaster = () => {
//         mouse.current = new Vector2();
//         raycaster.current = new Raycaster();
//         point.current = new Vector3();
//       };
  
//       const createLoader = () => {
//         const loadingManager = new LoadingManager();
//         //const gltfLoader = new GLTFLoader(loadingManager);
//         loadingManager.onLoad = () => {
//           document.documentElement.classList.add('model-loaded');
//         };
//       };
  
//       const loadModel = () => {
//         return new Promise<void>((resolve) => {
//             <Brainmodell
//             scale={[0.16, 0.19, 0.17]}
//             position={[0, -0.01, 0]}
//             rotation={[0, Math.PI/4, Math.PI/16]} 
//             />
          
            
//             instancedMesh.current = new InstancedUniformsMesh(
//               geometry,
//               material,
//               brain.current.geometry.attributes.position.count
//             );
  
//             scene.current?.add(instancedMesh.current);
  
//             const dummy = new Object3D();
//             const positions = brain.current.geometry.attributes.position.array;
//             for (let i = 0; i < positions.length; i += 3) {
//               dummy.position.set(positions[i], positions[i + 1], positions[i + 2]);
//               dummy.updateMatrix();
//               instancedMesh.current?.setMatrixAt(i / 3, dummy.matrix);
//               instancedMesh.current?.setUniformAt('uRotation', i / 3, MathUtils.randFloat(-1, 1));
//               instancedMesh.current?.setUniformAt('uSize', i / 3, MathUtils.randFloat(0.3, 3));
//               const colorIndex = MathUtils.randInt(0, colors.current.length - 1);
//               instancedMesh.current?.setUniformAt('uColor', i / 3, colors.current[colorIndex]);
//             }
  
//             resolve();
//           });
//         });
//       };
  
//       const update = () => {
//         if (camera.current) {
//           camera.current.lookAt(0, 0, 0);
//           camera.current.position.z = isMobile.current ? 2.3 : 1.2;
//         }
//       };
  
//       const renderScene = () => {
//         if (renderer.current && camera.current && scene.current) {
//           renderer.current.render(scene.current, camera.current);
//         }
//       };
  
//       const addListeners = () => {
//         window.addEventListener('resize', onResize, { passive: true });
//         window.addEventListener('mousemove', onMousemove, { passive: true });
//       };
  
//       const removeListeners = () => {
//         window.removeEventListener('resize', onResize);
//         window.removeEventListener('mousemove', onMousemove);
//       };
  
//       const onResize = () => {
//         if (camera.current && container) {
//           camera.current.aspect = container.clientWidth / container.clientHeight;
//           camera.current.updateProjectionMatrix();
//           renderer.current?.setSize(container.clientWidth, container.clientHeight);
//           checkMobile();
//         }
//       };
  
//       const onMousemove = (e: MouseEvent) => {
//         if (!container || !mouse.current || !raycaster.current || !camera.current || !brain.current) return;
  
//         const x = (e.clientX / container.offsetWidth) * 2 - 1;
//         const y = -(e.clientY / container.offsetHeight) * 2 - 1;
//         mouse.current.set(x, y);
  
//         gsap.to(camera.current.position, {
//           x: () => x * 0.15,
//           y: () => y * 0.1,
//           duration: 0.5,
//         });
  
//         raycaster.current.setFromCamera(mouse.current, camera.current);
//         const intersects = raycaster.current.intersectObject(brain.current);
  
//         if (intersects.length === 0) {
//           if (hover.current) {
//             hover.current = false;
//             animateHoverUniform(0);
//           }
//         } else {
//           if (!hover.current) {
//             hover.current = true;
//             animateHoverUniform(1);
//           }
  
//           gsap.to(point.current, {
//             x: () => intersects[0]?.point.x || 0,
//             y: () => intersects[0]?.point.y || 0,
//             z: () => intersects[0]?.point.z || 0,
//             overwrite: true,
//             duration: 0.3,
//             onUpdate: () => {
//               for (let i = 0; i < instancedMesh.current!.count; i++) {
//                 instancedMesh.current?.setUniformAt('uPointer', i, point.current);
//               }
//             },
//           });
//         }
//       };
  
//       const animateHoverUniform = (value: number) => {
//         gsap.to(uniforms.current, {
//           uHover: value,
//           duration: 0.25,
//           onUpdate: () => {
//             for (let i = 0; i < instancedMesh.current!.count; i++) {
//               instancedMesh.current?.setUniformAt('uHover', i, uniforms.current.uHover);
//             }
//           },
//         });
//       };
  
//       const checkMobile = () => {
//         isMobile.current = window.innerWidth < 767;
//       };
  
//       init();
  
//       return () => {
//         renderer.current?.dispose();
//         removeListeners();
//       };
//     }, []);
  
//     return <div ref={containerRef} id="brain-visualization" style={{ width: '100%', height: '100%' }} />;
//   };
  
//   export default BrainVisualization;


/////////////////////////////////////////////////////////////////////


// export const BrainfboMaterial = shaderMaterial(
//     {
//       time: 0,
//       color: new Color(0.1, 0.3, 0.6),
//       mouse: new Vector3(0, 0, 0),
//     },
//     /*glsl*/ `
//       uniform vec3 uPointer;
//       uniform vec3 uColor;
//       uniform float uRotation;
//       uniform float uSize;
//       uniform float uHover;
  
//       varying vec3 vColor;
  
//       #define PI 3.14159265359
  
//       mat2 rotate(float angle) {
//         float s = sin(angle);
//         float c = cos(angle);
  
//         return mat2(c, -s, s, c);
//       }
  
//       void main() {
//         vec4 mvPosition = vec4(position, 1.0);
//         mvPosition = instanceMatrix * mvPosition;
//         float d = distance(uPointer, mvPosition.xyz);
//         float c = smoothstep(0.45, 0.1, d);
//         float scale = uSize + c * 8. * uHover;
//         vec3 pos = position;
//         pos *= scale;
//         pos.xz *= rotate(PI * c * uRotation + PI * uRotation * 0.43);
//         pos.xy *= rotate(PI * c * uRotation + PI * uRotation * 0.71);
//         mvPosition = instanceMatrix * vec4(pos, 1.0);
//         gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
//         vColor = uColor;
//       }
//     `,
//     /*glsl*/ `
//       varying vec3 vColor;
  
//       void main() {
//         gl_FragColor = vec4(vColor, 1.0);
//       }
//     `,
// );
// extend({ BrainfboMaterial });


import { shaderMaterial } from '@react-three/drei';
import { Color, Vector3 } from 'three';
import { extend } from '@react-three/fiber';
export const BrainFbov = shaderMaterial(
    {
      time: 0,
      color: new Color(0.1, 0.3, 0.6),
      mouse: new Vector3(0, 0, 0),
    },
    /*glsl*/ `
      uniform vec3 uPointer;
      uniform vec3 uColor;
      uniform float uRotation;
      uniform float uSize;
      uniform float uHover;
  
      varying vec3 vColor;
  
      #define PI 3.14159265359
  
      mat2 rotate(float angle) {
        float s = sin(angle);
        float c = cos(angle);
  
        return mat2(c, -s, s, c);
      }
  
      void main() {
        vec4 mvPosition = vec4(position, 1.0);
        mvPosition = instanceMatrix * mvPosition;
        float d = distance(uPointer, mvPosition.xyz);
        float c = smoothstep(0.45, 0.1, d);
        float scale = uSize + c * 8. * uHover;
        vec3 pos = position;
        pos *= scale;
        pos.xz *= rotate(PI * c * uRotation + PI * uRotation * 0.43);
        pos.xy *= rotate(PI * c * uRotation + PI * uRotation * 0.71);
        mvPosition = instanceMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
        vColor = uColor;
      }
    `,
    /*glsl*/ `
      varying vec3 vColor;
  
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
);
extend({ BrainFbov });