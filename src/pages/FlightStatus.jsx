import React, { useState, useRef } from 'react';
import {
  Plane, Search, ArrowRight, Clock, MapPin, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Key, ExternalLink,
  ChevronRight, Wind, Navigation
} from 'lucide-react';
import { getApiKey, saveApiKey, clearApiKey } from '../services/flightService';
import { useFlightSearch } from '../hooks/useFlight';
import './FlightStatus.css';

/* ─── Airline logo via Airhex CDN ─── */
function AirlineLogo({ iata, name }) {
  const [err, setErr] = useState(false);
  if (!iata || err) {
    return (
      <div className="airline-logo-fallback">
        <Plane size={20} />
      </div>
    );
  }
  return (
    <img
      src={`https://content.airhex.com/content/logos/airports_${iata}_30_30_f.png`}
      alt={name}
      className="airline-logo"
      onError={() => setErr(true)}
    />
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  return (
    <span
      className="status-badge"
      style={{ background: `${status.color}20`, color: status.color, borderColor: `${status.color}40` }}
    >
      {status.emoji} {status.label}
    </span>
  );
}

/* ─── Individual flight card ─── */
function FlightCard({ flight }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flight-card glass-panel" id={`flight-${flight.iata}`}>
      {/* Top row */}
      <div className="flight-header" onClick={() => setExpanded(e => !e)}>
        <div className="flight-airline">
          <AirlineLogo iata={flight.airlineIata} name={flight.airlineName} />
          <div>
            <p className="flight-number">{flight.iata}</p>
            <p className="flight-airline-name">{flight.airlineName}</p>
          </div>
        </div>
        <StatusBadge status={flight.status} />
        <ChevronRight
          size={18}
          color="var(--text-secondary)"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.25s' }}
        />
      </div>

      {/* Route */}
      <div className="flight-route">
        <div className="route-end">
          <p className="route-iata">{flight.depIata}</p>
          <p className="route-time">{flight.depTime}</p>
          {flight.depDelay && <span className="delay-tag">+{flight.depDelay}</span>}
          <p className="route-airport">{flight.depAirport.length > 22 ? flight.depAirport.slice(0, 22) + '…' : flight.depAirport}</p>
        </div>

        <div className="route-middle">
          <div className="route-line">
            <div className="route-dot" />
            <div className="route-dash" />
            <Plane size={18} className="route-plane-icon" />
            <div className="route-dash" />
            <div className="route-dot" />
          </div>
          <p className="route-date">{flight.depDate}</p>
        </div>

        <div className="route-end route-end-right">
          <p className="route-iata">{flight.arrIata}</p>
          <p className="route-time">{flight.arrTime}</p>
          {flight.arrDelay && <span className="delay-tag">{flight.arrDelay}</span>}
          <p className="route-airport">{flight.arrAirport.length > 22 ? flight.arrAirport.slice(0, 22) + '…' : flight.arrAirport}</p>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="flight-details animate-slide-up">
          <div className="detail-grid">
            {flight.depTerminal && (
              <div className="detail-item">
                <span className="detail-label">Dep Terminal</span>
                <span className="detail-value">{flight.depTerminal}</span>
              </div>
            )}
            {flight.depGate && (
              <div className="detail-item">
                <span className="detail-label">Gate</span>
                <span className="detail-value">{flight.depGate}</span>
              </div>
            )}
            {flight.arrTerminal && (
              <div className="detail-item">
                <span className="detail-label">Arr Terminal</span>
                <span className="detail-value">{flight.arrTerminal}</span>
              </div>
            )}
            {flight.arrGate && (
              <div className="detail-item">
                <span className="detail-label">Arr Gate</span>
                <span className="detail-value">{flight.arrGate}</span>
              </div>
            )}
            {flight.aircraft && (
              <div className="detail-item">
                <span className="detail-label">Aircraft</span>
                <span className="detail-value">{flight.aircraft}</span>
              </div>
            )}
            {flight.live?.altitude && (
              <div className="detail-item">
                <span className="detail-label">Altitude</span>
                <span className="detail-value">{Math.round(flight.live.altitude * 3.28084).toLocaleString()} ft</span>
              </div>
            )}
            {flight.live?.speed_horizontal && (
              <div className="detail-item">
                <span className="detail-label">Speed</span>
                <span className="detail-value">{Math.round(flight.live.speed_horizontal)} km/h</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── API Key Setup Screen ─── */
function ApiKeySetup({ onSave }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed.length < 16) {
      setError('Key looks too short. Paste the full key from your AviationStack dashboard.');
      return;
    }
    saveApiKey(trimmed);
    onSave();
  };

  return (
    <div className="apikey-setup animate-slide-up">
      <div className="apikey-icon">
        <Key size={40} color="var(--accent-primary)" />
      </div>
      <h2>Connect Flight Data</h2>
      <p className="apikey-desc">
        Flight status data requires a free AviationStack API key.
        <br />No credit card required — takes 30 seconds.
      </p>

      <ol className="apikey-steps">
        <li>
          <a href="https://aviationstack.com/" target="_blank" rel="noopener noreferrer" className="apikey-link">
            Open aviationstack.com <ExternalLink size={12} />
          </a>
        </li>
        <li>Click <strong>Get Free API Key</strong> → sign up (email only)</li>
        <li>Copy your API key from the dashboard</li>
        <li>Paste it below:</li>
      </ol>

      <div className="apikey-input-group">
        <input
          id="apikey-input"
          type="password"
          placeholder="Paste your API key here…"
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        {error && <p className="apikey-error"><AlertTriangle size={13} /> {error}</p>}
      </div>

      <button
        className="btn-primary apikey-save-btn"
        id="save-apikey-btn"
        onClick={handleSave}
        disabled={!value.trim()}
      >
        Save & Search Flights <ArrowRight size={18} />
      </button>

      <p className="apikey-note">
        🔒 Key is stored locally on your device only. Never sent anywhere except AviationStack.
      </p>
    </div>
  );
}

/* ─── Main FlightStatus Page ─── */
const FlightStatus = () => {
  const [hasKey,    setHasKey]    = useState(!!getApiKey());
  const [inputVal,  setInputVal]  = useState('');
  const inputRef = useRef();

  const { results, loading, error, query, search } = useFlightSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    search(inputVal);
  };

  const handleKeySaved = () => setHasKey(true);

  const handleClearKey = () => {
    clearApiKey();
    setHasKey(false);
  };

  /* ── Error message resolver ── */
  const errorMessage = (() => {
    if (!error) return null;
    if (error === 'NO_KEY')      return null; // handled by setup screen
    if (error === 'INVALID_KEY') return { icon: <XCircle size={18} />, text: 'Invalid API key. Check your AviationStack dashboard.', action: handleClearKey, actionLabel: 'Re-enter key' };
    if (error === 'NO_RESULTS')  return { icon: <Search size={18} />, text: `No flights found for "${query}". Check the IATA code (e.g. AI101, 6E123).` };
    return { icon: <AlertTriangle size={18} />, text: `Error: ${error}` };
  })();

  if (!hasKey) {
    return (
      <div className="page-container flight-page">
        <header className="flight-header-bar stagger-1">
          <h1 className="text-gradient">Flight Status</h1>
        </header>
        <ApiKeySetup onSave={handleKeySaved} />
      </div>
    );
  }

  return (
    <div className="page-container flight-page">

      {/* ── Header ── */}
      <header className="flight-header-bar animate-slide-up stagger-1">
        <div>
          <h1 className="text-gradient">Flight Status</h1>
          <p className="subtitle">Real-time flight tracking</p>
        </div>
        <button
          className="icon-btn-sm"
          id="change-key-btn"
          onClick={handleClearKey}
          title="Change API key"
        >
          <Key size={15} />
        </button>
      </header>

      {/* ── Search bar ── */}
      <form className="flight-search-form glass-panel animate-slide-up stagger-2" onSubmit={handleSearch}>
        <Plane size={18} color="var(--accent-primary)" />
        <input
          ref={inputRef}
          id="flight-number-input"
          type="text"
          placeholder="Flight number (e.g. AI101, 6E-123, UA789)"
          value={inputVal}
          onChange={e => setInputVal(e.target.value.toUpperCase())}
          style={{ border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}
          autoComplete="off"
          autoCapitalize="characters"
        />
        <button
          type="submit"
          className="search-go-btn"
          id="search-flight-btn"
          disabled={loading || !inputVal.trim()}
          aria-label="Search"
        >
          {loading ? <RefreshCw size={16} className="spin-icon" /> : <Search size={16} />}
        </button>
      </form>

      {/* ── Quick flight code guide ── */}
      {!results.length && !loading && !error && (
        <div className="flight-tips animate-slide-up stagger-3">
          <p className="tips-title">Try popular routes</p>
          <div className="scroll-strip">
            {['AI101','6E123','EK501','SQ422','G8111','QR541'].map(code => (
              <button
                key={code}
                className="chip"
                id={`quick-${code}`}
                onClick={() => { setInputVal(code); search(code); }}
              >
                {code}
              </button>
            ))}
          </div>

          <div className="info-box glass-panel">
            <div className="info-row"><CheckCircle size={14} color="var(--success)" /><span>Enter IATA flight code without spaces: <strong>AI101</strong></span></div>
            <div className="info-row"><CheckCircle size={14} color="var(--success)" /><span>Or with dash: <strong>6E-123</strong></span></div>
            <div className="info-row"><Clock size={14} color="var(--accent-primary)" /><span>Data updates every few minutes from AviationStack</span></div>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flight-loading animate-fade-in">
          <div className="flight-loading-animation">
            <Plane size={32} className="loading-plane" />
            <div className="loading-trail" />
          </div>
          <p>Fetching real-time data for <strong>{query}</strong>…</p>
        </div>
      )}

      {/* ── Error ── */}
      {errorMessage && !loading && (
        <div className="flight-error glass-panel animate-slide-up">
          {errorMessage.icon}
          <div>
            <p>{errorMessage.text}</p>
            {errorMessage.action && (
              <button className="btn-ghost" style={{ marginTop: 10 }} onClick={errorMessage.action}>
                {errorMessage.actionLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {!loading && results.length > 0 && (
        <div className="flight-results animate-slide-up">
          <p className="results-label">
            <Navigation size={14} /> {results.length} result{results.length > 1 ? 's' : ''} for <strong>{query}</strong>
          </p>
          {results.map(f => (
            <FlightCard key={`${f.iata}-${f.depScheduled}`} flight={f} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightStatus;
