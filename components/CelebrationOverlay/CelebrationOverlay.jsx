'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import styles from './CelebrationOverlay.module.css';

/**
 * CelebrationOverlay Component
 *
 * Shows confetti burst and proceeding message
 * Duration: 2 seconds total (confetti 1s, hold 1s)
 *
 * @param {boolean} show - Whether to show the overlay
 */
export default function CelebrationOverlay({ show }) {
  useEffect(() => {
    if (show) {
      // Fire confetti burst
      const duration = 1000; // 1 second
      const animationEnd = Date.now() + duration;

      const colors = ['#ea580c', '#f59e0b', '#fb923c', '#fcd34d'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Center burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.checkmark}>
          <svg
            className={styles.checkmarkSvg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
            <path
              className={styles.checkmarkCheck}
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <p className={styles.message}>Requirements Complete!</p>
      </div>
    </div>
  );
}
