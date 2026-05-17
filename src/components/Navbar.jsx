import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, openModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const highlighterRef = useRef(null);
  const linksRef = useRef([]);
  const btnRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (mobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'expo.out',
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'expo.in',
        });
      }
    }
  }, [mobileMenuOpen]);

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
    { label: user ? 'Logout' : 'Login', href: '#' }
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="navbar navbar-expand-lg"
        style={{
          position: 'fixed',
          top: scrolled ? '16px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
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
          maxWidth: '95vw',
          width: 'auto'
        }}
      >
        {/* Highlighter Pill */}
        <div
          ref={highlighterRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
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

        {/* Hamburger menu for mobile */}
        <button
          className="d-lg-none border-0 bg-transparent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '0.5rem',
            zIndex: 1,
          }}
        >
          <span style={{
            width: '20px',
            height: '2px',
            background: scrolled ? '#0F1117' : 'white',
            margin: '3px 0',
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            width: '20px',
            height: '2px',
            background: scrolled ? '#0F1117' : 'white',
            margin: '3px 0',
            transition: 'all 0.3s ease',
            opacity: mobileMenuOpen ? 0 : 1,
          }} />
          <span style={{
            width: '20px',
            height: '2px',
            background: scrolled ? '#0F1117' : 'white',
            margin: '3px 0',
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
          }} />
        </button>

        <div className="d-none d-lg-flex align-items-center" style={{ zIndex: 1 }}>
          {navItems.map((item, i) => (
            <a
              key={item.label}
              ref={el => linksRef.current[i] = el}
              href={item.href}
              className={`${item.label === 'Login' || item.label === 'Logout' ? 'ms-1 cursor-pointer' : ''}`}
              onClick={(e) => {
                if (item.label === 'Login') { e.preventDefault(); openModal('login'); }
                if (item.label === 'Logout') { e.preventDefault(); logout(); }
                if (item.label === 'Blog') { e.preventDefault(); alert('Blog coming soon!'); }
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                color: scrolled ? '#3D3F4E' : 'rgba(255,255,255,0.95)',
                fontWeight: '700',
                fontSize: '0.86rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '50px',
                transition: 'color 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {item.label}
            </a>
          ))}

          <button
            ref={btnRef}
            onMouseMove={handleBtnMove}
            onMouseLeave={handleBtnLeave}
            onClick={() => document.getElementById('cta').scrollIntoView({ behavior: 'smooth' })}
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

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        style={{
          position: 'fixed',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: '400px',
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          zIndex: 999,
          height: 0,
          opacity: 0,
        }}
      >
        <div className="p-4">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="d-block py-3 text-decoration-none"
              style={{
                color: '#0F1117',
                fontWeight: '700',
                fontSize: '1rem',
                borderBottom: i < navItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}
              onClick={(e) => {
                if (item.label === 'Login') { e.preventDefault(); setMobileMenuOpen(false); openModal('login'); }
                else if (item.label === 'Logout') { e.preventDefault(); setMobileMenuOpen(false); logout(); }
                else if (item.label === 'Blog') { e.preventDefault(); alert('Blog coming soon!'); setMobileMenuOpen(false); }
                else { setMobileMenuOpen(false); }
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            className="w-100 mt-3 py-3 border-0 rounded-pill fw-bold"
            style={{
              background: '#CC5500',
              color: 'white',
              boxShadow: '0 8px 20px rgba(204,85,0,0.2)',
            }}
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book a Call
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
