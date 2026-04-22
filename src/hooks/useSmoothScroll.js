import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useSmoothScroll — initialises Lenis buttery smooth scroll
 * and wires it into GSAP's ScrollTrigger so all scroll-based
 * animations stay perfectly in sync.
 *
 * Used by award-winning studios (Basement, Studio Freight, etc.)
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,           // how long the inertia lasts (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,    // slightly slower than native — feels premium
      touchMultiplier: 1.8,    // responsive on mobile
      infinite: false,
    });

    // Tell GSAP ScrollTrigger to use Lenis' scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Tick Lenis on every GSAP frame — keeps them in lock-step
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's own lag smoothing (Lenis handles it)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);
};
