import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';

const destinationsData = [
  { id: 1, name: "Sigiriya", category: "cultural", rating: "4.8", desc: "Ancient rock fortress & royal history", img: "/images/ssg.jpg", link: "/place?place=sigiriya" },
  { id: 2, name: "Mirissa", category: "beaches", rating: "4.6", desc: "Whale watching & palm beaches", img: "/images/miris.jpg", link: "/place?place=mirissa" },
  { id: 3, name: "Galle Fort", category: "cultural", rating: "4.5", desc: "Colonial charm & ocean views", img: "/images/glft.webp", link: "/place?place=galle" },
  { id: 4, name: "Ella Nine Arch", category: "mountains", rating: "4.7", desc: "Hike, scenic train & tea hills", img: "/images/ellao.avif", link: "/place?place=ella" },
  { id: 5, name: "Yala National Park", category: "nature", rating: "4.9", desc: "Leopard safaris & wilderness", img: "/images/yalao.jpg", link: "/place?place=yala_national_park" },
  { id: 6, name: "Arugam Bay", category: "beaches", rating: "4.6", desc: "surfing & clean sea", img: "https://tse3.mm.bing.net/th/id/OIP.uEhkNvWjLGjH3PTKz2ahjwHaDt?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", link: "/place?place=arugam_bay" },
  { id: 7, name: "Colombo", category: "cultural", rating: "5.0", desc: "Enjoy your Street Night", img: "https://tse1.mm.bing.net/th/id/OIP.jC1oztiBaaji97GVXU4MOgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", link: "/place?place=colombo" },
  { id: 8, name: "Nuwara Eliya", category: "nature", rating: "5.0", desc: "Come and experince Litttle England", img: "https://tse1.mm.bing.net/th/id/OIP.bI-NlTTEA0BlVZI_bsPjEgHaFj?r=0&w=1024&h=768&rs=1&pid=ImgDetMain&o=7&rm=3", link: "/place?place=nuwara_eliya" },
  { id: 9, name: "Kandy", category: "cultural", rating: "4.9", desc: "hill city & royal history", img: "https://tse1.mm.bing.net/th/id/OIP.Ubp9AMxk7mIwncJrUOHt3gHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", link: "/place?place=kandy" }
];

export default function Explore() {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [savedItems, setSavedItems] = useState({});
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const { data, error } = await supabase.from('saved_destinations').select('*');
      if (error) throw error;

      if (data) {
        const savedMap = {};
        data.forEach(item => {
          savedMap[item.destination_id] = true;
        });
        setSavedItems(savedMap);
      }
    } catch (err) {
      console.error('Error fetching saved items:', err.message);
    }
  };

  const filteredDestinations = currentCategory === 'all'
    ? destinationsData
    : destinationsData.filter(d => d.category === currentCategory);

  const toggleHeart = async (dest, e) => {
    e.stopPropagation();
    const isCurrentlySaved = !!savedItems[dest.id];

    // Optimistically update UI
    setSavedItems(prev => ({ ...prev, [dest.id]: !isCurrentlySaved }));

    try {
      if (isCurrentlySaved) {
        const { error } = await supabase
          .from('saved_destinations')
          .delete()
          .match({ destination_id: dest.id });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_destinations')
          .insert([
            {
              destination_id: dest.id,
              name: dest.name,
              category: dest.category,
              rating: dest.rating,
              desc: dest.desc,
              img: dest.img,
              link: dest.link
            }
          ]);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error updating saved state in database:', err.message);
      setSavedItems(prev => ({ ...prev, [dest.id]: isCurrentlySaved }));
      alert('Failed to update saved status. Please check Supabase RLS policies.');
    }
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
        try {
          if (typeof emailjs !== 'undefined') {
            await emailjs.send(
              'YOUR_SERVICE_ID',
              'YOUR_TEMPLATE_ID',
              {
                to_name: subscriberName.trim(),
                to_email: subscriberEmail.trim(),
                message: 'Thank you for subscribing to Lanka Stay! You will now receive exclusive travel tips, destination updates, and special offers. Your journey, our care.'
              },
              'YOUR_PUBLIC_KEY'
            );
          }
          alert('Successfully subscribed to Lanka Stay!');
        } catch (emailErr) {
          console.warn('EmailJS note: Configure your service ID, template ID, and public key to enable automatic emails.', emailErr);
          alert('Successfully subscribed to Lanka Stay!');
        }

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
    <main className="screen">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
          <h2 data-i18n="explore_sl">Explore Sri Lanka</h2>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/saved" title="View Saved Destinations" style={{ color: 'inherit', fontSize: '1.2rem' }}>
            <i className="fa-solid fa-bookmark"></i>
          </Link>
          <a href="#search" onClick={(e) => e.preventDefault()}><i className="fa-solid fa-magnifying-glass"></i></a>
        </div>
      </header>

      {/* Curved Filter Chips */}
      <div className="chips" id="exploreFilterChips">
        {['all', 'beaches', 'mountains', 'cultural', 'nature'].map((cat) => (
          <button
            key={cat}
            className={`chip ${currentCategory === cat ? 'active' : ''}`}
            onClick={() => setCurrentCategory(cat)}
            style={{ borderRadius: '20px' }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Destinations List Container */}
      <section className="list" id="exploreList">
        {filteredDestinations.length === 0 ? (
          <p className="empty">No destinations found for this category.</p>
        ) : (
          filteredDestinations.map((d) => (
            <article 
              key={d.id} 
              className="dest-card" 
              onClick={() => navigate(d.link)}
              style={{ borderRadius: '0px', cursor: 'pointer' }}
            >
              <img src={d.img} alt={d.name} style={{ borderRadius: '0px' }} />
              <button
                type="button"
                className={`heart ${savedItems[d.id] ? 'saved' : ''}`}
                onClick={(e) => toggleHeart(d, e)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <i className={`${savedItems[d.id] ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
              </button>
              <span className="rating"><i className="fa-solid fa-star"></i> {d.rating}</span>
              <div className="info">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h3>{d.name}</h3>
                  <p>{d.desc}</p>
                </div>
              </div>
              <Link to={d.link} className="arrow" onClick={(e) => e.stopPropagation()}>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </article>
          ))
        )}
      </section>

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