import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ThemeSelector from './components/ThemeSelector';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Capture from './pages/Capture';
import Emergency from './pages/Emergency';
import AuraMode from './pages/AuraMode';
import './App.css';

// Layout wrapper to hide BottomNav on login
const AppLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      <ThemeSelector />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/aura" element={<AuraMode />} />
        <Route path="/emergency" element={<Emergency />} />
      </Routes>

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
