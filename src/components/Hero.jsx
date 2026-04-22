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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'expo.out' } });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: -28, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(2.5)' }
      );

      const lines = headRef.current.querySelectorAll('.anim-line');
      tl.fromTo(lines,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' },
        '-=0.4'
      );

      tl.fromTo(subRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.75 },
        '-=0.45'
      );

      tl.fromTo(
        ctaRef.current?.querySelectorAll('button'),
        { opacity: 0, y: 24, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.14, ease: 'back.out(2)' },
        '-=0.5'
      );

      tl.fromTo(socialRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55 },
        '-=0.3'
      );

      tl.fromTo(dashRef.current,
        { opacity: 0, y: 110, rotateX: 10, transformPerspective: 1000 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'expo.out' },
        '-=0.5'
      );

      tl.fromTo(chatRef.current,
        { opacity: 0, scale: 0, x: -16 },
        { opacity: 1, scale: 1, x: 0, duration: 0.7, ease: 'back.out(3)' },
        '-=0.6'
      );

      gsap.to(blob1Ref.current, {
        scale: 1.18, rotation: 70, duration: 22,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to(blob2Ref.current, {
        scale: 1.14, rotation: -65, duration: 30,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onBtnEnter = (e) => gsap.to(e.currentTarget, { scale: 1.05, y: -4, duration: 0.35, ease: 'back.out(2)' });
  const onBtnLeave = (e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(160deg, #E8500A 0%, #F47B20 45%, #F99B47 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 1.5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div ref={blob1Ref} style={{ position: 'absolute', top: '-15%', right: '-8%', width: '50%', height: '50%', background: 'rgba(255,255,255,0.06)', borderRadius: '40% 60% 70% 30%/30% 30% 70% 70%', filter: 'blur(60px)' }} />
      <div ref={blob2Ref} style={{ position: 'absolute', bottom: '5%', left: '-8%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.07)', borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%', filter: 'blur(80px)' }} />

      <div className="container" style={{ position: 'relative', zIndex: 5, maxWidth: 960 }}>
        {/* Badge */}
        <div ref={badgeRef} style={{ opacity: 0, marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '0.4rem 1.1rem', color: 'white', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFF176', boxShadow: '0 0 8px #FFF176' }} />
            All-in-one tiffin management
          </div>
        </div>

        {/* Headline */}
        <div ref={headRef} style={{ marginBottom: '1.75rem' }}>
          <AnimLine>
            <h1 style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-0.04em', margin: 0 }}>
              Modern software for
            </h1>
          </AnimLine>
          <AnimLine>
            <h1 style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-0.04em', margin: 0 }}>
              Tiffin Service Businesses
            </h1>
          </AnimLine>
        </div>

        {/* Subtitle */}
        <p ref={subRef} style={{ opacity: 0, fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Simplify operations, enhance customer experience, and grow your business with our all-in-one solution for tiffin services.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            style={{ background: 'white', color: '#CC5500', padding: '1rem 2.25rem', borderRadius: '50px', fontSize: '1.05rem', fontWeight: 800, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', cursor: 'pointer' }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
          >
            Start free trial — 15 days
          </button>
          <button
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '1rem 2.25rem', borderRadius: '50px', fontSize: '1.05rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)', cursor: 'pointer' }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
          >
            See how it works
          </button>
        </div>

        {/* Social proof */}
        <div ref={socialRef} style={{ opacity: 0, marginTop: '2.5rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${i * 40}, 70%, 60%)`, border: '2px solid white', marginLeft: i > 1 ? -10 : 0 }} />
            ))}
          </div>
          <span>Trusted by <strong style={{ color: 'white' }}>2,000+</strong> tiffin businesses</span>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div ref={dashRef} style={{ opacity: 0, width: '90%', maxWidth: 1100, height: 380, background: 'rgba(15,17,23,0.92)', marginTop: '5rem', borderRadius: '24px 24px 0 0', boxShadow: '0 -20px 80px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[1, 2, 3].map(i => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i === 1 ? '#FF5F57' : i === 2 ? '#FEBC2E' : '#28C840' }} />)}
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginLeft: '1rem', maxWidth: 260 }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: '0.5em', whiteSpace: 'nowrap', userSelect: 'none' }}>
          TIFFY DASHBOARD
        </div>
        <div style={{ display: 'flex', gap: '1rem', padding: '2rem 1.75rem' }}>
          {[180, 120, 200, 90].map((w, i) => <div key={i} style={{ width: w, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5 }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '0 1.75rem' }}>
          {[1, 2, 3].map(i => <div key={i} style={{ height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }} />)}
        </div>
      </div>

      {/* Chat bubble */}
      <div ref={chatRef} style={{ opacity: 0, position: 'absolute', bottom: '2.5rem', left: '2.5rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{ width: 52, height: 52, background: '#FF6B6B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,107,0.3)' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.4 })}
        >
          <MessageSquare color="white" size={24} />
        </div>
        <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', color: '#0F1117' }}>
          Support
        </div>
      </div>
    </section>
  );
};

export default Hero;
