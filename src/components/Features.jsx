import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const mapRef = useRef(null);
  const deliveryRef = useRef(null);
  const deliveryItemsRef = useRef([]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => { setLocation({ lat: p.coords.latitude, lon: p.coords.longitude }); setLoading(false); },
        () => { setError(true); setLocation({ lat: 51.505, lon: -0.09 }); setLoading(false); },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocation({ lat: 51.505, lon: -0.09 }); setLoading(false);
    }
  }, []);

  const getMapUrl = () => {
    if (!location) return '';
    const zoom = 0.012;
    const { lat, lon } = location;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - zoom}%2C${lat - zoom}%2C${lon + zoom}%2C${lat + zoom}&layer=mapnik&marker=${lat}%2C${lon}`;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 60, rotateY: -15 },
        {
          opacity: 1, y: 0, rotateY: 0,
          duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: cardsRef.current[0], start: 'top 80%' }
        }
      );

      gsap.fromTo(mapRef.current,
        { opacity: 0, x: -60, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: mapRef.current, start: 'top 75%' }
        }
      );

      gsap.fromTo(deliveryItemsRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: deliveryRef.current, start: 'top 75%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardMove = (e, el) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
    gsap.to(el, { rotateY: x, rotateX: -y, scale: 1.02, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
  };
  const handleCardLeave = (el) => {
    gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  const featureCards = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
      color: 'red', gradient: 'linear-gradient(90deg,#E05252,#FFADAD)',
      title: 'Meal Plan Customization', desc: 'Easily create and manage diverse meal plans catering to various dietary requirements.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      color: 'purple', gradient: 'linear-gradient(90deg,#6B68D4,#C4C3F7)',
      title: 'Subscription Tracking', desc: 'Automate subscription renewals and billing, ensuring consistent revenue streams.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
      color: 'orange', gradient: 'linear-gradient(90deg,#CC6B2E,#FFBD8A)',
      title: 'Kitchen Management', desc: 'Optimize kitchen workflows with detailed prep lists and ingredient tracking.',
    },
  ];

  const deliveryItems = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Automated Route Planning', desc: 'Generate optimal delivery routes to save time and reduce fuel costs.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, title: 'Driver Management', desc: 'Assign deliveries, track driver progress, and manage fleets efficiently.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: 'Real-Time Tracking', desc: 'Keep customers informed with live delivery updates and ETAs.' },
  ];

  return (
    <section id="features" ref={sectionRef} className="container section-padding">
      
      {/* Header */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '4.5rem', opacity: 0 }}>
        <span className="badge">Platform</span>
        <h2 style={{ marginBottom: '1rem' }}>
          Powerful Features for<br />Your Meal Prep Business
        </h2>
        <p style={{ maxWidth: '560px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-light)' }}>
          Tiffy provides an all-in-one platform to streamline your operations, optimize deliveries, and enhance the customer experience.
        </p>
      </div>

      {/* Feature Grid */}
      <div style={{ marginBottom: '6rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ marginBottom: '0.6rem' }}>Streamline Your Business Operations</h3>
          <p style={{ color: 'var(--text-light)' }}>Manage your entire business from a single, intuitive dashboard.</p>
        </div>
        <div className="grid-3">
          {featureCards.map((card, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="card"
              onMouseMove={e => handleCardMove(e, e.currentTarget)}
              onMouseLeave={e => handleCardLeave(e.currentTarget)}
              style={{ 
                position: 'relative', overflow: 'hidden', opacity: 0,
                background: 'var(--bg-elevated)', borderRadius: 20,
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: card.gradient }} />
              <div className={`feature-icon-wrapper`} style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, marginBottom: '1.5rem' }}>
                {card.icon}
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.8rem' }}>{card.title}</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-light)' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Section */}
      <div className="grid-2" style={{ alignItems: 'center' }}>
        <div
          ref={mapRef}
          style={{
            background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
            borderRadius: 24, height: 420, position: 'relative',
            overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-light)', opacity: 0,
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
              <div className="spinner-border text-primary" style={{ width: 32, height: 32 }} />
              <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>Locating delivery zone…</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', height: '100%', display: 'flex' }}>
                <iframe title="Map" width="100%" height="100%" frameBorder="0" src={getMapUrl()} style={{ border: 'none', filter: 'grayscale(0.4) contrast(1.1)', display: 'block' }} />
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'white', padding: '10px 14px', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 4px rgba(16,185,129,0.2)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>Optimized Delivery Zone</span>
                </div>
                <div style={{ position: 'absolute', bottom: 16, right: 16, background: '#0F1117', color: 'white', padding: '12px 18px', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 10 }}>
                  <div style={{ opacity: 0.55, fontSize: '0.72rem', marginBottom: 3, letterSpacing: '0.04em', textTransform: 'uppercase' }}>ETA</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>24 – 38 min</div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div ref={deliveryRef}>
          <span className="badge">Smart Routing</span>
          <h3 style={{ marginBottom: '0.75rem' }}>Optimize Your Delivery Operations</h3>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.02rem', color: 'var(--text-light)' }}>Ensure timely and efficient deliveries with intelligent routing and tracking.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {deliveryItems.map((item, i) => (
              <div
                key={i}
                ref={el => deliveryItemsRef.current[i] = el}
                style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  padding: '1.1rem 1.25rem', borderRadius: 14,
                  background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)', cursor: 'default', opacity: 0,
                }}
                onMouseEnter={e => gsap.to(e.currentTarget, { x: 6, duration: 0.3 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.4 })}
              >
                <div style={{ color: 'var(--primary)', flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem', fontWeight: 700 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
