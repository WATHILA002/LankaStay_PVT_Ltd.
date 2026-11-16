import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setLanguage } from '../utils/translations';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = useState(() => localStorage.getItem('lankastay_currency') || 'LKR');

  // Sync dropdown with active language from localStorage on load
  useEffect(() => {
    const savedLang = localStorage.getItem('lankastay_lang') || 'en';
    setLanguage(savedLang);
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.value = savedLang;
    }
  }, []);

  const handleLangChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang); // Updates storage and applies translation instantly
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleDarkMode = () => {
    const app = document.querySelector('.app');
    if (app) {
      app.classList.toggle('dark-mode');
      localStorage.setItem('lankastay_darkmode', app.classList.contains('dark-mode'));
    }
  };

  const toggleCurrency = () => {
    const currencies = ['LKR', 'USD'];
    const nextIndex = (currencies.indexOf(currency) + 1) % currencies.length;
    const nextCurr = currencies[nextIndex];
    setCurrency(nextCurr);
    localStorage.setItem('lankastay_currency', nextCurr);
    
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: nextCurr }));
  };

  return (
    <div className="sys-utility-bar">
      <div className="sys-alert">
        <i className="fa-solid fa-umbrella"></i>LankaStay
      </div>
      <div className="sys-utility-controls">
        <label className="sys-select">
          <i className="fa-solid fa-globe"></i>
          <select id="langSelect" onChange={handleLangChange} aria-label="Language">
            <option value="en">EN</option>
            <option value="si">සිං</option>
            <option value="ta">த</option>
          </select>
        </label>
        
        {/* Interactive Currency Button */}
        <button 
          className="sys-btn sys-curr-btn" 
          onClick={toggleCurrency} 
          aria-label="Currency"
          title="Click to change currency"
        >
          {currency}
        </button>

        <button className="sys-btn sys-theme-btn" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          <i className="fa-solid fa-sun"></i>
          <i className="fa-solid fa-moon"></i>
        </button>
        <button className="sys-btn sys-theme-btn" onClick={toggleMenu} aria-label="Open Menu">
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* Slide-out Drawer Navigation Menu */}
      <div id="navDrawer" className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="footer-logo" style={{ marginBottom: 0 }}>
            <i className="fa-solid fa-umbrella-beach logo-icon-gold" style={{ fontSize: '24px' }}></i>
            <div className="logo-text">
              <h2 className="color123">LANKA STAY</h2>
            </div>
          </div>
          <button className="close-btn" onClick={toggleMenu} aria-label="Close Menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="drawer-content">
          <span className="drawer-section-title">EXPLORE</span>
          <Link to="/" className="drawer-link" onClick={toggleMenu}>Home</Link>
          <Link to="/hotels" className="drawer-link" onClick={toggleMenu}>Hotel Packages</Link>
          <Link to="/explore" className="drawer-link" onClick={toggleMenu}>Explore</Link>
          <Link to="/planner" className="drawer-link" onClick={toggleMenu}>Trip Planner</Link>
          <Link to="/profile" className="drawer-link" onClick={toggleMenu}>Profile</Link>

          <span className="drawer-section-title">MORE</span>
          <Link to="/saved" className="drawer-link" onClick={toggleMenu}>Saved</Link>
          <Link to="/" className="drawer-link" onClick={toggleMenu}>Blog</Link>
          <Link to="/" className="drawer-link" onClick={toggleMenu}>Why Us</Link>
          <Link to="/" className="drawer-link" onClick={toggleMenu}>Testimonials</Link>
        </div>
      </div>

      {/* Background Dark Overlay */}
      <div id="drawerOverlay" className={`drawer-overlay ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
    </div>
  );
}