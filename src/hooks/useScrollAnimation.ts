import { useEffect, useRef } from 'react';

export const useScrollAnimation = <T extends HTMLElement>() => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Remove the class first to allow re-animation
          entry.target.classList.remove('motion-safe:animate-fadeIn');
          if (entry.isIntersecting) {
            // Add animation class when element is visible
            entry.target.classList.add('motion-safe:animate-fadeIn');
          }
        });
      },
      {
        root: null,
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px',
      }
    );

    // Memorizza il ref corrente in una variabile
    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      // Usa la variabile memorizzata nel cleanup
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return elementRef;
};