import React, { useState, useRef, useEffect } from 'react';
import { Eye, Radio, PlayCircle, Loader2, PauseCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AuraMode.css';

const AuraMode = () => {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'scanning' | 'active'
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const startAura = async () => {
    setPhase('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera not accessible, falling back to simulation.", err);
    }

    // Simulate scanning delay
    setTimeout(() => {
      setPhase('active');
    }, 4500);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setPhase('idle');
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="page-container aura-page">
      {phase === 'idle' && (
        <motion.div 
          className="aura-idle-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="aura-header">
            <h1 className="text-gradient">Aura Mode</h1>
            <p className="subtitle">Discover the hidden whispers of the past.</p>
          </div>
          
          <div className="aura-activate-container">
            <motion.button 
              className="aura-activate-btn" 
              onClick={startAura}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={48} color="white" />
            </motion.button>
            <p className="aura-hint">Tap to open the Aura Lens</p>
          </div>
        </motion.div>
      )}

      {/* The AR Camera View */}
      <AnimatePresence>
        {(phase === 'scanning' || phase === 'active') && (
          <motion.div 
            className="aura-active-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="aura-live-video"
            ></video>

            {/* AR Overlay Grid Filter */}
            <div className="aura-overlay-filter"></div>

            <div className="ar-overlay">
              <button className="ar-close-btn glass-panel" onClick={stopCamera}>Close Lens</button>

              {phase === 'scanning' ? (
                <motion.div 
                  className="ar-scanning-ui"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="scanning-rings">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                  </div>
                  <div className="scanning-text">
                    <Loader2 className="spin-icon" size={24} />
                    <h3>Analyzing Temporal Signature...</h3>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="ar-info-card glass-panel"
                  initial={{ y: 150, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                  <div className="ar-title">
                    <Radio size={24} className="pulse-icon" color="#d946ef" />
                    <h4>Edo Period (1603)</h4>
                  </div>
                  <p>You are standing on what used to be a major samurai pathway. The scent of matcha and sword-smithing filled this very air.</p>
                  
                  <div className="audio-controls">
                    <button 
                      className={`play-audio-btn ${isPlaying ? 'playing' : ''}`}
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />} 
                      {isPlaying ? 'Listening to 1603...' : 'Listen to the Past'}
                    </button>

                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div 
                          className="audio-visualizer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 40, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="bar b1"></div>
                          <div className="bar b2"></div>
                          <div className="bar b3"></div>
                          <div className="bar b4"></div>
                          <div className="bar b5"></div>
                          <div className="bar b1"></div>
                          <div className="bar b3"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
