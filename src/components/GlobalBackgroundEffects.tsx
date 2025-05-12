import React, { useState, useEffect } from 'react';
import {
  FaMusic
} from 'react-icons/fa';
import {
  BsMusicNoteBeamed, BsMusicNoteList, BsSoundwave
} from 'react-icons/bs';
import {
  GiMusicalScore, GiGClef, GiMusicalKeyboard
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

const SpaceParticle = ({ delay, duration, initialX, initialY, targetX, targetY, size }: {
  delay: string;
  duration: string;
  initialX: string;
  initialY: string;
  targetX: string;
  targetY: string;
  size: string;
}) => {
  return (
    <div
      className="absolute bg-gray-600 dark:bg-white rounded-full opacity-40 dark:opacity-70 animate-drift"
      style={{
        animationDelay: delay,
        animationDuration: duration,
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        ['--drift-x' as any]: `calc(${targetX} - ${initialX})`,
        ['--drift-y' as any]: `calc(${targetY} - ${initialY})`,
      } as React.CSSProperties}
    />
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
  const [spaceParticlesData, setSpaceParticlesData] = useState<any[]>([]);

  useEffect(() => {
    setMusicalElementsData(generateMusicalElements(20)); // Generate 20 musical elements

    // Generate a few space particles
    const particles = [];
    for (let i = 0; i < 10; i++) { // Add 10 particles
      particles.push({
        id: `sp-${i}`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 20 + 15}s`, // 15s to 35s
        initialX: `${Math.random() * 100}%`,
        initialY: `${Math.random() * 100}%`,
        targetX: `${Math.random() * 100}%`,
        targetY: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`, // 1px to 3px
      });
    }
    setSpaceParticlesData(particles);

  }, []);

  return (
    <div className="relative isolate overflow-hidden"> 
      {/* Existing Musical Elements */}
      <div className="absolute inset-0 opacity-15 dark:opacity-25 pointer-events-none">
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

      {/* New Space Themed Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Stars (Twinkling) */}
        <div 
          className="absolute inset-0 animate-twinkle opacity-30 dark:opacity-70"
          style={{
             backgroundImage: 'radial-gradient(1.5px 1.5px at 15% 25%, rgba(255, 255, 255, 0.7), transparent), radial-gradient(1px 1px at 35% 45%, rgba(255, 255, 255, 0.5), transparent), radial-gradient(2px 2px at 55% 75%, rgba(255, 255, 255, 0.6), transparent), radial-gradient(1px 1px at 5% 85%, rgba(255, 255, 255, 0.4), transparent), radial-gradient(1.5px 1.5px at 65% 15%, rgba(255, 255, 255, 0.7), transparent), radial-gradient(1px 1px at 85% 35%, rgba(255, 255, 255, 0.5), transparent), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.6), transparent), radial-gradient(1.5px 1.5px at 90% 80%, rgba(255,255,255,0.7), transparent)', 
          }}
        />
        {/* Nebula Effect */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse-slow opacity-40 dark:opacity-70" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-radial from-pink-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl animate-pulse-slower opacity-30 dark:opacity-60" />
        {/* Drifting Space Particles */}
        {spaceParticlesData.map(p => (
          <SpaceParticle
            key={p.id}
            delay={p.delay}
            duration={p.duration}
            initialX={p.initialX}
            initialY={p.initialY}
            targetX={p.targetX}
            targetY={p.targetY}
            size={p.size}
          />
        ))}
      </div>

      {children} {/* Page content will be rendered here */}
    </div>
  );
};

export default GlobalBackgroundEffects; 