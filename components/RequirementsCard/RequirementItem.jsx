'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check } from 'lucide-react';
import styles from './RequirementItem.module.css';

/**
 * RequirementItem Component
 *
 * Individual requirement checkbox with animation
 *
 * @param {string} label - Requirement text
 * @param {boolean} complete - Whether requirement is complete
 */
export default function RequirementItem({ label, complete }) {
  const checkboxRef = useRef(null);
  const previousComplete = useRef(complete);

  useEffect(() => {
    // Only animate if transitioning from incomplete to complete
    if (complete && !previousComplete.current) {
      const checkbox = checkboxRef.current;

      // Play check sound (placeholder for now)
      // TODO: Add Howler.js sound in Phase 1 polish

      // Animate checkbox: scale up then back down
      gsap.timeline()
        .to(checkbox, {
          scale: 1.2,
          duration: 0.2,
          ease: 'power2.out'
        })
        .to(checkbox, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.in'
        });
    }

    previousComplete.current = complete;
  }, [complete]);

  return (
    <div className={`${styles.item} ${complete ? styles.complete : ''}`}>
      <div
        ref={checkboxRef}
        className={`${styles.checkbox} ${complete ? styles.checked : ''}`}
      >
        {complete && <Check className={styles.checkIcon} size={16} strokeWidth={3} />}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
