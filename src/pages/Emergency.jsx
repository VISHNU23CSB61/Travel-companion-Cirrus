import React from 'react';
import { Phone, ShieldAlert, HeartPulse, MapPin } from 'lucide-react';
import './Emergency.css';

const Emergency = () => {
  return (
    <div className="page-container emergency-page">
      <div className="emergency-header stagger-1">
        <ShieldAlert size={48} color="var(--danger)" />
        <h1 className="text-gradient">Local Emergency Info</h1>
        <p className="subtitle">Offline contacts based on your location (Tokyo).</p>
      </div>

      <div className="emergency-actions stagger-2">
        <button className="sos-btn">
          <span>SOS</span>
        </button>
        <p className="sos-help">Hold for 3 seconds to alert local authorities</p>
      </div>

      <section className="contacts-section stagger-3">
        <h3 className="section-title">Offline Contacts</h3>
        
        <div className="contact-card glass-panel danger-border">
          <div className="contact-icon"><Phone size={24} color="var(--danger)" /></div>
          <div className="contact-details">
            <h4>Police (Japan)</h4>
            <p>110</p>
          </div>
          <button className="call-btn">Call</button>
        </div>

        <div className="contact-card glass-panel warning-border">
          <div className="contact-icon"><HeartPulse size={24} color="var(--warning)" /></div>
          <div className="contact-details">
            <h4>Ambulance / Fire</h4>
            <p>119</p>
          </div>
          <button className="call-btn warning-btn">Call</button>
        </div>

        <div className="contact-card glass-panel">
          <div className="contact-icon"><MapPin size={24} /></div>
          <div className="contact-details">
            <h4>Your Embassy</h4>
            <p>+81 3-3224-5000</p>
          </div>
          <button className="call-btn">Call</button>
        </div>
      </section>
    </div>
  );
};

export default Emergency;
