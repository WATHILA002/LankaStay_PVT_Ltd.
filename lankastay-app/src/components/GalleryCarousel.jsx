import { useState } from 'react';

export default function GalleryCarousel() {
  const images = [
    { id: 1, src: '/images/bg1.jpeg', alt: 'Gallery 1' },
    { id: 2, src: '/images/bg2.jpeg', alt: 'Gallery 2' },
    { id: 3, src: '/images/bg3.jpeg', alt: 'Gallery 3' },
    { id: 4, src: '/images/bg4.jpeg', alt: 'Gallery 4' },
    { id: 5, src: '/images/bg5.jpeg', alt: 'Gallery 5' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="gallery-section">
      <div className="header-text">
        <h2>OUR GALLERY</h2>
      </div>
      <br />
      
      <div className="carousel-track">
        <button className="nav-arrow left" onClick={prevSlide} aria-label="Previous slide">
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {images.map((img, index) => {
          let offset = index - activeIndex;
          if (offset > images.length / 2) offset -= images.length;
          if (offset < -images.length / 2) offset += images.length;

          let pos = "hidden";
          if (Math.abs(offset) <= 2) {
            pos = offset.toString();
          }

          return (
            <div
              key={img.id}
              className="card"
              data-pos={pos}
              onClick={() => setActiveIndex(index)}
            >
              <img src={img.src} alt={img.alt} />
            </div>
          );
        })}

        <button className="nav-arrow right" onClick={nextSlide} aria-label="Next slide">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="dots" id="dotsContainer">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          ></div>
        ))}
      </div>
    </section>
  );
}