import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaLightbulb, FaGlobeAmericas, FaTasks, FaChevronLeft, FaChevronRight, FaFileAlt, FaMicrophone, FaMobileAlt, FaHistory, FaSlidersH, FaShareSquare } from 'react-icons/fa';
import cartoonSongWorldFeatures from '../assets/song-world/transparent/AI-GEN/AI_world_icon_square.png';
const featuresData = [
  {
    id: 'ai-cocreator',
    icon: FaLightbulb,
    title: "AI Co-Creator",
    description: "Break through creative blocks with AI that suggests melodies, chord progressions, and lyrics, acting as your inspiring musical partner."
  },
  {
    id: 'collaboration',
    icon: FaGlobeAmericas,
    title: "Seamless Global Collaboration",
    description: "Work on projects simultaneously with anyone, anywhere. Shared workspaces and real-time editing make distance irrelevant."
  },
  {
    id: 'workflow',
    icon: FaTasks,
    title: "All-in-One Workflow",
    description: "From initial spark to basic demo, manage your entire songwriting process within a single, intuitive platform."
  },
  {
    id: 'lyric-chord-sync',
    icon: FaFileAlt,
    title: "Synced Lyrics & Chords",
    description: "Keep your lyrics, chord progressions, and song structure perfectly in sync. No more juggling separate documents or tools."
  },
  {
    id: 'audio-prototyping',
    icon: FaMicrophone,
    title: "Quick Audio Prototyping",
    description: "Easily record rough ideas and basic demos directly within the app. Capture inspiration the moment it strikes."
  },
  {
    id: 'multi-platform-access',
    icon: FaMobileAlt,
    title: "Cross-Platform Access",
    description: "Access and work on your songs from anywhere, on any device. Your creative workspace travels with you."
  },
  {
    id: 'version-history',
    icon: FaHistory,
    title: "Track Your Revisions",
    description: "Never lose a great idea. Effortlessly track song versions, revert changes, and see your creative evolution."
  },
  {
    id: 'pitch-tempo-tools',
    icon: FaSlidersH,
    title: "Pitch & Tempo Assist",
    description: "Experiment with key changes and tempo adjustments with built-in tools, making it easy to find the perfect feel for your song."
  },
  {
    id: 'export-options',
    icon: FaShareSquare,
    title: "Flexible Export Options",
    description: "Export your work in various formats, from simple text and PDF to MIDI and basic audio stems for further production."
  }
];

const AUTO_SLIDE_INTERVAL = 5000;
const CARD_TRANSITION_DURATION = 'duration-500'; // Corresponds to 500ms

const Features = () => {
  const [sectionTitleVisible, setSectionTitleVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the card that should be in the center
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Observer for section title
  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    if (!currentSectionRef) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSectionTitleVisible(true);
        observer.unobserve(currentSectionRef);
      }
    }, { threshold: 0.1 });
    observer.observe(currentSectionRef);
    return () => { if (currentSectionRef) observer.unobserve(currentSectionRef); };
  }, []);

  // Auto-sliding logic
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    resetTimeout();
    if (!isHovered) { // Only auto-slide if not hovered
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % featuresData.length);
      }, AUTO_SLIDE_INTERVAL);
    }
    return resetTimeout;
  }, [currentIndex, isHovered, resetTimeout]);

  const changeSlide = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + featuresData.length) % featuresData.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuresData.length);
  };

  const getCardStyle = (index: number) => {
    const numItems = featuresData.length;
    let offset = index - currentIndex;

    // Handle wrapping for offset calculation
    if (Math.abs(offset) > numItems / 2) {
      if (offset > 0) offset -= numItems;
      else offset += numItems;
    }

    let transform = '';
    let opacity = 0;
    let zIndex = 0;

    // Center card
    if (offset === 0) {
      opacity = 1;
      transform = 'translateX(0%) scale(1)';
      zIndex = 3;
    }
    // Left card (partially visible)
    else if (offset === -1) {
      opacity = 0.7;
      transform = 'translateX(-60%) scale(0.8)'; // Pulls it more to the left
      zIndex = 2;
    }
    // Right card (partially visible)
    else if (offset === 1) {
      opacity = 0.7;
      transform = 'translateX(60%) scale(0.8)'; // Pushes it more to the right
      zIndex = 2;
    }
    // Cards further out (to ensure smooth transition from/to hidden)
    else if (offset === -2) {
        opacity = 0;
        transform = 'translateX(-120%) scale(0.6)';
        zIndex = 1;
    } else if (offset === 2) {
        opacity = 0;
        transform = 'translateX(120%) scale(0.6)';
        zIndex = 1;
    } else {
        // Default for cards far off-screen
        opacity = 0;
        transform = `translateX(${offset * 100}%) scale(0.5)`;
        zIndex = 0;
    }
    
    return { transform, opacity, zIndex };
  };


  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="bg-slate-50 dark:bg-gray-800/30 text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 transition-opacity duration-700 ease-in-out ${sectionTitleVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <div className="flex justify-center mb-12">
            <img src={cartoonSongWorldFeatures.src} alt="cartoonSongWorld" className="h-16 w-16 mr-4" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">
            Transform Your Sound with Intelligent Tools
          </h2>
          </div>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Song World offers a unique blend of the best tools. It's like the Notes app with the features of Music Tablature, Chord Library, Media Library, Song Library, Collaboration, and there will be more to come.
          </p>
        </div>

        <div 
          className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[450px]" // Fixed height for the carousel area
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={carouselRef}
        >
          {/* This div will act as the viewport for cards. overflow-hidden is not strictly needed here 
              if cards are positioned absolutely, but good for structure. The actual positioning 
              and appearance are handled by individual card styles based on currentIndex. 
              The key is that cards will be absolutely positioned within this container. 
          */}
          <div className="relative w-full h-full">
            {featuresData.map((feature, index) => {
              const IconComponent = feature.icon;
              const style = getCardStyle(index);
              return (
                <div 
                  key={feature.id} 
                  className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-songworld-light-card dark:bg-songworld-dark-card rounded-xl shadow-xl transition-all ${CARD_TRANSITION_DURATION} ease-in-out`}
                  style={style}
                >
                  <div className="flex justify-center items-center mb-5 w-16 h-16 rounded-full bg-songworld-light-accent/10 dark:bg-songworld-dark-accent/10">
                    {IconComponent && <IconComponent className="w-8 h-8 text-songworld-light-accent dark:text-songworld-dark-accent" />}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-songworld-light-text dark:text-songworld-dark-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed flex-grow overflow-y-auto max-h-[100px] sm:max-h-[120px]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows - Visibility controlled by hover */}
          <button 
            onClick={goToPrevious} 
            className={`absolute top-1/2 left-0 sm:-left-2 transform -translate-y-1/2 p-3 bg-songworld-light-accent/70 hover:bg-songworld-light-accent dark:bg-songworld-dark-accent/70 dark:hover:bg-songworld-dark-accent text-white rounded-full shadow-lg transition-all duration-300 ease-in-out z-20 focus:outline-none focus:ring-2 ring-songworld-light-accent dark:ring-songworld-dark-accent
                        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
            aria-label="Previous Feature"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={goToNext} 
            className={`absolute top-1/2 right-0 sm:-right-2 transform -translate-y-1/2 p-3 bg-songworld-light-accent/70 hover:bg-songworld-light-accent dark:bg-songworld-dark-accent/70 dark:hover:bg-songworld-dark-accent text-white rounded-full shadow-lg transition-all duration-300 ease-in-out z-20 focus:outline-none focus:ring-2 ring-songworld-light-accent dark:ring-songworld-dark-accent
                        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
            aria-label="Next Feature"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 flex justify-center space-x-2.5">
            {featuresData.map((_, index) => (
              <button
                key={index}
                onClick={() => changeSlide(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 focus:outline-none
                            ${currentIndex === index ? 'bg-songworld-light-primary dark:bg-songworld-dark-primary scale-125' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 