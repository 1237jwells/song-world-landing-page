import React, { useState, useEffect, useCallback } from 'react';
import { FaRocket } from 'react-icons/fa';
// Import both logo versions
import logoLight from '../assets/song-world/transparent/3x/main_title_icon_light.png';
import logoDark from '../assets/song-world/transparent/3x/main_title_icon_dark.png';

// Simple SVG for abstract piano keys
const PianoKeys = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 30" className={`w-16 h-8 md:w-20 md:h-10 opacity-70 ${className}`}>
    <rect x="0" y="0" width="14" height="30" fill="currentColor" className="text-gray-800 dark:text-gray-300" />
    <rect x="15" y="0" width="14" height="20" fill="currentColor" className="text-black dark:text-white" />
    <rect x="30" y="0" width="14" height="30" fill="currentColor" className="text-gray-800 dark:text-gray-300" />
    <rect x="45" y="0" width="14" height="20" fill="currentColor" className="text-black dark:text-white" />
    <rect x="60" y="0" width="14" height="30" fill="currentColor" className="text-gray-800 dark:text-gray-300" />
    <rect x="75" y="0" width="14" height="20" fill="currentColor" className="text-black dark:text-white" />
    <rect x="90" y="0" width="14" height="30" fill="currentColor" className="text-gray-800 dark:text-gray-300" />
  </svg>
);

// Simple SVG for abstract guitar tablature
const GuitarTab = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 20" className={`w-20 h-5 md:w-24 md:h-6 opacity-70 ${className}`}>
    {[0, 5, 10, 15, 20].map(y => 
      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-500 dark:text-gray-400" />
    )}
    <circle cx="20" cy="7.5" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-200"/>
    <circle cx="50" cy="12.5" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-200"/>
    <circle cx="80" cy="2.5" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-200"/>
  </svg>
);

const MAIN_HEADLINE_FULL = "Song World: A World Just For You And Your Songs";
const SUB_HEADLINE_FULL = "Spark creativity, conquer blocks, and produce music effortlessly.";
const PARAGRAPH_FULL = "Tired of creative ruts and juggling multiple apps? Song World is your AI-powered partner, revolutionizing how you write, collaborate, and produce music. We provide intelligent tools to ignite your ideas and a seamless platform to bring them to life with anyone, anywhere. Create more, struggle less.";

const MAIN_HEADLINE_TYPING_SPEED = 130; // User set this
const SUB_HEADLINE_TYPING_SPEED = 70; // Faster for sub-headline
const PARAGRAPH_TYPING_SPEED = 67;    // Default for paragraph

const CURSOR_DISAPPEAR_DELAY = 2500; // 2 seconds (user set this)
const STAGE_TRANSITION_DELAY = 300; // ms to pause between typing stages (after text fully typed)

const LandingTitle = () => {
  const [currentLogo, setCurrentLogo] = useState(logoLight.src);
  
  const [animationStage, setAnimationStage] = useState(0); // 0:initial, 1:mainH, 2:subH, 3:para, 4:buttons+logo, 5:done
  
  const [mainHeadlineDisplayed, setMainHeadlineDisplayed] = useState('');
  const [subHeadlineDisplayed, setSubHeadlineDisplayed] = useState('');
  const [paragraphDisplayed, setParagraphDisplayed] = useState('');
  
  const [showMainHeadlineCursor, setShowMainHeadlineCursor] = useState(false);

  // Logo theme switching
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setCurrentLogo(root.classList.contains('dark') ? logoDark.src : logoLight.src);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    setCurrentLogo(root.classList.contains('dark') ? logoDark.src : logoLight.src);
    return () => observer.disconnect();
  }, []);

  // Effect to start the animation sequence
  useEffect(() => {
    setAnimationStage(1); 
    setShowMainHeadlineCursor(true);
  }, []);

  // Generic Typing logic effect - now accepts speed
  const typeText = useCallback((textToType: string, currentDisplayedText: string, setter: React.Dispatch<React.SetStateAction<string>>, speed: number, onComplete: () => void) => {
    if (currentDisplayedText.length < textToType.length) {
      const timeoutId = setTimeout(() => {
        setter(textToType.substring(0, currentDisplayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      setTimeout(onComplete, STAGE_TRANSITION_DELAY);
    }
  }, []);

  // Main Headline Typing (Stage 1)
  useEffect(() => {
    if (animationStage === 1) {
      return typeText(MAIN_HEADLINE_FULL, mainHeadlineDisplayed, setMainHeadlineDisplayed, MAIN_HEADLINE_TYPING_SPEED, () => {
        // Main headline finished typing. Now wait for its cursor to disappear before starting next stage.
        setTimeout(() => {
          setShowMainHeadlineCursor(false);
          setAnimationStage(2); // Start Sub-headline typing
        }, CURSOR_DISAPPEAR_DELAY);
      });
    }
  }, [animationStage, mainHeadlineDisplayed, typeText]);

  // Sub-Headline Typing (Stage 2)
  useEffect(() => {
    if (animationStage === 2) {
      return typeText(SUB_HEADLINE_FULL, subHeadlineDisplayed, setSubHeadlineDisplayed, SUB_HEADLINE_TYPING_SPEED, () => {
        setAnimationStage(3); // Start Paragraph typing
      });
    }
  }, [animationStage, subHeadlineDisplayed, typeText]);

  // Paragraph Typing (Stage 3)
  useEffect(() => {
    if (animationStage === 3) {
      return typeText(PARAGRAPH_FULL, paragraphDisplayed, setParagraphDisplayed, PARAGRAPH_TYPING_SPEED, () => {
        setAnimationStage(4); // Trigger buttons and final logo animation
      });
    }
  }, [animationStage, paragraphDisplayed, typeText]);

  const isCurrentlyTypingMain = animationStage === 1 && mainHeadlineDisplayed.length < MAIN_HEADLINE_FULL.length;
  const isCurrentlyTypingSub = animationStage === 2 && subHeadlineDisplayed.length < SUB_HEADLINE_FULL.length;
  const isCurrentlyTypingPara = animationStage === 3 && paragraphDisplayed.length < PARAGRAPH_FULL.length;

  // Determine logo classes based on animation stage
  let logoContainerClasses = "relative z-10 mt-12 md:mt-16 transition-opacity duration-500 ease-in-out pointer-events-none transform";
  if (animationStage === 0) {
    logoContainerClasses += " opacity-0 scale-150";
  } else if (animationStage >= 1 && animationStage < 4) {
    logoContainerClasses += " opacity-100 scale-150"; // Visible and big during typing
  } else if (animationStage >= 4) {
    // Stays big, becomes interactive, no longer uses animate-scale-in-from-big
    logoContainerClasses += " opacity-100 scale-150 pointer-events-auto"; 
  }

  return (
    <section
      id="hero"
      className="relative text-songworld-light-text dark:text-songworld-dark-text min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden pt-8 pb-12 md:pb-16"
    >
      {/* Floating Musical Elements Background */}
      {/* <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20"> ... </div> */}

      {/* Breathing background gradient - this will now sit on top of the global background effects */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-30 
                   animate-breathingBackground 
                   bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
                   from-songworld-light-primary/40 via-transparent to-transparent 
                   dark:from-songworld-dark-primary/40 dark:via-transparent dark:to-transparent"
      ></div>

      {/* Optional: Subtle background pattern - commented out for now
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(45)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,0)'/><path d='M1-5V5M20-5V5' stroke-width='1' stroke='hsla(176, 40%, 50%, 0.2)' fill='none'/></pattern></defs><rect width='100%' height='100%' fill='url(#a)'/></svg>
      </div>
      */}

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 w-full text-center flex flex-col items-center flex-grow justify-center">
        {/* Main Headline - always part of initial fade in */} 
        <div className={`animate-fadeInUp ${animationStage === 0 ? 'opacity-0' : 'opacity-100'}`} style={{ animationDelay: '0.1s' }}>
          <div className="inline-block min-h-[100px] sm:min-h-[140px] lg:min-h-[180px]">
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-songworld-light-primary via-songworld-light-accent to-green-400 dark:from-songworld-dark-primary dark:via-songworld-dark-accent dark:to-green-500 bg-clip-text text-transparent pb-2">
              {mainHeadlineDisplayed}
              {(showMainHeadlineCursor || isCurrentlyTypingMain) && <span className="inline-block align-bottom animate-caret-blink text-songworld-light-text dark:text-songworld-dark-text">|</span>}
            </h1>
          </div>
        </div>

        {/* Sub-Headline - fades in and types when stage 2 */} 
        <div className={`transition-opacity duration-300 ease-in-out ${animationStage >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ animationDelay: '0.1s' }}>
          <span className="block mt-1 sm:mt-2 font-semibold text-songworld-light-text/80 dark:text-songworld-dark-text/80 text-xl sm:text-2xl lg:text-3xl">
            {subHeadlineDisplayed}
            {isCurrentlyTypingSub && <span className="inline-block align-bottom animate-caret-blink text-songworld-light-text dark:text-songworld-dark-text">|</span>}
          </span>
        </div>

        {/* Paragraph - fades in and types when stage 3 */} 
        <div className={`transition-opacity duration-300 ease-in-out ${animationStage >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ animationDelay: '0.1s' }}>
          <p className="mx-auto mt-6 md:mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed opacity-90">
            {paragraphDisplayed}
            {isCurrentlyTypingPara && <span className="inline-block align-bottom animate-caret-blink text-songworld-light-text dark:text-songworld-dark-text">|</span>}
          </p>
        </div>

        {/* Buttons - Simplified to only use opacity transition for a cleaner appearance */} 
        <div 
          className={`mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-opacity duration-500 ease-in-out 
                      ${animationStage >= 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ transitionDelay: animationStage >=4 ? '0.2s' : '0s' }} // Use transitionDelay for opacity
        >
          <a 
            href="https://songworld.app/login" // UPDATED LINK
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-base font-bold text-white bg-songworld-light-primary dark:bg-songworld-dark-primary rounded-lg shadow-xl hover:bg-opacity-90 dark:hover:bg-opacity-90 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-songworld-light-card dark:focus:ring-offset-songworld-dark-card focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent"
          >
            <FaRocket className="mr-2 h-5 w-5" /> Start Your Musical Journey
          </a>
          <a href="#about" className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-base font-bold text-songworld-light-primary dark:text-songworld-dark-primary bg-transparent border-2 border-songworld-light-primary dark:border-songworld-dark-primary rounded-lg shadow-lg hover:bg-songworld-light-primary/10 dark:hover:bg-songworld-dark-primary/20 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-songworld-light-card dark:focus:ring-offset-songworld-dark-card focus:ring-songworld-light-primary dark:focus:ring-songworld-dark-primary">
            Learn More
          </a>
        </div>
      </div>
      
      {/* Logo - Logic for size and animation based on stage */}
      <div 
        className={logoContainerClasses} 
        style={{ animationDelay: animationStage >=4 ? '0.1s' : '0s' }} // animationDelay might not be needed if not animating scale
      >
        <img src={currentLogo} alt="Song World Logo" className="h-24 w-auto sm:h-32 md:h-40" /> {/* Increased default image size for a bigger look when scaled */} 
      </div>
    </section>
  );
};

export default LandingTitle; 