import React, { useState, useEffect, useRef } from 'react';
import display10in from '../assets/photos/display-10in.png';
import edit10in from '../assets/photos/edit-10in.png';
import home10in from '../assets/photos/home-10in.png';
import login10in from '../assets/photos/login-10in.png';
import { FaArrowLeft, FaArrowRight, FaExpand } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import cartoonSingingSongWorld from '../assets/song-world/transparent/AI-GEN/singing_icon_square.png';
import founderPhoto from '../assets/model-shots/founder_profile_photo.jpg';
import fullStudioShot from '../assets/model-shots/full_studio.jpg';
import iloveguitar from '../assets/model-shots/I_love_guitar.jpg';

const images = [
  { src: login10in, alt: 'App Login Screen' },
  { src: display10in, alt: 'App Display View' },
  { src: edit10in, alt: 'App Edit View' },
  { src: home10in, alt: 'App Home Screen' },
];

// Data for the Founder Carousel
const founderCardsData = [
  {
    id: 'founder1',
    name: "Jordan Wells",
    title: "Founder & CEO of Song World",
    photoSrc: founderPhoto.src,
    description1: "I'm a musician, songwriter, and computer programmer with a passion for creating music and helping others do the same. I've been writing and producing music for over 10 years and I've learned a lot about what would be most helpful for songwriters to have at their disposal. With my skills in software development, I'm excited to share what I've created and hope you can enjoy using Song World as much as I have!",
    description2: ""
  },
  {
    id: 'member2',
    name: "The Studio",
    title: "JMP Studios",
    photoSrc: fullStudioShot.src,
    description1: "This is where I have been producing music as well as developing Song World. This app is a culmination of all my knowledge and experience with both music and software development.",
    description2: ""
  },
  {
    id: 'member3',
    name: "The Songwriter",
    title: "Developed by a songwriter, for songwriters",
    photoSrc: iloveguitar.src,
    description1: "I have used a lot of different apps and tools to help me write songs. I've learned a lot about what would be most helpful for songwriters to have at their disposal. With my skills in software development as well as the development of AI, I believe that Song World is the best tool for the job!",
  }
];

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentFounderCardIndex, setCurrentFounderCardIndex] = useState(0);
  const [showFounderPhotoFullScreen, setShowFounderPhotoFullScreen] = useState(false);
  const [selectedFounderPhotoUrl, setSelectedFounderPhotoUrl] = useState<string | null>(null);

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

  const goToPreviousFounderCard = () => {
    setCurrentFounderCardIndex((prevIndex) =>
      prevIndex === 0 ? founderCardsData.length - 1 : prevIndex - 1
    );
  };

  const goToNextFounderCard = () => {
    setCurrentFounderCardIndex((prevIndex) =>
      prevIndex === founderCardsData.length - 1 ? 0 : prevIndex + 1
    );
  };

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

  const openFounderPhotoFullScreen = (url: string) => {
    setSelectedFounderPhotoUrl(url);
    setShowFounderPhotoFullScreen(true);
  };

  const closeFounderPhotoFullScreen = () => {
    setShowFounderPhotoFullScreen(false);
    setSelectedFounderPhotoUrl(null);
  };

  return (
    <div className="bg-songworld-light-card dark:bg-songworld-dark-card text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24">
      <div
        ref={sectionRef}
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out transform 
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="flex justify-center mb-12">
          <img src={cartoonSingingSongWorld.src} alt="cartoonSongWorld" className="h-16 w-16 mr-4"  />
          <h2 className="text-6xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary text-center mb-12">
            About Song World
          </h2>
        </div>
        <div className="bg-white dark:bg-black/20 shadow-xl rounded-lg p-8 md:p-10 ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Welcome to Song World! We are passionate about music and dedicated to providing musicians, songwriters, and artists with the ultimate tool to bring their musical ideas to life.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Our mission is to bridge the gap between simple note-taking apps and complex digital audio workstations. Song World offers an intuitive, focused environment for lyric writing, chord progression, song structuring, collaboration and of course... AI.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Founded by musicians for musicians, we understand the creative process and aim to make Song World an indispensable part of your songwriting journey.
          </p>
        </div>

        {/* Meet the Founder Section - Carousel */}
        <div className="mt-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-songworld-light-text dark:text-songworld-dark-text text-center mb-10">
            Meet the Founder
          </h3>
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-lg"> {/* Removed shadow and bg from here to apply per-card */}
              <div
                className="flex transition-transform ease-in-out duration-500"
                style={{ transform: `translateX(-${currentFounderCardIndex * 100}%)` }}
              >
                {founderCardsData.map((card) => (
                  <div key={card.id} className="w-full flex-shrink-0 p-1"> {/* Added p-1 for potential card spacing */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 bg-white dark:bg-black/20 shadow-xl rounded-lg p-8 md:p-10 ring-1 ring-black/5 dark:ring-white/10">
                      {/* Founder Image (Square) */}
                      <div
                        className="relative w-96 h-96 md:w-96 md:h-96 rounded-lg bg-gray-300 dark:bg-gray-700 flex-shrink-0 overflow-hidden group cursor-pointer"
                        onClick={() => openFounderPhotoFullScreen(card.photoSrc)}
                      >
                        <img src={card.photoSrc} alt={card.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaExpand className="text-white text-3xl" />
                        </div>
                      </div>
                      {/* Founder Description */}
                      <div className="text-center md:text-left flex-grow">
                        <h4 className="text-xl sm:text-2xl font-semibold text-songworld-light-primary dark:text-songworld-dark-primary mb-3">
                          {card.name}
                        </h4>
                        <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {card.title}
                        </p>
                        <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {card.description1}
                        </p>
                        <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          {card.description2}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prev/Next Buttons for Founder Carousel */}
            {founderCardsData.length > 1 && (
              <>
                <button
                  onClick={goToPreviousFounderCard}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-8 bg-songworld-light-accent/70 hover:bg-songworld-light-accent dark:bg-songworld-dark-accent/70 dark:hover:bg-songworld-dark-accent text-white p-2 sm:p-3 rounded-full shadow-md transition-colors z-10"
                  aria-label="Previous founder"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={goToNextFounderCard}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 sm:translate-x-8 bg-songworld-light-accent/70 hover:bg-songworld-light-accent dark:bg-songworld-dark-accent/70 dark:hover:bg-songworld-dark-accent text-white p-2 sm:p-3 rounded-full shadow-md transition-colors z-10"
                  aria-label="Next founder"
                >
                  <FaArrowRight />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {founderCardsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFounderCardIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentFounderCardIndex === index
                          ? 'bg-songworld-light-primary dark:bg-songworld-dark-primary'
                          : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                      }`}
                      aria-label={`Go to founder card ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
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

      {showFounderPhotoFullScreen && selectedFounderPhotoUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeFounderPhotoFullScreen}
        >
          <img
            src={selectedFounderPhotoUrl}
            alt="Founder photo full screen"
            className="max-w-[90vw] max-h-[90vh] sm:max-w-[85vw] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeFounderPhotoFullScreen}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-full transition-colors z-50"
            aria-label="Close full screen founder photo"
          >
            <FaXmark />
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutUs; 