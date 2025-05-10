import React, { useState, useEffect, useRef } from 'react';

const ContactUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-gray-800/30 text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24">
      <div 
        ref={sectionRef}
        className={`max-w-xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out transform 
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary text-center mb-12">
          Contact Us
        </h2>
        <div className="bg-white dark:bg-black/20 shadow-xl rounded-lg p-8 md:p-10 ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed">
            Have questions, feedback, or need support? We'd love to hear from you! Reach out to us through the form below or via email.
          </p>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                autoComplete="name" 
                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent focus:border-songworld-light-accent dark:focus:border-songworld-dark-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                autoComplete="email" 
                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent focus:border-songworld-light-accent dark:focus:border-songworld-dark-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent focus:border-songworld-light-accent dark:focus:border-songworld-dark-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
              ></textarea>
            </div>
            <div>
              <button 
                type="submit" 
                className="group relative w-full inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-songworld-light-primary dark:bg-songworld-dark-primary rounded-lg shadow-xl hover:bg-opacity-90 dark:hover:bg-opacity-90 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-songworld-light-card dark:focus:ring-offset-songworld-dark-card focus:ring-songworld-light-accent dark:focus:ring-songworld-dark-accent"
              >
                Send Message
              </button>
            </div>
          </form>
          <div className="mt-10 text-center">
            <p className="text-gray-600 dark:text-gray-400">Alternatively, you can email us at: <a href="mailto:support@songworld.app" className="font-medium text-songworld-light-primary dark:text-songworld-dark-primary hover:underline">support@songworld.app</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 