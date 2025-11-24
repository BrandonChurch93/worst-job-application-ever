'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Section.module.css';

/**
 * Section Component
 *
 * Full-viewport wrapper for each application section
 * Handles fade in/out transitions
 *
 * @param {ReactNode} children - Section content
 * @param {boolean} show - Whether to show this section
 * @param {string} className - Additional CSS classes
 */
export default function Section({ children, show, className = '' }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;

    if (show) {
      // Fade in
      gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    } else {
      // Fade out
      gsap.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  }, [show]);

  if (!show) return null;

  return (
    <section ref={sectionRef} className={`${styles.section} ${className}`}>
      <div className={styles.bgEffects}>
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-texture"></div>
      </div>

      <div className={styles.content}>{children}</div>
    </section>
  );
}
