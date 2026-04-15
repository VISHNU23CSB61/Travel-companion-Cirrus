import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaneTakeoff, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if(email) {
      // Simulate quick animated login
      setTimeout(() => navigate('/home'), 500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-slide-up">
        <div className="logo-container animate-float">
          <div className="logo-circle">
            <PlaneTakeoff size={48} color="white" />
          </div>
        </div>
        
        <h1 className="text-gradient stagger-1" style={{opacity: 0, animation: 'fadeIn 0.5s ease-out 0.1s forwards'}}>Aura Companion</h1>
        <p className="subtitle stagger-1" style={{opacity: 0, animation: 'fadeIn 0.5s ease-out 0.2s forwards'}}>Your hyper-personalized travel guide.</p>
        
        <form onSubmit={handleLogin} className="login-form stagger-2" style={{opacity: 0, animation: 'fadeIn 0.5s ease-out 0.3s forwards'}}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Enter your password" 
              required
            />
          </div>
          <button type="submit" className="btn-primary login-btn">
            Start Journey <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
