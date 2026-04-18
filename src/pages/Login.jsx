import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaneTakeoff, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setTimeout(() => navigate('/home'), 900);
    }
  };

  return (
    <div className="login-container">

      {/* Blurred orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="login-card glass-panel animate-slide-up">

        {/* Logo */}
        <div className="logo-container animate-float">
          <div className="logo-circle">
            <PlaneTakeoff size={44} color="white" />
          </div>
          <div className="logo-ring" />
        </div>

        <h1 className="text-gradient" style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.2s forwards' }}>
          Aura Companion
        </h1>
        <p className="subtitle" style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.3s forwards' }}>
          Your hyper-personalized travel guide
        </p>

        {/* Social Login */}
        <div className="social-login" style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.35s forwards' }}>
          <button className="social-btn" id="google-login-btn">
            <span>🌐</span> Continue with Google
          </button>
        </div>

        <div className="divider-row" style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.4s forwards' }}>
          <div className="divider-line" />
          <span>or</span>
          <div className="divider-line" />
        </div>

        <form
          onSubmit={handleLogin}
          className="login-form"
          style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.45s forwards' }}
        >
          <div className="input-group">
            <Mail size={16} className="input-icon" />
            <input
              id="email-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: '42px' }}
            />
          </div>
          <div className="input-group">
            <Lock size={16} className="input-icon" />
            <input
              id="password-input"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              required
              style={{ paddingLeft: '42px', paddingRight: '42px' }}
            />
            <button
              type="button"
              className="toggle-pass"
              id="toggle-password-btn"
              onClick={() => setShowPass(p => !p)}
              aria-label="Toggle password visibility"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className={`btn-primary login-btn ${loading ? 'loading' : ''}`}
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>Start Journey <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p className="signup-hint" style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out 0.6s forwards' }}>
          New here? <button className="link-btn" id="sign-up-btn">Create account</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
