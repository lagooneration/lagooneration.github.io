import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"

import * as THREE from 'three'
import Lights from './Lights';
import Loader from './Loader';
// import IPhone from './IPhone.tsx';
import Neuroxones from './Neuroxones.tsx';
import { Suspense } from "react";
import { Brainmodel } from './brain/Brainmodel.tsx';

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }: any) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 5]} />

      <Lights />
      {/* <Brainmodel /> */}
      <OrbitControls 
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0 ,0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      /> 

      <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, -1 ,0]}>
        <Suspense fallback={<Loader />}>
          <Neuroxones
          scale={index === 1 ? [12, 12, 12] : [15, 15, 15]}
          item={item}
          size={size} 
          rotation={[0, Math.PI/1.9,0]}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default ModelView