import React, { useState, useEffect, useRef } from 'react';
import display10in from '../assets/photos/display-10in.png';
import edit10in from '../assets/photos/edit-10in.png';
import home10in from '../assets/photos/home-10in.png';
import login10in from '../assets/photos/login-10in.png';
import { FaArrowLeft, FaArrowRight, FaExpand } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import cartoonSingingSongWorld from '../assets/song-world/transparent/AI-GEN/singing_icon_square.png';
const images = [
  { src: login10in, alt: 'App Login Screen' },
  { src: display10in, alt: 'App Display View' },
  { src: edit10in, alt: 'App Edit View' },
  { src: home10in, alt: 'App Home Screen' },
];

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openFullScreen = () => {
    setShowFullScreen(true);
  };

  const closeFullScreen = () => {
    setShowFullScreen(false);
  };

  return (
    <div className="bg-songworld-light-card dark:bg-songworld-dark-card text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24">
      <div
        ref={sectionRef}
        className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out transform 
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="flex justify-center mb-12">
          <img src={cartoonSingingSongWorld.src} alt="cartoonSongWorld" className="h-16 w-16 mr-4"  />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary text-center mb-12">
            About Song World
          </h2>
        </div>
        <div className="bg-white dark:bg-black/20 shadow-xl rounded-lg p-8 md:p-10 ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Welcome to Song World! We are passionate about music and dedicated to providing musicians, songwriters, and artists with the ultimate tool to bring their musical ideas to life.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Our mission is to bridge the gap between simple note-taking apps and complex digital audio workstations. Song World offers an intuitive, focused environment for lyric writing, chord progression, song structuring, and collaboration.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Founded by musicians for musicians, we understand the creative process and aim to make Song World an indispensable part of your songwriting journey.
          </p>
        </div>

        {/* Meet the Founder Section */}
        <div className="mt-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-songworld-light-text dark:text-songworld-dark-text text-center mb-10">
            Meet the Founder
          </h3>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 bg-white dark:bg-black/20 shadow-xl rounded-lg p-8 md:p-10 ring-1 ring-black/5 dark:ring-white/10">
            {/* Image Placeholder */}
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden">
              {/* You can replace this with an <img /> tag later */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {/* <span className="text-sm">Image Coming Soon</span> */}
            </div>
            {/* Founder Description */}
            <div className="text-center md:text-left">
              <h4 className="text-xl sm:text-2xl font-semibold text-songworld-light-primary dark:text-songworld-dark-primary mb-3">
                [Founder's Name]
              </h4>
              <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                [Founder's Title/Role, e.g., Founder & CEO of Song World]
              </p>
              <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Replace this with a compelling description of the founder. Talk about their passion for music, their vision for Song World, and their background. What inspired them to create this platform?
              </p>
              <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Add another paragraph or two here to share more about their journey, expertise, or a personal message to the users.
              </p>
            </div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mt-12 relative w-full max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-lg shadow-xl bg-gray-100 dark:bg-gray-800 relative">
            <div
              className="flex transition-transform ease-in-out duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.src.src}
                  alt={image.alt}
                  className="w-full flex-shrink-0 object-contain h-96 sm:h-[30rem] lg:h-[34rem]"
                />
              ))}
            </div>
            <button
              onClick={openFullScreen}
              className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow-md transition-colors z-10"
              aria-label="Open full screen"
            >
              <FaExpand />
            </button>
          </div>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-8 bg-songworld-light-accent/70 hover:bg-songworld-light-accent dark:bg-songworld-dark-accent/70 dark:hover:bg-songworld-dark-accent text-white p-2 sm:p-3 rounded-full shadow-md transition-colors z-10"
            aria-label="Previous image"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 sm:translate-x-8 bg-songworld-light-accent/70 hover:bg-songworld-light-accent dark:bg-songworld-dark-accent/70 dark:hover:bg-songworld-dark-accent text-white p-2 sm:p-3 rounded-full shadow-md transition-colors z-10"
            aria-label="Next image"
          >
            <FaArrowRight />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-songworld-light-primary dark:bg-songworld-dark-primary' : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {showFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40 p-4" onClick={closeFullScreen}>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 sm:p-4 rounded-full shadow-md transition-colors z-50"
            aria-label="Previous image (fullscreen)"
          >
            <FaArrowLeft />
          </button>

          <img
            src={images[currentIndex].src.src}
            alt={images[currentIndex].alt}
            className="max-w-[90vw] max-h-[90vh] sm:max-w-[85vw] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 sm:p-4 rounded-full shadow-md transition-colors z-50"
            aria-label="Next image (fullscreen)"
          >
            <FaArrowRight />
          </button>

          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-full transition-colors z-50"
            aria-label="Close full screen"
          >
            <FaXmark />
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutUs; 