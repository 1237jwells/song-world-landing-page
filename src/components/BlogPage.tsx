import React, { useState, useEffect, useRef } from 'react';
import cartoonSongWorldBlog from '../assets/song-world/transparent/AI-GEN/songwriter_icon_square.png';
// Placeholder for individual blog post data
const posts = [
  {
    id: 1,
    title: 'The Art of Lyric Writing: Tips from the Pros',
    href: '#', // Placeholder, will be /blog/slug later
    description:
      'Unlock your lyrical genius with these expert tips and techniques. Dive deep into song structure, storytelling, and finding your unique voice.',
    date: 'Mar 16, 2024',
    datetime: '2024-03-16',
    category: { title: 'Songwriting', href: '#' },
    // imageUrl: 'https://source.unsplash.com/random/800x600?music,writing' // Example image
  },
  {
    id: 2,
    title: 'Chord Progressions That Inspire: A Beginner\'s Guide',
    href: '#', // Placeholder
    description:
      'Learn the fundamentals of creating captivating chord progressions. Explore common patterns and how to break the rules effectively.',
    date: 'Mar 10, 2024',
    datetime: '2024-03-10',
    category: { title: 'Music Theory', href: '#' },
    // imageUrl: 'https://source.unsplash.com/random/800x600?guitar,chords' // Example image
  },
  // More posts...
];

const BlogPage = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState<Record<number, boolean>>({});
  
  const headerRef = useRef<HTMLDivElement | null>(null);
  const postRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Observer for header
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          headerObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    // Observer for posts
    postRefs.current = postRefs.current.slice(0, posts.length);
    const postObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = parseInt(entry.target.getAttribute('data-post-id') || '0', 10);
            setVisiblePosts((prev) => ({ ...prev, [postId]: true }));
            postObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    postRefs.current.forEach((ref) => {
      if (ref) postObserver.observe(ref);
    });

    return () => {
      if (headerRef.current) headerObserver.unobserve(headerRef.current);
      postRefs.current.forEach((ref) => {
        if (ref) postObserver.unobserve(ref);
      });
    };
  }, [posts]);

  return (
    <div className="relative text-songworld-light-text dark:text-songworld-dark-text py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-gray-100 to-slate-100 dark:from-gray-800/30 dark:via-gray-900/20 dark:to-gray-800/30 animate-animatedGradientShift" style={{ backgroundSize: '200% 200%' }}></div>
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={headerRef}
            className={`text-center mb-12 transition-all duration-1000 ease-out transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-12">
              <img src={cartoonSongWorldBlog.src} alt="cartoonSongWorld" className="h-16 w-16 mr-4" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-songworld-light-primary dark:text-songworld-dark-primary mb-4">
              Song World Blog
            </h2>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Insights, tips, and stories for musicians and songwriters.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {posts.map((post, index) => {
              const isVisible = visiblePosts[post.id] || false;
              return (
                <article 
                  ref={(el) => {
                    if (el) postRefs.current[index] = el;
                  }}
                  data-post-id={post.id}
                  key={post.id} 
                  className={`group relative flex flex-col rounded-xl shadow-2xl bg-white dark:bg-black/20 ring-1 ring-black/10 dark:ring-white/10 overflow-hidden 
                             transition-all duration-700 ease-out transform hover:shadow-songworld-light-primary/30 dark:hover:shadow-songworld-dark-primary/30 
                             ${isVisible ? 'opacity-100 translate-y-0 rotate-0 hover:scale-[1.02]' : 'opacity-0 translate-y-5 rotate-[-2deg]'}`}
                  style={{ transitionDelay: `${isVisible ? index * 150 : 0}ms` }}
                >
                  {/* Optional Image */}
                  {/* {post.imageUrl && ( <img className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" src={post.imageUrl} alt="" /> )} */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-songworld-light-accent dark:text-songworld-dark-accent uppercase tracking-wider">
                        {post.category.title}
                      </p>
                      <a href={post.href} className="block mt-3">
                        <p className="text-xl sm:text-2xl font-bold text-songworld-light-text dark:text-songworld-dark-text group-hover:text-songworld-light-primary dark:group-hover:text-songworld-dark-primary transition-colors">
                          {post.title}
                        </p>
                        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={post.datetime}>{post.date}</time>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 