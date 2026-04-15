import React, { useEffect, useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="theme-selector glass-panel animate-fade-in stagger-2">
      <button 
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => setTheme('light')}
        title="Light Mode"
      >
        <Sun size={20} />
      </button>
      <button 
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
        title="Dark Mode"
      >
        <Moon size={20} />
      </button>
      <button 
        className={`theme-btn aura-btn ${theme === 'aura' ? 'active' : ''}`}
        onClick={() => setTheme('aura')}
        title="Aura Experience"
      >
        <Sparkles size={20} />
      </button>
    </div>
  );
};

export default ThemeSelector;
