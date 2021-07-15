import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import { Environment, OrbitControls } from "@react-three/drei";

import Player from "@Genesys/rtf-fps-player";

export default {
  component: Player,
  title: "3D/FPS Player",
};

function Scene() {
  // return null
  return (
    <Player useFrame={useFrame} useThree={useThree} useSphere={useSphere} />
  );
}

function Plane() {
  const [ref] = usePlane(() => ({ mass: 1, type: "Static" }));

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  );
}

export const Default = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Environment background preset="city" />

        <Physics>
          <Plane />
          <Scene />
        </Physics>
      </Suspense>

      {false && <OrbitControls />}
    </Canvas>
  );
};
