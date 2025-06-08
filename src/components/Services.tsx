import { useRef, useEffect } from 'react';
import { services } from '../data/services';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Services = () => {
  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.remove('motion-safe:animate-fadeIn');
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-safe:animate-fadeIn');
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    // Memorizza i refs correnti in una variabile
    const currentRefs = serviceRefs.current;

    currentRefs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      // Usa la variabile memorizzata nel cleanup
      currentRefs.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-3xl font-bold text-center mb-12 opacity-0">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">{service.duration} min</span>
                  <span className="font-medium">${service.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a
                  href="#appointment"
                  className="inline-block bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition duration-200"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};