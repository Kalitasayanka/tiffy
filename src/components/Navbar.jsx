import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navRef = useRef(null);
  const highlighterRef = useRef(null);
  const linksRef = useRef([]);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    // Entrance animation
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    );

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Moving Highlighter Logic
  useEffect(() => {
    if (hoveredIndex !== null && linksRef.current[hoveredIndex]) {
      const target = linksRef.current[hoveredIndex];
      const rect = target.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      
      gsap.to(highlighterRef.current, {
        opacity: 1,
        x: rect.left - navRect.left,
        width: rect.width,
        height: rect.height,
        y: rect.top - navRect.top,
        duration: 0.45,
        ease: 'expo.out',
      });
    } else {
      gsap.to(highlighterRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [hoveredIndex]);

  // Magnetic effect for the CTA button (Subtle)
  const handleBtnMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
  };
  const handleBtnLeave = () => {
    setHoveredIndex(null);
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Blog', href: '#blog' },
    { label: 'Login', href: '#login' }
  ];

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: scrolled ? '16px' : '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.45rem',
        background: scrolled
          ? 'rgba(255,255,255,0.94)'
          : 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '60px',
        border: scrolled
          ? '1px solid rgba(0,0,0,0.06)'
          : '1px solid rgba(255,255,255,0.2)',
        boxShadow: scrolled
          ? '0 12px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.8) inset'
          : '0 8px 32px rgba(0,0,0,0.08)',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        whiteSpace: 'nowrap',
        maxWidth: '95vw'
      }}
    >
      {/* Highlighter Pill */}
      <div
        ref={highlighterRef}
        style={{
          position: 'absolute',
          background: scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)',
          borderRadius: '50px',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 0,
        }}
      />

      {/* Logo */}
      <div style={{
        fontSize: '1.15rem',
        fontWeight: '900',
        letterSpacing: '-0.05em',
        color: scrolled ? '#0F1117' : 'white',
        padding: '0 1.25rem',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
        zIndex: 1,
      }}>
        tiffy
      </div>

      <div className="d-flex align-items-center" style={{ zIndex: 1 }}>
        {navItems.map((item, i) => (
          <a
            key={item.label}
            ref={el => linksRef.current[i] = el}
            href={item.href}
            className={`${item.label === 'Login' ? 'ms-1' : ''} ${item.label === 'Features' || item.label === 'Blog' ? 'd-none d-sm-inline-block' : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              color: scrolled ? '#3D3F4E' : 'rgba(255,255,255,0.95)',
              fontWeight: '700',
              fontSize: '0.86rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '50px',
              transition: 'color 0.3s ease',
              display: 'inline-block',
            }}
          >
            {item.label}
          </a>
        ))}

        <button
          ref={btnRef}
          onMouseMove={handleBtnMove}
          onMouseLeave={handleBtnLeave}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '50px',
            background: scrolled ? '#CC5500' : 'white',
            color: scrolled ? 'white' : '#F47B20',
            fontWeight: '800',
            fontSize: '0.85rem',
            border: 'none',
            boxShadow: scrolled ? '0 8px 20px rgba(204,85,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginLeft: '0.5rem',
            zIndex: 1,
          }}
        >
          Book a Call
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
