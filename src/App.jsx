import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';
import StoryScroll from './components/StoryScroll';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import ParticleCTA from './components/ParticleCTA';

function App() {
  useSmoothScroll();
  return (
    <>
      <StoryScroll />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FAQ />
      </main>
      <div id="cta">
        <ParticleCTA />
      </div>
    </>
  );
}

export default App;
