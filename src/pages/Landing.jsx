import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import StoryScroll from '../components/StoryScroll';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ParticleCTA from '../components/ParticleCTA';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Landing = () => {
  useSmoothScroll();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Only track authenticated users for active metrics
    
    // Track active user session quietly in the background
    fetch(`${API_URL}/api/track-visit`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    }).catch(e => console.error('Failed to track visit', e));
  }, [user]);

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
      <AuthModal />
    </>
  );
};

export default Landing;
