import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { fetchLiveWeather } from '../utils/weatherApi';
import GalleryCarousel from '../components/GalleryCarousel';
import { supabase } from '../SupabaseClient';

const SPONSORS = [
  { code: 'PM', name: 'PICK ME', hub: 'Sri Lanka(LK)' },
  { code: 'U', name: 'UBER EATS', hub: 'Sri Lanka(LK)' },
  { code: 'DA', name: 'Dialog Axiata', hub: 'Sri Lanka(LK)' },
  { code: 'CG', name: 'Cinnamon Grand', hub: 'Sri Lanka(Lk)' },
  { code: 'DT', name: 'Dilmah Tea', hub: 'Sri Lanka(LK)' },
  { code: 'PS', name: 'Plam Stay', hub: 'Sri Lanka(LK)' },
  { code: 'UC', name: 'Urban Cab', hub: 'Sri Lanka(LK)' },
  { code: 'B', name: 'Booking.Com', hub: 'UK' },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weather, setWeather] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Newsletter form state
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const infiniteSponsors = [...SPONSORS, ...SPONSORS];

  // Fetch live weather on mount
  useEffect(() => {
    fetchLiveWeather().then((data) => {
      if (data) setWeather(data);
    });
  }, []);

  // Carousel slider effect
  useEffect(() => {
    const track = document.getElementById('icfCardsTrack');
    if (!track) return;

    const getCardsPerView = () => {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    };

    const updateSlider = () => {
      const firstCard = track.querySelector('.icf-destination-card');
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      const gap = 14;
      const maxIndex = Math.max(0, track.children.length - getCardsPerView());

      let current = currentIndex;
      if (current > maxIndex) current = maxIndex;

      const moveAmount = current * (cardWidth + gap);
      track.style.transform = `translateX(-${moveAmount}px)`;
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [currentIndex]);

  const handleNext = () => {
    const track = document.getElementById('icfCardsTrack');
    if (!track) return;
    const cardsPerView = window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
    const maxIndex = Math.max(0, track.children.length - cardsPerView);
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handlePrev = () => {
    const track = document.getElementById('icfCardsTrack');
    if (!track) return;
    const cardsPerView = window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
    const maxIndex = Math.max(0, track.children.length - cardsPerView);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const toggleFaq = (button) => {
    const item = button.parentElement;
    item.classList.toggle('active');
  };

  // Supabase Database Handler & Safe EmailJS Confirmation for Newsletter Subscription
  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberName.trim() || !subscriberEmail.trim()) {
      alert('Please enter both your name and email.');
      return;
    }

    setSubscribing(true);
    try {
      // 1. Save subscriber data to Supabase Database
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
        // 2. Try sending confirmation email via EmailJS (safely wrapped so it won't crash if placeholders are not set)
        try {
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
          alert('Successfully subscribed and confirmation email sent!');
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
      {/* Hero Section */}
      <section className="hero">
        <div className="top-bar">
          <i className="fa-solid fa-umbrella-beach logo-icon"></i>
          <div className="brand">
            <h1>Lanka <span>Stay</span></h1>
            <small>Season-Aware Hotel &amp; Trip Planner</small>
          </div>
        </div>

        <p className="kicker">SRI LANKA</p>
        <h2 data-i18n="hero_title">Explore Sri Lanka with <span>Lanka Stay</span></h2>
        <p data-i18n="hero_sub">Your island journey, all in one place.</p>

        <form
          className="search-pill"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = '/explore';
          }}
        >
          <i className="fa-solid fa-location-dot"></i>
          <input type="text" name="q" placeholder="Where do you want to go?" data-i18n="search_placeholder" />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </section>

      {/* Main Content */}
      <section className="content">
        {/* Quick Category Shortcuts */}
        <div className="categories">
          <Link to="/hotels">
            <span className="box green"><i className="fa-solid fa-bed"></i></span>
            <span data-i18n="hotels">Hotels</span>
          </Link>
          <a href="https://pickme.lk/services/ride/" target="_blank" rel="noreferrer">
            <span className="box blue"><i className="fa-solid fa-bus"></i></span>
            <span data-i18n="transport">Transport</span>
          </a>
          <Link to="/explore">
            <span className="box orange"><i className="fa-solid fa-utensils"></i></span>
            <span data-i18n="foods">Foods</span>
          </Link>
          <Link to="/explore">
            <span className="box purple"><i className="fas fa-map"></i></span>
            <span data-i18n="attraction">Map</span>
          </Link>
          <Link to="/planner">
            <span className="box leaf"><i className="fa-solid fa-route"></i></span>
            <span data-i18n="planner">Planner</span>
          </Link>
        </div>
        <br /><br />

        {/* Live Weather Widget */}
        <div className="weather-compact-card">
          <div className="weather-col left">
            <i className={`${weather?.weatherIcon || 'fa-solid fa-cloud-sun'} weather-mini-icon`}></i>
            <div>
              <h4 data-i18n="weather_title">Sri Lanka Weather</h4>
              <div className="temp-row">
                <span>{weather ? `${weather.currentTemp}°C` : '--°C'}</span>
                <span>{weather ? weather.weatherDesc : 'Loading...'}</span>
              </div>
            </div>
          </div>

          <div className="weather-divider"></div>

          <div className="weather-col right">
            <div className="forecast-pills">
              <span className="pill">
                Tomorrow: <strong>{weather ? `${weather.day1Max}°C / ${weather.day1Min}°C` : '--°C / --°C'}</strong>
              </span>
              <span className="pill">
                In 2 Days: <strong>{weather ? `${weather.day2Max}°C / ${weather.day2Min}°C` : '--°C / --°C'}</strong>
              </span>
            </div>
            <button className="show-more-mini-btn" onClick={() => setModalOpen(true)} data-i18n="sm">
              Show More <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem', marginLeft: '2px' }}></i>
            </button>
          </div>
        </div>

        {/* Extended Weather Modal */}
        {modalOpen && (
          <div
            className="weather-modal"
            style={{ display: 'flex' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
          >
            <div className="modal-content">
              <span className="close-btn" onClick={() => setModalOpen(false)}>&times;</span>
              <h2>Extended Forecast &amp; Analytics</h2>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '-10px' }}></p>

              <div className="forecast-mini-list" style={{ marginTop: '20px' }}>
                <div className="forecast-mini-item">
                  <span>{weather ? `Tomorrow (${weather.day1Name})` : 'Tomorrow'}</span>
                  <span>{weather ? `${weather.day1Text} • ${weather.day1Max}°C / ${weather.day1Min}°C` : 'Loading...'}</span>
                </div>
                <div className="forecast-mini-item">
                  <span>{weather ? `In 2 Days (${weather.day2Name})` : 'In 2 Days'}</span>
                  <span>{weather ? `${weather.day2Text} • ${weather.day2Max}°C / ${weather.day2Min}°C` : 'Loading...'}</span>
                </div>
              </div>

              <div className="chart-container">
                <div className="chart-title">Temperature Trend (°C)</div>
                <div className="bar-graph">
                  <div className="bar-col">
                    <span style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                      {weather ? `${weather.currentTemp}°` : '--°'}
                    </span>
                    <div
                      className="bar"
                      style={{ height: weather ? `${(weather.currentTemp / 40) * 100}%` : '50%' }}
                    ></div>
                    <span className="bar-label">Today</span>
                  </div>
                  <div className="bar-col">
                    <span style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                      {weather ? `${weather.day1Max}°` : '--°'}
                    </span>
                    <div
                      className="bar"
                      style={{ height: weather ? `${(weather.day1Max / 40) * 100}%` : '50%' }}
                    ></div>
                    <span className="bar-label">{weather?.day1Name || 'Wed'}</span>
                  </div>
                  <div className="bar-col">
                    <span style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                      {weather ? `${weather.day2Max}°` : '--°'}
                    </span>
                    <div
                      className="bar"
                      style={{ height: weather ? `${(weather.day2Max / 40) * 100}%` : '50%' }}
                    ></div>
                    <span className="bar-label">{weather?.day2Name || 'Thu'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <br />

        {/* Top Destinations Carousel Slider */}
        <div className="icf-wrapper">
          <section className="icf-destinations-section">
            <h2 data-i18n="explore_more" className="icf-section-title">Explore More</h2>
            <div className="icf-slider-wrapper">
              <button className="icf-slider-btn icf-prev-btn" onClick={handlePrev} aria-label="Previous slide">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <div className="icf-cards-viewport">
                <div className="icf-cards-track" id="icfCardsTrack">
                  <Link to="/place?place=ella" className="icf-destination-card" style={{ textDecoration: 'none' }}>
                    <img src="/images/ellao.avif" alt="Ella" className="icf-card-img" />
                    <div className="icf-card-overlay"></div>
                    <h3 className="icf-card-title">Ella</h3>
                  </Link>
                  <Link to="/place?place=yala_national_park" className="icf-destination-card" style={{ textDecoration: 'none' }}>
                    <img src="/images/yalao.jpg" alt="Yala" className="icf-card-img" />
                    <div className="icf-card-overlay"></div>
                    <h3 className="icf-card-title">Yala</h3>
                  </Link>
                  <Link to="/place?place=mirissa" className="icf-destination-card" style={{ textDecoration: 'none' }}>
                    <img src="/images/miris.jpg" alt="Mirissa" className="icf-card-img" />
                    <div className="icf-card-overlay"></div>
                    <h3 className="icf-card-title">Mirissa</h3>
                  </Link>
                  <Link to="/place?place=sigiriya" className="icf-destination-card" style={{ textDecoration: 'none' }}>
                    <img src="/images/ssg.jpg" alt="Sigiriya" className="icf-card-img" />
                    <div className="icf-card-overlay"></div>
                    <h3 className="icf-card-title">Sigiriya</h3>
                  </Link>
                  <Link to="/place?place=galle" className="icf-destination-card" style={{ textDecoration: 'none' }}>
                    <img src="/images/glft.webp" alt="Galle" className="icf-card-img" />
                    <div className="icf-card-overlay"></div>
                    <h3 className="icf-card-title">Galle</h3>
                  </Link>
                </div>
              </div>
              <button className="icf-slider-btn icf-next-btn" onClick={handleNext} aria-label="Next slide">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </section>
        </div>

        {/* AI Trip Fit Banner */}
        <section className="ai-fullwidth-banner">
          <div className="ai-banner-content">
            <h1 className="ai-title">Trip Fit &amp; Monsoon Engine</h1>
            <div className="ai-chip-icon">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <p data-i18n="cal_c" className="ai-subtitle">
              Calculates dynamic 0-100 compatibility scores, real road driving hours (OSRM matrix), and seasonal down-ranking.
            </p>
            <Link
              to="/planner"
              className="ai-action-btn"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fa-solid fa-robot" style={{ marginRight: '6px' }}></i> Calculate Trip Fit
            </Link>
          </div>
        </section>
      </section>

      {/* Gallery Section */}
      <GalleryCarousel />

      {/* Discover Sri Lanka Section */}
      <section className="dest-header-section">
        <div className="dest-intro-box">
          <h2 className="dest-main-title">
            <span data-i18n="discover_the_beauty_of" style={{ color: '#d4af37' }}>Discover The Beauty Of</span><br />
            <span data-i18n="sri_lanka" style={{ color: '#D4AF37' }}>Sri Lanka</span>
          </h2>
          <p className="dest-main-desc">
            <span data-i18n="discover_paragraph">
              Explore a land of breathtaking landscapes, golden beaches, acient wonders, and unforgettable adventures. From misty mountains to topical coastlines, every destination tells a beautiful story.
            </span>
          </p>
        </div>
        <article className="dest-detail-card">
          <h1 className="dest-name"><span data-i18n="journey_he">Journey Through Paradise</span></h1>
          <p className="dest-bio">
            <span data-i18n="journey_para">
              Discover Sri Lanka's most beautiful destinations, from peaceful beaches and green mountains to historical cites and hidden natural wonders. Every journey brings a new experince.....
            </span>
          </p>
          <div className="dest-meta-list">
            <div className="dest-meta-item">
              <div className="meta-icon-btn"><i className="fas fa-hotel"></i></div>
              <div data-i18n="dest1" className="meta-text"><span>Comfortable Hotels</span></div>
            </div>
            <div className="dest-meta-item">
              <div className="meta-icon-btn"><i className="fas fa-route"></i></div>
              <div data-i18n="dest2" className="meta-text"><span>Your Perfect Journey</span></div>
            </div>
            <div className="dest-meta-item">
              <div className="meta-icon-btn"><i className="fas fa-car"></i></div>
              <div data-i18n="dest3" className="meta-text"><span>Transportation</span></div>
            </div>
            <div className="dest-meta-item">
              <div className="meta-icon-btn"><i className="fas fa-leaf"></i></div>
              <div data-i18n="dest4" className="meta-text"><span>Nature &amp; Wildlife</span></div>
            </div>
            <div className="dest-meta-item">
              <div className="meta-icon-btn"><i className="fas fa-landmark"></i></div>
              <div data-i18n="dest5" className="meta-text"><span>Historical Places</span></div>
            </div>
            <div className="dest-meta-item">
              <div className="meta-icon-btn"><i className="fas fa-utensils"></i></div>
              <div data-i18n="dest6" className="meta-text"><span>Sri Lanka Foods</span></div>
            </div>
          </div>
          <br />
          <Link
            to="/explore"
            className="ai-action-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <i className="fa-solid fa-location-dot" style={{ marginRight: '6px' }}></i>
            <span data-i18n="dest_btn">Explore Destination</span>
          </Link>
        </article>
      </section>

      {/* Wildlife Conservation Section */}
      <section className="elephant-section">
        <article className="elephant-card">
          <div className="elephant-img-wrapper">
            <img src="/images/elephanthome.jpeg" alt="Save Sri Lankan Elephants" />
          </div>
          <div className="elephant-content">
            <div className="elephant-tag"><span data-i18n="ele_t">Wildlife Conservation</span></div>
            <h2 className="elephant-title"><span data-i18n="ele_t2">Save Sri Lanka's Gentle Giants</span></h2>
            <p data-i18n="ele_t3" className="elephant-desc">
              Sri Lanka is home to the Asian elephant subspecies (Elephas maximus maximus). Human-elephant conflict and habitat loss severely threaten their survival. Join conservation efforts, support ethical elephant sanctuaries, and protect their natural migratory corridors.
            </p>
            <div className="elephant-footer">
              <div className="elephant-stat">
                <i className="fa-solid fa-tree"></i>
                <span data-i18n="ele_t4"><b>Udawalawe &amp; Minneriya</b> Protection Zones</span>
              </div>
              <button
                className="elephant-action-btn"
                onClick={() => alert('Thank you for supporting Sri Lankan Elephant Conservation!')}
              >
                <span data-i18n="ele_btn">Support Now</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <article className="feature-card">
            <div className="feature-icon-box"><i className="fas fa-heart"></i></div>
            <h3 data-i18n="ban1" className="feature-title">Customer First</h3>
            <p data-i18n="band1" className="feature-desc">
              Our travelers are at the heart of everything we do. Every journey is designed around your comfort, satisfaction, and happiness.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-icon-box"><i className="fa-solid fa-globe"></i></div>
            <h3 data-i18n="ban2" className="feature-title">Authenticity</h3>
            <p data-i18n="band2" className="feature-desc">
              We share the real essence of Sri Lanka — its people, culture, and landscapes — offering experiences that are genuine and meaningful.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-icon-box"><i className="fas fa-shield-alt"></i></div>
            <h3 data-i18n="ban3" className="feature-title">Reliability</h3>
            <p data-i18n="band3" className="feature-desc">
              We provide precise travel insights, real-time monsoon advisories, and accurate hotel rates to ensure a seamless trip experience.
            </p>
          </article>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="video-text">
          <h3 data-i18n="vidt" className="video-title">Discover Sri Lanka</h3>
          <p data-i18n="vidb" className="video-desc">
            Sri Lanka is a tropical island with golden beaches, misty tea hills, ancient temples and wild safaris, all within a few hours of each other.
          </p>
        </div>
        <div className="video-card">
          <video autoPlay muted loop playsInline preload="auto">
            <source src="/images/mainvideo.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
      <br /><br />

      {/* Blog Section */}
      <section className="blog-section" style={{ padding: '20px 16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a1a' }} data-i18n="ts">Travel Stories &amp; Updates</h2>
        <div className="blog-cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="blog-card" style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img src="/images/ellao.avif" alt="Blog 1" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            <div style={{ padding: '14px' }}>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>January 25, 10:00</span>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '6px 0' }} data-i18n="ts1">The Bahamas Escape: Tropical Paradise</h3>
              <button className="ai-action-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '8px' }} data-i18n="tsb">
                Read More
              </button>
            </div>
          </div>
          <div className="blog-card" style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img src="/images/ssg.jpg" alt="Blog 2" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            <div style={{ padding: '14px' }}>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>January 27, 12:10</span>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '6px 0' }} data-i18n="ts2">Switzerland: Alpine Peaks &amp; Valleys</h3>
              <button className="ai-action-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '8px' }} data-i18n="tsb">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header-content">
            <h2 className="faq-title" data-i18n="qh">Planning a Trip to Sri Lanka: Common Questions</h2>
            <p className="faq-desc" data-i18n="qh1">The questions travellers ask us most, answered by a local team that runs these routes every week</p>
          </div>
          <div className="faq-accordion">
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFaq(e.currentTarget)}>
                <span data-i18n="q1">When is the best time to visit Sri Lanka?</span>
                <i className="fa-solid fa-plus faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p data-i18n="q1a">Sri Lanka is a year-round destination! The best time depends on where you go: the South &amp; West coasts are best from December to April, while the East coast is ideal from May to September.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFaq(e.currentTarget)}>
                <span data-i18n="q2">How many days do you need in Sri Lanka?</span>
                <i className="fa-solid fa-plus faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p data-i18n="q2a">To experience the cultural triangle, hill country tea plantations, and southern beaches comfortably, 10 to 14 days is the ideal duration.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFaq(e.currentTarget)}>
                <span data-i18n="q3">Do I need a visa to travel to Sri Lanka?</span>
                <i className="fa-solid fa-plus faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p data-i18n="q3a">Yes, most travelers require an Electronic Travel Authorization (ETA) or tourist visa prior to arrival, which can easily be applied for online.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFaq(e.currentTarget)}>
                <span data-i18n="q4">How much does a Sri Lanka tour cost?</span>
                <i className="fa-solid fa-plus faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p data-i18n="q4a">Costs vary depending on your style, budget backpacker styles can be very economical, while mid-range private tours with drivers and boutique hotels range comfortably based on season.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-question" onClick={(e) => toggleFaq(e.currentTarget)}>
                <span data-i18n="q5">Is Sri Lanka safe for tourists?</span>
                <i className="fa-solid fa-plus faq-icon"></i>
              </button>
              <div className="faq-answer">
                <p data-i18n="q5a">Sri Lanka is widely considered one of the safest and friendliest countries for travelers, with low violent crime rates against tourists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />

      {/* Sponsors Section */}
      <section className="icf-airlines-section">
        <div className="partner-text">
          <h2>OUR SPONSERS</h2>
        </div>
        <br />

        <div className="icf-ticker-container">
          <div className="icf-ticker-track" id="icfTickerTrack">
            {infiniteSponsors.map((sponsor, index) => (
              <div className="icf-airline-item" key={`${sponsor.code}-${index}`}>
                <span className="icf-airline-code">{sponsor.code}</span>
                <div className="icf-airline-info">
                  <span className="icf-airline-name">{sponsor.name}</span>
                  <span className="icf-airline-hub">{sponsor.hub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <br />
      <br />

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