import React, { useState, useEffect } from 'react';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope, FaPaperPlane, FaMusic, FaRegLightbulb, FaRegCopyright, FaYoutube } from 'react-icons/fa';
import logoLight from '../assets/song-world/phone_light_2mdpi.png';
import logoDark from '../assets/song-world/phone_dark_2mdpi.png';

const Footer = () => {
  const [currentLogo, setCurrentLogo] = useState(logoLight.src);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setCurrentLogo(root.classList.contains('dark') ? logoDark.src : logoLight.src);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    setCurrentLogo(root.classList.contains('dark') ? logoDark.src : logoLight.src);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit to an API or service like Mailchimp
    console.log(`Subscribed with email: ${email}`);
    setSubscribed(true);
    setEmail('');
    // Reset after 5 seconds
    setTimeout(() => setSubscribed(false), 5000);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#about', label: 'About' },
    { href: '/#blog', label: 'Blog' },
    { href: '/#store', label: 'Store' },
    { href: '/#contact', label: 'Contact' },
  ];

  const legalLinks = [
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/copyright', label: 'Copyright Info' },
    { href: '/legal/data-usage', label: 'Data Usage Policy' },
  ];

  const socialLinks = [
    { href: '#', icon: FaTwitter, label: 'Twitter', color: 'hover:text-blue-400' },
    { href: '#', icon: FaFacebookF, label: 'Facebook', color: 'hover:text-blue-600' },
    { href: '#', icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-500' },
    { href: 'https://www.youtube.com/@songworld_app', icon: FaYoutube, label: 'Youtube', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-songworld-light-card/90 dark:bg-songworld-dark-card/90 text-songworld-light-text dark:text-songworld-dark-text py-16 border-t border-songworld-light-primary/20 dark:border-songworld-dark-primary/20 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section: Logo/description and Links/Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
          {/* Logo and company info */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-block mb-6 group">
              <div className="flex items-center">
                <img 
                  src={currentLogo} 
                  alt="Song World" 
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-110" 
                />
                <h3 className="ml-3 text-2xl font-bold text-songworld-light-primary dark:text-songworld-dark-primary">
                  Song World
                </h3>
              </div>
            </a>
            <p className="text-base mb-6 max-w-md">
              Your ultimate AI-powered songwriting companion. Create, collaborate, and perfect your songs with our innovative platform designed for musicians.
            </p>
            <div className="flex space-x-4 mb-8 lg:mb-0">
              {socialLinks.map(social => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  aria-label={social.label}
                  className={`${social.color} text-songworld-light-text/70 dark:text-songworld-dark-text/70 transition-colors duration-200 bg-songworld-light-primary/10 dark:bg-songworld-dark-primary/10 p-2.5 rounded-full hover:scale-110 transform transition-transform`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links (Navigation, Legal) and Newsletter Subscription - Sub-grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Navigation links section */}
            <div>
              <h5 className="text-lg font-semibold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">Navigation</h5>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="hover:text-songworld-light-accent dark:hover:text-songworld-dark-accent transition-colors duration-200 text-base inline-block py-1 border-b border-transparent hover:border-songworld-light-accent/30 dark:hover:border-songworld-dark-accent/30"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links section (moved here) */}
            <div>
              <h5 className="text-lg font-semibold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">Legal</h5>
              <ul className="space-y-3">
                {legalLinks.map(link => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="hover:text-songworld-light-accent dark:hover:text-songworld-dark-accent transition-colors duration-200 text-base inline-block py-1 border-b border-transparent hover:border-songworld-light-accent/30 dark:hover:border-songworld-dark-accent/30"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter subscription */}
            <div className="sm:col-span-2 md:col-span-1">
              <h5 className="text-lg font-semibold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">Stay Updated</h5>
              <p className="text-base mb-4">
                Subscribe to our newsletter for the latest updates, features, and music tips.
              </p>
              {subscribed ? (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded">
                  <p className="text-sm">Thanks for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope className="w-4 h-4 text-songworld-light-text/60 dark:text-songworld-dark-text/60" />
                      </div>
                      <input 
                        type="email" 
                        className="bg-white/50 dark:bg-black/20 border border-songworld-light-primary/30 dark:border-songworld-dark-primary/30 text-songworld-light-text dark:text-songworld-dark-text rounded-l-lg pl-10 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent"
                        placeholder="Your email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="bg-songworld-light-primary dark:bg-songworld-dark-primary text-white px-3 py-2.5 rounded-r-lg hover:bg-opacity-90 transition-colors duration-200 text-sm flex items-center"
                    >
                      <FaPaperPlane className="w-4 h-4 mr-1" /> Subscribe
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="pt-8 mt-8 border-t border-songworld-light-primary/10 dark:border-songworld-dark-primary/10 flex flex-col md:flex-row justify-between items-center text-songworld-light-text/60 dark:text-songworld-dark-text/60">
          <div className="flex items-center mb-4 md:mb-0">
            <FaRegCopyright className="mr-1.5 h-4 w-4" />
            <p className="text-sm">
              {currentYear} Song World. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="/#features" className="text-sm flex items-center hover:text-songworld-light-accent dark:hover:text-songworld-dark-accent transition-colors duration-200">
              <FaMusic className="mr-1.5 h-4 w-4" /> Our Mission
            </a>
            <a href="/#about" className="text-sm flex items-center hover:text-songworld-light-accent dark:hover:text-songworld-dark-accent transition-colors duration-200">
              <FaRegLightbulb className="mr-1.5 h-4 w-4" /> Our Story
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 