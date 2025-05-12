import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaRocket, FaMusic, FaSignInAlt } from 'react-icons/fa';
import headLight from '../assets/song-world/phone_light_2mdpi.png';
import headDark from '../assets/song-world/phone_dark_2mdpi.png';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [currentLogo, setCurrentLogo] = useState(headLight.src);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Theme management
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setCurrentLogo(headDark.src);
    } else {
      document.documentElement.classList.remove('dark');
      setCurrentLogo(headLight.src);
    }

    // Scroll effect
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scrollspy functionality
      const sections = navLinks
        .map(link => link.sectionId ? document.getElementById(link.sectionId) : null)
        .filter(section => section !== null) as HTMLElement[];
      
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let currentSectionId = 'hero'; // Default to hero if no other section is active
      if (sections.length > 0 && window.scrollY > sections[0].offsetTop - window.innerHeight / 3) { // Check if scrolled past the very top
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.offsetTop <= scrollPosition) {
            currentSectionId = section.id;
            break;
          }
        }
      }
      setActiveSection(currentSectionId);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setCurrentLogo(headDark.src);
    } else {
      document.documentElement.classList.remove('dark');
      setCurrentLogo(headLight.src);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: FaMusic, sectionId: 'hero' },
    { href: '#features', label: 'Features', sectionId: 'features' },
    { href: '#about', label: 'About Us', sectionId: 'about' },
    { href: '#blog', label: 'Blog', sectionId: 'blog' },
    { href: '#store', label: 'Store', sectionId: 'store' },
    { href: '#contact', label: 'Contact', sectionId: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      scrolled 
        ? 'bg-songworld-light-card/95 dark:bg-songworld-dark-card/95 shadow-lg' 
        : 'bg-songworld-light-card/80 dark:bg-songworld-dark-card/80'
      } backdrop-blur-md transition-all duration-300 ease-in-out`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img 
                className="h-10 w-auto transition-transform duration-300 ease-in-out group-hover:scale-110"
                src={currentLogo} 
                alt="Song World Logo"
              />
              <div className="pl-2">
                <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-songworld-light-primary to-songworld-light-accent dark:from-songworld-dark-primary dark:to-songworld-dark-accent">
                  Song World
                </p>
              </div>
            </a>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                  ${activeSection === link.sectionId 
                    ? 'text-songworld-light-primary dark:text-songworld-dark-primary font-bold scale-105' 
                    : 'text-songworld-light-text hover:text-songworld-light-primary dark:text-songworld-dark-text dark:hover:text-songworld-dark-primary'
                  }`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  // If it's a hash link, manually set active section and scroll smoothly
                  if (link.href.startsWith('#')) {
                    setActiveSection(link.sectionId);
                  }
                  // For '/', router will handle navigation, active state relies on scroll
                }}
              >
                {link.label}
              </a>
            ))}
            <a 
              href="https://songworld.app/login"
              className="ml-2 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-songworld-light-primary dark:bg-songworld-dark-primary rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-300 ease-in-out hover:scale-105"
            >
              <FaSignInAlt className="mr-1.5 h-4 w-4" /> Login
            </a>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-songworld-light-text dark:text-songworld-dark-text hover:text-songworld-light-primary dark:hover:text-songworld-dark-primary focus:outline-none transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FaMoon className="h-5 w-5" />
              ) : (
                <FaSun className="h-5 w-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="p-2 rounded-md text-songworld-light-text dark:text-songworld-dark-text focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
        <div className="pb-3 space-y-1 border-t border-songworld-light-primary/10 dark:border-songworld-dark-primary/10 bg-songworld-light-card/95 dark:bg-songworld-dark-card/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 
                ${activeSection === link.sectionId
                  ? 'text-songworld-light-primary dark:text-songworld-dark-primary font-bold'
                  : 'text-songworld-light-text hover:text-songworld-light-primary dark:text-songworld-dark-text dark:hover:text-songworld-dark-primary'
                }`}
              onClick={() => {
                setMobileMenuOpen(false);
                if (link.href.startsWith('#')) {
                  setActiveSection(link.sectionId);
                }
              }}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="https://songworld.app/login"
            className="flex items-center justify-center w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-songworld-light-primary dark:bg-songworld-dark-primary rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaSignInAlt className="mr-1.5 h-4 w-4" /> Login
          </a>
          <a 
            href="https://songworld.app/register"
            className="flex items-center justify-center w-full mt-2 px-4 py-2 text-sm font-medium border border-songworld-light-primary dark:border-songworld-dark-primary text-songworld-light-primary dark:text-songworld-dark-primary rounded-lg hover:bg-songworld-light-primary/10 dark:hover:bg-songworld-dark-primary/10 transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaRocket className="mr-1.5 h-4 w-4" /> Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 