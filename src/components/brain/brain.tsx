import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Tubes } from './brain-tubes.tsx';
import { BrainParticles } from './brain-particles.tsx';
import { data } from './data.ts';
// import Experience from '../Experience.tsx';
import { Brainmodel } from './Brainmodel.tsx';



function createBrainCurvesFromPaths(): THREE.CatmullRomCurve3[] {
  const paths = data.economics[0].paths;

  const brainCurves: THREE.CatmullRomCurve3[] = [];
  paths.forEach(path => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < path.length; i += 3) {
      points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
    }
    const tempCurve = new THREE.CatmullRomCurve3(points);
    brainCurves.push(tempCurve);
  });

  return brainCurves;
}

const curves = createBrainCurvesFromPaths();



export function Brain() {

  

  


  return (
    <Canvas camera={{ position: [0, 0, 0.2], near: 0.001, far: 5 }}>
      <color attach="background" args={['black']} />
      {/* <ambientLight /> */}
      {/* <pointLight position={[10, 10, 10]} /> */}
      {/* <pointLight decay={0} color='hotpink' intensity={2} position={[0, 0.8, 0.8]} /> */}
      {/* <pointLight decay={0} color={new THREE.Color(0x0000ff)} intensity={4} position={[0, -0.8, 0.8]} /> */}
      <directionalLight intensity={0.4} position={[0, 2, 2]} />
      <Tubes curves={curves} />
      <BrainParticles curves={curves} />
      <OrbitControls />
      <Brainmodel 
        scale={[0.16, 0.16, 0.14]}
        position={[0, -.01, 0]}
        rotation={[0, Math.PI/4, 0]}
      />
      

    </Canvas>
  );
}

useGLTF.preload('/models/brain.glb');