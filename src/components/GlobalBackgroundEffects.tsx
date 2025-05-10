import React, { useState, useEffect } from 'react';
import {
  FaMusic
} from 'react-icons/fa';
import {
  BsMusicNoteBeamed,
  BsMusicNoteList,
  BsSoundwave
} from 'react-icons/bs';
import {
  GiMusicalScore,
  GiGClef,
  GiMusicalKeyboard
} from 'react-icons/gi';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { RiMusic2Line } from 'react-icons/ri';

// Props type now includes children
interface GlobalBackgroundEffectsProps {
  children: React.ReactNode;
}

const MusicalElement = ({ children, delay, duration, initialX, initialY, targetY }: {
  children: React.ReactNode;
  delay: string;
  duration: string;
  initialX: string;
  initialY: string;
  targetY: string;
}) => {
  const verticalTravel = `calc(${targetY} - ${initialY})`;
  return (
    <div
      className="absolute animate-floatFade"
      style={{
        animationDelay: delay,
        animationDuration: duration,
        left: initialX,
        top: initialY,
        ['--vertical-travel' as any]: verticalTravel,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

const iconComponents: React.ElementType[] = [
  FaMusic, BsMusicNoteBeamed, BsMusicNoteList,
  BsSoundwave, GiMusicalScore, GiGClef, GiMusicalKeyboard,
  IoMusicalNotesSharp, RiMusic2Line
];

const iconColors = [
  "text-songworld-light-primary dark:text-songworld-dark-primary",
  "text-songworld-light-accent dark:text-songworld-dark-accent",
  "text-green-500 dark:text-green-400",
  "text-purple-500 dark:text-purple-400",
  "text-pink-500 dark:text-pink-400",
];

const iconSizes = [
  "w-6 h-6 md:w-8 md:h-8",
  "w-8 h-8 md:w-10 md:h-10",
  "w-10 h-10 md:w-12 md:h-12",
  "w-5 h-5 md:w-6 md:h-6",
];

interface MusicalElementData {
  id: number;
  IconComponent: React.ElementType;
  delay: string;
  duration: string;
  initialX: string;
  initialY: string;
  targetY: string;
  sizeClass: string;
  colorClass: string;
}

const generateMusicalElements = (count: number): MusicalElementData[] => {
  const elements: MusicalElementData[] = [];
  const verticalBands = count > 0 ? 80 / count : 80; // Divide 10-90% (80% range) into bands

  for (let i = 0; i < count; i++) {
    // Horizontal placement: 5-35% or 65-95%
    let initialXPercent;
    if (Math.random() < 0.5) {
      initialXPercent = Math.random() * 30 + 5; // Left side: 5% to 35%
    } else {
      initialXPercent = Math.random() * 30 + 65; // Right side: 65% to 95%
    }

    // Vertical placement: Assign to bands for better spread
    const bandStartY = 10 + (i * verticalBands);
    const initialYPercent = bandStartY + (Math.random() * verticalBands * 0.8); // Random within band, avoiding exact edges

    // Ensure targetY is significantly different for noticeable travel
    let targetYPercent = initialYPercent + (Math.random() * 60 - 30); // +/- 30% from initialY
    if (targetYPercent < 5) targetYPercent = 5 + Math.random() * 10; // Keep within 5-95% bounds mostly
    if (targetYPercent > 95) targetYPercent = 95 - Math.random() * 10;
    if (Math.abs(targetYPercent - initialYPercent) < 25) { // Minimum 25% travel
      targetYPercent = initialYPercent + (initialYPercent > 50 ? -25 : 25);
    }
    // Clamp again after ensuring minimum travel
    targetYPercent = Math.max(5, Math.min(95, targetYPercent));

    elements.push({
      id: i,
      IconComponent: iconComponents[Math.floor(Math.random() * iconComponents.length)],
      delay: `${(Math.random() * 5 + i * 0.3).toFixed(1)}s`, // Staggered delay slightly by index
      duration: `${(Math.random() * 10 + 18).toFixed(1)}s`, // 18s to 28s duration
      initialX: `${initialXPercent}%`,
      initialY: `${initialYPercent}%`,
      targetY: `${targetYPercent}%`,
      sizeClass: iconSizes[Math.floor(Math.random() * iconSizes.length)],
      colorClass: iconColors[Math.floor(Math.random() * iconColors.length)],
    });
  }
  return elements;
};

const GlobalBackgroundEffects: React.FC<GlobalBackgroundEffectsProps> = ({ children }) => {
  const [musicalElementsData, setMusicalElementsData] = useState<MusicalElementData[]>([]);

  useEffect(() => {
    setMusicalElementsData(generateMusicalElements(20)); // Generate 20 elements
  }, []);

  return (
    <div className="relative isolate"> {/* Changed: Main wrapper for stacking context and scrolling */}
      <div className="absolute inset-0 opacity-25 dark:opacity-20 pointer-events-none"> {/* Removed z-[-1], increased opacity */}
        {musicalElementsData.map(el => (
          <MusicalElement
            key={el.id}
            delay={el.delay}
            duration={el.duration}
            initialX={el.initialX}
            initialY={el.initialY}
            targetY={el.targetY}
          >
            <el.IconComponent className={`${el.sizeClass} ${el.colorClass}`} />
          </MusicalElement>
        ))}
      </div>
      {children} {/* Page content will be rendered here */}
    </div>
  );
};

export default GlobalBackgroundEffects; 