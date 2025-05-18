import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const CSSElement = ({ children, delay, duration, initialX, initialY, targetY }: {
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

const baseIconComponents: React.ElementType[] = [
  FaMusic, BsMusicNoteBeamed, BsMusicNoteList,
  BsSoundwave, GiMusicalScore, GiGClef, GiMusicalKeyboard,
  IoMusicalNotesSharp, RiMusic2Line
];

const baseIconColors = [
  "text-songworld-light-primary dark:text-songworld-dark-primary",
  "text-songworld-light-accent dark:text-songworld-dark-accent",
  "text-green-500 dark:text-green-400",
  "text-purple-500 dark:text-purple-400",
  "text-pink-500 dark:text-pink-400",
];

const baseIconSizes = [
  "w-4 h-4 md:w-5 md:h-5",
  "w-5 h-5 md:w-6 md:h-6",
  "w-6 h-6 md:w-7 md:h-7",
  "w-3 h-3 md:w-4 md:h-4",
];

interface CSSElementData {
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

const generateCSSElements = (count: number): CSSElementData[] => {
  const elements: CSSElementData[] = [];
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
      IconComponent: baseIconComponents[Math.floor(Math.random() * baseIconComponents.length)],
      delay: `${(Math.random() * 5 + i * 0.3).toFixed(1)}s`, // Staggered delay slightly by index
      duration: `${(Math.random() * 10 + 18).toFixed(1)}s`, // 18s to 28s duration
      initialX: `${initialXPercent}%`,
      initialY: `${initialYPercent}%`,
      targetY: `${targetYPercent}%`,
      sizeClass: baseIconSizes[Math.floor(Math.random() * baseIconSizes.length)],
      colorClass: baseIconColors[Math.floor(Math.random() * baseIconColors.length)],
    });
  }
  return elements;
};

// --- Configuration for Dynamic Particles ---
const MAX_UFOS = 10;
const UFO_EXPLOSION_DURATION = 300; // ms
const DEBRIS_LIFETIME = 1200; // ms
const DEBRIS_COUNT = 20; // Number of particles per explosion
const UFO_TRAIL_LIFETIME = 600; // ms
const UFO_TRAIL_EMIT_INTERVAL = 7; // frames
const INITIAL_UFO_COUNT = 1;
const UFO_RESPAWN_BATCH_SIZE = 2; // How many UFOs to spawn after an explosion
const UFO_RESPAWN_DELAY_AFTER_EXPLOSION = 1500; // ms

const MAX_FALLING_STARS = 80;
const FALLING_STAR_RESPAWN_DELAY = 80;
const MAX_FALLING_ICONS = 12;
const FALLING_ICON_RESPAWN_DELAY = 350;

// --- UFO State ---
interface UfoState {
  id: string; x: number; y: number; dx: number; dy: number; size: number; rotation: number;
  domeColor: string; bodyColor: string; initialSpeed: number; isExploding: boolean;
  explosionTimer: number; trailEmitCounter: number; wanderAngle: number; wanderTimer: number;
}

const ufoDomeColorsDark = ["rgba(0,255,255,0.7)", "rgba(127,255,212,0.7)", "rgba(173,255,47,0.6)"];
const ufoDomeColorsLight = ["rgba(100,149,237,0.8)", "rgba(60,179,113,0.8)", "rgba(135,206,250,0.7)"];
const ufoBodyColorsDark = ["#4A5568", "#52525B", "#384252"];
const ufoBodyColorsLight = ["#71717A", "#6B7280", "#7f8c8d"];

const createUfo = (isDarkMode: boolean): UfoState => {
  const id = `ufo-${Date.now()}-${Math.random()}`;
  const size = Math.random() * 20 + 20; // 20px to 40px
  const initialSpeed = Math.random() * 1.2 + 0.6; // 0.6 to 1.8 pixels/frame
  const wanderAngle = Math.random() * 2 * Math.PI;
  return {
    id, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    dx: Math.cos(wanderAngle) * initialSpeed, dy: Math.sin(wanderAngle) * initialSpeed, size,
    rotation: Math.atan2(Math.sin(wanderAngle), Math.cos(wanderAngle)) + Math.PI / 2,
    domeColor: isDarkMode ? ufoDomeColorsDark[Math.floor(Math.random() * ufoDomeColorsDark.length)] : ufoDomeColorsLight[Math.floor(Math.random() * ufoDomeColorsLight.length)],
    bodyColor: isDarkMode ? ufoBodyColorsDark[Math.floor(Math.random() * ufoBodyColorsDark.length)] : ufoBodyColorsLight[Math.floor(Math.random() * ufoBodyColorsLight.length)],
    initialSpeed, trailEmitCounter: 0, wanderAngle, wanderTimer: Math.random() * 200 + 150, // 2.5-5.8 secs
    isExploding: false, explosionTimer: 0,
  };
};

// --- Particle States (Debris, Trail, Falling Icon) ---
interface ParticleState {
  id: string; x: number; y: number; dx: number; dy: number;
  initialSize: number; size: number; opacity: number; createdAt: number;
  color?: string; IconComponent?: React.ElementType;
  iconSizeClass?: string; iconColorClass?: string; isTrailIcon?: boolean;
}

interface FallingStarState {
  id: string; x: number; y: number; dy: number; size: number; opacity: number;
}

const createFallingStar = (): FallingStarState => ({
  id: `star-${Date.now()}-${Math.random()}`,
  x: Math.random() * window.innerWidth,
  y: -Math.random() * window.innerHeight * 0.1 - 5, // Start just above or at top
  dy: Math.random() * 1.8 + 0.8, // Slightly faster stars
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
});

interface FallingIconState {
  id: string; x: number; y: number; dy: number;
  IconComponent: React.ElementType; sizeClass: string; colorClass: string; opacity: number;
  rotation: number; rotationSpeed: number;
}

const createFallingIcon = (): FallingIconState => ({
  id: `fall-icon-${Date.now()}-${Math.random()}`,
  x: Math.random() * window.innerWidth,
  y: -Math.random() * window.innerHeight * 0.2 - 30,
  dy: Math.random() * 0.7 + 0.3, // Slower musical icons
  IconComponent: baseIconComponents[Math.floor(Math.random() * baseIconComponents.length)],
  sizeClass: baseIconSizes[Math.floor(Math.random() * baseIconSizes.length)],
  colorClass: baseIconColors[Math.floor(Math.random() * baseIconColors.length)],
  opacity: Math.random() * 0.5 + 0.3,
  rotation: Math.random() * 360,
  rotationSpeed: (Math.random() - 0.5) * 1.2,
});

// --- Main Component ---
const GlobalBackgroundEffects: React.FC<GlobalBackgroundEffectsProps> = ({ children }) => {
  const [cssElementsData, setCssElementsData] = useState<CSSElementData[]>([]);
  const [ufos, setUfos] = useState<UfoState[]>([]);
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [fallingStars, setFallingStars] = useState<FallingStarState[]>([]);
  const [fallingIcons, setFallingIcons] = useState<FallingIconState[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const animationFrameId = useRef<number | null>(null);
  const ufoRespawnScheduler = useRef<NodeJS.Timeout | null>(null);
  const starRespawnTimerId = useRef<NodeJS.Timeout | null>(null);
  const iconRespawnTimerId = useRef<NodeJS.Timeout | null>(null);
  const lastTimestamp = useRef<number>(0);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDarkMode(root.classList.contains('dark')));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    
    const currentIsDarkMode = root.classList.contains('dark');
    setIsDarkMode(currentIsDarkMode);

    // Initialize UFOs
    setUfos([createUfo(currentIsDarkMode)]);
    
    // Initialize CSS background elements
    setCssElementsData(generateCSSElements(8));

    // Initialize falling stars
    const initialStars = Array.from({ length: MAX_FALLING_STARS }, createFallingStar);
    setFallingStars(initialStars);

    // Initialize falling icons
    const initialIcons = Array.from({ length: MAX_FALLING_ICONS }, createFallingIcon);
    setFallingIcons(initialIcons);

    return () => {
      observer.disconnect();
      if (ufoRespawnScheduler.current) clearTimeout(ufoRespawnScheduler.current);
      // Clear other timers if they were added here
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const scheduleUfoRespawn = useCallback((count: number) => {
    console.log(`Scheduling respawn of ${count} UFOs`);
    if (ufoRespawnScheduler.current) clearTimeout(ufoRespawnScheduler.current);
    ufoRespawnScheduler.current = setTimeout(() => {
      setUfos(prevUfos => {
        const activeUfos = prevUfos.filter(u => !u.isExploding);
        console.log(`Current active UFOs: ${activeUfos.length}`);
        const canSpawnCount = Math.min(count, MAX_UFOS - activeUfos.length);
        console.log(`Will spawn ${canSpawnCount} new UFOs`);
        if (canSpawnCount > 0) {
          const newUfos = Array.from({ length: canSpawnCount }, () => createUfo(isDarkMode));
          return [...activeUfos, ...newUfos];
        }
        return activeUfos;
      });
    }, UFO_RESPAWN_DELAY_AFTER_EXPLOSION);
  }, [isDarkMode]);

  const explodeUfo = useCallback((ufoId: string) => {
    let ufoExploded = false;
    setUfos(prevUfos =>
      prevUfos.map(u => {
        if (u.id === ufoId && !u.isExploding) {
          ufoExploded = true;
          return { ...u, isExploding: true, explosionTimer: UFO_EXPLOSION_DURATION };
        }
        return u;
      })
    );

    if (ufoExploded) {
      const ufo = ufos.find(u => u.id === ufoId); // ufo state here might be one frame behind for coords
      if (ufo) { // Use found ufo's current coords for explosion center
        const newDebris: ParticleState[] = Array.from({ length: DEBRIS_COUNT }, (_, i) => {
          const angle = Math.random() * 2 * Math.PI;
          const speed = Math.random() * 3.5 + 2.0; // Faster debris
          return {
            id: `debris-${Date.now()}-${i}`, x: ufo.x, y: ufo.y,
            dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
            initialSize: Math.random() * 3.5 + 2, size:0,
            color: `rgba(${Math.random()*100 + 155}, ${Math.random()*80+20}, ${Math.random()*30}, ${Math.random() * 0.7 + 0.3})`,
            opacity: 1, createdAt: Date.now(),
          };
        });
        setParticles(prev => [...prev, ...newDebris]);
      }
      scheduleUfoRespawn(UFO_RESPAWN_BATCH_SIZE);
    }
  }, [ufos, scheduleUfoRespawn]);

  const animationLoop = useCallback((timestamp: number) => {
    if (typeof window === 'undefined') return;
    if (!lastTimestamp.current) lastTimestamp.current = timestamp;
    const deltaTime = timestamp - lastTimestamp.current;
    lastTimestamp.current = timestamp;

    setUfos(prevUfos => prevUfos.map(ufo => {
      if (ufo.isExploding) {
        const newExplosionTimer = ufo.explosionTimer - deltaTime;
        if (newExplosionTimer <= 0) return null; // Mark for removal
        return { ...ufo, explosionTimer: newExplosionTimer };
      }
      let { x, y, dx, dy, size, trailEmitCounter, wanderAngle, wanderTimer, initialSpeed, rotation } = ufo;
      
      wanderTimer--;
      if (wanderTimer <= 0) {
        wanderAngle = Math.random() * 2 * Math.PI;
        const speedVariation = initialSpeed * (Math.random() * 0.6 + 0.7); // 70%-130% of initial
        dx = Math.cos(wanderAngle) * speedVariation;
        dy = Math.sin(wanderAngle) * speedVariation;
        wanderTimer = Math.random() * 200 + 150;
        rotation = Math.atan2(dy, dx) + Math.PI / 2;
      }
      
      x += dx; y += dy;

      const screenWidth = window.innerWidth; const screenHeight = window.innerHeight;
      if (x < -size) x = screenWidth + size; if (x > screenWidth + size) x = -size;
      if (y < -size) y = screenHeight + size; if (y > screenHeight + size) y = -size;

      trailEmitCounter++;
      if (trailEmitCounter >= UFO_TRAIL_EMIT_INTERVAL) {
        trailEmitCounter = 0;
        const trailColor = isDarkMode ? `rgba(173, 216, 230, ${Math.random()*0.2 + 0.15})` : `rgba(120, 120, 150, ${Math.random()*0.2 + 0.15})`;
        setParticles(prevPart => [...prevPart, {
          id: `trail-${Date.now()}-${Math.random()}`, isTrailIcon: true,
          x: ufo.x, y: ufo.y,
          dx: -ufo.dx * 0.05 + (Math.random() - 0.5) * 0.2, dy: -ufo.dy * 0.05 + (Math.random() - 0.5) * 0.2,
          initialSize: Math.random() * 2.0 + 0.8, size:0, // Trail particles are small dots
          color: trailColor, opacity: 1, createdAt: Date.now(),
        }]);
      }
      return { ...ufo, x, y, dx, dy, rotation, wanderAngle, wanderTimer, trailEmitCounter };
    }).filter(ufo => ufo !== null) as UfoState[]);

    setParticles(prevPart =>
      prevPart.map(p => {
        const age = Date.now() - p.createdAt;
        const lifetime = p.isTrailIcon ? UFO_TRAIL_LIFETIME : DEBRIS_LIFETIME;
        const lifeRatio = Math.max(0, 1 - age / lifetime);
        return { ...p, x: p.x + p.dx, y: p.y + p.dy, opacity: lifeRatio, size: p.initialSize * lifeRatio };
      }).filter(p => p.opacity > 0)
    );

    setFallingStars(prevStars => prevStars.map(star => {
        let newY = star.y + star.dy;
        if (newY > window.innerHeight + star.size) return createFallingStar(); // Respawn
        return { ...star, y: newY };
    }));
    
    setFallingIcons(prevIcons => prevIcons.map(icon => {
      let newY = icon.y + icon.dy;
      let newRotation = icon.rotation + icon.rotationSpeed;
      if (newY > window.innerHeight + 40) return createFallingIcon(); // Respawn
      return { ...icon, y: newY, rotation: newRotation };
    }));

    animationFrameId.current = requestAnimationFrame(animationLoop);
  }, [isDarkMode, explodeUfo, scheduleUfoRespawn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      animationFrameId.current = requestAnimationFrame(animationLoop);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animationLoop]);

  return (
    <div className="relative isolate overflow-hidden h-full">
      <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none -z-1">
        {cssElementsData.map(el => <CSSElement children key={el.id} {...el} />)}
      </div>
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 animate-twinkle opacity-30 dark:opacity-70"
          style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 15% 25%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 35% 45%, rgba(255,255,255,0.5), transparent), radial-gradient(2px 2px at 55% 75%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 5% 85%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 65% 15%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 85% 35%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.6), transparent), radial-gradient(1.5px 1.5px at 90% 80%, rgba(255,255,255,0.7), transparent)'}}
        />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse-slow opacity-20 dark:opacity-70" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-radial from-pink-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl animate-pulse-slower opacity-15 dark:opacity-60" />
      </div>

      {fallingStars.map(star => (
        <div key={star.id} className="absolute rounded-full" style={{
            left: star.x, top: star.y, width: star.size, height: star.size,
            backgroundColor: isDarkMode ? `rgba(220, 220, 255, ${star.opacity})` : `rgba(100, 100, 120, ${star.opacity})`,
            transform: 'translate(-50%, -50%)', zIndex: 1,
        }}/>
      ))}

      {fallingIcons.map(icon => {
        const Icon = icon.IconComponent;
        return (
          <div key={icon.id} className="absolute" style={{
            left: icon.x, top: icon.y, opacity: icon.opacity,
            transform: `translate(-50%, -50%) rotate(${icon.rotation}deg)`, zIndex: 2,
          }}>
            <Icon className={`${icon.sizeClass} ${icon.colorClass}`} />
          </div>
        );
      })}

      {particles.map(p => {
        if (p.isTrailIcon && p.IconComponent) {
          const TrailIcon = p.IconComponent;
          return ( <div key={p.id} className="absolute" style={{
              left: p.x, top: p.y, opacity: p.opacity, transform: 'translate(-50%, -50%)', zIndex: 8,
            }}> <TrailIcon className={`${p.iconSizeClass} ${p.iconColorClass}`} /> </div> );
        }
        return ( <div key={p.id} className="absolute rounded-full" style={{
            left: p.x, top: p.y, width: p.size, height: p.size,
            backgroundColor: p.color, opacity: p.opacity, transform: 'translate(-50%, -50%)', zIndex: 9,
          }} /> );
      })}
      
      {ufos.map(ufo => {
        if (ufo.isExploding) {
          // Enhanced Explosion Effect
          const progress = 1 - (ufo.explosionTimer / UFO_EXPLOSION_DURATION); // 0 to 1
          const explosionSize = ufo.size * (1 + progress * 2.5); // Max 3.5x size
          const opacity = 1 - progress * progress; // Fade out quadratically
          return (
            <div key={ufo.id + '-exploding'} className="absolute rounded-full" style={{
                left: ufo.x, top: ufo.y,
                width: explosionSize, height: explosionSize,
                transform: 'translate(-50%, -50%)',
                backgroundColor: `rgba(255, ${165 - progress * 100}, ${0 + progress * 50}, ${opacity * 0.8})`,
                // Multiple box-shadows for a more "burst" like effect
                boxShadow: `
                  0 0 ${10 + progress * 30}px ${5 + progress * 15}px rgba(255,200,0,${opacity * 0.5}),
                  0 0 ${5 + progress * 15}px ${2 + progress * 8}px rgba(255,100,0,${opacity * 0.7})
                `,
                zIndex: 11, // Highest zIndex for explosion
                transition: 'opacity 50ms ease-out, width 50ms ease-out, height 50ms ease-out', // Match CSS for consistency
            }} />
          );
        }
        // Normal UFO rendering
        return (
          <div key={ufo.id} onClick={() => explodeUfo(ufo.id)}
            className="absolute cursor-pointer group" // Added group for potential hover effects later
            style={{
              left: ufo.x, top: ufo.y, width: ufo.size, height: ufo.size * 0.5,
              transform: `translate(-50%, -50%) rotate(${ufo.rotation}rad)`,
              willChange: 'transform, left, top', zIndex: 10,
            }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: ufo.bodyColor, borderRadius: '50%', boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.2)' }} /> {/* Subtle inset shadows */}
            <div style={{ position: 'absolute', width: ufo.size * 0.6, height: ufo.size * 0.6, backgroundColor: ufo.domeColor, borderRadius: '50%', top: '-25%', left: '20%', border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: 'inset 0 0 5px rgba(255,255,255,0.5)' }} />
          </div>
        );
      })}
      {children}
    </div>
  );
};

export default GlobalBackgroundEffects; 