import React, { useState } from 'react';
import { User, Settings, MapPin, Award, LogOut, ChevronRight, Camera, Star, Globe, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const BADGES = [
  { icon: '🌏', label: 'Globetrotter', color: '#3b82f6' },
  { icon: '📸', label: 'Photographer', color: '#d946ef' },
  { icon: '🍜', label: 'Foodie', color: '#f59e0b' },
  { icon: '🏯', label: 'Historian', color: '#10b981' },
];

const JOURNEY_LOGS = [
  { city: 'Kyoto', flag: '🇯🇵', date: 'Mar 2025', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80' },
  { city: 'Bali', flag: '🇮🇩', date: 'Jan 2025', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&q=80' },
  { city: 'Paris', flag: '🇫🇷', date: 'Nov 2024', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=200&q=80' },
  { city: 'NYC', flag: '🇺🇸', date: 'Sep 2024', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=200&q=80' },
];

const MENU_ITEMS = [
  { icon: <User size={20} />, label: 'Personal Details', color: 'var(--accent-primary)' },
  { icon: <Globe size={20} />, label: 'My Journeys', color: 'var(--success)' },
  { icon: <Award size={20} />, label: 'Aura Rewards', color: 'var(--warning)' },
  { icon: <Camera size={20} />, label: 'Memories Gallery', color: '#d946ef' },
  { icon: <Settings size={20} />, label: 'Settings', color: 'var(--text-secondary)' },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('badges');

  return (
    <div className="page-container profile-page animate-fade-in">

      {/* ── Cover & Avatar ── */}
      <div className="profile-cover stagger-1">
        <div className="cover-gradient" />
        <button className="cover-edit-btn" id="edit-cover-btn" aria-label="Edit cover">
          <Edit3 size={14} color="white" />
        </button>
        <div className="avatar-wrap">
          <img
            src="https://ui-avatars.com/api/?name=Vishnu&background=3b82f6&color=fff&size=200"
            alt="Profile"
            className="avatar-img"
          />
          <button className="avatar-cam-btn" id="change-avatar-btn" aria-label="Change photo">
            <Camera size={12} color="white" />
          </button>
        </div>
      </div>

      {/* ── Name & Rank ── */}
      <div className="profile-identity stagger-2">
        <h2 className="text-gradient">Vishnu</h2>
        <div className="rank-badge">
          <Star size={13} fill="gold" color="gold" /> Globetrotter · Level 4
        </div>
        <p className="profile-bio">Chasing sunsets & street food 🌅 · 12 countries explored</p>
      </div>

      {/* ── Stats ── */}
      <div className="profile-stats glass-panel stagger-2">
        <div className="stat-box">
          <h3>12</h3>
          <p>Countries</p>
        </div>
        <div className="stat-separator" />
        <div className="stat-box">
          <h3>1,250</h3>
          <p>Aura Pts</p>
        </div>
        <div className="stat-separator" />
        <div className="stat-box">
          <h3>5</h3>
          <p>Trips</p>
        </div>
        <div className="stat-separator" />
        <div className="stat-box">
          <h3>48</h3>
          <p>Photos</p>
        </div>
      </div>

      {/* ── Tab toggle ── */}
      <div className="profile-tabs stagger-3">
        <button
          id="tab-badges"
          className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button
          id="tab-journeys"
          className={`tab-btn ${activeTab === 'journeys' ? 'active' : ''}`}
          onClick={() => setActiveTab('journeys')}
        >
          Journey Log
        </button>
      </div>

      {activeTab === 'badges' ? (
        <div className="badges-grid stagger-3">
          {BADGES.map(b => (
            <div key={b.label} className="badge-card glass-panel" id={`badge-${b.label.toLowerCase()}`}>
              <span className="badge-emoji">{b.icon}</span>
              <span className="badge-label">{b.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="journey-log stagger-3">
          {JOURNEY_LOGS.map(j => (
            <div key={j.city} className="journey-item glass-panel" id={`journey-${j.city.toLowerCase()}`}>
              <img src={j.img} alt={j.city} className="journey-thumb" />
              <div className="journey-info">
                <h4>{j.flag} {j.city}</h4>
                <p>{j.date}</p>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          ))}
        </div>
      )}

      {/* ── Menu ── */}
      <div className="profile-menu stagger-4">
        {MENU_ITEMS.map(item => (
          <button key={item.label} className="menu-item glass-panel" id={`menu-${item.label.replace(/\s+/g,'-').toLowerCase()}`}>
            <div className="menu-icon" style={{ color: item.color, background: `${item.color}18` }}>
              {item.icon}
            </div>
            <span>{item.label}</span>
            <ChevronRight size={18} color="var(--text-secondary)" className="ml-auto" />
          </button>
        ))}

        <button className="menu-item logout-btn" id="logout-btn" onClick={() => navigate('/login')}>
          <div className="menu-icon logout-icon">
            <LogOut size={20} color="white" />
          </div>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
