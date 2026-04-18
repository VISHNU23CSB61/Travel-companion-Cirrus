import React, { useState, useRef, useEffect } from 'react';
import { Eye, Radio, PlayCircle, Loader2, PauseCircle, ExternalLink, MapPin, BookOpen, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeolocation }  from '../hooks/useGeolocation';
import { useWikipedia }    from '../hooks/useWikipedia';
import './AuraMode.css';

const AuraMode = () => {
  const [phase, setPhase]       = useState('idle');  // 'idle' | 'scanning' | 'active'
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const { article, loading: wikiLoading, error: wikiError } = useWikipedia(
    phase === 'active' ? coords : null   // only fetch when lens is active
  );

  const startAura = async () => {
    setPhase('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      /* Camera permission denied — continue in simulation mode */
    }

    // 3.5s scan → active (Wikipedia fetch begins simultaneously)
    setTimeout(() => setPhase('active'), 3500);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setPhase('idle');
    setIsPlaying(false);
  };

  useEffect(() => () => stopCamera(), []);

  /* ── Truncate extract to ~3 clean sentences ── */
  const parseExtract = (text = '') => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
    return sentences.slice(0, 3).join(' ').trim();
  };

  return (
    <div className="page-container aura-page">

      {/* ── IDLE: entry screen ── */}
      {phase === 'idle' && (
        <motion.div
          className="aura-idle-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="aura-header">
            <h1 className="text-gradient">Aura Mode</h1>
            <p className="subtitle">Discover real history at your exact location.</p>
          </div>

          {/* Location preview */}
          {!geoLoading && coords && (
            <div className="aura-coords glass-panel">
              <MapPin size={14} color="var(--accent-primary)" />
              <span>{coords.latitude.toFixed(4)}°N, {coords.longitude.toFixed(4)}°E</span>
              <span className="aura-acc">±{Math.round(coords.accuracy)}m</span>
            </div>
          )}
          {geoError && (
            <div className="aura-warn glass-panel">
              <AlertTriangle size={14} color="var(--warning)" />
              <span>Location needed for real history. {geoError}</span>
            </div>
          )}

          <div className="aura-activate-container">
            <motion.button
              className="aura-activate-btn"
              onClick={startAura}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <Eye size={44} color="white" />
            </motion.button>
            <p className="aura-hint">Tap to open the Aura Lens</p>
          </div>
        </motion.div>
      )}

      {/* ── CAMERA VIEW (scanning + active) ── */}
      <AnimatePresence>
        {(phase === 'scanning' || phase === 'active') && (
          <motion.div
            className="aura-active-view"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 26, stiffness: 120 }}
          >
            <video ref={videoRef} autoPlay playsInline className="aura-live-video" />
            <div className="aura-overlay-filter" />

            <div className="ar-overlay">
              <button className="ar-close-btn glass-panel" onClick={stopCamera}>Close Lens</button>

              {/* ── SCANNING UI ── */}
              {phase === 'scanning' && (
                <motion.div className="ar-scanning-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="scanning-rings">
                    <div className="ring ring-1" />
                    <div className="ring ring-2" />
                  </div>
                  <div className="scanning-text">
                    <Loader2 className="spin-icon" size={22} />
                    <h3>Reading Temporal Signature…</h3>
                    <p className="scan-sub">Querying Wikipedia GeoSearch API</p>
                  </div>
                </motion.div>
              )}

              {/* ── ACTIVE: Wikipedia data ── */}
              {phase === 'active' && (
                <motion.div
                  className="ar-info-card glass-panel"
                  initial={{ y: 160, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 100 }}
                >
                  {/* Wikipedia loading */}
                  {wikiLoading && (
                    <div className="wiki-loading">
                      <Loader2 className="spin-icon" size={18} />
                      <span>Fetching historical records…</span>
                    </div>
                  )}

                  {/* Wikipedia error */}
                  {wikiError && !wikiLoading && (
                    <div className="wiki-error">
                      <AlertTriangle size={16} color="var(--warning)" />
                      <span>Could not load historical data.</span>
                    </div>
                  )}

                  {/* Real Wikipedia article */}
                  {!wikiLoading && article && (
                    <>
                      {/* Thumbnail */}
                      {article.thumbnail && (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="wiki-thumb"
                        />
                      )}

                      <div className="ar-title">
                        <Radio size={20} className="pulse-icon" color="var(--accent-primary)" />
                        <h4>{article.title}</h4>
                      </div>

                      <p className="wiki-extract">{parseExtract(article.extract)}</p>

                      <div className="wiki-meta">
                        <span><MapPin size={11} /> {article.dist}m away</span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wiki-read-more"
                        >
                          <BookOpen size={12} /> Read more <ExternalLink size={11} />
                        </a>
                      </div>

                      {/* Audio controls */}
                      <div className="audio-controls">
                        <button
                          className={`play-audio-btn ${isPlaying ? 'playing' : ''}`}
                          onClick={() => setIsPlaying(p => !p)}
                        >
                          {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                          {isPlaying ? 'Listening to the past…' : 'Listen to Audio'}
                        </button>

                        <AnimatePresence>
                          {isPlaying && (
                            <motion.div
                              className="audio-visualizer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 36, opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              {[1,2,3,4,5,3,1].map((b, i) => (
                                <div key={i} className={`bar b${b}`} />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )}

                  {/* Fallback if no article found */}
                  {!wikiLoading && !article && !wikiError && (
                    <div className="wiki-empty">
                      <BookOpen size={24} color="var(--text-secondary)" />
                      <p>No historical records found at this location.</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        Try moving to a different area.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuraMode;
