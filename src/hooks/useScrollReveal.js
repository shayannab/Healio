/**
 * useScrollReveal - Custom hook for scroll-triggered animations
 * Uses Intersection Observer for performance
 */
import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once revealed, stop observing (one-time animation)
                    if (options.once !== false) {
                        observer.unobserve(element);
                    }
                } else if (options.once === false) {
                    setIsVisible(false);
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px'
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin, options.once]);

    return [ref, isVisible];
}

// Stagger delay helper for lists
export function getStaggerDelay(index, baseDelay = 100) {
    return `${index * baseDelay}ms`;
}

export default useScrollReveal;
