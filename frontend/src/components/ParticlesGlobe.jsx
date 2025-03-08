import { Canvas } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const ParticlesGlobe = () => {
  const particles = useMemo(() => {
    const points = [];
    const radius = 2;
    const density = 3000;

    for (let i = 0; i < density; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.7} />
      <Points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(particles.flatMap((p) => [p.x, p.y, p.z]))}
            itemSize={3}
            count={particles.length}
          />
        </bufferGeometry>
        <PointMaterial size={0.03} color="#00ccff" transparent opacity={0.8} />
      </Points>
    </Canvas>
  );
};

export default ParticlesGlobe;
