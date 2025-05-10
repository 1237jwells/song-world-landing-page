import React, { useEffect, useRef, useState } from 'react';
import { FaLightbulb, FaGlobeAmericas, FaTasks } from 'react-icons/fa'; // Using FaTasks for All-in-One Workflow

const featuresData = [
  {
    id: 'ai-cocreator',
    icon: FaLightbulb,
    title: "AI Co-Creator",
    description: "Break through creative blocks with AI that suggests melodies, chord progressions, and lyrics, acting as your inspiring musical partner."
  },
  {
    id: 'collaboration',
    icon: FaGlobeAmericas,
    title: "Seamless Global Collaboration",
    description: "Work on projects simultaneously with anyone, anywhere. Shared workspaces and real-time editing make distance irrelevant."
  },
  {
    id: 'workflow',
    icon: FaTasks,
    title: "All-in-One Workflow",
    description: "From initial spark to basic demo, manage your entire songwriting process within a single, intuitive platform."
  }
];

const Features = () => {
  const [sectionTitleVisible, setSectionTitleVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const featureCardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  featureCardsRefs.current = Array(featuresData.length).fill(null);

  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionTitleVisible(true);
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (currentSectionRef) {
      sectionObserver.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        sectionObserver.unobserve(currentSectionRef);
      }
    };
  }, []);

  useEffect(() => {
    const cardObservers: IntersectionObserver[] = [];
    featureCardsRefs.current.forEach((cardEl, index) => {
      if (cardEl) {
        const cardObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0');
                entry.target.classList.add('opacity-100', 'animate-zoomIn');
                (entry.target as HTMLElement).style.animationDelay = `${index * 0.15}s`;
                cardObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );
        cardObserver.observe(cardEl);
        cardObservers.push(cardObserver);
      }
    });

    return () => {
      cardObservers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="bg-slate-50 dark:bg-gray-800/30 text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24"
    >
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 transition-opacity duration-700 ease-in-out ${sectionTitleVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">
            Transform Your Sound with Intelligent Tools
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Song World offers a unique blend of AI assistance and collaborative power to elevate your music creation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.id} 
                ref={el => { featureCardsRefs.current[index] = el; }}
                className="text-center p-6 bg-songworld-light-card dark:bg-songworld-dark-card rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 opacity-0"
              >
                <div className="flex justify-center items-center mb-4">
                  {IconComponent && <IconComponent className="w-12 h-12 text-songworld-light-accent dark:text-songworld-dark-accent mb-4" />}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-songworld-light-text dark:text-songworld-dark-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features; 