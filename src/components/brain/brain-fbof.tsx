// /*
// Auto-generated by: https://github.com/pmndrs/gltfjsx
// */

// // import React, { useRef, useEffect } from 'react'
// import React, { useRef, useEffect } from 'react';
// import { useGLTF } from '@react-three/drei';
// import { extend } from '@react-three/fiber';
// import { Color, Vector3, Scene, PerspectiveCamera, WebGLRenderer, Raycaster, Vector2, Object3D } from 'three';
// import { shaderMaterial } from '@react-three/drei';
// import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
// import gsap from 'gsap';

// const BrainfboMaterial = shaderMaterial(
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

// export function Brainmodel(props: JSX.IntrinsicElements['group']) {
//   const { nodes } = useGLTF('/models/brain2.glb');
//   const instancedMesh = useRef<InstancedUniformsMesh<null>>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const hover = useRef(false);
//   const colors = useRef<Color[]>([
//     new Color(0x963CBD),
//     new Color(0xFF6F61),
//     new Color(0xC5299B),
//     new Color(0xFEAE51),
//   ]);
//   const uniforms = useRef({ uHover: 0 });
//   const scene = useRef<Scene | null>(null);
//   const camera = useRef<PerspectiveCamera | null>(null);
//   const renderer = useRef<WebGLRenderer | null>(null);
//   const raycaster = useRef<Raycaster | null>(null);
//   const mouse = useRef<Vector2 | null>(null);
//   const point = useRef<Vector3 | null>(null);
//   const isMobile = useRef(false);

//   useEffect(() => {
//     if (instancedMesh.current && nodes.Brain_Model) {
//       const count = nodes.Brain_Model.geometry.attributes.position.count;

//       instancedMesh.current = new InstancedUniformsMesh(
//         nodes.Brain_Model.geometry,
//         BrainfboMaterial,
//         count
//       );

//       for (let i = 0; i < count; i++) {
//         const matrix = new THREE.Matrix4();
//         matrix.setPosition(i * 0.01, i * 0.01, 0);
//         instancedMesh.current.setMatrixAt(i, matrix);
//       }
//       instancedMesh.current.instanceMatrix.needsUpdate = true;
//     }
//   }, [nodes]);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const init = () => {
//       scene.current = new Scene();
//       createCamera();
//       createRenderer();
//       createRaycaster();
//       loadModel();
//     };

//     const createCamera = () => {
//       camera.current = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
//       camera.current.position.set(0, 0, 1.2);
//     };

//     const createRenderer = () => {
//       renderer.current = new WebGLRenderer({ alpha: true, antialias: true });
//       container.appendChild(renderer.current.domElement);
//       renderer.current.setSize(container.clientWidth, container.clientHeight);
//       renderer.current.setPixelRatio(window.devicePixelRatio);
//     };

//     const createRaycaster = () => {
//       mouse.current = new Vector2();
//       raycaster.current = new Raycaster();
//       point.current = new Vector3();
//     };

//     const loadModel = () => {
//       if (instancedMesh.current) {
//         scene.current?.add(instancedMesh.current);
//       }
//     };

//     const animate = () => {
//       if (renderer.current && camera.current && scene.current) {
//         renderer.current.render(scene.current, camera.current);
//       }
//       requestAnimationFrame(animate);
//     };

//     init();
//     animate();

//     return () => {
//       renderer.current?.dispose();
//     };
//   }, []);

//   return (
//     <group {...props} dispose={null}>
//       <mesh
//         castShadow
//         receiveShadow
//         geometry={nodes.Brain_Model.geometry}
//         material={BrainfboMaterial}
//         ref={instancedMesh}
//       />
//       <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
//     </group>
//   );
// }

// useGLTF.preload('/models/brain2.glb');



