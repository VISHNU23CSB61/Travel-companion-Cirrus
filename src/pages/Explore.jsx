import React from 'react';
import { Newspaper, Bell, PlusCircle } from 'lucide-react';
import './Explore.css';

const Explore = () => {
  return (
    <div className="page-container">
      <header className="page-header stagger-1">
        <h1 className="text-gradient">Explore</h1>
        <button className="icon-btn"><Bell size={24} color="var(--text-primary)" /></button>
      </header>
      
      <section className="explore-section stagger-2">
        <h2 className="section-title">Trending Affairs</h2>
        <div className="news-card glass-panel">
          <div className="news-content">
            <Newspaper size={20} color="var(--accent-primary)" />
            <div>
              <h4>Cherry Blossom Festival Starts Tomorrow</h4>
              <p>Join the local festivities at Ueno Park.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="explore-section stagger-3">
        <h2 className="section-title">Must-Visit Journey</h2>
        
        <div className="checklist-card glass-panel">
          <div className="checklist-item">
            <input type="checkbox" id="item1" className="custom-checkbox" />
            <label htmlFor="item1">Visit Senso-ji Temple</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="item2" className="custom-checkbox" />
            <label htmlFor="item2">Try Authentic Mochi</label>
          </div>
          <button className="btn-primary" style={{marginTop: '10px', width: '100%', justifyContent: 'center'}}>
            <PlusCircle size={18} /> Add Destination
          </button>
        </div>
      </section>
    </div>
  );
};

export default Explore;
