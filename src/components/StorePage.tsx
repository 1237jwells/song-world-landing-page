import React, { useEffect, useRef, useState } from 'react';
import { FaHeart, FaBan, FaMusic, FaStar, FaUsersCog, FaFire, FaCheckCircle, FaAtlas, FaGlobeAmericas } from 'react-icons/fa';

// Subscription plans using react-icons
const products = [
  {
    id: 1,
    name: 'Free',
    href: '#',
    price: '$0',
    priceSuffix: '/forever',
    description: 'Limited access to Song World features.',
    features: ['Up to 15 songs', '0.25GB cloud storage', 'No AI features', '1 collaborator'],
    cta: 'Choose Plan',
    cardColor: 'bg-white dark:bg-black/20',
    gradient: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-800/30',
    icon: FaGlobeAmericas,
  },
  {
    id: 2,
    name: 'No Ads',
    href: '#',
    price: '$19.99',
    priceSuffix: '/one-time',
    description: 'Ad-free experience with basic features.',
    features: ['Ad-free experience', 'Unlimited song creations', 'All basic features'],
    cta: 'Choose Plan',
    cardColor: 'bg-teal-50 dark:bg-teal-900/30',
    gradient: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30',
    icon: FaBan,
  },
  {
    id: 3,
    name: 'Songwriter',
    href: '#',
    price: '$4.99',
    priceSuffix: '/month',
    description: 'For individual songwriters with enhanced features.',
    features: ['Ad-free experience', 'Unlimited song creations', '5GB cloud storage', '20 AI tokens per month', '3 collaborators'],
    cta: 'Choose Plan',
    cardColor: 'bg-blue-50 dark:bg-blue-900/30',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
    isPremium: true,
    icon: FaMusic,
  },
  {
    id: 4,
    name: 'Artist',
    href: '#',
    price: '$79.99',
    priceSuffix: '/year (save 34%)',
    description: 'For active musicians, best value with premium features.',
    features: ['All Songwriter features', '25GB cloud storage', '50 AI tokens per month', '5 collaborators', 'AI lyrical extraction', 'Monthly song challenges'],
    cta: 'Choose Plan',
    cardColor: 'bg-purple-50 dark:bg-purple-900/30',
    gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
    isFeatured: true,
    isPremium: true,
    badge: 'Best Value',
    icon: FaStar,
  },
  {
    id: 5,
    name: 'Producer',
    href: '#',
    price: '$14.99',
    priceSuffix: '/month',
    description: 'For serious musicians with unlimited access.',
    features: ['All Artist features', '75GB cloud storage', '10 collaborators', 'Unlimited AI features', 'Priority support'],
    cta: 'Choose Plan',
    cardColor: 'bg-deepPurple-50 dark:bg-deepPurple-900/30',
    gradient: 'bg-gradient-to-br from-deepPurple-50 to-deepPurple-100 dark:from-deepPurple-900/30 dark:to-deepPurple-800/30',
    isPremium: true,
    icon: FaUsersCog,
  },
  {
    id: 6,
    name: 'Artist Trial',
    href: '#',
    price: 'Free Trial',
    priceSuffix: '/30 days',
    description: 'Try Artist tier features for 30 days.',
    features: ['Ad-free experience', 'Unlimited song creations', '25GB cloud storage', '50 AI tokens', '5 collaborators', 'AI lyrical extraction'],
    cta: 'Start Trial',
    cardColor: 'bg-orange-50 dark:bg-orange-900/30',
    gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
    badge: 'Limited Offer',
    icon: FaFire,
  },
];

const StorePage = () => {
  const [visibleCards, setVisibleCards] = useState<Record<number, boolean>>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Ensure cardRefs current array is initialized for the number of products
    cardRefs.current = cardRefs.current.slice(0, products.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0', 10);
            setVisibleCards((prev) => ({ ...prev, [cardId]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } 
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [products]);

  return (
    <div className="bg-songworld-light-card dark:bg-songworld-dark-card text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">
            Song World Plans
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan to unlock your songwriting potential.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 items-stretch">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            const isVisible = visibleCards[product.id] || false;
            return (
              <div 
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                data-card-id={product.id}
                key={product.id} 
                className={`group relative flex flex-col rounded-xl shadow-2xl ${product.gradient || product.cardColor} ring-1 ${product.isFeatured ? 'ring-songworld-light-accent dark:ring-songworld-dark-accent' : 'ring-black/10 dark:ring-white/10'} 
                           transition-all duration-700 ease-out transform hover:shadow-songworld-light-primary/30 dark:hover:shadow-songworld-dark-primary/30 
                           ${product.isPremium && isVisible ? 'hover:scale-[1.05]' : isVisible ? 'hover:scale-[1.03]' : 'opacity-0 -translate-y-5 rotate-[-3deg]'} 
                           ${isVisible ? 'opacity-100 translate-y-0 rotate-0' : ''}`}
                style={{ transitionDelay: `${isVisible ? index * 100 : 0}ms` }}
              >
                {(product.isFeatured || product.badge) && (
                  <div className={`absolute top-0 right-0 text-white dark:text-songworld-dark-text text-xs font-bold uppercase px-3 py-1 rounded-bl-lg ${product.isFeatured ? 'bg-songworld-light-accent dark:bg-songworld-dark-accent' : 'bg-orange-500 dark:bg-orange-700'}`}>
                    {product.badge || 'Best Value'}
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center mb-2">
                    {IconComponent && <IconComponent className="w-6 h-6 text-songworld-light-accent dark:text-songworld-dark-accent mr-3 flex-shrink-0" />}
                    <h3 className="text-2xl font-bold text-songworld-light-text dark:text-songworld-dark-text">{product.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{product.description}</p>
                  
                  <div className="mb-6 p-3 bg-white/80 dark:bg-black/40 rounded-lg">
                    <span className="text-4xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary">{product.price}</span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">{product.priceSuffix}</span>
                  </div>

                  <ul className="space-y-2 mb-8 flex-grow">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300 p-2 rounded-lg bg-white/50 dark:bg-black/20">
                        <FaCheckCircle className="h-5 w-5 text-songworld-light-accent dark:text-songworld-dark-accent mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href={product.href}
                    className={`mt-auto w-full inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-lg shadow-md transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 
                               ${product.isPremium ? 'bg-gradient-to-r from-songworld-light-primary to-songworld-light-accent dark:from-songworld-dark-primary dark:to-songworld-dark-accent hover:scale-105 text-white dark:text-songworld-dark-text focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-songworld-light-accent/70 dark:focus:ring-songworld-dark-accent/70' 
                               : product.isFeatured ? 'bg-songworld-light-accent dark:bg-songworld-dark-accent hover:scale-105 text-white dark:text-songworld-dark-text focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-songworld-light-accent/70 dark:focus:ring-songworld-dark-accent/70' 
                               : 'bg-songworld-light-primary dark:bg-songworld-dark-primary hover:scale-105 text-white focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-songworld-light-primary/70 dark:focus:ring-songworld-dark-primary/70'}`}
                  >
                    {product.cta}
                    {product.isPremium && (
                      <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StorePage; 