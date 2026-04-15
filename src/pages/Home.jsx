import React from 'react';
import { CloudRain, MapPin, Coffee, Star, Award, TrendingUp } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="page-container">
      <header className="home-header stagger-1">
        <div>
          <h2 className="greeting">Good Morning,</h2>
          <h1 className="text-gradient">Explorer</h1>
        </div>
        <div className="profile-pic">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" />
        </div>
      </header>

      {/* Real-time Climate Tracking Tracker */}
      <section className="dashboard-section stagger-2">
        <h3 className="section-title">Current Journey: Tokyo</h3>
        <div className="weather-card glass-panel">
          <div className="weather-info">
            <CloudRain size={36} color="var(--accent-secondary)" />
            <div>
              <h2>18°C</h2>
              <p>Light Rain, expected to clear by 2PM.</p>
            </div>
          </div>
          <div className="alert-badge warning-bg animate-pulse">
            Carry an umbrella today!
          </div>
        </div>
      </section>

      {/* Hyper-personalized Recommendations */}
      <section className="dashboard-section stagger-3">
        <div className="section-header">
          <h3 className="section-title">Hyper-Personalized For You</h3>
          <span className="badge">Because you love Cafes</span>
        </div>
        
        <div className="recommendation-card glass-panel">
          <img className="rec-image" src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80" alt="Cafe" />
          <div className="rec-details">
            <div className="rec-title-row">
              <h4>Neon Dreams Cafe</h4>
              <div className="rating"><Star size={14} fill="gold" color="gold"/> 4.9</div>
            </div>
            <p className="rec-desc"><Coffee size={14}/> Hidden gem 2km away. A must-visit matcha spot!</p>
            <button className="btn-primary small-btn">Take me there</button>
          </div>
        </div>
      </section>

      {/* Reward Systems Dashboard */}
      <section className="dashboard-section stagger-4">
        <h3 className="section-title">Your Travel Status</h3>
        <div className="rewards-card glass-panel">
          <div className="reward-stat">
            <div className="icon-circle bg-yellow"><Award size={24} color="white"/></div>
            <div>
              <p className="stat-value">1,250</p>
              <p className="stat-label">Aura Points</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="reward-stat">
            <div className="icon-circle bg-green"><TrendingUp size={24} color="white"/></div>
            <div>
              <p className="stat-value">Level 4</p>
              <p className="stat-label">Globetrotter</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
