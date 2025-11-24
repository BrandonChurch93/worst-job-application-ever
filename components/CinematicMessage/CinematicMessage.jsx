'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CinematicMessage.module.css';

/**
 * CinematicMessage Component
 *
 * Displays cinematic transition messages between major sections
 * Similar to TransitionText but with slightly longer timing
 *
 * @param {string} message - Message to display
 * @param {function} onComplete - Callback when animation completes
 */
export default function CinematicMessage({ message, onComplete }) {
  const messageRef = useRef(null);

  useEffect(() => {
    const element = messageRef.current;

    // Create GSAP timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      }
    });

    // Fade in (0.8s)
    timeline.fromTo(
      element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Hold (2.5s)
    timeline.to(element, { duration: 2.5 });

    // Fade out (0.8s)
    timeline.to(element, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.in'
    });

    return () => {
      timeline.kill();
    };
  }, [message, onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.bgEffects}>
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
      </div>

      <p ref={messageRef} className={styles.message}>
        {message}
      </p>
    </div>
  );
}
