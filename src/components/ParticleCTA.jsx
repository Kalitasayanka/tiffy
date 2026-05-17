import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const { user, token } = useAuth();
  const params = useResponsiveParticleParams();
  const [minHeight, setMinHeight] = useState('850px');
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', business_name: '', inquiry_type: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [socialLinks, setSocialLinks] = useState({
    social_facebook: 'https://facebook.com',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    company_address: '',
    contact_email: ''
  });

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSocialLinks(data);
        }
      })
      .catch(e => console.error('Failed to load settings:', e));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Something went wrong');
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '', business_name: '', inquiry_type: '' });
      setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

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
        <div className="row g-4 g-md-5 align-items-center pt-4">
          {/* Column 1: Brand/Address */}
          <div className="col-12 col-md-6 col-lg-3 d-flex flex-column gap-5" style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
            <div>
              <h3 className="display-6 fw-bold mb-4" style={{ letterSpacing: '-0.04em' }}>tiffy</h3>
              <p className="lh-lg fw-medium mb-0" style={{ fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{socialLinks.company_address || "Suite 2, 9 Marsh Street\nBristol, BS1 4AA\nUnited Kingdom"}</p>
            </div>
            <div>
              <p className="small mb-1 text-uppercase fw-bold" style={{ color: 'var(--text-light)', letterSpacing: '0.05em' }}>General enquires</p>
              <a href={`mailto:${socialLinks.contact_email || 'hello@tiffy.io'}`} className="fw-bold text-decoration-none h4" style={{ color: 'var(--text-dark)' }}>{socialLinks.contact_email || 'hello@tiffy.io'}</a>
            </div>
          </div>

          {/* Column 2: Social/Links */}
          <div className="col-12 col-md-6 col-lg-3 d-flex flex-column gap-4" style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
            <p className="small mb-1 text-uppercase fw-bold" style={{ color: 'var(--text-light)', letterSpacing: '0.05em' }}>Follow Us</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
              {Object.keys(socialLinks).filter(k => k.startsWith('social_')).map(key => {
                const platformName = key.replace('social_', '');
                const displayName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
                const colorMap = { facebook: '#1877F2', twitter: '#1DA1F2', instagram: '#E1306C', linkedin: '#0077B5', youtube: '#FF0000', tiktok: '#000000' };
                const hoverColor = colorMap[platformName] || 'var(--primary)';
                return (
                  <a key={key} href={socialLinks[key]} target="_blank" rel="noreferrer" className="fw-bold mb-0 text-decoration-none" style={{ color: 'var(--text-dark)', transition: 'color 0.2s', fontSize: '1.05rem' }} onMouseEnter={e => e.target.style.color = hoverColor} onMouseLeave={e => e.target.style.color = 'var(--text-dark)'}>{displayName}</a>
                );
              })}
            </div>
          </div>

          {/* Column 3: Contact Form */}
          <div className="col-12 col-lg-6 mt-5 mt-lg-0 ms-auto" style={{ pointerEvents: 'auto' }}>
            <div className="p-4 p-md-5 rounded-5 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)' }}>
              <h2 className="display-4 mb-4" style={{ letterSpacing: '-0.04em', fontWeight: 800, color: 'var(--text-dark)' }}>Contact Us</h2>
              
              {status.success && (
                <div className="alert alert-success border-0 small py-2 mb-4 rounded-3" style={{ background: 'rgba(40,200,64,0.15)', color: '#1B8A2B', fontWeight: 600 }}>
                  Message sent successfully! We'll be in touch soon.
                </div>
              )}
              {status.error && (
                <div className="alert alert-danger border-0 small py-2 mb-4 rounded-3" style={{ background: '#FFEBEB', color: '#D32F2F', fontWeight: 600 }}>
                  {status.error}
                </div>
              )}

              <form className="row g-3" onSubmit={handleSubmit}>
                {!user && (
                  <>
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Name</label>
                      <input type="text" className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" style={{ fontSize: '1rem' }} placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Email</label>
                      <input type="email" className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" style={{ fontSize: '1rem' }} placeholder="you@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </>
                )}
                
                <div className="col-12 col-sm-6">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Business Name</label>
                  <input type="text" className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" style={{ fontSize: '1rem' }} placeholder="E.g., Fresh Prep" required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Inquiry Type</label>
                  <select className="form-select form-select-lg border-0 bg-white rounded-4 shadow-sm" style={{ fontSize: '1rem' }} required value={formData.inquiry_type} onChange={e => setFormData({...formData, inquiry_type: e.target.value})}>
                    <option value="" disabled>Select an option</option>
                    <option value="Sales">Sales & Pricing</option>
                    <option value="Support">Technical Support</option>
                    <option value="Feature">Feature Request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small" style={{ color: 'var(--text-dark)' }}>Message</label>
                  <textarea className="form-control form-control-lg border-0 bg-white rounded-4 shadow-sm" rows="3" style={{ fontSize: '1rem' }} placeholder="Tell us about your business..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                </div>
                <div className="col-12 mt-4">
                  <button disabled={status.loading} type="submit" className="btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" style={{ fontSize: '1.1rem', transition: 'transform 0.2s', transform: status.loading ? 'scale(0.98)' : 'scale(1)' }}>
                    {status.loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="row mt-5 pt-4 border-top border-dark border-opacity-10 align-items-center" style={{ pointerEvents: 'auto', color: 'var(--text-dark)' }}>
          <div className="col-12 col-md-6 mb-4 mb-md-0 text-center text-md-start">
            <p className="small fw-medium mb-0" style={{ color: 'var(--text-light)' }}>©2026 TIFFY Creative Studio | labs.tiffy.io</p>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end align-items-center gap-4">
            <p className="small fw-medium mb-0" style={{ color: 'var(--text-light)' }}>Built with ❤️</p>
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
