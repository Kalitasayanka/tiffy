import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AnimLine = ({ children, style = {} }) => (
  <div style={{ overflow: 'hidden', display: 'block', ...style }}>
    <div className="anim-line" style={{ display: 'block' }}>{children}</div>
  </div>
);

const Hero = () => {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const socialRef = useRef(null);
  const dashRef = useRef(null);
  const chatRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // If user prefers reduced motion, skip complex animations
      if (prefersReducedMotion) {
        // Simple fade-in for accessibility
        gsap.fromTo([badgeRef.current, headRef.current, subRef.current, ctaRef.current, socialRef.current, dashRef.current, chatRef.current],
          { opacity: 0 },
          { opacity: 1, duration: 0.8, stagger: 0.1 }
        );
        return;
      }

      // Master timeline with smoother easing
      const tl = gsap.timeline({
        delay: 0.2,
        defaults: {
          ease: 'power3.out',
          duration: 1.1
        }
      });

      // Badge with bounce effect
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: -30, scale: 0.9, rotation: -5 },
        { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }
      );

      // Headline with improved stagger and clipping
      const lines = headRef.current.querySelectorAll('.anim-line');
      tl.fromTo(lines,
        {
          y: '120%',
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)'
        },
        {
          y: '0%',
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          stagger: 0.12,
          duration: 1.4,
          ease: 'power4.out'
        },
        '-=0.7'
      );

      // Subtitle with fade and slight scale
      tl.fromTo(subRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'expo.out' },
        '-=1.0'
      );

      // CTA buttons with enhanced stagger and bounce
      tl.fromTo(
        ctaRef.current?.querySelectorAll('button'),
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.8)'
        },
        '-=0.8'
      );

      // Social proof with fade and slide
      tl.fromTo(socialRef.current,
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
        '-=0.5'
      );

      // Dashboard mockup with 3D perspective and parallax
      tl.fromTo(dashRef.current,
        {
          opacity: 0,
          y: 100,
          rotateX: 15,
          rotateY: -5,
          transformPerspective: 1500,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.8,
          ease: 'power3.out'
        },
        '-=0.6'
      );

      // Chat bubble with playful entrance
      tl.fromTo(chatRef.current,
        { opacity: 0, scale: 0, rotation: -180, x: -50 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          x: 0,
          duration: 1.2,
          ease: 'elastic.out(1.2, 0.5)'
        },
        '-=1.0'
      );

      // Enhanced blob animations with parallax on scroll - only if not reduced motion
      if (!prefersReducedMotion) {
        gsap.to(blob1Ref.current, {
          scale: 1.2,
          rotation: 45,
          x: '5%',
          y: '5%',
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.to(blob2Ref.current, {
          scale: 1.15,
          rotation: -40,
          x: '-3%',
          y: '-3%',
          duration: 22,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Add scroll-triggered parallax to hero elements
        gsap.to(headRef.current, {
          y: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });

        gsap.to(dashRef.current, {
          y: 50,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          }
        });
      }

      // Add subtle floating animation to CTA buttons on hover (always enabled for UX)
      const buttons = ctaRef.current?.querySelectorAll('button');
      if (buttons) {
        buttons.forEach(btn => {
          btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
              y: -5,
              scale: 1.05,
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              duration: 0.4,
              ease: 'power2.out'
            });
          });

          btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
              y: 0,
              scale: 1,
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              duration: 0.6,
              ease: 'elastic.out(1, 0.5)'
            });
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onBtnEnter = (e) => gsap.to(e.currentTarget, { scale: 1.03, y: -2, duration: 0.4, ease: 'expo.out' });
  const onBtnLeave = (e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="d-flex flex-column align-items-center justify-content-center text-center px-3"
      style={{
        background: 'linear-gradient(160deg, #E8500A 0%, #F47B20 45%, #F99B47 100%)',
        minHeight: '100vh',
        padding: '8.5rem 0 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div ref={blob1Ref} style={{ position: 'absolute', top: '-15%', right: '-8%', width: '60vw', height: '60vw', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 1 }} />
      <div ref={blob2Ref} style={{ position: 'absolute', bottom: '5%', left: '-8%', width: '50vw', height: '50vw', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 1 }} />

      <div className="container position-relative" style={{ zIndex: 5, maxWidth: 960 }}>
        {/* Badge */}
        <div ref={badgeRef} style={{ opacity: 0, marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '0.45rem 1.25rem', color: 'white', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFF176', boxShadow: '0 0 8px #FFF176' }} />
            All-in-one tiffin management
          </div>
        </div>

        {/* Headline */}
        <div ref={headRef} style={{ marginBottom: '2rem' }}>
          <AnimLine>
            <h1 style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-0.04em', margin: 0 }}>
              Modern software for
            </h1>
          </AnimLine>
          <AnimLine>
            <h1 style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-0.04em', margin: 0 }}>
              Tiffin Businesses
            </h1>
          </AnimLine>
        </div>

        {/* Subtitle */}
        <p ref={subRef} style={{ opacity: 0, fontSize: '1.18rem', color: 'rgba(255,255,255,0.9)', maxWidth: 620, margin: '0 auto 3rem', lineHeight: 1.7 }}>
          Simplify operations, enhance customer experience, and grow your business with our all-in-one solution for tiffin services.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="d-flex flex-wrap gap-3 justify-content-center">
          <button
            style={{ background: 'white', color: '#CC5500', padding: '1.1rem 2.5rem', borderRadius: '50px', fontSize: '1.05rem', fontWeight: 800, border: 'none', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', cursor: 'pointer' }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
          >
            Start free trial
          </button>
          <button
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '1.1rem 2.5rem', borderRadius: '50px', fontSize: '1.05rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)', cursor: 'pointer' }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
          >
            See how it works
          </button>
        </div>

        {/* Social proof */}
        <div ref={socialRef} className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-5" style={{ opacity: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontWeight: 500 }}>
          <div className="d-flex">
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${i * 40}, 70%, 60%)`, border: '2px solid white', marginLeft: i > 1 ? -12 : 0 }} />
            ))}
          </div>
          <span>Trusted by <strong style={{ color: 'white' }}>2,000+</strong> businesses</span>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div ref={dashRef} className="d-none d-md-block mt-5 mx-auto rounded-top-5 shadow-lg border border-white border-opacity-10 overflow-hidden"
        style={{ opacity: 0, width: '92%', maxWidth: '1150px', height: '400px', background: 'rgba(15,17,23,0.94)' }}>
        <div className="p-3 border-bottom border-white border-opacity-10 d-flex gap-2">
          {[1, 2, 3].map(i => <div key={i} className="rounded-circle" style={{ width: 10, height: 10, background: i === 1 ? '#ff5f57' : i === 2 ? '#febc2e' : '#28c840' }} />)}
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: '0.5em', whiteSpace: 'nowrap', userSelect: 'none' }}>
          TIFFY DASHBOARD
        </div>
        <div className="d-flex gap-3 p-4">
          {[180, 120, 200, 90].map((w, i) => <div key={i} style={{ width: w, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5 }} />)}
        </div>
        <div className="row g-3 px-4">
          {[1, 2, 3].map(i => <div key={i} className="col-4"><div style={{ height: 130, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }} /></div>)}
        </div>
      </div>

      {/* Chat bubble */}
      <div ref={chatRef} className="d-none d-lg-flex align-items-center gap-3 position-absolute" style={{ opacity: 0, bottom: '3.5rem', left: '3.5rem', zIndex: 10 }}>
        <div className="rounded-circle d-flex align-items-center justify-content-center shadow-lg cursor-pointer"
          style={{ width: 56, height: 56, background: '#FF6B6B' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.4, ease: 'expo.out' })}
          onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })}>
          <MessageSquare color="white" />
        </div>
        <div className="bg-white px-3 py-2 rounded-3 shadow fw-bold small text-dark">Support</div>
      </div>
    </section>
  );
};

export default Hero;
