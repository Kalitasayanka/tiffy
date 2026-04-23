import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Responsive particle parameters
const useResponsiveParticleParams = () => {
  const [params, setParams] = useState({
    countPerShape: 1500,
    spreadX: 60,
    spreadY: 40,
    cameraFov: 40,
    cameraZ: 15,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setParams({
          countPerShape: 800,
          spreadX: 30,
          spreadY: 25,
          cameraFov: 50,
          cameraZ: 12,
        });
      } else if (width < 1024) {
        setParams({
          countPerShape: 1200,
          spreadX: 45,
          spreadY: 35,
          cameraFov: 45,
          cameraZ: 14,
        });
      } else {
        setParams({
          countPerShape: 2000,
          spreadX: 60,
          spreadY: 40,
          cameraFov: 40,
          cameraZ: 15,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return params;
};

const DAMPING = 0.95;
const MOUSE_FORCE = 0.07;
const RETURN_FORCE = 0.02;

const createParticles = (countPerShape, spreadX, spreadY) => {
  const positions = new Float32Array(countPerShape * 3);
  const originalPositions = new Float32Array(countPerShape * 3);
  const velocities = new Float32Array(countPerShape * 3);
  const colors = new Float32Array(countPerShape * 3);
  const scales = new Float32Array(countPerShape * 3);

  const themeColors = [
    new THREE.Color('#F47B20'), new THREE.Color('#CC5500'), new THREE.Color('#FF9F43'),
    new THREE.Color('#E8500A'), new THREE.Color('#FFB347'), new THREE.Color('#E26D32'),
  ];

  for (let i = 0; i < countPerShape; i++) {
    const x = (Math.random() - 0.5) * spreadX;
    const y = (Math.random() - 0.5) * spreadY;
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

const FluidSwarm = ({ geometry, data, count }) => {
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

    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;
      let px = data.positions[idx3]; let py = data.positions[idx3 + 1]; let pz = data.positions[idx3 + 2];
      let vx = data.velocities[idx3]; let vy = data.velocities[idx3 + 1]; let vz = data.velocities[idx3 + 2];
      const dx = mouseX - px; const dy = mouseY - py;
      const distSq = dx * dx + dy * dy;
      if (distSq < 16) {
        const dist = Math.sqrt(distSq);
        const force = (4 - dist) / 4;
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
    <instancedMesh ref={meshRef} args={[geometry, null, count]}>
      <meshBasicMaterial><instancedBufferAttribute attach="attributes-color" args={[data.colors, 3]} /></meshBasicMaterial>
    </instancedMesh>
  );
};

const Particles = () => {
  const params = useResponsiveParticleParams();
  const dataBox = useMemo(() => createParticles(params.countPerShape, params.spreadX, params.spreadY), [params]);
  const dataSphere = useMemo(() => createParticles(params.countPerShape, params.spreadX, params.spreadY), [params]);
  const geoBox = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const geoSphere = useMemo(() => new THREE.CircleGeometry(0.6, 16), []);
  return (
    <group>
      <FluidSwarm geometry={geoBox} data={dataBox} count={params.countPerShape} />
      <FluidSwarm geometry={geoSphere} data={dataSphere} count={params.countPerShape} />
    </group>
  );
};

const ParticleCTA = () => {
  const params = useResponsiveParticleParams();
  const [minHeight, setMinHeight] = useState('850px');
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setMinHeight('600px');
      } else if (width < 1024) {
        setMinHeight('750px');
      } else {
        setMinHeight('850px');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={sectionRef} className="position-relative w-100 overflow-hidden" style={{ minHeight, backgroundColor: '#F8F8FC' }}>
      <div className="position-absolute top-0 left-0 w-100 h-100" style={{ zIndex: 1 }}>
        <Canvas eventSource={sectionRef} eventPrefix="client" camera={{ position: [0, 0, params.cameraZ], fov: params.cameraFov }}><Particles /></Canvas>
      </div>

      <div className="container position-relative py-5 h-100 d-flex flex-column justify-content-between" style={{ zIndex: 2, pointerEvents: 'none', minHeight }}>
        <div className="row g-4 g-md-5 pt-4 pt-md-5">
          {/* Column 1: Brand/Address */}
          <div className="col-12 col-md-4 col-lg-3" style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
            <h3 className="h2 fw-bold mb-4" style={{ letterSpacing: '-0.04em' }}>tiffy</h3>
            <p className="lh-lg fw-medium mb-0">Suite 2, 9 Marsh Street<br />Bristol, BS1 4AA<br />United Kingdom</p>
          </div>

          {/* Column 2: Social/Links */}
          <div className="col-12 col-md-4 col-lg-3" style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
            <div className="d-flex flex-column gap-3 mb-5">
              <p className="fw-bold mb-0 cursor-pointer">Twitter / X</p>
              <p className="fw-bold mb-0 cursor-pointer">Instagram</p>
              <p className="fw-bold mb-0 cursor-pointer">LinkedIn</p>
            </div>
            <div>
              <p className="small mb-1" style={{ color: 'var(--text-light)' }}>General enquires</p>
              <p className="fw-bold cursor-pointer h5">hello@tiffy.io</p>
            </div>
          </div>

          {/* Column 3: Contact Form */}
          <div className="col-12 col-md-8 col-lg-6 ms-auto" style={{ pointerEvents: 'auto' }}>
            <div className="p-4 p-md-5 rounded-5 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)' }}>
              <h2 className="display-4 mb-4" style={{ letterSpacing: '-0.04em', fontWeight: 800, color: 'var(--text-dark)' }}>Contact Us</h2>
              <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                <div className="col-12 col-sm-6">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Name</label>
                  <input type="text" className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" style={{ fontSize: '1rem' }} placeholder="Your Name" required />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Email</label>
                  <input type="email" className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" style={{ fontSize: '1rem' }} placeholder="you@example.com" required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Message</label>
                  <textarea className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" rows="3" style={{ fontSize: '1rem' }} placeholder="Tell us about your business..." required></textarea>
                </div>
                <div className="col-12 mt-4">
                  <button type="submit" className="btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" style={{ fontSize: '1.1rem' }}>
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="row mt-5 pt-4 border-top border-dark border-opacity-10 align-items-center" style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <p className="small fw-medium mb-0">©2026 TIFFY Creative Studio | labs.tiffy.io</p>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center gap-4">
            <p className="small fw-medium mb-0">Built with ❤️</p>
            <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center cursor-pointer" style={{ width: 44, height: 44 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" /></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticleCTA;
