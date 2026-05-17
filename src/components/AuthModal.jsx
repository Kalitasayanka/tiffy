import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthModal = () => {
  const { isAuthModalOpen, authModalMode, closeModal, login } = useAuth();
  const [mode, setMode] = useState(authModalMode);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    setMode(authModalMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setShowPassword(false);
  }, [authModalMode, isAuthModalOpen]);

  useEffect(() => {
    if (isAuthModalOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'flex', ease: 'power2.out' });
      gsap.fromTo(modalRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'expo.out' }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
        if(overlayRef.current) overlayRef.current.style.display = 'none';
      }});
    }
  }, [isAuthModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    const url = mode === 'login' ? `${API_URL}/api/login` : `${API_URL}/api/signup`;
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onBtnEnter = (e) => {
    if(!loading) gsap.to(e.currentTarget, { scale: 1.03, boxShadow: '0 12px 30px rgba(204,85,0,0.3)', duration: 0.3, ease: 'power2.out' });
  };
  const onBtnLeave = (e) => {
    if(!loading) gsap.to(e.currentTarget, { scale: 1, boxShadow: '0 8px 20px rgba(204,85,0,0.2)', duration: 0.4, ease: 'power2.out' });
  };
  const onInputFocus = (e) => gsap.to(e.currentTarget, { boxShadow: '0 0 0 4px rgba(204,85,0,0.15)', borderColor: '#CC5500', duration: 0.3 });
  const onInputBlur = (e) => gsap.to(e.currentTarget, { boxShadow: 'none', borderColor: 'transparent', duration: 0.3 });

  return (
    <div 
      ref={overlayRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(15, 17, 23, 0.4)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'none', alignItems: 'center', justifyContent: 'center',
        opacity: 0
      }}
      onClick={(e) => e.target === overlayRef.current && closeModal()}
    >
      <div 
        ref={modalRef}
        style={{
          width: '90%', maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
          borderRadius: '24px', padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0" style={{ color: 'var(--text-dark)', letterSpacing: '-0.03em' }}>
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h3>
          <button 
            onClick={closeModal}
            className="btn-close" 
            style={{ filter: 'invert(1)' }}
          ></button>
        </div>

        {error && <div className="alert alert-danger small py-2 rounded-3 border-0" style={{ background: '#FFEBEB', color: '#D32F2F' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {mode === 'signup' && (
            <div>
              <label className="form-label small fw-bold text-muted mb-1">Name</label>
              <input 
                type="text" required 
                className="form-control form-control-lg bg-light rounded-3" 
                style={{ fontSize: '0.95rem', border: '1px solid transparent', outline: 'none', transition: 'none' }}
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                onFocus={onInputFocus} onBlur={onInputBlur}
              />
            </div>
          )}
          <div>
            <label className="form-label small fw-bold text-muted mb-1">Email address</label>
            <input 
              type="email" required 
              className="form-control form-control-lg bg-light rounded-3" 
              style={{ fontSize: '0.95rem', border: '1px solid transparent', outline: 'none', transition: 'none' }}
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              onFocus={onInputFocus} onBlur={onInputBlur}
            />
          </div>
          <div className="position-relative">
            <label className="form-label small fw-bold text-muted mb-1">Password</label>
            <input 
              type={showPassword ? "text" : "password"} required 
              className="form-control form-control-lg bg-light rounded-3" 
              style={{ fontSize: '0.95rem', border: '1px solid transparent', outline: 'none', transition: 'none' }}
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              onFocus={onInputFocus} onBlur={onInputBlur}
            />
            <button 
              type="button" 
              className="btn btn-link position-absolute end-0 bottom-0 text-muted"
              style={{ padding: '0.7rem', transform: 'translateY(-2px)', textDecoration: 'none' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {mode === 'signup' && (
            <div className="position-relative">
              <label className="form-label small fw-bold text-muted mb-1">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} required 
                className="form-control form-control-lg bg-light rounded-3" 
                style={{ fontSize: '0.95rem', border: '1px solid transparent', outline: 'none', transition: 'none' }}
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                onFocus={onInputFocus} onBlur={onInputBlur}
              />
            </div>
          )}

          <button  
            type="submit" 
            disabled={loading}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
            className="w-100 py-3 mt-3 rounded-pill fw-bold border-0"
            style={{ 
              background: '#CC5500', color: 'white',
              boxShadow: '0 8px 20px rgba(204,85,0,0.2)',
              transition: 'transform 0.2s ease',
              transform: loading ? 'scale(0.98)' : 'scale(1)'
            }}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Start free trial')}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 small text-muted">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="fw-bold cursor-pointer" 
            style={{ color: '#CC5500' }}
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
