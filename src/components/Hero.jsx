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
      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'expo.out', duration: 1.2 } });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' }
      );

      const lines = headRef.current.querySelectorAll('.anim-line');
      tl.fromTo(lines,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, stagger: 0.08 },
        '-=0.8'
      );

      tl.fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.9'
      );

      tl.fromTo(
        ctaRef.current?.querySelectorAll('button'),
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 },
        '-=0.8'
      );

      tl.fromTo(socialRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      );

      tl.fromTo(dashRef.current,
        { opacity: 0, y: 80, rotateX: 8, transformPerspective: 1200 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.5 },
        '-=0.8'
      );

      tl.fromTo(chatRef.current,
        { opacity: 0, scale: 0.5, x: -10 },
        { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: 'back.out(2)' },
        '-=1.2'
      );

      gsap.to(blob1Ref.current, {
        scale: 1.15, rotation: 40, duration: 18,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to(blob2Ref.current, {
        scale: 1.12, rotation: -35, duration: 25,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });

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
