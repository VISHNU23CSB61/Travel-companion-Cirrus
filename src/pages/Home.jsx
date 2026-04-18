import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets, Wind, Sun, ChevronRight, Zap,
  Award, TrendingUp, Coffee, Star, Clock,
  MapPin, Camera, BookOpen, Plane, AlertTriangle
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather }     from '../hooks/useWeather';
import './Home.css';

/* ─── Weather Icon Resolver ─── */
function WeatherEmoji({ code, size = 40 }) {
  const map = {
    0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️',
    45:'🌫️', 48:'🌫️',
    51:'🌦️', 53:'🌦️', 55:'🌧️',
    61:'🌧️', 63:'🌧️', 65:'🌧️',
    71:'🌨️', 73:'❄️', 75:'❄️',
    80:'🌦️', 81:'🌧️', 82:'⛈️',
    95:'⛈️', 96:'⛈️', 99:'⛈️',
  };
  const emoji = map[code] ?? '🌡️';
  return <span style={{ fontSize: size }}>{emoji}</span>;
}

/* ─── Smart Alert from weather code ─── */
function getWeatherAlert(code, precipitation) {
  if (code >= 95) return '⚡ Thunderstorm warning — avoid open areas';
  if (code >= 80) return '☂️ Rain showers expected — carry an umbrella';
  if (code >= 61) return '🌧️ Rainy day — pack a raincoat';
  if (code >= 71) return '❄️ Snow — dress warm and travel carefully';
  if (code === 45 || code === 48) return '🌫️ Dense fog — reduced visibility';
  if (precipitation > 0) return '🌂️ Light precipitation expected';
  if (code <= 1) return '☀️ Beautiful day — great time to explore!';
  return null;
}

/* ─── Skeleton Loader ─── */
function WeatherSkeleton() {
  return (
    <div className="weather-card glass-panel">
      <div className="weather-skeleton">
        <div className="sk-block sk-circle" />
        <div className="sk-lines">
          <div className="sk-block sk-line-lg" />
          <div className="sk-block sk-line-sm" />
        </div>
      </div>
      <div className="sk-block sk-strip" />
    </div>
  );
}

/* ─── Quick Actions ─── */
const QUICK_ACTIONS = [
  { icon: <Plane size={18} />,   label: 'Flights',  color: '#3b82f6', path: '/flights' },
  { icon: <MapPin size={18} />,  label: 'Nearby',   color: '#10b981', path: '/explore' },
  { icon: <Camera size={18} />,  label: 'Memories', color: '#d946ef', path: '/capture' },
  { icon: <BookOpen size={18} />,label: 'Journal',  color: '#f59e0b', path: null },
];

/* ────────────────────────────────── */

const Home = () => {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning,';
    if (h < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  }, []);

  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const { weather, location, loading: weatherLoading, error: weatherError } = useWeather(coords);
  const navigate = useNavigate();

  const isLoading = geoLoading || weatherLoading;
  const locationName = location?.shortDisplay ?? location?.city ?? '—';
  const countryCode  = location?.countryCode ?? '';
  const weatherAlert = weather ? getWeatherAlert(weather.code, weather.precipitation) : null;

  return (
    <div className="page-container">

      {/* ── Header ── */}
      <header className="home-header animate-slide-up stagger-1">
        <div>
          <p className="greeting">{greeting}</p>
          <h1 className="text-gradient">Explorer</h1>
        </div>
        <div className="header-right">
          <button className="notif-btn" id="notif-btn" aria-label="Notifications">
            <Zap size={20} />
            <span className="notif-dot" />
          </button>
          <div className="profile-pic">
            <img src="https://i.pravatar.cc/150?img=32" alt="Profile" />
            <div className="online-ring" />
          </div>
        </div>
      </header>

      {/* ── Quick Actions ── */}
      <section className="quick-actions animate-slide-up stagger-2">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            className="quick-action-btn glass-panel"
            id={`quick-action-${a.label.toLowerCase()}`}
            onClick={() => a.path && navigate(a.path)}
            style={{ cursor: a.path ? 'pointer' : 'default' }}
          >
            <div className="qa-icon" style={{ background: `${a.color}22`, color: a.color }}>{a.icon}</div>
            <span>{a.label}</span>
          </button>
        ))}
      </section>

      {/* ── REAL Weather Card ── */}
      <section className="dashboard-section animate-slide-up stagger-2">
        <div className="section-header">
          <h3 className="section-title">
            {location ? `📍 ${locationName}${countryCode ? `, ${countryCode}` : ''}` : 'Current Weather'}
          </h3>
          {!isLoading && (
            <span className="live-badge">
              <span className="live-dot" /> LIVE
            </span>
          )}
        </div>

        {/* Geo permission error */}
        {geoError && !geoLoading && (
          <div className="error-state glass-panel">
            <AlertTriangle size={20} color="var(--warning)" />
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Location access denied</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Enable location in browser settings to see real weather.
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && <WeatherSkeleton />}

        {/* Real Weather */}
        {!isLoading && weather && (
          <div className="weather-card glass-panel">
            <div className="weather-top">
              <div className="weather-icon-wrap">
                <WeatherEmoji code={weather.code} size={42} />
              </div>
              <div className="weather-main">
                <h2 className="weather-temp">{weather.temp}°</h2>
                <p className="weather-desc">{weather.label}</p>
                <p className="weather-feels">Feels like {weather.feelsLike}°</p>
              </div>
              <div className="weather-side-stats">
                <div className="side-stat">
                  <Droplets size={14} color="var(--accent-primary)" />
                  <span>{weather.humidity}%</span>
                </div>
                <div className="side-stat">
                  <Wind size={14} color="var(--accent-secondary)" />
                  <span>{weather.windSpeed}km/h</span>
                </div>
                <div className="side-stat">
                  <Sun size={14} color="var(--warning)" />
                  <span>UV {Math.round(weather.uvIndex)}</span>
                </div>
              </div>
            </div>

            {/* Real Hourly Forecast */}
            {weather.hourly?.length > 0 && (
              <div className="hourly-strip">
                {weather.hourly.map((h, i) => (
                  <div key={h.time} className={`hour-item ${i === 0 ? 'current' : ''}`}>
                    <span className="hour-label">{i === 0 ? 'Now' : h.time}</span>
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{h.emoji}</span>
                    <span className="hour-temp">{h.temp}°</span>
                  </div>
                ))}
              </div>
            )}

            {weatherAlert && (
              <div className="alert-badge warning-bg animate-pulse">
                {weatherAlert}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Featured Recommendation (static but rich) ── */}
      <section className="dashboard-section animate-slide-up stagger-3">
        <div className="section-header">
          <h3 className="section-title">Picked For You</h3>
          <span className="chip active">Cafes ☕</span>
        </div>
        <div className="recommendation-card glass-panel" id="rec-card-neon-dreams">
          <img
            className="rec-image"
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
            alt="Cafe"
          />
          <div className="rec-gradient-overlay" />
          <div className="rec-details">
            <div className="rec-title-row">
              <h4>Neon Dreams Cafe</h4>
              <div className="rating"><Star size={14} fill="gold" color="gold" /> 4.9</div>
            </div>
            <p className="rec-desc"><Coffee size={13} /> Hidden gem nearby · Must-visit matcha spot</p>
            <div className="rec-footer">
              <div className="rec-meta"><Clock size={12} /> Open until 10 PM</div>
              <button className="btn-primary small-btn" id="take-me-there-btn">Take me there</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Aura Status ── */}
      <section className="dashboard-section animate-slide-up stagger-4">
        <h3 className="section-title">Your Aura Status</h3>
        <div className="rewards-card glass-panel">
          <div className="reward-stat">
            <div className="icon-circle bg-yellow"><Award size={22} color="white" /></div>
            <div>
              <p className="stat-value">1,250</p>
              <p className="stat-label">Aura Points</p>
            </div>
          </div>
          <div className="divider" />
          <div className="reward-stat">
            <div className="icon-circle bg-green"><TrendingUp size={22} color="white" /></div>
            <div>
              <p className="stat-value">Level 4</p>
              <p className="stat-label">Globetrotter</p>
            </div>
          </div>
        </div>

        <div className="xp-bar-wrap glass-panel">
          <div className="xp-labels">
            <span>Lv 4 <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Globetrotter</span></span>
            <span className="xp-count">1,250 / 2,000 XP</span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: '62.5%' }} />
          </div>
          <p className="xp-hint">750 XP to reach <strong>Lv 5 — Wanderer</strong></p>
        </div>
      </section>
    </div>
  );
};

export default Home;
