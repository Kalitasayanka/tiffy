import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const mapRef = useRef(null);
  const mapContentRef = useRef(null);
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
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // If user prefers reduced motion, use simple fade animations
      if (prefersReducedMotion) {
        gsap.fromTo([headerRef.current, ...cardsRef.current, mapRef.current, ...deliveryItemsRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
        );
        return;
      }

      // Header with enhanced entrance
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50, filter: 'blur(15px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Feature cards with 3D tilt and stagger
      gsap.fromTo(cardsRef.current,
        {
          opacity: 0,
          y: 60,
          rotationX: 10,
          scale: 0.92,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: 'top 85%',
            end: 'bottom 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Map container with parallax and scale
      gsap.fromTo(mapRef.current,
        {
          opacity: 0,
          scale: 0.95,
          filter: 'blur(15px)',
          y: 40,
          rotationY: -5
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          rotationY: 0,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 85%',
            end: 'bottom 65%',
            toggleActions: 'play none none reverse'
          }
        }
      );


      gsap.fromTo(deliveryItemsRef.current,
        {
          opacity: 0,
          x: -30,
          scale: 0.95
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: deliveryRef.current,
            start: 'top 85%',
            end: 'bottom 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Add scroll-triggered parallax to map
      if (!prefersReducedMotion) {
        gsap.to(mapRef.current, {
          y: -30,
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate map content entrance with GSAP
  useEffect(() => {
    if (!loading && mapContentRef.current) {
      gsap.fromTo(mapContentRef.current,
        { opacity: 0, filter: 'blur(10px)', scale: 1.05 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'expo.out' }
      );
    }
  }, [loading]);

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
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>,
      color: 'red', gradient: 'linear-gradient(90deg,#E05252,#FFADAD)',
      title: 'Meal Plan Customization', desc: 'Easily create and manage diverse meal plans catering to various dietary requirements.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
      color: 'purple', gradient: 'linear-gradient(90deg,#6B68D4,#C4C3F7)',
      title: 'Subscription Tracking', desc: 'Automate subscription renewals and billing, ensuring consistent revenue streams.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
      color: 'orange', gradient: 'linear-gradient(90deg,#CC6B2E,#FFBD8A)',
      title: 'Kitchen Management', desc: 'Optimize kitchen workflows with detailed prep lists and ingredient tracking.',
    },
  ];

  const deliveryItems = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, title: 'Automated Route Planning', desc: 'Generate optimal delivery routes to save time and reduce fuel costs.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: 'Driver Management', desc: 'Assign deliveries, track driver progress, and manage fleets efficiently.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>, title: 'Real-Time Tracking', desc: 'Keep customers informed with live delivery updates and ETAs.' },
  ];

  return (
    <section id="features" ref={sectionRef} className="container py-5 my-5">

      {/* Header */}
      <div ref={headerRef} className="text-center mb-5" style={{ opacity: 0 }}>
        <span className="badge mb-3">Platform</span>
        <h2 className="display-6 fw-bold mb-3">
          Powerful Features for<br />Your Meal Prep Business
        </h2>
        <p className="mx-auto" style={{ maxWidth: '600px', color: 'var(--text-light)' }}>
          Tiffy provides an all-in-one platform to streamline your operations, optimize deliveries, and enhance the customer experience.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="mb-5 py-4">
        <div className="mb-4">
          <h3 className="fw-bold mb-2">Streamline Your Business Operations</h3>
          <p style={{ color: 'var(--text-light)' }}>Manage your entire business from a single, intuitive dashboard.</p>
        </div>
        <div className="row g-4">
          {featureCards.map((card, i) => (
            <div key={i} className="col-12 col-md-4">
              <div
                ref={el => cardsRef.current[i] = el}
                className="card h-100 border-0 p-4"
                onMouseMove={e => handleCardMove(e, e.currentTarget)}
                onMouseLeave={e => handleCardLeave(e.currentTarget)}
                style={{
                  position: 'relative', overflow: 'hidden', opacity: 0,
                  background: 'var(--bg-elevated)', borderRadius: 20,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'box-shadow 0.4s ease, opacity 0.4s ease'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: card.gradient }} />
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, marginBottom: '1.5rem' }}>
                  {card.icon}
                </div>
                <h4 className="fw-bold mb-3 h5">{card.title}</h4>
                <p className="small mb-0" style={{ lineHeight: 1.6, color: 'var(--text-light)' }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Grid */}
      <div className="row align-items-center g-5 py-5">
        <div className="col-12 col-lg-6">
          <div
            ref={mapRef}
            style={{
              background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
              borderRadius: 24, height: 450, position: 'relative',
              overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              border: '1px solid var(--border-light)', opacity: 0,
            }}
          >
            {loading ? (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center gap-3">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="fw-bold" style={{ color: 'var(--text-light)' }}>Locating delivery zone…</p>
              </div>
            ) : (
              <div ref={mapContentRef} style={{ width: '100%', height: '100%', display: 'flex', opacity: 0 }}>
                <iframe title="Map" width="100%" height="100%" frameBorder="0" src={getMapUrl()} style={{ border: 'none', filter: 'grayscale(0.4) contrast(1.1)', display: 'block' }} />
                <div style={{ position: 'absolute', top: 20, left: 20, background: 'white', padding: '12px 16px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 4px rgba(16,185,129,0.2)' }} />
                  <span className="fw-bold small" style={{ color: 'var(--text-dark)' }}>Optimized Delivery Zone</span>
                </div>
                <div style={{ position: 'absolute', bottom: 20, right: 20, background: '#0F1117', color: 'white', padding: '14px 20px', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 10 }}>
                  <div style={{ opacity: 0.6, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ETA</div>
                  <div className="fw-bold h5 mb-0">24 – 38 min</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6" ref={deliveryRef}>
          <span className="badge mb-3">Smart Routing</span>
          <h3 className="display-6 fw-bold mb-3">Optimize Your Delivery Operations</h3>
          <p className="mb-4 fs-5" style={{ color: 'var(--text-light)' }}>Ensure timely and efficient deliveries with intelligent routing and tracking.</p>
          <div className="d-flex flex-column gap-3">
            {deliveryItems.map((item, i) => (
              <div
                key={i}
                ref={el => deliveryItemsRef.current[i] = el}
                className="d-flex gap-3 p-4 rounded-4 border"
                style={{ opacity: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'box-shadow 0.3s ease, opacity 0.3s ease', background: 'var(--bg-card)' }}
                onMouseEnter={e => gsap.to(e.currentTarget, { x: 8, duration: 0.3 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.4 })}
              >
                <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44, background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="h6 fw-bold mb-1">{item.title}</h4>
                  <p className="small mb-0" style={{ color: 'var(--text-light)' }}>{item.desc}</p>
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
