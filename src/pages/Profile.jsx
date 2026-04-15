import React from 'react';
import { User, Settings, MapPin, Award, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="page-container profile-page animate-fade-in">
      <div className="profile-header stagger-1">
        <div className="profile-avatar bg-gradient">
          <img src="https://ui-avatars.com/api/?name=Vishnu&background=0D8ABC&color=fff&size=200" alt="Profile" />
        </div>
        <h2 className="text-gradient">Vishnu</h2>
        <p className="subtitle">Globetrotter Level 4</p>
      </div>

      <div className="profile-stats glass-panel stagger-2">
        <div className="stat-box">
          <h3>12</h3>
          <p>Places</p>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-box">
          <h3>1,250</h3>
          <p>Aura Pts</p>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-box">
          <h3>5</h3>
          <p>Trips</p>
        </div>
      </div>

      <div className="profile-menu stagger-3">
        <button className="menu-item glass-panel">
          <div className="menu-icon"><User size={20} color="var(--accent-primary)" /></div>
          <span>Personal Details</span>
          <ChevronRight size={20} color="var(--text-secondary)" className="ml-auto" />
        </button>
        <button className="menu-item glass-panel">
          <div className="menu-icon"><MapPin size={20} color="var(--success)" /></div>
          <span>My Journeys</span>
          <ChevronRight size={20} color="var(--text-secondary)" className="ml-auto" />
        </button>
        <button className="menu-item glass-panel">
          <div className="menu-icon"><Award size={20} color="var(--warning)" /></div>
          <span>Aura Rewards</span>
          <ChevronRight size={20} color="var(--text-secondary)" className="ml-auto" />
        </button>
        <button className="menu-item glass-panel">
          <div className="menu-icon"><Settings size={20} color="var(--text-primary)" /></div>
          <span>Settings</span>
          <ChevronRight size={20} color="var(--text-secondary)" className="ml-auto" />
        </button>
        
        <button className="menu-item logout-btn" onClick={handleLogout}>
          <div className="menu-icon"><LogOut size={20} color="white" /></div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
