import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Newsletter states
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  
  // Form state for Sign-In / Sign-Up
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  });

  // Load user session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lanka_stay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle image upload & preview conversion
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email.');
      return;
    }
    const newUser = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      history: [
        { action: 'Viewed Place', item: 'Sigiriya Rock Fortress', time: '2 hours ago' },
        { action: 'Searched', item: 'Galle Dutch Fort Hotel', time: 'Yesterday' },
        { action: 'Viewed Place', item: 'Ella Nine Arch Bridge', time: '3 days ago' }
      ],
      saved: [
        { title: 'Sigiriya Ancient Fortress', category: 'Heritage', image: '/images/ssg.jpg' },
        { title: 'Galle Fort Ramparts', category: 'Coastal', image: '/images/glft.webp' }
      ],
      favorites: [
        { title: 'Ella Nine Arch Bridge', category: 'Mountain', image: '/images/ellao.avif' },
        { title: 'Mirissa Beach Resort', category: 'Beach', image: '/images/miris.jpg' }
      ]
    };

    localStorage.setItem('lanka_stay_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('lanka_stay_user');
    setUser(null);
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberName.trim() || !subscriberEmail.trim()) {
      alert('Please enter both your name and email.');
      return;
    }

    setSubscribing(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ name: subscriberName.trim(), email: subscriberEmail.trim() }]);

      if (error) {
        if (error.code === '23505') {
          alert('This email address is already subscribed to Lanka Stay!');
        } else {
          alert('Subscription failed: ' + error.message);
        }
      } else {
        alert('Successfully subscribed to Lanka Stay!');
        setSubscriberName('');
        setSubscriberEmail('');
      }
    } catch (err) {
      alert('An unexpected error occurred: ' + (err?.message || err));
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <main className="screen" style={{ width: '100%', boxSizing: 'border-box', borderRadius: '0px' }}>
      
      {/* 1. Profile Header / Guest Banner */}
      {user ? (
        <section className="me" style={{ background: '#fff', padding: '24px', borderRadius: '0px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              className="avatar" 
              src={user.avatar} 
              alt="Profile" 
              style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #D4AF37' }} 
            />
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 4px 0' }}>{user.name}</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{user.email}</p>
              <span style={{ display: 'inline-block', background: '#e2e8f0', color: '#0f172a', fontSize: '0.7rem', padding: '2px 8px', marginTop: '6px', fontWeight: '600' }}>Verified Traveler</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
           data-i18n="logout5">
            Logout
          </button>
        </section>
      ) : (
        <section style={{ background: '#0f172a', color: '#fff', padding: '30px 20px', textAlign: 'center', borderRadius: '0px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }} data-i18n="welcome_to_lankastay">Welcome to LankaStay</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }} data-i18n="sign_in_to_manage_bookings">Sign in to manage your bookings, view your travel history, and save favorite destinations.</p>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            style={{ background: '#D4AF37', color: '#0f172a', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}
           data-i18n="sign_in_register_now">
            Sign In / Register Now
          </button>
        </section>
      )}

      {/* 2. Menu Items (Bookings, Saved, Trips) */}
      <a
        href="#bookings"
        className="menu-item"
        onClick={(e) => { e.preventDefault(); alert(user ? 'Viewing Active Booking: BK-9982 at Sigiriya Village Hotel' : 'Please sign in to view bookings.'); }}
      >
        <span className="box green" style={{ borderRadius: '0px' }}><i className="fa-solid fa-calendar-check"></i></span>
        <span data-i18n="my_bookings">My Bookings</span>
      </a>

      <Link to="/saved" className="menu-item" style={{ borderRadius: '0px' }}>
        <span className="box purple" style={{ borderRadius: '0px' }}><i className="fa-solid fa-heart"></i></span>
        <span data-i18n="saved_places">Saved Places ({user ? user.saved.length : 0})</span>
      </Link>

      <Link to="/planner" className="menu-item" style={{ borderRadius: '0px' }}>
        <span className="box orange" style={{ borderRadius: '0px' }}><i className="fa-solid fa-suitcase"></i></span>
        <span data-i18n="my_trips">My Trips &amp; Itineraries</span>
      </Link>

      <a
        href="#help"
        className="menu-item"
        onClick={(e) => { e.preventDefault(); alert('AI Support Assistant is ready to help you!'); }}
      >
        <span className="box blue" style={{ borderRadius: '0px' }}><i className="fa-solid fa-circle-question"></i></span>
        <span data-i18n="help_support">Help &amp; AI Support</span>
      </a>

      {/* 3. User Activity, Saved & Favorites Section (Shown when Logged In) */}
      {user && (
        <div style={{ padding: '0 16px', marginBottom: '30px' }}>
          {/* User History */}
          <section style={{ background: '#fff', padding: '20px', borderRadius: '0px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#0f172a' }}>Recent Activity History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user.history.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span><strong>{h.action}:</strong> {h.item}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{h.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* User Saved Places Grid */}
          <section style={{ background: '#fff', padding: '20px', borderRadius: '0px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#0f172a' }}>Saved Places</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {user.saved.map((item, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* User Favorites Grid */}
          <section style={{ background: '#fff', padding: '20px', borderRadius: '0px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#0f172a' }}>My Favorites</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {user.favorites.map((item, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 4. Auth Modal Popup */}
      {isAuthModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '12px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <span 
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &times;
            </span>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px', color: '#0f172a' }} data-i18n="traveler_sign_in">Traveler Sign In</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }} data-i18n="enter_details_upload_picture">Enter your details and upload a profile picture to access your account.</p>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px', color: '#334155' }} data-i18n="your_name">Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Wathila Yethmal" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px', color: '#334155' }} data-i18n="email_address">Email Address</label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '5px', color: '#334155' }}>Upload Profile Picture</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={formData.avatar} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #cbd5e1' }} />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px', borderRadius: '0px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}
              >
                Complete Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer" style={{ marginBottom: 0, paddingBottom: '20px' }}>
        <div className="fotter-brand-section">
          <div className="footer-logo">
            <i className="fa-solid fa-umbrella-beach logo-icon-gold"></i>
            <div className="logo-text">
              <h2>LANKA STAY</h2>
              <small>YOUR JOURNEY, OUR CARE</small>
            </div>
          </div>
          <p className="footer-about-text">
            <strong>LANKA Stay</strong><span data-i18n="fd1"> - operated by LankaGo (Pvt) Ltd and incorporated under companies Act No. 7 0f 2026 (company Registration no. PV00345889) - is your trusted Sri Lanka travel partner, dedicated to crafting tailor-made journeys, authentic experiences, cultural immersion, and exceptional comfort.</span>
          </p>

          <p className="footer-about-text"><span data-i18n="fd2">
            We bring your travel dreams to life through expertly curated itineraries, genuine local insights, and personalized service every step of the way - <em>Because your journey our care.</em>
          </span></p>

          <div className="footer-social-icons">
            <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
            <a href="#"><i className="fa-brands fa-pinterest-p"></i></a>
            <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-tiktok"></i></a>
          </div>

          <div className="footer-partner-badge">
            <span className="badge-tag">PARTNERED ON SOCIAL MEDIA</span>
            <div className="partner-box-content">
              <div className="partner-logo-title">Pick Me</div>
              <div className="partner-sub">Official Travel Media Partner</div>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-block">
          <h3 className="footer-heading"><span data-i18n="lh">QUICK LINKS</span></h3>
          <ul className="footer-nav-list">
            <li><a href="#"><span data-i18n="l1">Home</span></a></li>
            <li><a href="#"><span data-i18n="l2">Travel Testimonials</span></a></li>
            <li><a href="#"><span data-i18n="l3">Tour Package</span></a></li>
            <li><a href="#"><span data-i18n="l4">Day Tours</span></a></li>
            <li><a href="#"><span data-i18n="l5">Destinations</span></a></li>
            <li><a href="#"><span data-i18n="l6">Tailor Made Tours</span></a></li>
            <li><a href="#"><span data-i18n="l7">MICE &amp; Corporate Travel</span></a></li>
            <li><a href="#"><span data-i18n="l8">Blog</span></a></li>
            <li><a href="#"><span data-i18n="l9">Careers</span></a></li>
            <li><a href="#"><span data-i18n="l10">Our Partners</span></a></li>
            <li><a href="#"><span data-i18n="l11">pay-fee-PVT-Ltd</span></a></li>
            <li><a href="#"><span data-i18n="l12">Faq</span></a></li>
            <li><a href="#"><span data-i18n="l13">About Us</span></a></li>
            <li><a href="#"><span data-i18n="l14">Contact Us</span></a></li>
            <li><a href="#"><span data-i18n="l15">Rate Us</span></a></li>
          </ul>
        </div>

        <hr className="footer-divider" />

        <div className="footer-block">
          <h3 className="footer-heading"><span data-i18n="destinations">DESTINATIONS</span></h3>
          <ul className="footer-nav-list">
            <li><a href="#"><span data-i18n="sigiriya">Sigiriya</span></a></li>
            <li><a href="#"><span data-i18n="kandy">Kandy</span></a></li>
            <li><a href="#"><span data-i18n="ella">Ella</span></a></li>
            <li><a href="#"><span data-i18n="nuwara_eliya">Nuwara Eliya</span></a></li>
            <li><a href="#"><span data-i18n="mirissa">Mirissa</span></a></li>
            <li><a href="#"><span data-i18n="galle">Galle</span></a></li>
            <li><a href="#"><span data-i18n="yala_national_park">Yala National Park</span></a></li>
            <li><a href="#"><span data-i18n="colombo">Colombo</span></a></li>
            <li><a href="#"><span data-i18n="arugam_bay">Arugam Bay</span></a></li>
          </ul>
        </div>

        <div className="footer-block">
          <h3 className="footer-heading">BROWSE SRI LANKA TOURS</h3>
          <div className="footer-tags-wrapper">
            <a href="#" className="tour-chip">Wildlife Safaris</a>
            <a href="#" className="tour-chip">Honeymoon Packages</a>
            <a href="#" className="tour-chip">Luxury Packages</a>
            <a href="#" className="tour-chip">Family Trips</a>
            <a href="#" className="tour-chip">Ayurveda &amp; Wellness</a>
            <a href="#" className="tour-chip">Cultural Tours</a>
            <a href="#" className="tour-chip">Heritage &amp; History</a>
            <a href="#" className="tour-chip">Beach holidays</a>
            <a href="#" className="tour-chip">Adventure Tours</a>
            <a href="#" className="tour-chip">Nature &amp; Hills</a>
            <a href="#" className="tour-chip">Private Transfers</a>
            <a href="#" className="tour-chip">Scenic Train Journeys</a>
            <a href="#" className="tour-chip">7 Days in Sri Lanka</a>
            <a href="#" className="tour-chip">10 Days in Sri Lanka</a>
            <a href="#" className="tour-chip">12 Days in Sri Lanka</a>
            <a href="#" className="tour-chip">14 Days in Sri Lanka</a>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-block">
          <h3 className="footer-heading">OUR OFFICE</h3>
          <ul className="footer-contact-list">
            <li>
              <i className="fa-solid fa-phone"></i>
              <span>Hotline: +94 85 345 3454</span>
            </li>
            <li>
              <i className="fa-solid fa-phone-volume"></i>
              <span>General: +94 11 478 6784</span>
            </li>
            <li>
              <i className="fa-solid fa-whatsapp"></i>
              <span>Chat On WhatsApp</span>
            </li>
            <li>
              <i className="fa-solid fa-envelope"></i>
              <span>info@lankastay.com</span>
            </li>
            <li>
              <i className="fa-solid fa-location-dot"></i>
              <span>Lanka Stay (Pvt) Ltd, No. 105/A1, Western Province, Colombo3, Sri Lanka</span>
            </li>
          </ul>
        </div>

        <div className="footer-newsletter-card">
          <h3 className="newsletter-sub">Subscribe to receive travel tips and exclusive offers.</h3>
          <form className="newsletter-form" onSubmit={handleSubscribeSubmit}>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={subscriberName} 
              onChange={(e) => setSubscriberName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={subscriberEmail} 
              onChange={(e) => setSubscriberEmail(e.target.value)} 
              required 
            />
            <button type="submit" disabled={subscribing}>
              {subscribing ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>
        </div>

        <div className="footer-legal">
          <p>&copy; 2026 <strong>Lanka Stay (Pvt) Ltd</strong>. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a> &bull;
            <a href="#">Terms and Conditions</a> &bull;
            <a href="#">Cookie Policy</a> &bull;
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </main>
  );
}