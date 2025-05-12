import React, { useState, useEffect, useRef, useCallback } from 'react';
import blackNotePath from '../assets/music-note-cursor-black.svg';
import whiteNotePath from '../assets/music-note-cursor-white.svg';

// Remove Trail Particle Constants
// const TRAIL_NOTE_LENGTH = 6;
// const TRAIL_SPARKLE_COUNT_PER_NOTE_EVENT = 3;
// const TRAIL_CREATION_INTERVAL = 40; // Keep if used for other timed mouse move effects, otherwise remove. Assuming removal.
// const TRAIL_PARTICLE_LIFESPAN_MIN = 300; 
// const TRAIL_PARTICLE_LIFESPAN_MAX = 600; 
// const TRAIL_INITIAL_SPEED_FACTOR = 0.8; 
// const TRAIL_RANDOM_ANGLE_SPREAD = Math.PI / 6; 
// const TRAIL_RANDOM_SPEED_FACTOR = 0.5;
// const TRAIL_DRAG_FACTOR = 0.94;

const IDLE_TIMEOUT_DURATION = 200; // Mouse stop detection
const IDLE_EXPLOSION_COOLDOWN = 2000; // 2 seconds cooldown for idle explosions

// Explosion Particle Constants (keep as is)
const EXPLOSION_PARTICLE_COUNT = 25;
const EXPLOSION_NOTE_PROBABILITY = 0.1;
const EXPLOSION_LIFESPAN_MIN = 600;
const EXPLOSION_LIFESPAN_MAX = 1200;
const EXPLOSION_INITIAL_SPEED_MIN = 1.5;
const EXPLOSION_INITIAL_SPEED_MAX = 4;
const EXPLOSION_DRAG_FACTOR = 0.96;

// Theme colors, sizes, ParticleBase interface remain the same
const LIGHT_THEME_SPARKLE_COLORS = ['#9BCA3D', '#62AEAC', '#A8D76F', '#7CC4C2', '#88C057'];
const DARK_THEME_SPARKLE_COLORS = ['#3F7424', '#326B69', '#5A8D40', '#4E8482', '#6FAA2E'];
const MAIN_CURSOR_SIZE = 24; // px
const NOTE_PARTICLE_SIZE = 24; // px
const SPARKLE_BASE_SIZE = 6; // px

interface ParticleBase {
  id: number;
  type: 'note' | 'sparkle';
  originX: number; 
  originY: number;
  currentX: number; 
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
  maxLifespan?: number; 
}


const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // Remove regularTrail state
  // const [regularTrail, setRegularTrail] = useState<ParticleBase[]>([]); 
  const [explosionParticles, setExplosionParticles] = useState<ParticleBase[]>([]);
  
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseIdle, setIsMouseIdle] = useState(false); // Keep for potential idle explosion logic if desired later
  const [canTriggerIdleExplosion, setCanTriggerIdleExplosion] = useState(true); // Keep for potential idle explosion logic

  // Remove refs related to trail velocity and timing
  // const lastPositionRef = useRef({ x: -100, y: -100 });
  // const lastMoveTimeRef = useRef<number>(0);
  // const currentVelocityRef = useRef({ vx: 0, vy: 0 });
  // const lastTrailTimeRef = useRef<number>(0);

  const mouseStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleExplosionCooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isTouchOnly, setIsTouchOnly] = useState(false);

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

  const createExplosionBurst = useCallback((burstX: number, burstY: number, theme: 'light' | 'dark') => {
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
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      // const now = performance.now(); // Not needed if not creating trail

      setPosition({ x: newX, y: newY });

      // Remove Velocity Calculation
      // ...

      if (!isVisible && (newX > 0 || newY > 0)) setIsVisible(true);

      const target = e.target as HTMLElement;
      setIsHoveringInteractive(!!(target && target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]')));

      if (isMouseIdle) setIsMouseIdle(false); 

      if (mouseStopTimeoutRef.current) clearTimeout(mouseStopTimeoutRef.current);
      mouseStopTimeoutRef.current = setTimeout(() => {
        if (!isMouseIdle) setIsMouseIdle(true);
        // currentVelocityRef.current = { vx: 0, vy: 0 }; // Not needed
      }, IDLE_TIMEOUT_DURATION);

      // Remove Trail Particle Creation Logic
      // ...
    };

    const handleClick = (e: MouseEvent) => {
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
  }, [isVisible, isMouseIdle, currentTheme, canTriggerIdleExplosion, createExplosionBurst]);

  // Animation Loop for Explosion Particles
  useEffect(() => {
    let isActive = true; 
    const animateParticles = () => {
      if (!isActive) return;

      const now = performance.now();
      
      // Remove Regular Trail Particle Animation
      // ...

      // Animate Explosion Particles (same logic as before)
      setExplosionParticles(prevExplosion =>
        prevExplosion.map(p => {
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

    // Adjust condition to only check explosionParticles
    if (explosionParticles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animateParticles);
    } else {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
        isActive = false; 
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  // Animation loop now only depends on explosionParticles
  }, [explosionParticles]); 

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouchOnly(isTouch);
    const handler = () => {
      setIsTouchOnly(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (!isTouchOnly) return;

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0] || e.changedTouches[0];
      if (touch) {
        createExplosionBurst(touch.clientX, touch.clientY, currentTheme);
      }
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, [isTouchOnly, currentTheme, createExplosionBurst]); // Added createExplosionBurst dependency

  const mainCursorImageSrc = currentTheme === 'dark' ? whiteNotePath.src : blackNotePath.src;
  const glowColor = currentTheme === 'dark' ? 'rgba(230, 230, 255, 0.8)' : 'rgba(0,0,0, 0.6)';


  if (isTouchOnly) {
    return (
      <>
        {/* Only render explosionParticles */}
        {explosionParticles.map(p => {
          const commonStyle: React.CSSProperties = {
              position: 'fixed', top: `${p.currentY}px`, left: `${p.currentX}px`,
              pointerEvents: 'none', zIndex: 9990, 
              opacity: p.currentOpacity,
          };
          if (p.type === 'note') {
              const imgPath = p.themeAtCreation === 'dark' ? whiteNotePath.src : blackNotePath.src;
              return <img key={p.id} src={imgPath} alt="" data-no-click-explosion="true" style={{
                  ...commonStyle, width: `${NOTE_PARTICLE_SIZE}px`, height: `${NOTE_PARTICLE_SIZE}px`,
                  transform: `translate(-${NOTE_PARTICLE_SIZE / 2}px, -${NOTE_PARTICLE_SIZE / 2}px) scale(${Math.max(p.currentScale, 0.01)}) rotate(${p.rotation}deg)`,
              }}/>;
          } else { 
              return <div key={p.id} data-no-click-explosion="true" style={{
                  ...commonStyle,
                  width: `${Math.max(SPARKLE_BASE_SIZE * p.currentScale, 1)}px`, height: `${Math.max(SPARKLE_BASE_SIZE * p.currentScale, 1)}px`,
                  backgroundColor: p.color, borderRadius: '50%',
                  transform: `translate(-50%, -50%) scale(${Math.max(p.currentScale, 0.1)})`,
              }}/>;
          }
        })}
      </>
    );
  }

  return (
    <>
      {/* Main Cursor Image */}
      <img
        src={mainCursorImageSrc}
        alt="custom cursor"
        data-no-click-explosion="true" 
        style={{
          position: 'fixed', top: `${position.y}px`, left: `${position.x}px`,
          width: `${MAIN_CURSOR_SIZE}px`, height: `${MAIN_CURSOR_SIZE}px`, pointerEvents: 'none',
          transform: `translate(-${MAIN_CURSOR_SIZE / 2}px, -${MAIN_CURSOR_SIZE / 2}px)`, zIndex: 10001, 
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.1s ease-out, filter 0.2s ease-out',
          filter: isHoveringInteractive ? `drop-shadow(0 0 7px ${glowColor}) drop-shadow(0 0 15px ${glowColor})` : 'none',
        }}
      />

      {/* Render ONLY Explosion Particles */}
      {explosionParticles.map(p => {
         const commonStyle: React.CSSProperties = {
              position: 'fixed', 
              top: `${p.currentY}px`, 
              left: `${p.currentX}px`, 
              pointerEvents: 'none', 
              zIndex: 9990, 
              opacity: Math.max(0, p.currentOpacity), 
              transformOrigin: 'center center', 
          };

          if (p.type === 'note') {
              const imgPath = p.themeAtCreation === 'dark' ? whiteNotePath.src : blackNotePath.src;
              return <img key={p.id} src={imgPath} alt="" data-no-click-explosion="true" style={{
                  ...commonStyle, width: `${NOTE_PARTICLE_SIZE}px`, height: `${NOTE_PARTICLE_SIZE}px`,
                  transform: `translate(-${NOTE_PARTICLE_SIZE / 2}px, -${NOTE_PARTICLE_SIZE / 2}px) scale(${Math.max(p.currentScale, 0.01)}) rotate(${p.rotation}deg)`, 
              }}/>;
          } else { 
              return <div key={p.id} data-no-click-explosion="true" style={{
                  ...commonStyle,
                  width: `${Math.max(SPARKLE_BASE_SIZE * p.currentScale, 1)}px`, 
                  height: `${Math.max(SPARKLE_BASE_SIZE * p.currentScale, 1)}px`,
                  backgroundColor: p.color, borderRadius: '50%',
                  transform: `translate(-50%, -50%) scale(${Math.max(p.currentScale, 0.1)})`,
              }}/>;
          }
      })}
    </>
  );
};

export default CustomCursor;