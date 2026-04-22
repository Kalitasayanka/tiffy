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

  // Magnetic Effect for any element
  const handleMagneticMove = (e, el, strength = 0.3) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
  };

  const handleMagneticLeave = (el) => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
  };

  // Text shift animation
  const handleTextEnter = (el) => {
    const text = el.querySelector('.nav-text-inner');
    if (text) {
      gsap.to(text, { y: '-100%', duration: 0.4, ease: 'power3.inOut' });
      gsap.to(el.querySelector('.nav-text-copy'), { y: '-100%', duration: 0.4, ease: 'power3.inOut' });
    }
  };

  const handleTextLeave = (el) => {
    const text = el.querySelector('.nav-text-inner');
    if (text) {
      gsap.to(text, { y: '0%', duration: 0.4, ease: 'power3.inOut' });
      gsap.to(el.querySelector('.nav-text-copy'), { y: '0%', duration: 0.4, ease: 'power3.inOut' });
    }
  };

  const NavLink = ({ href, children, i }) => (
    <a
      href={href}
      ref={el => linksRef.current[i] = el}
      onMouseMove={e => handleMagneticMove(e, e.currentTarget, 0.2)}
      onMouseEnter={e => handleTextEnter(e.currentTarget)}
      onMouseLeave={e => {
        handleMagneticLeave(e.currentTarget);
        handleTextLeave(e.currentTarget);
      }}
      style={{
        color: scrolled ? '#0F1117' : 'white',
        fontWeight: '700',
        fontSize: '0.85rem',
        padding: '0.5rem 0.9rem',
        borderRadius: '50px',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'color 0.3s ease',
      }}
    >
      <div style={{ position: 'relative', height: '1.2em', overflow: 'hidden' }}>
        <span className="nav-text-inner" style={{ display: 'block' }}>{children}</span>
        <span className="nav-text-copy" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, width: '100%', color: scrolled ? '#CC5500' : '#FFD700' }}>
          {children}
        </span>
      </div>
    </a>
  );

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
        padding: scrolled ? '0.5rem 0.8rem' : '0.6rem 1.1rem',
        background: scrolled
          ? 'rgba(255,255,255,0.92)'
          : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '60px',
        border: scrolled
          ? '1px solid rgba(0,0,0,0.08)'
          : '1px solid rgba(255,255,255,0.25)',
        boxShadow: scrolled
          ? '0 10px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset'
          : '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        whiteSpace: 'nowrap',
        maxWidth: '95vw'
      }}
    >
      {/* Logo */}
      <div 
        onMouseMove={e => handleMagneticMove(e, e.currentTarget, 0.15)}
        onMouseLeave={e => handleMagneticLeave(e.currentTarget)}
        style={{
          fontSize: '1.15rem',
          fontWeight: '900',
          letterSpacing: '-0.05em',
          color: scrolled ? '#0F1117' : 'white',
          padding: '0 0.75rem',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
        }}
      >
        tiffy
      </div>

      <div className="d-none d-sm-flex align-items-center">
        <div style={{ width: 1, height: 18, background: scrolled ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.25)', margin: '0 0.4rem' }} />
        
        <NavLink href="#features" i={0}>Features</NavLink>
        <NavLink href="#blog" i={1}>Blog</NavLink>
        
        <div style={{ width: 1, height: 18, background: scrolled ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.25)', margin: '0 0.4rem' }} />
      </div>

      <NavLink href="#login" i={2}>Login</NavLink>

      <button
        ref={btnRef}
        onMouseMove={e => handleMagneticMove(e, e.currentTarget, 0.35)}
        onMouseLeave={handleMagneticLeave}
        style={{
          padding: '0.65rem 1.4rem',
          borderRadius: '50px',
          background: scrolled ? '#CC5500' : 'white',
          color: scrolled ? 'white' : '#F47B20',
          fontWeight: '800',
          fontSize: '0.85rem',
          border: 'none',
          boxShadow: scrolled ? '0 8px 20px rgba(204,85,0,0.25)' : '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginLeft: '0.3rem'
        }}
      >
        Book a Call
      </button>
    </nav>
  );
};

export default Navbar;
