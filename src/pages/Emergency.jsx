import React, { useState, useRef } from 'react';
import { Phone, ShieldAlert, HeartPulse, MapPin, MessageCircle, Globe } from 'lucide-react';
import './Emergency.css';

const CONTACTS = [
  {
    id: 'police',
    icon: <Phone size={22} />,
    title: 'Police (Japan)',
    number: '110',
    type: 'danger',
    desc: 'Available 24/7 — English assistance available'
  },
  {
    id: 'ambulance',
    icon: <HeartPulse size={22} />,
    title: 'Ambulance / Fire',
    number: '119',
    type: 'warning',
    desc: 'Medical & fire emergency response'
  },
  {
    id: 'embassy',
    icon: <Globe size={22} />,
    title: 'Your Embassy',
    number: '+81 3-3224-5000',
    type: 'neutral',
    desc: 'Indian Embassy — Tokyo'
  },
  {
    id: 'tourist',
    icon: <MessageCircle size={22} />,
    title: 'Tourist Helpline',
    number: '0570-051-190',
    type: 'info',
    desc: 'Japan Travel Information Centre'
  }
];

const Emergency = () => {
  const [sosArmed, setSosArmed] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const holdTimer = useRef(null);

  const startHold = () => {
    setSosArmed(true);
    holdTimer.current = setTimeout(() => {
      setSosTriggered(true);
    }, 3000);
  };

  const cancelHold = () => {
    clearTimeout(holdTimer.current);
    if (!sosTriggered) setSosArmed(false);
  };

  return (
    <div className="page-container emergency-page">

      {/* Header */}
      <div className="emergency-header stagger-1">
        <div className="emergency-icon-wrap">
          <ShieldAlert size={40} className="shield-icon" />
        </div>
        <div>
          <h1 className="text-gradient">SOS & Safety</h1>
          <p className="subtitle">Offline contacts · Tokyo, Japan <MapPin size={12} /></p>
        </div>
      </div>

      {/* SOS Button */}
      <div className="emergency-actions stagger-2">
        {sosTriggered ? (
          <div className="sos-triggered animate-scale-in">
            <div className="sos-sent-icon">📡</div>
            <h3>SOS Sent!</h3>
            <p>Alerting local authorities & your emergency contact.</p>
            <button className="btn-ghost" id="cancel-sos-btn" onClick={() => { setSosTriggered(false); setSosArmed(false); }}>
              Cancel Alert
            </button>
          </div>
        ) : (
          <>
            <div className={`sos-rings ${sosArmed ? 'armed' : ''}`}>
              <div className="sos-ring r1" />
              <div className="sos-ring r2" />
              <button
                className={`sos-btn ${sosArmed ? 'armed' : ''}`}
                id="sos-btn"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                aria-label="SOS Button"
              >
                <span>SOS</span>
                {sosArmed && <div className="sos-progress" />}
              </button>
            </div>
            <p className="sos-help">{sosArmed ? '⏳ Hold for 3 seconds...' : '🔴 Hold 3s to alert local authorities'}</p>
          </>
        )}
      </div>

      {/* Offline contacts */}
      <section className="contacts-section stagger-3">
        <h3 className="section-title">Offline Emergency Contacts</h3>

        {CONTACTS.map(c => (
          <div key={c.id} className={`contact-card glass-panel ${c.type}-border`} id={`contact-${c.id}`}>
            <div className={`contact-icon-wrap ${c.type}-icon`}>
              {c.icon}
            </div>
            <div className="contact-details">
              <h4>{c.title}</h4>
              <p className="contact-number">{c.number}</p>
              <p className="contact-desc">{c.desc}</p>
            </div>
            <button className={`call-btn ${c.type}-call`} id={`call-${c.id}-btn`}>Call</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Emergency;
