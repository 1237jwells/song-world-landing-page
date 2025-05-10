/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        'songworld-light-primary': '#62AEAC',
        'songworld-light-accent': '#9BCA3D',
        'songworld-light-card': '#FEF7FF',
        'songworld-light-text': '#000000',

        'songworld-dark-primary': '#326B69',
        'songworld-dark-accent': '#3F7424',
        'songworld-dark-card': '#141218',
        'songworld-dark-text': '#FFFFFF',
      },
      keyframes: { // Add keyframes for animations
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        breathingBackground: {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'center center' },
          '50%': { backgroundSize: '250% 250%', backgroundPosition: 'center center' },
        },
        animatedGradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(100, 116, 139, 0.3)' },
        },
        floatFade: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.8)' },
          '15%': { opacity: '0.7', transform: 'translateY(-15px) scale(1)' },
          '70%': { opacity: '0.7', transform: 'translateY(var(--vertical-travel, 0px)) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(calc(var(--vertical-travel, 0px) + 25px)) scale(0.7)' },
        },
        blinkCaret: { // For typewriter cursor blink - uses opacity for an inline element
          'from, to': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        scaleInFromBig: { // For logo: starts big and slightly transparent, scales down and fades in
          '0%': { opacity: '0', transform: 'scale(1.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: { // Link keyframes to animation utilities
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        fadeInLeft: 'fadeInLeft 0.8s ease-out forwards',
        fadeInRight: 'fadeInRight 0.8s ease-out forwards',
        zoomIn: 'zoomIn 0.7s ease-out forwards',
        breathingBackground: 'breathingBackground 12s ease-in-out infinite',
        animatedGradientShift: 'animatedGradientShift 15s ease-in-out infinite',
        pulseGlow: 'pulseGlow 1.5s ease-in-out infinite',
        floatFade: 'floatFade var(--duration, 15s) var(--delay, 0s) ease-in-out infinite',
        'caret-blink': 'blinkCaret 0.75s step-end infinite',
        'scale-in-from-big': 'scaleInFromBig 0.7s ease-out forwards' // Utility for the logo
      },
    },
  },
  plugins: [],
} 