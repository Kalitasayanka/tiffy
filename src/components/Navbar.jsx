import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    // Entrance animation
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.4)', delay: 0.2 }
    );

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Magnetic button effect
  const handleBtnMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  };
  const handleBtnLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  // Link hover
  const handleLinkEnter = (el) => {
    gsap.to(el, { y: -2, duration: 0.25, ease: 'power2.out' });
  };
  const handleLinkLeave = (el) => {
    gsap.to(el, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: scrolled ? '14px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: scrolled ? '0.6rem 0.9rem' : '0.75rem 1.25rem',
        background: scrolled
          ? 'rgba(255,255,255,0.94)'
          : 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '60px',
        border: scrolled
          ? '1px solid rgba(0,0,0,0.08)'
          : '1px solid rgba(255,255,255,0.3)',
        boxShadow: scrolled
          ? '0 4px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset'
          : '0 8px 32px rgba(0,0,0,0.12)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        whiteSpace: 'nowrap',
        maxWidth: '95vw'
      }}
    >
      {/* Logo */}
      <div style={{
        fontSize: '1.1rem',
        fontWeight: '800',
        letterSpacing: '-0.04em',
        color: scrolled ? '#0F1117' : 'white',
        padding: '0 0.5rem',
        transition: 'color 0.3s ease',
      }}>
        tiffy
      </div>

      <div className="d-none d-sm-flex align-items-center gap-1">
        <div style={{ width: 1, height: 18, background: scrolled ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)', margin: '0 0.2rem' }} />

        {['Features', 'Blog'].map((item, i) => (
          <a
            key={item}
            ref={el => linksRef.current[i] = el}
            href={`#${item.toLowerCase()}`}
            onMouseEnter={e => handleLinkEnter(e.currentTarget)}
            onMouseLeave={e => handleLinkLeave(e.currentTarget)}
            style={{
              color: scrolled ? '#3D3F4E' : 'rgba(255,255,255,0.95)',
              fontWeight: '700',
              fontSize: '0.85rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '50px',
              transition: 'all 0.25s ease',
              display: 'inline-block',
            }}
          >
            {item}
          </a>
        ))}
      </div>

      <div style={{ width: 1, height: 18, background: scrolled ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)', margin: '0 0.2rem' }} />

      <a href="#login" className="d-none d-sm-inline-block" style={{
        color: scrolled ? '#3D3F4E' : 'rgba(255,255,255,0.9)',
        fontWeight: '700',
        fontSize: '0.85rem',
        padding: '0.4rem 0.6rem',
        transition: 'color 0.25s ease',
        display: 'inline-block',
      }}>
        Login
      </a>

      <button
        ref={btnRef}
        onMouseMove={handleBtnMove}
        onMouseLeave={handleBtnLeave}
        style={{
          padding: '0.55rem 1.15rem',
          borderRadius: '50px',
          background: scrolled ? '#CC5500' : 'white',
          color: scrolled ? 'white' : '#F47B20',
          fontWeight: '800',
          fontSize: '0.82rem',
          border: 'none',
          boxShadow: scrolled ? '0 4px 14px rgba(204,85,0,0.35)' : '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'inline-block',
          position: 'relative',
        }}
      >
        Book a Call
      </button>
    </nav>
  );
};

export default Navbar;
