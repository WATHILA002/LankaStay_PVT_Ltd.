import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';

const DESTINATIONS = [
  { name: 'Anuradhapura' },
  { name: 'Sigiriya' },
  { name: 'Ella' },
  { name: 'Nuwara Eliya' },
  { name: 'Colombo' },
  { name: 'Galle' },
  { name: 'Kandy' },
  { name: 'Yala' },
  { name: 'others' }
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const GOOD = {
  'Colombo': [12, 1, 2, 3], 'Galle': [12, 1, 2, 3, 4], 'Kandy': [1, 2, 3, 4, 8, 9], 'Sigiriya': [1, 2, 3, 4, 5, 6, 7, 8, 9],
  'Anuradhapura': [1, 2, 3, 4, 5, 6, 7, 8, 9], 'Ella': [1, 2, 3, 4, 8, 9], 'Nuwara Eliya': [2, 3, 4, 8], 'Yala': [2, 3, 4, 5, 6, 7]
};

const BLURB = {
  'Anuradhapura': 'Explore the ancient sacred city: Ruwanwelisaya and the Sri Maha Bodhi tree.',
  'Sigiriya': 'Climb the Lion Rock fortress and enjoy a village tour nearby.',
  'Ella': 'Nine Arch Bridge, Little Adam’s Peak and a scenic hill-country train ride.',
  'Nuwara Eliya': 'Tea estates, Gregory Lake and cool “Little England” air.',
  'Colombo': 'Galle Face Green, local markets, museums and street food.',
  'Galle': 'Walk the Galle Fort walls, relax on the beach and catch the sunset.',
  'Kandy': 'Temple of the Tooth, the lake walk and Peradeniya Botanical Gardens.',
  'Yala': 'Morning and evening jeep safaris for leopards and elephants.'
};

export default function Planner() {
  const [step, setStep] = useState(1);
  const [sixMode, setSixMode] = useState('summary');
  
  const [state, setState] = useState({
    style: '', who: '', type: '', name: '', email: '', phone: '', country: '+94',
    dests: [], start: null, end: null,
    adults: 2, children: 0,
    budget: 3000, tier: 'Mid-Range',
    stays: [], acts: [], requests: ''
  });

  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState(null);

  // Newsletter states
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  // Calendar view state
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const goTo = (n) => {
    const target = Math.max(1, Math.min(6, n));
    setStep(target);
    if (target === 6) setSixMode('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validate = (n) => {
    let ok = true;
    let errs = {};

    if (n === 1) {
      if (!state.type) errs.type = 'Please choose what you are planning.';
      if (state.name.length < 2) errs.name = 'Please enter your full name.';
      const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
      if (!mailOk) errs.email = 'Please enter a valid email.';
      const digits = state.phone.replace(/\D/g, '');
      if (digits.length < 7) errs.phone = 'Please enter a valid mobile number.';
      ok = !errs.type && !errs.name && mailOk && digits.length >= 7;
    } else if (n === 2) {
      ok = state.dests.length > 0;
      if (!ok) errs.dest = 'Select at least one destination.';
    } else if (n === 3) {
      ok = !!(state.start && state.end);
      if (!ok) errs.dates = 'Please pick your arrival and departure dates.';
    }

    setErrors(errs);
    return ok;
  };

  const handleNext = () => {
    if (validate(step)) goTo(step + 1);
  };

  const handleBack = () => {
    goTo(step - 1);
  };

  const fmt = (d) => d ? `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : '';

  const pickDate = (d) => {
    if (!state.start || state.end || d < state.start) {
      setState(prev => ({ ...prev, start: d, end: null }));
    } else {
      setState(prev => ({ ...prev, end: d }));
    }
    setErrors(prev => ({ ...prev, dates: '' }));
  };

  const toggleDest = (name) => {
    setState(prev => {
      const exists = prev.dests.includes(name);
      return {
        ...prev,
        dests: exists ? prev.dests.filter(d => d !== name) : [...prev.dests, name]
      };
    });
    setErrors(prev => ({ ...prev, dest: '' }));
  };

  const toggleChip = (field, val) => {
    setState(prev => {
      const list = prev[field];
      const exists = list.includes(val);
      return {
        ...prev,
        [field]: exists ? list.filter(v => v !== val) : [...list, val]
      };
    });
  };

  const nightsBetween = () => state.start && state.end ? Math.max(1, Math.round((state.end - state.start) / 86400000)) : 1;

  const runPrediction = () => {
    setSixMode('loading');
    setTimeout(() => {
      const nights = nightsBetween();
      const base = { 'Mid-Range': 85, 'Luxury': 220, 'Boutique': 140 }[state.tier] || 100;
      const pp = nights * base + state.dests.length * 35 + state.acts.length * 25;
      const total = pp * state.adults + pp * 0.6 * state.children;
      const month = state.start ? state.start.getMonth() + 1 : 1;
      
      let score = state.budget >= pp ? Math.min(92, 72 + (state.budget / pp - 1) * 30) : 72 * (state.budget / pp);
      let notes = [], wet = [];
      state.dests.forEach(d => { if (GOOD[d] && !GOOD[d].includes(month)) wet.push(d); });
      score -= wet.length * 6;
      if (wet.length) notes.push(`Expect showers in ${wet.join(', ')} around your travel dates. Pack a light rain jacket.`);
      if (state.budget < pp) notes.push('Your budget is below the estimated cost. Consider fewer nights or a Mid-Range tier.');
      if (state.children > 0) notes.push('Travelling with children: we will prefer family rooms and shorter drives.');
      
      const hops = Math.max(0, state.dests.length - 1);
      score = Math.max(20, Math.min(96, Math.round(score - hops * 1.5)));

      const perDest = Math.max(1, Math.floor(nights / state.dests.length));
      let day = 1;
      const itin = state.dests.map((d, i) => {
        const n = i === state.dests.length - 1 ? Math.max(1, nights - perDest * i) : perDest;
        const from = day; day += n;
        return { day: n > 1 ? `Days ${from}–${from + n - 1}` : `Day ${from}`, title: d, details: BLURB[d] || `Enjoy the best of ${d}.` };
      });

      const hotels = state.dests.slice(0, 4).map(d => ({ name: `${state.tier} stay in ${d}`, location: d, price_per_night_usd: Math.round(base * 1.4) }));

      setPrediction({
        fit_score: score,
        predicted_cost_usd_per_person: pp,
        cost_low: pp * 0.88, cost_high: pp * 1.12,
        total_cost_usd: total,
        best_season: wet.length ? 'Dec – Mar' : 'Your dates',
        weather: wet.length ? 'Some wet weather likely' : 'Mostly favourable',
        travel_hours: Math.round(hops * 2.8 * 10) / 10,
        summary: `A ${nights}-night ${(state.type || 'Tailor-Made')} trip for ${state.adults} adult${state.adults > 1 ? 's' : ''}${state.children ? ` and ${state.children} child${state.children > 1 ? 'ren' : ''}` : ''}, covering ${state.dests.join(', ')}.`,
        hotels,
        itinerary: itin,
        notes: notes.length ? notes : ['Your plan looks well balanced for the season and budget.'],
        source: 'demo'
      });
      setSixMode('result');
    }, 1400);
  };

  const handleSubmit = async () => {
    const quote = { ...state, prediction, created_at: new Date().toISOString() };
    try { 
      localStorage.setItem('lankaGoLastQuote', JSON.stringify(quote)); 
      
      // Save prediction to Supabase database
      await supabase.from('planner_predictions').insert([
        {
          user_name: state.name,
          travel_style: state.type || 'Tailor-Made',
          budget: state.budget,
          predicted_cost: prediction?.predicted_cost_usd_per_person || 0,
          recommended_season: prediction?.best_season || 'Any',
          itinerary_summary: prediction?.summary || 'Custom plan'
        }
      ]);
    } catch (e) {
      console.error('Error saving quote:', e.message);
    }
    setSixMode('done');
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberName.trim() || !subscriberEmail.trim()) {
      alert('Please enter both your name and email.');
      return;
    }

    setSubscribing(true);
    try {
      alert(`Thank you for subscribing, ${subscriberName}!`);
      setSubscriberName('');
      setSubscriberEmail('');
    } catch (err) {
      alert('An unexpected error occurred: ' + (err?.message || err));
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <main className="screen planner-screen" style={{ width: '100%', boxSizing: 'border-box' }}>
      <header className="page-header">
        <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
        <h2 data-i18n="planner">Trip Planner &amp; Scoring</h2>
      </header>

      <div className="planner-wrapper">
        <div className="plan-progress" id="progress">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <span key={i} className={i < step ? 'done' : (i === step ? 'now' : '')}></span>
          ))}
        </div>
        <p className="plan-step-meta" id="stepMeta"><b>Step {step} of 6</b></p>

        {/* STEP 1 */}
        <section className={`plan-step ${step === 1 ? 'active' : ''}`} data-step="1">
          <div className="plan-card">
            <div className="plan-card-header">
              <h1 className="plan-heading" data-i18n="get_quote">Get a Personal Quote</h1>
              <p className="plan-sub" data-i18n="tell_us">Tell us about your travel plans and contact details so we can tailor the best experience for you.</p>
            </div>

            <div className="plan-section">
              <label className="plan-lbl" data-i18n="what_planning">What are you planning?<b className="plan-req"></b></label>
              <div className="plan-types" id="types">
                {['Tailor-Made', 'Honeymoon', 'Family', 'Group', 'MICE'].map(v => {
                  const isStyle = ['Tailor-Made', 'Honeymoon'].includes(v);
                  const sel = isStyle ? state.style === v : state.who === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      className={`plan-type ${['Tailor-Made', 'Honeymoon', 'MICE'].includes(v) ? 'wide' : ''} ${sel ? 'sel' : ''}`}
                      onClick={() => {
                        const g = isStyle ? 'style' : 'who';
                        const newVal = sel ? '' : v;
                        setState(prev => {
                          const updated = { ...prev, [g]: newVal };
                          return { ...updated, type: [updated.style, updated.who].filter(Boolean).join(' ') };
                        });
                        setErrors(prev => ({ ...prev, type: '' }));
                      }}
                    >
                      {v === 'Tailor-Made' && <i className="fa-regular fa-pen-to-square"></i>}
                      {v === 'Honeymoon' && <i className="fas fa-heart"></i>}
                      {v === 'Family' && <i className="fa-solid fa-people-roof"></i>}
                      {v === 'Group' && <i className="fa-solid fa-users"></i>}
                      {v === 'MICE' && <i className="fa-solid fa-people-group"></i>}
                      {v}
                    </button>
                  );
                })}
              </div>
              <p className="plan-err">{errors.type}</p>
            </div>

            <div className="plan-section">
              <label className="plan-lbl" htmlFor="fullName" data-i18n="fullName1">Full Name <b className="plan-req">*</b></label>
              <input
                className={`plan-field ${errors.name ? 'bad' : ''}`}
                id="fullName"
                type="text"
                placeholder="e.g. John Doe"
                value={state.name}
                onChange={e => setState({ ...state, name: e.target.value })}
              />
              <p className="plan-err">{errors.name}</p>

              <label className="plan-lbl" htmlFor="email" data-i18n="email1">Email Address <b className="plan-req">*</b></label>
              <input
                className={`plan-field ${errors.email ? 'bad' : ''}`}
                id="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={state.email}
                onChange={e => setState({ ...state, email: e.target.value })}
              />
              <p className="plan-err">{errors.email}</p>

              <label className="plan-lbl" data-i18n="phone1">Phone / WhatsApp <span className="plan-req">*</span></label>
              <div className="plan-phone-row">
                <select
                  className="plan-field plan-cc"
                  value={state.country}
                  onChange={e => setState({ ...state, country: e.target.value })}
                >
                  <option value="+94">🇱🇰 +94 - Sri Lanka</option>
                  <option value="+1">🇺🇸 +1 - USA / Canada</option>
                  <option value="+44">🇬🇧 +44 - United Kingdom</option>
                  <option value="+61">🇦🇺 +61 - Australia</option>
                  <option value="+91">🇮🇳 +91 - India</option>
                </select>
                <input
                  type="tel"
                  className={`plan-field ${errors.phone ? 'bad' : ''}`}
                  placeholder="77 123 4567"
                  value={state.phone}
                  onChange={e => setState({ ...state, phone: e.target.value })}
                />
              </div>
              <p className="plan-err">{errors.phone}</p>
            </div>

            <div className="plan-btn-row">
              <button type="button" className="plan-btn plan-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className={`plan-step ${step === 2 ? 'active' : ''}`} data-step="2">
          <div className="plan-card">
            <div className="plan-card-header">
              <h2 className="plan-title" data-i18n="select_dest1">Select Destinations</h2>
              <p className="plan-sub" data-i18n="dest_sub1">Where would you like to travel? Select all the destinations you wish to visit in Sri Lanka.</p>
            </div>

            <div className="plan-dest-grid">
              {DESTINATIONS.map(d => {
                const sel = state.dests.includes(d.name);
                return (
                  <button
                    key={d.name}
                    type="button"
                    className={`plan-dest-card ${sel ? 'sel' : ''}`}
                    onClick={() => toggleDest(d.name)}
                  >
                    <i className="fa-solid fa-location-dot dest-icon"></i>
                    <span className="dest-name">{d.name}</span>
                    <span className="plan-check"><i className="fa-solid fa-check"></i></span>
                  </button>
                );
              })}
            </div>
            <p className="plan-err">{errors.dest}</p>

            <div className="plan-btn-row">
              <button type="button" className="plan-btn plan-btn-back" onClick={handleBack}>Back</button>
              <button type="button" className="plan-btn plan-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        </section>

        {/* STEP 3 */}
        <section className={`plan-step ${step === 3 ? 'active' : ''}`} data-step="3">
          <div className="plan-card">
            <div className="plan-card-header">
              <h2 className="plan-title" data-i18n="td1">Travel Dates &amp; Group</h2>
              <p className="plan-sub" data-i18n="td_sub">Pick your estimated arrival and departure dates, and tell us how many guests are travelling.</p>
            </div>

            <div className="plan-cal-head">
              <span className="plan-cal-title">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
              <div className="plan-cal-nav-wrap">
                <button type="button" className="plan-cal-nav" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button type="button" className="plan-cal-nav" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="plan-cal-grid plan-cal-dow">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="plan-cal-grid">
              {(() => {
                const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
                const count = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
                let days = [];
                for (let e = 0; e < first; e++) {
                  days.push(<span key={`empty-${e}`} className="plan-day empty"></span>);
                }
                for (let n = 1; n <= count; n++) {
                  const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), n);
                  const t = d.getTime();
                  const isOff = d < today;
                  const isStart = state.start && t === state.start.getTime();
                  const isEnd = state.end && t === state.end.getTime();
                  const inRange = state.start && state.end && t > state.start.getTime() && t < state.end.getTime();
                  days.push(
                    <button
                      key={n}
                      type="button"
                      className={`plan-day ${isOff ? 'off' : ''} ${isStart || isEnd ? 'range start' : ''} ${inRange ? 'range' : ''}`}
                      disabled={isOff}
                      onClick={() => pickDate(d)}
                    >
                      {n}
                    </button>
                  );
                }
                return days;
              })()}
            </div>

            <div className="plan-section">
              <label className="plan-lbl" data-i18n="select_dest1">Selected Dates</label>
              <div className="plan-date-row">
                <input className="plan-field" type="text" placeholder="Arrival Date" value={fmt(state.start)} readOnly />
                <input className="plan-field" type="text" placeholder="Departure Date" value={fmt(state.end)} readOnly />
              </div>
              <p className="plan-err">{errors.dates}</p>
            </div>

            <div className="plan-section">
              <label className="plan-lbl" htmlFor="adults">Number of Adults</label>
              <select className="plan-field" value={state.adults} onChange={e => setState({ ...state, adults: Number(e.target.value) })}>
                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>

              <label className="plan-lbl" htmlFor="children">Number of Children</label>
              <select className="plan-field" value={state.children} onChange={e => setState({ ...state, children: Number(e.target.value) })}>
                {[...Array(9)].map((_, i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="plan-btn-row">
              <button type="button" className="plan-btn plan-btn-back" onClick={handleBack}>Back</button>
              <button type="button" className="plan-btn plan-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        </section>

        {/* STEP 4 */}
        <section className={`plan-step ${step === 4 ? 'active' : ''}`} data-step="4">
          <div className="plan-card">
            <div className="plan-card-header">
              <h2 className="plan-title" data-i18n="budget_details">Budget Details</h2>
              <p className="plan-sub" data-i18n="budget_sub">Set your approximate spending limit and choose your desired accommodation style tier.</p>
            </div>

            <div className="plan-section">
              <h3 className="plan-card-title" data-i18n="estimated_budget">Estimated Budget</h3>
              <p className="plan-budget-val">${state.budget} <small>per person</small></p>
              <input type="range" min="500" max="8000" step="100" value={state.budget} onChange={e => setState({ ...state, budget: Number(e.target.value) })} />
              <div className="plan-range-labels">
                <span data-i18n="under_500">Under $500</span>
                <span data-i18n="approximate_budget">Approximate Budget</span>
                <span data-i18n="above_8000">Above $8000</span>
              </div>
            </div>

            <hr className="plan-hr" />

            <div className="plan-section">
              <h3 className="plan-card-title" data-i18n="budget_tier">Budget Tier</h3>
              <div className="plan-radios">
                {['Mid-Range', 'Luxury', 'Boutique'].map(tier => (
                  <label key={tier}>
                    <input type="radio" name="tier" value={tier} checked={state.tier === tier} onChange={() => setState({ ...state, tier })} />
                    <i></i>{tier}
                  </label>
                ))}
              </div>
            </div>

            <div className="plan-btn-row">
              <button type="button" className="plan-btn plan-btn-back" onClick={handleBack}>Back</button>
              <button type="button" className="plan-btn plan-primary" onClick={handleNext}>Continue</button>
            </div>
          </div>
        </section>

        {/* STEP 5 */}
        <section className={`plan-step ${step === 5 ? 'active' : ''}`} data-step="5">
          <div className="plan-card">
            <div className="plan-card-header">
              <h2 className="plan-title" data-i18n="your_preferences">Your Preferences</h2>
              <p className="plan-sub" data-i18n="preferences_sub">Customize your stay types, favorite travel activities, and add any special requirements.</p>
            </div>

            <div className="plan-section">
              <h3 className="plan_card">Accommodation Type</h3>
              <div className="plan-chips">
                {['Hotels', 'Resorts', 'Villas', 'Camping'].map(v => (
                  <button key={v} type="button" className={`plan-chip ${state.stays.includes(v) ? 'sel' : ''}`} onClick={() => toggleChip('stays', v)}>{v}</button>
                ))}
              </div>
            </div>

            <div className="plan-section">
              <h3 className="plan-card-title" data-i18n="activities">Activities</h3>
              <div className="plan-chips">
                {[
                  { v: 'Cultural Tours', icon: 'landmark' },
                  { v: 'Wildlife Safari', icon: 'paw' },
                  { v: 'Hiking', icon: 'person-hiking' },
                  { v: 'Beach & Surf', icon: 'umbrella-beach' },
                  { v: 'Culinary Experiences', icon: 'utensils' },
                  { v: 'Tea Trails', icon: 'mug-hot' }
                ].map(act => (
                  <button key={act.v} type="button" className={`plan-chip plan-pill ${state.acts.includes(act.v) ? 'sel' : ''}`} onClick={() => toggleChip('acts', act.v)}>
                    <i className={`fa-solid fa-${act.icon}`}></i>{act.v}
                  </button>
                ))}
              </div>
            </div>

            <div className="plan-section">
              <h3 className="plan-card-title" data-i18n="special_requests">Special Requests</h3>
              <textarea className="plan-field" rows="4" placeholder="Mention dietary preferences, accessibility needs..." value={state.requests} onChange={e => setState({ ...state, requests: e.target.value })}></textarea>
            </div>

            <div className="plan-btn-row">
              <button type="button" className="plan-btn plan-btn-back" onClick={handleBack}>Back</button>
              <button type="button" className="plan-btn plan-primary" onClick={handleNext}>Next</button>
            </div>
          </div>
        </section>

        {/* STEP 6 */}
        <section className={`plan-step ${step === 6 ? 'active' : ''}`} data-step="6">
          {sixMode === 'summary' && (
            <div className="plan-card plan-center">
              <h2 className="plan-title big" data-i18n="almost_done">Almost Done!</h2>
              <p className="plan-sub mb-14" data-i18n="review_summary">Review your travel plan summary before running our smart AI prediction engine.</p>
              <div className="plan-summary">
                <div><b>Planning</b><span>{state.type}</span></div>
                <div><b>Destinations</b><span>{state.dests.join(', ')}</span></div>
                <div><b>Dates</b><span>{fmt(state.start)} – {fmt(state.end)}</span></div>
                <div><b>Group</b><span>{state.adults} adult{state.adults > 1 ? 's' : ''}{state.children ? `, ${state.children} child${state.children > 1 ? 'ren' : ''}` : ''}</span></div>
                <div><b>Budget</b><span>${state.budget} · {state.tier}</span></div>
                <div><b>Stay</b><span>{state.stays.join(', ') || 'Any'}</span></div>
                <div><b>Activities</b><span>{state.acts.join(', ') || 'Any'}</span></div>
              </div>
              <div className="plan-btn-row">
                <button type="button" className="plan-btn plan-btn-back" onClick={handleBack}>Back</button>
                <button type="button" className="plan-btn plan-primary" onClick={runPrediction}>Get My Trip Prediction</button>
              </div>
            </div>
          )}

          {sixMode === 'loading' && (
            <div className="plan-card plan-center">
              <div className="plan-spinner"></div>
              <h2 className="plan-title big" data-i18n="analysing_trip">Analysing your trip…</h2>
              <p className="plan-note" data-i18n="ai_model_checking">Our AI model is checking weather conditions, budget alignment, and optimal route distances.</p>
            </div>
          )}

          {sixMode === 'result' && prediction && (
            <div>
              <h2 className="plan-title big" data-i18n="your_trip_prediction">Your Trip Prediction</h2>
              <p className="plan-src">{prediction.source === 'demo' ? 'Demo estimate' : 'Live prediction'}</p>

              <div className="plan-card plan-score-card">
                <div className="plan-ring" style={{ '--p': Math.round(prediction.fit_score) }}>
                  <div><b>{Math.round(prediction.fit_score)}</b><small>Trip Fit</small></div>
                </div>
                <div className="plan-score-info">
                  <h3>{prediction.fit_score >= 80 ? 'Excellent match' : 'Good match'}</h3>
                  <p data-i18n="plan_fit_note">Your plan fits the season, budget and route well.</p>
                </div>
              </div>

              <div className="plan-stats">
                <div className="plan-stat"><small data-i18n="predicted_cost">Predicted cost</small><b>${Math.round(prediction.predicted_cost_usd_per_person).toLocaleString()}</b><span>per person</span></div>
                <div className="plan-stat"><small data-i18n="group_total">Group total</small><b>${Math.round(prediction.total_cost_usd).toLocaleString()}</b><span>all travellers</span></div>
                <div className="plan-stat"><small data-i18n="best_season">Best season</small><b>{prediction.best_season}</b><span>{prediction.weather}</span></div>
                <div className="plan-stat"><small data-i18n="road_travel">Road travel</small><b>{prediction.travel_hours} h</b><span>between stops</span></div>
              </div>

              <div className="plan-card">
                <h3 className="plan-card-title">About your trip</h3>
                <p className="plan-desc">{prediction.summary}</p>
              </div>

              <div className="plan-card">
                <h3 className="plan-card-title">Recommended stays</h3>
                {prediction.hotels.map((h, i) => (
                  <div key={i} className="plan-hotel">
                    <div><b>{h.name}</b><small>{h.location}</small></div>
                    <span className="hp">${h.price_per_night_usd} / night</span>
                  </div>
                ))}
              </div>

              <div className="plan-card">
                <h3 className="plan-card-title">Suggested itinerary</h3>
                <ol className="plan-itin">
                  {prediction.itinerary.map((d, i) => (
                    <li key={i}><b>{d.day} · {d.title}</b><p>{d.details}</p></li>
                  ))}
                </ol>
              </div>

              <button type="button" className="plan-btn plan-orange" onClick={handleSubmit}>Submit Quote Request &amp; Save</button>
              <button type="button" className="plan-btn plan-ghost" onClick={() => goTo(1)}>Edit My Plan</button>
            </div>
          )}

          {sixMode === 'done' && (
            <div className="plan-card plan-center plan-done">
              <div className="plan-tick"><i className="fa-solid fa-check"></i></div>
              <h2 className="plan-title big">Thank You!</h2>
              <p className="plan-note">Your quote request and prediction have been saved successfully to Supabase. Our travel team will contact you within 24 hours.</p>
              <Link className="plan-btn plan-primary plan-link" to="/">Back to Home</Link>
            </div>
          )}
        </section>
      </div>

      {/* Edge-to-Edge Footer */}
      <footer 
        className="app-footer" 
        style={{ 
          marginBottom: 0, 
          paddingBottom: '20px', 
          width: 'calc(100% + 32px)',
          marginLeft: '-16px',
          marginRight: '-16px',
          boxSizing: 'border-box',
          marginTop: '40px',
        }}
      >
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