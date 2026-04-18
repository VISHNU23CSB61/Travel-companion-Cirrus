import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ThemeSelector from './components/ThemeSelector';
import BottomNav from './components/BottomNav';
import PageTransition from './components/PageTransition';

import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Capture from './pages/Capture';
import Emergency from './pages/Emergency';
import AuraMode from './pages/AuraMode';
import Profile from './pages/Profile';
import FlightStatus from './pages/FlightStatus';
import './App.css';

// Layout wrapper to hide BottomNav on login
const AppLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      <ThemeSelector />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
          <Route path="/capture" element={<PageTransition><Capture /></PageTransition>} />
          <Route path="/aura" element={<PageTransition><AuraMode /></PageTransition>} />
          <Route path="/emergency" element={<PageTransition><Emergency /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/flights" element={<PageTransition><FlightStatus /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {!isLogin && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
