import React, { useState, useEffect, useCallback } from 'react';
import { FaRocket } from 'react-icons/fa';
import songTitleLight from '../assets/song-world/Song_World_Title_Lightxxxhdpi.png';
import songTitleDark from '../assets/song-world/Song_World_Title_Darkxxxhdpi.png';
import cartoonSongWorld from '../assets/song-world/transparent/AI-GEN/home_icon_square.png';
import GlobalBackgroundEffects from './GlobalBackgroundEffects';
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
    <circle cx="20" cy="7.5" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-200" />
    <circle cx="50" cy="12.5" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-200" />
    <circle cx="80" cy="2.5" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-200" />
  </svg>
);

const MAIN_HEADLINE_FULL = "Song World: A World Just For You And Your Songs";
const SUB_HEADLINE_FULL = "An all in one application for songwriting tools, song management, collaboration and creativity... and yes we use AI!";
const PARAGRAPH_FULL = "We will help you avoid writer's block and the chaos of managing the lyrics, recordings, and ideas that you really need to store somewhere to remember that great idea. Song World offers this and more, an AI-powered music creation partner, cloud storage, intelligent tools to revolutionize your songwriting, collaboration, and production. It's your world, your songs!.";

const MAIN_HEADLINE_TYPING_SPEED = 130;
const SUB_HEADLINE_TYPING_SPEED = 70;

const CURSOR_DISAPPEAR_DELAY = 2500;
const STAGE_TRANSITION_DELAY = 300;
const AI_BUTTON_APPEAR_DELAY = 1000; // Delay before AI button appears
const THINKING_ANIMATION_PER_STAGE_DURATION = 4000; // Increased from 2500
const THINKING_STAGES_TEXT = [
  "Initiating Sonic Algorithm: Warming up the digital band...",
  "Neural Jam Session: Syncing with the rhythm of your muse...",
  "Harmonic Processing Unit: Calculating the ultimate riff...",
  "Quantum Mixdown: Blending genres across dimensions...",
  "Bassline Brainstorm: Dropping the beat of inspiration...",
  "Melody Matrix: Weaving notes into pure gold...",
  "Chord Constructor: Building progressions that resonate...",
  "Rhythm Router: Syncing your tempo to the cosmos...",
  "Lyric Logic: Crafting words that hit all the right notes...",
  "Synth Symphony: Layering sounds for epic crescendos...",
  "Digital DJ: Spinning ideas into seamless tracks...",
  "Frequency Finder: Tuning into your creative wavelength...",
  "Echo Engine: Amplifying echoes of genius...",
  "Groove Generator: Pulsing with unstoppable vibes...",
  "Harmony Hub: Connecting every musical idea...",
  "Beat Blueprint: Designing rhythms that move souls...",
  "Tone Transformer: Shaping sounds beyond imagination...",
  "Mixing Mindset: Balancing every element perfectly...",
  "Acoustic AI: Strumming the strings of innovation...",
  "Vocal Vision: Singing the future of your song..."
];

const LandingTitle = () => {
  const [currentLogo, setCurrentLogo] = useState(songTitleLight.src);
  const [animationStage, setAnimationStage] = useState(0); // 0:initial, 1:mainH, 2:subH, 3:think1, 4:think2, 5:think3, 6:para, 7:buttons+logo

  const [mainHeadlineDisplayed, setMainHeadlineDisplayed] = useState('');
  const [subHeadlineDisplayed, setSubHeadlineDisplayed] = useState('');
  const [paragraphDisplayed, setParagraphDisplayed] = useState('');
  const [showMainHeadlineCursor, setShowMainHeadlineCursor] = useState(false);
  const [showSubHeadlineCursor, setShowSubHeadlineCursor] = useState(false);
  const [showAIButton, setShowAIButton] = useState(false);

  const [paragraphWords, setParagraphWords] = useState<string[]>([]);
  const [currentParagraphWordIndex, setCurrentParagraphWordIndex] = useState(0);

  const [genericThinkingTextDisplayed, setGenericThinkingTextDisplayed] = useState(''); // Replaces thinkingTextDisplayed
  const [selectedThinkingTexts, setSelectedThinkingTexts] = useState<string[]>([]);

  useEffect(() => {
    if (PARAGRAPH_FULL) setParagraphWords(PARAGRAPH_FULL.split(' '));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setCurrentLogo(root.classList.contains('dark') ? songTitleDark.src : songTitleLight.src);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    setCurrentLogo(root.classList.contains('dark') ? songTitleDark.src : songTitleLight.src);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setAnimationStage(1);
    setShowMainHeadlineCursor(true);
    // Randomly select 3 thinking texts from the array
    const shuffled = THINKING_STAGES_TEXT.sort(() => 0.5 - Math.random());
    setSelectedThinkingTexts(shuffled.slice(0, 3));
  }, []);

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

  useEffect(() => { // Main Headline Typing (Stage 1)
    if (animationStage === 1) {
      return typeText(MAIN_HEADLINE_FULL, mainHeadlineDisplayed, setMainHeadlineDisplayed, MAIN_HEADLINE_TYPING_SPEED, () => {
        setTimeout(() => {
          setShowMainHeadlineCursor(false);
          setAnimationStage(2); // -> Sub-headline
        }, CURSOR_DISAPPEAR_DELAY);
      });
    }
  }, [animationStage, mainHeadlineDisplayed, typeText]);

  useEffect(() => { // Sub-Headline Typing (Stage 2)
    if (animationStage === 2) {
      setShowSubHeadlineCursor(true);
      return typeText(SUB_HEADLINE_FULL, subHeadlineDisplayed, setSubHeadlineDisplayed, SUB_HEADLINE_TYPING_SPEED, () => {
        setTimeout(() => {
          setShowAIButton(true); // Show AI button after sub-headline completes
          setShowSubHeadlineCursor(false); // Stop cursor blink when button appears
        }, AI_BUTTON_APPEAR_DELAY);
      });
    }
  }, [animationStage, subHeadlineDisplayed, typeText]);

  const handleAIButtonClick = () => {
    setShowAIButton(false);
    setAnimationStage(3); // -> First Thinking Animation stage
  };

  useEffect(() => { // Multi-stage Thinking Animation (Stages 3, 4, 5)
    if (animationStage >= 3 && animationStage <= 5) {
      let dotCount = 0;
      const currentThinkingStageIndex = animationStage - 3;
      const currentThinkingBaseText = selectedThinkingTexts[currentThinkingStageIndex] || THINKING_STAGES_TEXT[currentThinkingStageIndex];

      // Immediately set the full text for the current stage
      setGenericThinkingTextDisplayed(currentThinkingBaseText);

      const intervalId = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        setGenericThinkingTextDisplayed(currentThinkingBaseText + '.'.repeat(dotCount));
      }, 500);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        if (animationStage < 5) {
          setAnimationStage(prevStage => prevStage + 1); // Move to next thinking stage
        } else {
          setAnimationStage(6); // -> Paragraph Reveal
        }
      }, THINKING_ANIMATION_PER_STAGE_DURATION);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        if (animationStage < 6) {
          setGenericThinkingTextDisplayed('');
        }
      };
    } else if (animationStage === 6) { // When moving to paragraph, ensure thinking text is cleared for fade out
      setGenericThinkingTextDisplayed('');
    }
  }, [animationStage, selectedThinkingTexts]);

  useEffect(() => { // Paragraph "AI-style" Reveal (Stage 6)
    if (animationStage === 6 && paragraphWords.length > 0 && currentParagraphWordIndex < paragraphWords.length) {
      const delay = Math.random() * 120 + 60;
      const timeoutId = setTimeout(() => {
        setParagraphDisplayed((prev) => prev + (currentParagraphWordIndex > 0 ? ' ' : '') + paragraphWords[currentParagraphWordIndex]);
        setCurrentParagraphWordIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeoutId);
    } else if (animationStage === 6 && paragraphWords.length > 0 && currentParagraphWordIndex >= paragraphWords.length) {
      setTimeout(() => {
        setAnimationStage(7); // -> Buttons and logo
      }, STAGE_TRANSITION_DELAY);
    }
  }, [animationStage, paragraphWords, currentParagraphWordIndex]);

  const isCurrentlyTypingMain = animationStage === 1 && mainHeadlineDisplayed.length < MAIN_HEADLINE_FULL.length;
  const isCurrentlyTypingSub = animationStage === 2 && subHeadlineDisplayed.length < SUB_HEADLINE_FULL.length;

  let logoContainerClasses = "relative z-10 mt-12 md:mt-16 transition-opacity duration-500 ease-in-out pointer-events-none transform";
  if (animationStage === 0) {
    logoContainerClasses += " opacity-0 scale-150";
  } else if (animationStage >= 1 && animationStage < 7) { // Visible until stage 7
    logoContainerClasses += " opacity-100 scale-150";
  } else if (animationStage >= 7) { // Interactive at stage 7
    logoContainerClasses += " opacity-100 scale-150 pointer-events-auto";
  }

  return (
    <GlobalBackgroundEffects>
      <section
        id="hero"
        className="relative text-songworld-light-text dark:text-songworld-dark-text min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden pt-8 pb-12 md:pb-16"
      >
        <div
          className="absolute inset-0 opacity-40 dark:opacity-30 animate-breathingBackground bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-songworld-light-primary/40 via-transparent to-transparent dark:from-songworld-dark-primary/40 dark:via-transparent dark:to-transparent"
        ></div>

        {/* Space Background Effects - These will be moved to GlobalBackgroundEffects.tsx */}
        {/* The div below containing the SVG grid, stars, nebula, and particles will be removed from here. */}

        <div className="relative z-10 mx-auto max-w-screen-xl px-4 w-full text-center flex flex-col items-center flex-grow justify-center">
          <div className={`animate-fadeInUp ${animationStage === 0 ? 'opacity-0' : 'opacity-100'}`} style={{ animationDelay: '0.1s' }}>
            <div className="inline-block min-h-[100px] sm:min-h-[140px] lg:min-h-[180px]">
              <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-songworld-light-primary via-songworld-light-accent to-green-400 dark:from-songworld-dark-primary dark:via-songworld-dark-accent dark:to-green-500 bg-clip-text text-transparent pb-2">
                {mainHeadlineDisplayed}
                {(showMainHeadlineCursor || isCurrentlyTypingMain) && <span className="inline-block align-bottom animate-caret-blink text-songworld-light-text dark:text-songworld-dark-text">|</span>}
              </h1>
            </div>
          </div>

          <div className={`transition-opacity duration-300 ease-in-out ${animationStage >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'} min-h-[5rem]`} style={{ animationDelay: '0.1s' }}>
            <span className="block mt-1 sm:mt-2 font-semibold text-songworld-light-text/80 dark:text-songworld-dark-text/80 text-xl sm:text-2xl lg:text-3xl">
              {subHeadlineDisplayed}
              {showSubHeadlineCursor && <span className="inline-block align-bottom animate-caret-blink text-songworld-light-text dark:text-songworld-dark-text">|</span>}
            </span>
          </div>

          {animationStage == 2 && (
            <div className={`transition-opacity duration-500 ease-in-out mt-4 md:mt-6 ${showAIButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button
                onClick={handleAIButtonClick}
                className="px-6 py-2 text-base font-semibold text-white bg-songworld-light-accent dark:bg-songworld-dark-accent rounded-lg shadow-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-songworld-light-card dark:focus:ring-offset-songworld-dark-card focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent"
                disabled={!showAIButton}
              >
                Enable AI Magic
              </button>
            </div>
          )}
          {animationStage <= 6 && animationStage >= 3 && (
            <div className={`transition-opacity duration-300 ease-in-out min-h-[2rem] mt-4 md:mt-6 ${(animationStage >= 3 && animationStage <= 5) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {(animationStage >= 3 && animationStage <= 5) && (
                <div className="bg-songworld-light-card dark:bg-songworld-dark-card p-4 rounded-lg shadow-md max-w-lg mx-auto">
                  <p className="text-lg sm:text-xl text-songworld-light-text/80 dark:text-songworld-dark-text/80 italic">
                    {genericThinkingTextDisplayed}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className={`transition-opacity duration-300 ease-in-out mt-4 md:mt-6 ${(animationStage >= 6) ? 'opacity-100' : 'opacity-0 pointer-events-none'} min-h-[10rem]`} style={{ animationDelay: animationStage === 6 ? '0.1s' : '0s' }}>
            {/* Render p tag only when its container is meant to be visible to help with transitions */}
            {animationStage >= 6 && (
              <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed opacity-90">
                {paragraphDisplayed}
              </p>
            )}
          </div>

          <div
            className={`mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-opacity duration-500 ease-in-out 
                        ${animationStage >= 7 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ transitionDelay: animationStage >= 7 ? '0.2s' : '0s' }}
          >
            <a
              href="https://songworld.app/login"
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-base font-bold text-white bg-songworld-light-primary dark:bg-songworld-dark-primary rounded-lg shadow-xl hover:bg-opacity-90 dark:hover:bg-opacity-90 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-songworld-light-card dark:focus:ring-offset-songworld-dark-card focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent"
            >
              {/* <FaRocket className="mr-2 h-5 w-5" />  */}
              <img src={cartoonSongWorld.src} alt="cartoonSongWorld" className="mr-2 h-10 w-10" />
              Start Your Musical Journey
            </a>
            <a href="#about" className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-base font-bold text-songworld-light-primary dark:text-songworld-dark-primary bg-transparent border-2 border-songworld-light-primary dark:border-songworld-dark-primary rounded-lg shadow-lg hover:bg-songworld-light-primary/10 dark:hover:bg-songworld-dark-primary/20 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-songworld-light-card dark:focus:ring-offset-songworld-dark-card focus:ring-songworld-light-primary dark:focus:ring-songworld-dark-primary">
              Learn More
            </a>
          </div>
        </div>


        <div
          className={logoContainerClasses}
          style={{ animationDelay: animationStage >= 7 ? '0.1s' : '0s' }}
        >
          <img src={currentLogo} alt="Song World Logo" className="h-24 w-auto sm:h-32 md:h-40" />
        </div>
      </section>
    </GlobalBackgroundEffects>
  );
};

export default LandingTitle;