import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Tubes } from './brain-tubes.tsx';
import { BrainParticles } from './brain-particles.tsx';
import { data } from './data.ts';
// import Experience from '../Experience.tsx';
import { Brainmodel } from './Brainmodel.tsx';
import { Brainmodell } from './Brainmodell.tsx';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { OrbitControls } from '@react-three/drei';

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
    <Canvas camera={{ position: [0.1, .03, 0.2], near: 0.001, far: 3 }}>
      <color attach="background" args={['black']} />
      <ambientLight />
      {/* <pointLight position={[1, 1, 1]} /> */}
      {/* <pointLight decay={1} color='hotpink' intensity={4} position={[0, 0.8, 0.8]} /> */}
      {/* <pointLight decay={1} color={new THREE.Color(0x0000ff)} intensity={4} position={[0, 1.8, 0.8]} /> */}
      <directionalLight intensity={2.0} position={[0, 2, 2]}  />
      <Tubes curves={curves} />
      <BrainParticles curves={curves} />
      <OrbitControls />
      
      <Brainmodel 
        scale={[0.16, 0.19, 0.17]}
        position={[0, -0.01, 0]}
        rotation={[0, Math.PI/4, Math.PI/16]}
      />
      {/* <Brainmodell /> */}
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.04} bokehScale={1} height={400} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

    </Canvas>
  );
}

useGLTF.preload('/models/brain.glb');