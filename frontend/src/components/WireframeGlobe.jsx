import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const WireframeGlobe = () => {
  const meshRef = useRef();

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.7} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial wireframe color="white" />
      </mesh>
    </Canvas>
  );
};

export default WireframeGlobe;
