import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #CC5500, #F47B20, #FF9F43)',
        scaleX,
        transformOrigin: '0%',
        zIndex: 9999,
        boxShadow: '0 0 12px rgba(204, 85, 0, 0.5)',
      }}
    />
  );
};

export default ProgressBar;
