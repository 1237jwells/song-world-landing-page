import React, { useState, useEffect, useRef } from 'react';
// Ensure these paths are correct relative to CustomCursor.tsx
// For Astro, if these are in /public, the path would be different.
// Assuming they are in src/assets and CustomCursor.tsx is in src/components:
import blackNotePath from '../assets/music-note-cursor-black.svg';
import whiteNotePath from '../assets/music-note-cursor-white.svg';

// Trail Particle Constants
const TRAIL_NOTE_LENGTH = 7;
const TRAIL_SPARKLE_COUNT_PER_NOTE_EVENT = 3;
const MAX_REGULAR_TRAIL_PARTICLES = TRAIL_NOTE_LENGTH + (TRAIL_NOTE_LENGTH * TRAIL_SPARKLE_COUNT_PER_NOTE_EVENT);
const TRAIL_CREATION_INTERVAL = 40;
const IDLE_TIMEOUT_DURATION = 200; // Mouse stop detection
const IDLE_EXPLOSION_COOLDOWN = 4000; // 4 seconds cooldown for idle explosions

// Explosion Particle Constants
const EXPLOSION_PARTICLE_COUNT = 25; // Total particles in one explosion
const EXPLOSION_NOTE_PROBABILITY = 0.3; // 30% chance a particle is a note
const EXPLOSION_LIFESPAN_MIN = 600;  // ms
const EXPLOSION_LIFESPAN_MAX = 1200; // ms
const EXPLOSION_INITIAL_SPEED_MIN = 1.5;
const EXPLOSION_INITIAL_SPEED_MAX = 4;
const EXPLOSION_DRAG_FACTOR = 0.96; // Slows particles down over time

// Theme colors (ensure these match your tailwind config if needed)
const LIGHT_THEME_SPARKLE_COLORS = ['#9BCA3D', '#62AEAC', '#A8D76F', '#7CC4C2', '#88C057'];
const DARK_THEME_SPARKLE_COLORS = ['#3F7424', '#326B69', '#5A8D40', '#4E8482', '#6FAA2E'];

interface ParticleBase {
  id: number;
  type: 'note' | 'sparkle';
  originX: number; // Initial X (for explosion) or creation X (for trail)
  originY: number;
  currentX: number; // Current X for rendering
  currentY: number;
  themeAtCreation: 'light' | 'dark';
  initialOpacity: number;
  currentOpacity: number;
  initialScale: number;
  currentScale: number;
  velocityX: number;
  velocityY: number;
  color?: string;
  rotation: number;
  createdAt: number;
  maxLifespan?: number; // Only for explosion particles
}

type TrailParticle = Omit<ParticleBase, 'maxLifespan' | 'originX' | 'originY' | 'currentX' | 'currentY'> & {
  // Trail specific if any, for now common fields are in ParticleBase
  // Trail particles use their creation x,y for rendering directly
  x: number; y: number; 
};

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  const [regularTrail, setRegularTrail] = useState<TrailParticle[]>([]);
  const [explosionParticles, setExplosionParticles] = useState<ParticleBase[]>([]);
  
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const [canTriggerIdleExplosion, setCanTriggerIdleExplosion] = useState(true);

  const prevIsMouseIdleRef = useRef(false);
  const lastTrailTimeRef = useRef<number>(0);
  const mouseStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleExplosionCooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Theme Detection
  useEffect(() => {
    const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setCurrentTheme(getTheme());
    const observer = new MutationObserver(() => setCurrentTheme(getTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
        observer.disconnect();
        if (idleExplosionCooldownTimerRef.current) clearTimeout(idleExplosionCooldownTimerRef.current);
    };
  }, []);

  // Function to create an explosion burst
  const createExplosionBurst = (burstX: number, burstY: number, theme: 'light' | 'dark') => {
    // console.log(`Creating explosion at ${burstX},${burstY} with theme ${theme}`);
    const newExplosion: ParticleBase[] = [];
    const sparkleColors = theme === 'dark' ? DARK_THEME_SPARKLE_COLORS : LIGHT_THEME_SPARKLE_COLORS;
    const now = performance.now();

    for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = EXPLOSION_INITIAL_SPEED_MIN + Math.random() * (EXPLOSION_INITIAL_SPEED_MAX - EXPLOSION_INITIAL_SPEED_MIN);
      const type = Math.random() < EXPLOSION_NOTE_PROBABILITY ? 'note' : 'sparkle';
      
      const initialOpacityVal = type === 'note' ? (0.7 + Math.random() * 0.3) : (0.9 + Math.random() * 0.1);
      const initialScaleVal = type === 'note' ? (0.7 + Math.random() * 0.4) : (0.4 + Math.random() * 0.5);

      newExplosion.push({
        id: now + Math.random() * (i + 100), type: type,
        originX: burstX, originY: burstY,
        currentX: burstX, currentY: burstY,
        themeAtCreation: theme,
        initialOpacity: initialOpacityVal, currentOpacity: initialOpacityVal,
        initialScale: initialScaleVal, currentScale: initialScaleVal,
        velocityX: Math.cos(angle) * speed, velocityY: Math.sin(angle) * speed,
        color: type === 'sparkle' ? sparkleColors[Math.floor(Math.random() * sparkleColors.length)] : undefined,
        rotation: type === 'note' ? (Math.random() - 0.5) * 45 : 0,
        createdAt: now,
        maxLifespan: EXPLOSION_LIFESPAN_MIN + Math.random() * (EXPLOSION_LIFESPAN_MAX - EXPLOSION_LIFESPAN_MIN),
      });
    }
    setExplosionParticles(prev => [...prev, ...newExplosion]);
  };

  // Mouse Movement, Trail Creation, Idle Detection, Click Explosion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      setPosition({ x: newX, y: newY });

      if (!isVisible && (newX > 0 || newY > 0)) setIsVisible(true);

      const target = e.target as HTMLElement;
      setIsHoveringInteractive(!!(target && target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]')));

      if (isMouseIdle) setIsMouseIdle(false); 

      if (mouseStopTimeoutRef.current) clearTimeout(mouseStopTimeoutRef.current);
      mouseStopTimeoutRef.current = setTimeout(() => {
        if (!isMouseIdle) setIsMouseIdle(true);
      }, IDLE_TIMEOUT_DURATION);

      const now = performance.now();
      if (now - lastTrailTimeRef.current > TRAIL_CREATION_INTERVAL) {
        lastTrailTimeRef.current = now;
        const themeNow = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTrailParticles: TrailParticle[] = [];
        
        const noteInitialOpacity = 0.7 + Math.random() * 0.3;
        const noteInitialScale = 0.8 + Math.random() * 0.3;

        newTrailParticles.push({
          id: now + Math.random(), type: 'note', x: newX, y: newY, themeAtCreation: themeNow,
          initialOpacity: noteInitialOpacity, currentOpacity: noteInitialOpacity,
          initialScale: noteInitialScale, currentScale: noteInitialScale,    
          velocityX: 0, velocityY: 0, 
          rotation: (Math.random() - 0.5) * 20, createdAt: now,
        });

        const sparkleColors = themeNow === 'dark' ? DARK_THEME_SPARKLE_COLORS : LIGHT_THEME_SPARKLE_COLORS;
        for (let i = 0; i < TRAIL_SPARKLE_COUNT_PER_NOTE_EVENT; i++) {
          const sparkleInitialOpacity = 0.8 + Math.random() * 0.2;
          const sparkleInitialScale = 0.3 + Math.random() * 0.4;
          newTrailParticles.push({
            id: now + Math.random() * (i + 2), type: 'sparkle', x: newX, y: newY, themeAtCreation: themeNow,
            initialOpacity: sparkleInitialOpacity, currentOpacity: sparkleInitialOpacity,
            initialScale: sparkleInitialScale, currentScale: sparkleInitialScale,      
            velocityX: 0, velocityY: 0,
            color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
            rotation: 0, createdAt: now,
          });
        }
        setRegularTrail(prev => [...newTrailParticles, ...prev].slice(0, MAX_REGULAR_TRAIL_PARTICLES));
      }
    };

    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // console.log("Click detected. Target:", target);
        if (target.closest('a, button, input, textarea, select, label, [data-no-click-explosion="true"]')) {
            // console.log("Click explosion prevented on interactive element.");
            return;
        }
        createExplosionBurst(e.clientX, e.clientY, currentTheme);
    };

    const handleMouseLeaveScreen = (e: MouseEvent) => {
      if (!e.relatedTarget && !document.elementFromPoint(e.clientX, e.clientY)) setIsVisible(false);
    };
    const handleMouseEnterScreen = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick); 
    document.body.addEventListener('mouseleave', handleMouseLeaveScreen);
    document.body.addEventListener('mouseenter', handleMouseEnterScreen);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick); 
      document.body.removeEventListener('mouseleave', handleMouseLeaveScreen);
      document.body.removeEventListener('mouseenter', handleMouseEnterScreen);
      if (mouseStopTimeoutRef.current) clearTimeout(mouseStopTimeoutRef.current);
    };
  }, [isVisible, isMouseIdle, currentTheme, canTriggerIdleExplosion]); // Added canTriggerIdleExplosion to dependencies

  // Effect to Trigger Explosion when mouse becomes idle (with cooldown)
  useEffect(() => {
    if (isMouseIdle && !prevIsMouseIdleRef.current && canTriggerIdleExplosion) {
      createExplosionBurst(position.x, position.y, currentTheme);
      setCanTriggerIdleExplosion(false); // Disable further idle explosions
      
      // Clear any existing cooldown timer before setting a new one
      if (idleExplosionCooldownTimerRef.current) clearTimeout(idleExplosionCooldownTimerRef.current);
      
      idleExplosionCooldownTimerRef.current = setTimeout(() => {
        setCanTriggerIdleExplosion(true); // Re-enable after cooldown
      }, IDLE_EXPLOSION_COOLDOWN);
    }
    prevIsMouseIdleRef.current = isMouseIdle;
  }, [isMouseIdle, position.x, position.y, currentTheme, canTriggerIdleExplosion]);


  // Animation Loop for Explosion Particles
  useEffect(() => {
    const animateParticles = () => {
      const now = performance.now();
      setExplosionParticles(prevParticles =>
        prevParticles.map(p => {
          const age = now - p.createdAt;
          if (age >= (p.maxLifespan ?? Infinity)) return null;

          const progress = age / (p.maxLifespan ?? Infinity);

          return {
            ...p,
            currentX: p.currentX + p.velocityX,
            currentY: p.currentY + p.velocityY,
            velocityX: p.velocityX * EXPLOSION_DRAG_FACTOR,
            velocityY: p.velocityY * EXPLOSION_DRAG_FACTOR,
            currentOpacity: p.initialOpacity * (1 - Math.pow(progress, 2)),
            currentScale: p.initialScale * (1 - Math.pow(progress, 1.5)),
          };
        }).filter(p => p !== null) as ParticleBase[]
      );
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };

    if (explosionParticles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animateParticles);
    } else {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [explosionParticles]);


  const mainCursorImageSrc = currentTheme === 'dark' ? whiteNotePath.src : blackNotePath.src;
  const glowColor = currentTheme === 'dark' ? 'rgba(230, 230, 255, 0.8)' : 'rgba(0,0,0, 0.6)';

  return (
    <>
      {/* Main Cursor Image */}
      <img
        src={mainCursorImageSrc}
        alt="custom cursor"
        data-no-click-explosion="true" // Prevent main cursor from triggering click explosion on itself
        style={{
          position: 'fixed', top: `${position.y}px`, left: `${position.x}px`,
          width: '24px', height: '24px', pointerEvents: 'none',
          transform: 'translate(-4px, -4px)', zIndex: 10001, // Ensure main cursor is on top of its own trail/explosion
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.1s ease-out, filter 0.2s ease-out',
          filter: isHoveringInteractive ? `drop-shadow(0 0 7px ${glowColor}) drop-shadow(0 0 15px ${glowColor})` : 'none',
        }}
      />

      {/* Regular Trail Particles */}
      {regularTrail.map((particle, index) => {
        const progress = index / (MAX_REGULAR_TRAIL_PARTICLES -1);
        const targetOpacity = isMouseIdle ? 0 : (1 - Math.pow(progress, 1.5)) * particle.initialOpacity;
        const opacityTransition = isMouseIdle ? '0.15s' : (particle.type === 'sparkle' ? '0.5s' : '0.4s'); // Sparkle colors last longer
        const dynamicOpacity = isVisible ? Math.max(0, targetOpacity) : 0;
        
        const MIN_SCALE_PROPORTION = particle.type === 'sparkle' ? 0.15 : 0.1;
        const scaleFactor = 1 - Math.pow(progress, 2) * (1 - MIN_SCALE_PROPORTION);
        const dynamicScale = particle.initialScale * scaleFactor;

        const particleSpecificStyle: React.CSSProperties = {
            position: 'fixed', top: `${particle.y}px`, left: `${particle.x}px`,
            pointerEvents: 'none', zIndex: 10000 - index, opacity: dynamicOpacity,
            transition: `opacity ${opacityTransition} linear, transform ${opacityTransition} linear`,
        };
        
        if (particle.type === 'note') {
          const imgPath = particle.themeAtCreation === 'dark' ? whiteNotePath.src : blackNotePath.src;
          return (
            <img key={particle.id} src={imgPath} alt="" data-no-click-explosion="true" style={{
                ...particleSpecificStyle,
                width: '24px', height: '24px', 
                transform: `translate(-4px, -4px) scale(${Math.max(dynamicScale, 0.01)}) rotate(${particle.rotation}deg)`,
            }}/>
          );
        } else { // Sparkle for regular trail
          return (
            <div key={particle.id} data-no-click-explosion="true" style={{
                ...particleSpecificStyle,
                width: `${Math.max(6 * dynamicScale, 1)}px`, height: `${Math.max(6 * dynamicScale, 1)}px`,
                backgroundColor: particle.color, borderRadius: '50%', 
                transform: `translate(-50%, -50%) scale(${Math.max(dynamicScale, 0.1)})`,
                transition: `opacity ${opacityTransition} linear, transform ${opacityTransition} linear, width ${opacityTransition} linear, height ${opacityTransition} linear`,
            }}/>
          );
        }
      })}

      {/* Explosion Particles */}
      {explosionParticles.map(p => {
        const commonStyle: React.CSSProperties = {
            position: 'fixed', top: `${p.currentY}px`, left: `${p.currentX}px`,
            pointerEvents: 'none', zIndex: 9990, // Ensure they are generally behind trail but visible
            opacity: p.currentOpacity,
            // No CSS transitions here, JS animation loop handles it
        };
        if (p.type === 'note') {
            const imgPath = p.themeAtCreation === 'dark' ? whiteNotePath.src : blackNotePath.src;
            return <img key={p.id} src={imgPath} alt="" data-no-click-explosion="true" style={{
                ...commonStyle, width: '24px', height: '24px',
                transform: `translate(-4px, -4px) scale(${Math.max(p.currentScale, 0.01)}) rotate(${p.rotation}deg)`,
            }}/>;
        } else { // Sparkle
            return <div key={p.id} data-no-click-explosion="true" style={{
                ...commonStyle,
                width: `${Math.max(6 * p.currentScale, 1)}px`, height: `${Math.max(6 * p.currentScale, 1)}px`,
                backgroundColor: p.color, borderRadius: '50%',
                transform: `translate(-50%, -50%) scale(${Math.max(p.currentScale, 0.1)})`,
            }}/>;
        }
      })}
    </>
  );
};

export default CustomCursor;