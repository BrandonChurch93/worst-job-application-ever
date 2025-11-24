'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollProgress.module.css';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollProgress Component
 *
 * A fixed progress bar at the top of the page showing scroll progress.
 * Features:
 * - GSAP ScrollTrigger for smooth tracking
 * - Gradient fill matching brand colors
 * - Glow effect on the leading edge
 * - Respects reduced motion preference
 */

export default function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    const progressBar = progressRef.current;

    if (!progressBar) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      progressBar.style.display = 'none';
      return;
    }

    // Create scroll-linked animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress * 100;
        progressBar.style.width = `${progress}%`;
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div ref={progressRef} className={styles.progress}></div>
      </div>
    </div>
  );
}
