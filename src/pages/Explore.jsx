import React, { useState } from 'react';
import {
  Bell, Search, MapPin, Star, ArrowRight,
  Utensils, TreePine, Landmark, Music,
  RefreshCw, AlertTriangle, Navigation
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePlaces }      from '../hooks/usePlaces';
import './Explore.css';

const CATEGORIES = [
  { id: 'all',       label: 'All',       icon: <MapPin size={14} /> },
  { id: 'food',      label: 'Food',       icon: <Utensils size={14} /> },
  { id: 'nature',    label: 'Nature',     icon: <TreePine size={14} /> },
  { id: 'culture',   label: 'Culture',    icon: <Landmark size={14} /> },
  { id: 'nightlife', label: 'Nightlife',  icon: <Music size={14} /> },
];

const CHECKLIST_DEFAULTS = [
  { id: 'item1', label: 'Visit a local landmark' },
  { id: 'item2', label: 'Try authentic street food' },
  { id: 'item3', label: 'Catch a local event' },
  { id: 'item4', label: 'Take a scenic walk' },
];

/* ─── Skeleton card ─── */
function PlaceSkeleton() {
  return (
    <div className="place-card glass-panel">
      <div className="place-img-wrap">
        <div className="sk-block" style={{ width: '100%', height: '100px', borderRadius: '0' }} />
      </div>
      <div className="place-info" style={{ gap: '8px' }}>
        <div className="sk-block sk-line-lg" style={{ height: '14px' }} />
        <div className="sk-block sk-line-sm" style={{ height: '11px' }} />
        <div className="sk-block" style={{ height: '26px', width: '80px', borderRadius: '8px', marginTop: '4px' }} />
      </div>
    </div>
  );
}

/* ─── Type label for display ─── */
function typeLabel(type) {
  const map = {
    restaurant: 'Restaurant', cafe: 'Café', fast_food: 'Fast Food',
    bakery: 'Bakery', park: 'Park', garden: 'Garden', beach: 'Beach',
    nature_reserve: 'Reserve', museum: 'Museum', monument: 'Monument',
    gallery: 'Gallery', castle: 'Castle', attraction: 'Attraction',
    place_of_worship: 'Shrine', bar: 'Bar', pub: 'Pub',
    nightclub: 'Club', cinema: 'Cinema',
  };
  return map[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

/* ─── Open link in Maps ─── */
function openInMaps(lat, lon, name) {
  const q = encodeURIComponent(name);
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query=${q}`, '_blank');
}

/* ────────────────────────────────── */

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [checked, setChecked]               = useState({});

  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const { places, loading: placesLoading, error: placesError, refetch } = usePlaces(coords, activeCategory);

  const isLoading = geoLoading || placesLoading;

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const filtered = places.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">

      {/* ── Header ── */}
      <header className="page-header animate-slide-up stagger-1">
        <h1 className="text-gradient">Explore</h1>
        <div className="header-actions">
          <button className="icon-btn" id="explore-notif-btn" aria-label="Notifications">
            <Bell size={22} color="var(--text-primary)" />
          </button>
        </div>
      </header>

      {/* ── Search bar ── */}
      <div className="search-bar-wrap animate-slide-up stagger-2">
        <div className="search-bar glass-panel">
          <Search size={16} color="var(--text-secondary)" />
          <input
            id="explore-search-input"
            type="text"
            placeholder="Search nearby places…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '0', boxShadow: 'none' }}
          />
        </div>
      </div>

      {/* ── Category Chips ── */}
      <div className="scroll-strip category-strip animate-slide-up stagger-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`category-${cat.id}`}
            className={`chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Real Places Grid ── */}
      <section className="explore-section animate-slide-up stagger-3">
        <div className="section-header">
          <h2 className="section-title">
            {geoError ? 'Nearby Places' : isLoading ? 'Scanning area…' : `${filtered.length} Places Found`}
          </h2>
          {!isLoading && coords && (
            <button className="icon-btn-sm" id="refetch-btn" onClick={refetch} title="Refresh">
              <RefreshCw size={15} />
            </button>
          )}
        </div>

        {/* Geolocation denied */}
        {geoError && (
          <div className="error-state glass-panel" style={{ marginBottom: 16 }}>
            <AlertTriangle size={20} color="var(--warning)" />
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Location access denied</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Enable location to see real nearby places.
              </p>
            </div>
          </div>
        )}

        {/* Places API error */}
        {placesError && !placesLoading && (
          <div className="error-state glass-panel" style={{ marginBottom: 16 }}>
            <AlertTriangle size={20} color="var(--danger)" />
            <p style={{ fontSize: '0.85rem' }}>Could not load places. <button className="link-btn" onClick={refetch}>Retry</button></p>
          </div>
        )}

        <div className="places-grid">
          {/* Skeleton loading */}
          {isLoading && Array.from({ length: 6 }).map((_, i) => <PlaceSkeleton key={i} />)}

          {/* Real place cards */}
          {!isLoading && filtered.map(place => (
            <div
              key={place.id}
              className="place-card glass-panel"
              id={`place-${place.id}`}
              onClick={() => openInMaps(place.lat, place.lon, place.name)}
            >
              <div className="place-img-wrap">
                <img src={place.photo} alt={place.name} className="place-img" />
                <span className="place-tag">{typeLabel(place.type)}</span>
                <div className="place-overlay" />
              </div>
              <div className="place-info">
                <h4 title={place.name}>{place.name}</h4>
                <div className="place-meta">
                  <span className="place-distance"><MapPin size={11} /> {place.distance}</span>
                  <span className="place-rating"><Star size={11} fill="gold" color="gold" /> {place.rating}</span>
                </div>
                <button
                  className="place-goto-btn"
                  id={`goto-${place.id}`}
                  onClick={e => { e.stopPropagation(); openInMaps(place.lat, place.lon, place.name); }}
                >
                  <Navigation size={11} /> Directions
                </button>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!isLoading && !placesError && coords && filtered.length === 0 && (
            <div className="empty-state">
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <p>No {activeCategory !== 'all' ? activeCategory : ''} places found nearby.</p>
              <button className="btn-ghost" onClick={refetch}>Expand search</button>
            </div>
          )}
        </div>
      </section>

      {/* ── Journey Checklist ── */}
      <section className="explore-section animate-slide-up stagger-4">
        <h2 className="section-title">Journey Checklist</h2>
        <div className="checklist-card glass-panel">
          {CHECKLIST_DEFAULTS.map(item => (
            <label key={item.id} htmlFor={item.id} className={`checklist-item ${checked[item.id] ? 'done' : ''}`}>
              <input
                type="checkbox"
                id={item.id}
                className="custom-checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
              />
              <span>{item.label}</span>
              {checked[item.id] && <span className="done-badge">✓ Done</span>}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;
