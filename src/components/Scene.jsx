import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, PresentationControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const TiffinContainer = ({ position, color }) => {
  return (
    <group position={position}>
      {/* Main Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.4, 1.2, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Rim */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.1, 32]} />
        <meshStandardMaterial color="#ff8400ff" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Indentation Line */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.41, 1.41, 0.05, 32]} />
        <meshStandardMaterial color="#ff7402ff" />
      </mesh>
    </group>
  );
};

export const TiffinBox = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t / 2) * 0.2;
    groupRef.current.rotation.z = Math.sin(t / 3) * 0.05;
  });

  return (
    <PresentationControls
      global
      rotation={[0.13, 0.1, 0]}
      polar={[-0.4, 0.2]}
      azimuth={[-1, 0.75]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 400 }}
    >
      <Float rotationIntensity={0.4} floatIntensity={2} speed={1.5}>
        <group ref={groupRef} position={[0, 0, 0]}>
          {/* Tiffin Stack */}
          <TiffinContainer position={[0, -1.3, 0]} color="#2d3748" />
          <TiffinContainer position={[0, 0, 0]} color="#2d3748" />
          <TiffinContainer position={[0, 1.3, 0]} color="#2d3748" />

          {/* Top Lid */}
          <mesh castShadow receiveShadow position={[0, 2.05, 0]}>
            <cylinderGeometry args={[1.55, 1.5, 0.3, 32]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Handle */}
          <mesh castShadow position={[0, 2.5, 0]}>
            <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Side Clips */}
          <mesh castShadow position={[1.6, 0, 0]}>
            <boxGeometry args={[0.1, 4, 0.3]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh castShadow position={[-1.6, 0, 0]}>
            <boxGeometry args={[0.1, 4, 0.3]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </Float>
    </PresentationControls>
  );
};

// --- Food Particle Simulation ---
const FOOD_COUNT = 300; // per shape, so total 1200 chunks

const createFoodParticles = (colorHex) => {
  const positions = new Float32Array(FOOD_COUNT * 3);
  const originalPositions = new Float32Array(FOOD_COUNT * 3);
  const velocities = new Float32Array(FOOD_COUNT * 3);
  const scales = new Float32Array(FOOD_COUNT * 3);

  const baseColor = new THREE.Color(colorHex);

  for (let i = 0; i < FOOD_COUNT; i++) {
    // Spread in a large volume behind and around the tiffin box
    const x = (Math.random() - 0.5) * 40;
    const y = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 15 - 5; // offset back

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;

    velocities[i * 3] = 0;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = 0;

    const scale = 0.5 + Math.random() * 0.5;
    scales[i * 3] = scale;
    scales[i * 3 + 1] = scale;
    scales[i * 3 + 2] = scale;
  }

  return { positions, originalPositions, velocities, scales, color: baseColor };
};

const FoodSwarm = ({ geometry, data, materialProps }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport, pointer, camera } = useThree();
  const [lastMouse] = useState(() => new THREE.Vector2());

  useFrame(() => {
    if (!meshRef.current) return;

    // Convert pointer to world coordinates at z=0 approx
    const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    const mouseX = pos.x;
    const mouseY = pos.y;

    const mouseVelX = mouseX - lastMouse.x;
    const mouseVelY = mouseY - lastMouse.y;
    lastMouse.set(mouseX, mouseY);

    for (let i = 0; i < FOOD_COUNT; i++) {
      const idx3 = i * 3;
      let px = data.positions[idx3];
      let py = data.positions[idx3 + 1];
      let pz = data.positions[idx3 + 2];

      let vx = data.velocities[idx3];
      let vy = data.velocities[idx3 + 1];
      let vz = data.velocities[idx3 + 2];

      const ox = data.originalPositions[idx3];
      const oy = data.originalPositions[idx3 + 1];
      const oz = data.originalPositions[idx3 + 2];

      // Mouse repulsion
      const dx = mouseX - px;
      const dy = mouseY - py;
      const distSq = dx * dx + dy * dy;

      if (distSq < 25) {
        const dist = Math.sqrt(distSq);
        const force = (5 - dist) / 5;

        vx -= (dx / dist) * force * 0.15;
        vy -= (dy / dist) * force * 0.15;

        vx += mouseVelX * force * 0.2;
        vy += mouseVelY * force * 0.2;

        vz += force * 0.1;
      }

      // Spring back to original position
      vx += (ox - px) * 0.02;
      vy += (oy - py) * 0.02;
      vz += (oz - pz) * 0.02;

      // Small drift
      const time = performance.now() * 0.001;
      vx += Math.sin(time + px) * 0.003;
      vy += Math.cos(time + py) * 0.003;

      vx *= 0.94;
      vy *= 0.94;
      vz *= 0.94;

      px += vx;
      py += vy;
      pz += vz;

      data.velocities[idx3] = vx;
      data.velocities[idx3 + 1] = vy;
      data.velocities[idx3 + 2] = vz;

      data.positions[idx3] = px;
      data.positions[idx3 + 1] = py;
      data.positions[idx3 + 2] = pz;

      dummy.position.set(px, py, pz);
      dummy.rotation.x += vx * 0.2;
      dummy.rotation.y += vy * 0.2;

      const s = data.scales[idx3];
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, FOOD_COUNT]} castShadow receiveShadow>
      <meshStandardMaterial color={data.color} {...materialProps} />
    </instancedMesh>
  );
};

const FoodParticles = () => {
  // Generate data
  const dataPeas = useMemo(() => createFoodParticles('#4ade80'), []); // Green Peas
  const dataCarrots = useMemo(() => createFoodParticles('#fb923c'), []); // Orange Carrots
  const dataCheese = useMemo(() => createFoodParticles('#fde047'), []); // Yellow Cheese
  const dataMeatball = useMemo(() => createFoodParticles('#78350f'), []); // Brown Meatballs

  // Geometries
  const geoPea = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []);
  const geoCarrot = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), []);
  const geoCheese = useMemo(() => new THREE.BoxGeometry(0.3, 0.3, 0.3), []);
  const geoMeatball = useMemo(() => new THREE.SphereGeometry(0.25, 8, 8), []); // low poly for texture

  return (
    <group position={[0, 0, -2]}>
      <FoodSwarm geometry={geoPea} data={dataPeas} materialProps={{ roughness: 0.3, metalness: 0.1 }} />
      <FoodSwarm geometry={geoCarrot} data={dataCarrots} materialProps={{ roughness: 0.8 }} />
      <FoodSwarm geometry={geoCheese} data={dataCheese} materialProps={{ roughness: 0.5 }} />
      <FoodSwarm geometry={geoMeatball} data={dataMeatball} materialProps={{ roughness: 1.0 }} />
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Environment preset="city" />

      <FoodParticles />
      <TiffinBox />

      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={15} blur={2} far={4} />
    </>
  );
};

export default Scene;
