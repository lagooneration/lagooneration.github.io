import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraParallaxProps {
  intensity?: number;
}

export const CameraParallax: React.FC<CameraParallaxProps> = ({ intensity = 0.005 }) => {
  const { camera, mouse } = useThree();
  const initialCameraPosition = useRef<Vector3>(new Vector3());

  useEffect(() => {
    initialCameraPosition.current.copy(camera.position);
    console.log('Initial camera position:', initialCameraPosition.current);
  }, [camera]);

  useFrame(() => {
    const targetX = (mouse.x * intensity) + initialCameraPosition.current.x;
    const targetY = (mouse.y * intensity) + initialCameraPosition.current.y;

    console.log('Mouse position:', mouse.x, mouse.y);
    console.log('Target position:', targetX, targetY);

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    console.log('New camera position:', camera.position.x, camera.position.y);

    camera.lookAt(0, 0, 0);
  });

  return null;
};