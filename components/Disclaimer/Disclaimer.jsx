'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import styles from './Disclaimer.module.css';

/**
 * Final CTA Section
 *
 * A clean final call-to-action before the footer.
 * The main disclaimer info has been moved to the Hero.
 * Features:
 * - Engaging copy
 * - Premium CTA button
 * - Subtle reveal animation
 */

export default function Disclaimer({ onBeginApplication }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background */}
      <div className={styles.backgroundGradient}></div>

      <div className={styles.container}>
        {/* Final CTA */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>
              <Sparkles size={32} />
            </div>
            <h2 className={styles.ctaTitle}>Ready to Waste Some Time?</h2>
            <p className={styles.ctaSubtitle}>
              You've scrolled this far. Might as well see what all the fuss is about.
              Zero positions available. Maximum chaos guaranteed.
            </p>
            <button className={styles.ctaButton} onClick={onBeginApplication}>
              <span>Apply for a Job</span>
              <ArrowRight size={18} className={styles.ctaArrow} />
            </button>
            <p className={styles.ctaDisclaimer}>
              12-15 min of your life you'll never get back
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
