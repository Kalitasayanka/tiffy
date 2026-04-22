import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT_PER_SHAPE = 2000; 
const DAMPING = 0.95;
const MOUSE_FORCE = 0.07;
const RETURN_FORCE = 0.02;

const createParticles = () => {
  const positions = new Float32Array(COUNT_PER_SHAPE * 3);
  const originalPositions = new Float32Array(COUNT_PER_SHAPE * 3);
  const velocities = new Float32Array(COUNT_PER_SHAPE * 3);
  const colors = new Float32Array(COUNT_PER_SHAPE * 3);
  const scales = new Float32Array(COUNT_PER_SHAPE * 3);

  const themeColors = [
    new THREE.Color('#F47B20'), new THREE.Color('#CC5500'), new THREE.Color('#FF9F43'), 
    new THREE.Color('#E8500A'), new THREE.Color('#FFB347'), new THREE.Color('#E26D32'), 
  ];

  for (let i = 0; i < COUNT_PER_SHAPE; i++) {
    const x = (Math.random() - 0.5) * 60;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 2;
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    originalPositions[i * 3] = x; originalPositions[i * 3 + 1] = y; originalPositions[i * 3 + 2] = z;
    const scale = 0.05 + Math.random() * 0.15;
    scales[i * 3] = scale; scales[i * 3 + 1] = scale; scales[i * 3 + 2] = scale;
    const c = themeColors[Math.floor(Math.random() * themeColors.length)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  return { positions, originalPositions, velocities, colors, scales };
};

const FluidSwarm = ({ geometry, data }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport, pointer } = useThree();
  const smoothedMouse = useRef(new THREE.Vector2(0, 0));
  const [lastMouse] = useState(() => new THREE.Vector2());

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;
    const lerpFactor = 1 - Math.exp(-15 * delta);
    smoothedMouse.current.x += (targetX - smoothedMouse.current.x) * lerpFactor;
    smoothedMouse.current.y += (targetY - smoothedMouse.current.y) * lerpFactor;
    const mouseX = smoothedMouse.current.x;
    const mouseY = smoothedMouse.current.y;
    const mouseVelX = mouseX - lastMouse.x;
    const mouseVelY = mouseY - lastMouse.y;
    lastMouse.set(mouseX, mouseY);

    for (let i = 0; i < COUNT_PER_SHAPE; i++) {
      const idx3 = i * 3;
      let px = data.positions[idx3]; let py = data.positions[idx3 + 1]; let pz = data.positions[idx3 + 2];
      let vx = data.velocities[idx3]; let vy = data.velocities[idx3 + 1]; let vz = data.velocities[idx3 + 2];
      const dx = mouseX - px; const dy = mouseY - py;
      const distSq = dx * dx + dy * dy;
      if (distSq < 36) {
        const dist = Math.sqrt(distSq);
        const force = (6 - dist) / 6;
        vx -= (dx / dist) * force * MOUSE_FORCE; vy -= (dy / dist) * force * MOUSE_FORCE;
        vx += mouseVelX * force * 0.08; vy += mouseVelY * force * 0.08;
      }
      vx += (data.originalPositions[idx3] - px) * RETURN_FORCE;
      vy += (data.originalPositions[idx3 + 1] - py) * RETURN_FORCE;
      vx *= DAMPING; vy *= DAMPING; px += vx; py += vy;
      data.velocities[idx3] = vx; data.velocities[idx3 + 1] = vy;
      data.positions[idx3] = px; data.positions[idx3 + 1] = py;
      dummy.position.set(px, py, pz); dummy.scale.set(data.scales[idx3], data.scales[idx3], data.scales[idx3]); dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={meshRef} args={[geometry, null, COUNT_PER_SHAPE]}>
      <meshBasicMaterial><instancedBufferAttribute attach="attributes-color" args={[data.colors, 3]} /></meshBasicMaterial>
    </instancedMesh>
  );
};

const Particles = () => {
  const dataBox = useMemo(createParticles, []);
  const dataSphere = useMemo(createParticles, []);
  const geoBox = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const geoSphere = useMemo(() => new THREE.CircleGeometry(0.6, 16), []);
  return <group><FluidSwarm geometry={geoBox} data={dataBox} /><FluidSwarm geometry={geoSphere} data={dataSphere} /></group>;
};

const ParticleCTA = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '850px', backgroundColor: '#F8F8FC', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 40 }}><Particles /></Canvas>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '6rem', paddingBottom: '2rem', pointerEvents: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 2fr', gap: '2rem' }}>
          <div style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.04em' }}>tiffy</h3>
            <p style={{ lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 500 }}>Suite 2, 9 Marsh Street<br />Bristol, BS1 4AA<br />United Kingdom</p>
          </div>

          <div style={{ pointerEvents: 'auto', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingTop: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 500 }}>
              <p style={{ cursor: 'pointer' }}>Twitter / X</p><p style={{ cursor: 'pointer' }}>Instagram</p><p style={{ cursor: 'pointer' }}>LinkedIn</p>
            </div>
            <div><p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>General enquires</p><p style={{ fontSize: '1.05rem', fontWeight: 500, cursor: 'pointer' }}>hello@tiffy.io</p></div>
          </div>

          <div style={{ pointerEvents: 'auto' }}>
            <div style={{ background: 'rgba(248, 248, 252, 0.6)', backdropFilter: 'blur(12px)', padding: '3rem', borderRadius: 24, border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: 'var(--shadow-lg)' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '2rem' }}>Contact Us</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.8)', background: 'white', outline: 'none' }} required />
                <input type="email" placeholder="you@example.com" style={{ width: '100%', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.8)', background: 'white', outline: 'none' }} required />
                <textarea placeholder="Message..." rows="3" style={{ width: '100%', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.8)', background: 'white', outline: 'none', resize: 'none' }} required></textarea>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>

        <div style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(26, 29, 43, 0.1)', paddingTop: '1.5rem', color: 'var(--text-dark)', fontSize: '0.9rem', fontWeight: 500 }}>
          <p>©2026 TIFFY Creative Studio | labs.tiffy.io</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <p>Built with ❤️</p>
            <div onClick={() => window.scrollTo({top:0, behavior:'smooth'})} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--text-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>↑</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticleCTA;
