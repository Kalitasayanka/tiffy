import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const contentRefs = useRef([]);
  const ctaRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' } }
      );

      gsap.fromTo(catRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: catRef.current, start: 'top 85%' } }
      );

      gsap.fromTo(itemRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: itemRefs.current[0], start: 'top 85%' }
        }
      );

      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle accordion animation with GSAP
  useEffect(() => {
    contentRefs.current.forEach((ref, i) => {
      if (!ref) return;
      if (openIndex === i) {
        gsap.to(ref, { height: 'auto', opacity: 1, marginTop: '1rem', duration: 0.5, ease: 'expo.out' });
      } else {
        gsap.to(ref, { height: 0, opacity: 0, marginTop: 0, duration: 0.45, ease: 'expo.inOut' });
      }
    });
  }, [openIndex]);

  return (
    <section id="faq" ref={sectionRef} className="container py-5 my-5">
      
      {/* Header */}
      <div ref={headerRef} className="text-center mb-5" style={{ opacity: 0 }}>
        <span className="badge mb-3">Support</span>
        <h2 className="display-6 fw-bold mb-3">
          Frequently Asked<br />
          <span className="text-primary">Questions</span>
        </h2>
        <p className="mx-auto" style={{ maxWidth: '520px', color: 'var(--text-light)' }}>
          Everything you need to know about Tiffy, the ultimate tiffin management software.
        </p>
      </div>

      <div className="row g-5">
        {/* Category Sidebar */}
        <div className="col-12 col-md-4 col-lg-3">
          <div ref={catRef} style={{ opacity: 0 }}>
            <p className="small fw-bold text-uppercase mb-3 letter-spacing-1" style={{ color: 'var(--text-light)' }}>Categories</p>
            <div className="d-flex flex-md-column gap-2 overflow-auto pb-3 pb-md-0 no-scrollbar">
              {['General', 'Features', 'Pricing'].map((cat, i) => (
                <button
                  key={i}
                  className={`btn border-0 text-start px-3 py-2 rounded-3 whitespace-nowrap`}
                  style={{ 
                    fontSize: '0.9rem', 
                    transition: 'all 0.2s ease',
                    background: i === 0 ? 'var(--primary-light)' : 'transparent',
                    color: i === 0 ? 'var(--primary)' : 'var(--text-light)',
                    fontWeight: i === 0 ? 700 : 500
                  }}
                  onClick={() => i === 0 ? setOpenIndex(0) : null}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="d-flex flex-column gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  ref={el => itemRefs.current[index] = el}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className={`p-4 rounded-4 cursor-pointer transition-all`}
                  style={{ 
                    border: `1px solid ${isOpen ? 'var(--primary-glow)' : 'transparent'}`, 
                    background: isOpen ? 'white' : 'var(--bg-elevated)',
                    boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                    opacity: 0 
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <h4 className="h6 fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>{faq.question}</h4>
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center`}
                      style={{ 
                        width: 32, height: 32, flexShrink: 0,
                        background: isOpen ? 'var(--primary)' : 'white',
                        color: isOpen ? 'white' : 'var(--text-light)',
                        border: `1px solid ${isOpen ? 'transparent' : 'var(--border-light)'}`,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'all 0.4s ease'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                  <div
                    ref={el => contentRefs.current[index] = el}
                    style={{ overflow: 'hidden', height: index === openIndex ? 'auto' : 0, opacity: index === openIndex ? 1 : 0 }}
                  >
                    <p className="small mb-0" style={{ lineHeight: 1.7, color: 'var(--text-light)' }}>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div
        ref={ctaRef}
        className="mt-5 p-4 p-md-5 rounded-5 border shadow-sm text-center text-md-start"
        style={{ opacity: 0, background: 'linear-gradient(135deg, #FFF 0%, #FFF3EB 100%)', borderColor: 'var(--border-light)' }}
      >
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-7">
            <h3 className="fw-bold mb-2">Still have questions?</h3>
            <p className="mb-0" style={{ color: 'var(--text-light)' }}>Our team is ready to help you optimize your tiffin service operations.</p>
          </div>
          <div className="col-12 col-md-5 d-flex gap-2 justify-content-center justify-content-md-end">
            <button className="btn-primary">Contact Support</button>
            <button 
              className="rounded-pill px-4 py-2 fw-bold"
              style={{ background: 'white', color: 'var(--text-dark)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}
            >
              View Docs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
