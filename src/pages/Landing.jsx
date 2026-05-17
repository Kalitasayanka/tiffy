import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import StoryScroll from '../components/StoryScroll';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ParticleCTA from '../components/ParticleCTA';
import AuthModal from '../components/AuthModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Landing = () => {
  useSmoothScroll();

  useEffect(() => {
    // Generate a unique session ID per browser session and track it
    let sessionId = sessionStorage.getItem('tiffy_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('tiffy_session_id', sessionId);
    }
    fetch(`${API_URL}/api/track-visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    }).catch(e => console.error('Failed to track visit', e));
  }, []);

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
      <footer className="text-center py-4" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
        <p className="small mb-0" style={{ color: 'var(--text-light)' }}>
          <strong>Disclaimer:</strong> This project is a replica of <a href="https://tiffy.io" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>tiffy.io</a> built by <strong>Sayanka</strong>.
        </p>
      </footer>
      <AuthModal />
    </>
  );
};

export default Landing;
