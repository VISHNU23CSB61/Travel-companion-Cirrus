import React, { useState } from 'react';
import { Eye, Radio, PlayCircle } from 'lucide-react';
import './AuraMode.css';

const AuraMode = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="page-container aura-page animate-fade-in">
      <div className="aura-header stagger-1">
        <h1 className="text-gradient">Aura Mode</h1>
        <p className="subtitle">Discover the hidden whispers of the past.</p>
      </div>

      {!active ? (
        <div className="aura-activate-container stagger-2">
          <button className="aura-activate-btn" onClick={() => setActive(true)}>
            <Eye size={48} color="white" />
          </button>
          <p className="aura-hint">Tap to reveal the secrets of Tokyo</p>
        </div>
      ) : (
        <div className="aura-active-view animate-fade-in">
          <div className="ar-overlay">
            <div className="ar-target"></div>
            <div className="ar-info-card glass-panel stagger-1">
              <div className="ar-title">
                <Radio size={20} className="pulse-icon" color="var(--accent-primary)" />
                <h4>Edo Period (1603)</h4>
              </div>
              <p>You are standing on what used to be a major samurai pathway. The scent of matcha and sword-smithing filled this very air.</p>
              
              <button className="play-audio-btn">
                <PlayCircle size={20} /> Listen to the Past
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuraMode;
