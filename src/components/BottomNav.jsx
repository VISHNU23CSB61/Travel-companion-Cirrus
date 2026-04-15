import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Camera, ShieldAlert, Sparkles } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav glass-panel animate-slide-up">
      <NavLink to="/home" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/explore" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Compass size={24} />
        <span>Explore</span>
      </NavLink>
      <NavLink to="/capture" className={({isActive}) => isActive ? "nav-item active action-btn" : "nav-item action-btn"}>
        <div className="action-circle">
          <Camera size={28} color="white" />
        </div>
      </NavLink>
      <NavLink to="/aura" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Sparkles size={24} />
        <span>Aura</span>
      </NavLink>
      <NavLink to="/emergency" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <ShieldAlert size={24} />
        <span>SOS</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
