'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './TransitionText.module.css';

/**
 * TransitionText Component
 *
 * Displays transition text between sections with precise timing:
 * - Fade in: 0.6s
 * - Hold: 2s
 * - Fade out: 0.6s
 * - Total: 3.2s
 *
 * @param {string} text - Text to display
 * @param {function} onComplete - Callback when animation completes
 */
export default function TransitionText({ text, onComplete }) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;

    // Create GSAP timeline for precise control
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      }
    });

    // Fade in (0.6s)
    timeline.fromTo(
      element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Hold (2s)
    timeline.to(element, { duration: 2 });

    // Fade out (0.6s)
    timeline.to(element, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power2.in'
    });

    return () => {
      timeline.kill();
    };
  }, [text, onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.bgEffects}>
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
      </div>

      <h2 ref={textRef} className={styles.text}>
        {text}
      </h2>
    </div>
  );
}
