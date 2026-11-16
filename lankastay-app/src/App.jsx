import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ElephantBot from './components/ElephantBot';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Hotel from './pages/Hotel';
import Planner from './pages/Planner';
import PlaceDetail from './pages/PlaceDetail';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import HotelDetail from './pages/HotelDetail';
import { setLanguage } from './utils/translations'; 
import './App.css';

function AutoTranslate() {
  const location = useLocation();

  useEffect(() => {
    const savedLang = localStorage.getItem('lankastay_lang') || 'en';
    setLanguage(savedLang);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <AutoTranslate />
      <div className="app" id="appFrame">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/hotels" element={<Hotel />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/place" element={<PlaceDetail />} />
          <Route path="/place-detail" element={<PlaceDetail />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/hotel" element={<HotelDetail />} />
          <Route path="/hotel-detail" element={<HotelDetail />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
        </Routes>
        <ElephantBot />
      </div>
    </Router>
  );
}

export default App;