import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImagePlus, CheckCircle, Aperture } from 'lucide-react';
import './Capture.css';

const Capture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // ensure video plays
        setStreamActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      // Fallback or alert if no camera
      alert("Could not access real camera. Check permissions or if you are using localhost/HTTPS.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      // Set canvas to video actual dimensions
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.85); // 85% quality jpeg
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStreamActive(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="page-container capture-page">
      <div className="capture-header stagger-1">
        <h1 className="text-gradient">Capture Moment</h1>
        <p className="subtitle">Lock in your memories and earn Aura points.</p>
      </div>

      <div className="camera-container glass-panel stagger-2">
        {/* Hidden Canvas for extracting image */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

        {capturedImage ? (
          <div className="success-capture animate-slide-up">
            <div className="success-img-wrapper" style={{backgroundImage: `url(${capturedImage})`}}>
              <div className="points-earned">
                <CheckCircle size={20} /> +50 Points Earned!
              </div>
            </div>
            <button className="btn-primary" style={{width: '100%', marginTop: '20px'}} onClick={resetCapture}>
              <ImagePlus size={18} style={{marginRight: '8px'}} /> Capture Another
            </button>
          </div>
        ) : (
          <div className="live-camera-view">
            {/* The actual video element, hidden unless active */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`live-video ${streamActive ? 'active' : ''}`}
            ></video>

            {!streamActive && (
              <div className="viewfinder-placeholder" onClick={startCamera}>
                <Camera size={48} className="camera-icon pulse-icon" />
                <p>Tap to start real Camera <br/><span style={{fontSize:'0.8rem', opacity:0.7}}>+ 50 Aura Points</span></p>
              </div>
            )}

            {streamActive && (
              <button className="shutter-btn animate-fade-in" onClick={takePhoto}>
                <Aperture size={32} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Capture;
