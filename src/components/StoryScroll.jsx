import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProgressBar = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={progressRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #CC5500, #F47B20, #FF9B47)',
        transformOrigin: '0% 50%',
        transform: 'scaleX(0)',
        zIndex: 9999,
        boxShadow: '0 0 10px rgba(204, 85, 0, 0.4)',
      }}
    />
  );
};

export default ProgressBar;
