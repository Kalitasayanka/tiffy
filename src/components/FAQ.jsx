import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { question: 'What is tiffin management software?', answer: 'Tiffin management software is a digital solution designed to help tiffin service providers manage their daily operations. This includes tracking customer subscriptions, planning menus, and managing deliveries.' },
  { question: 'What is Tiffy?', answer: "Tiffy is an all-in-one platform built specifically for modern meal prep and tiffin delivery businesses. It helps you automate your daily operations from the kitchen to the customer's doorstep." },
  { question: 'Is it easy to use?', answer: 'Yes! Tiffy is designed with a very intuitive, modern user interface that anyone can quickly learn and use, whether they are in the kitchen or the back office.' },
  { question: 'Can I customize my meal plans?', answer: 'Absolutely. Tiffy allows you to create highly customizable meal plans to cater to various dietary preferences, allergies, and subscription types.' }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemRefs = useRef([]);
  const ctaRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%' } }
      );

      gsap.fromTo(catRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: catRef.current, start: 'top 80%' } }
      );

      gsap.fromTo(itemRefs.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          duration: 0.55, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: itemRefs.current[0], start: 'top 80%' }
        }
      );

      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="container section-padding">
      
      {/* Header */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '4.5rem', opacity: 0 }}>
        <span className="badge">Support</span>
        <h2 style={{ marginBottom: '1rem' }}>
          Frequently Asked<br />
          <span className="text-primary">Questions</span>
        </h2>
        <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-light)' }}>
          Everything you need to know about Tiffy, the ultimate tiffin management software.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Category Sidebar */}
        <div ref={catRef} style={{ opacity: 0 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.9rem' }}>
            Categories
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {['General Questions', 'Features & Usage', 'Pricing & Billing'].map((cat, i) => (
              <li
                key={i}
                style={{
                  padding: '0.65rem 1rem', borderRadius: 10,
                  background: i === 0 ? 'var(--primary-light)' : 'transparent',
                  color: i === 0 ? 'var(--primary)' : 'var(--text-light)',
                  fontWeight: i === 0 ? 700 : 500, fontSize: '0.9rem', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => gsap.to(e.currentTarget, { x: 4, duration: 0.2 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.3 })}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                ref={el => itemRefs.current[index] = el}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                style={{
                  background: isOpen ? 'white' : 'var(--bg-elevated)',
                  borderRadius: 16, padding: '1.3rem 1.5rem',
                  cursor: 'pointer',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'none',
                  border: `1px solid ${isOpen ? 'var(--primary-glow)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.3s ease',
                  opacity: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {faq.question}
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    style={{
                      flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                      background: isOpen ? 'var(--primary)' : 'white',
                      border: `1px solid ${isOpen ? 'transparent' : 'var(--border-light)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isOpen ? 'white' : 'var(--text-light)',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: '0.85rem' }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ fontSize: '0.93rem', lineHeight: 1.7, color: 'var(--text-light)' }}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Strip */}
      <div
        ref={ctaRef}
        style={{
          opacity: 0,
          maxWidth: '900px', margin: '5rem auto 0',
          background: 'linear-gradient(135deg, #FFF 0%, #FFF3EB 100%)',
          borderRadius: 24, padding: '3.5rem 4rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '2rem', border: '1px solid var(--border-light)',
        }}
      >
        <div>
          <h3 style={{ marginBottom: '0.6rem' }}>Still have questions?</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Our team is ready to help you optimize your tiffin service operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button className="btn-primary">Contact Support</button>
          <button style={{ background: 'white', color: 'var(--text-dark)', padding: '0.85rem 1.75rem', borderRadius: '50px', fontWeight: '700', fontSize: '0.95rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>View Docs</button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
