'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, AlertCircle } from 'lucide-react';
import styles from './Hero.module.css';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero Section - Mandatory Optional Overtime LLC
 *
 * Premium 2025 hero with:
 * - Centered layout with bold typography
 * - Staggered reveal animations
 * - Fourth-wall-breaking disclaimer
 * - Ambient glow effects with parallax
 * - dbrand-style irreverent copy
 */

export default function Hero({ onBeginApplication }) {
  const heroRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Add loaded class after mount for staggered animations
    const timer = setTimeout(() => {
      heroRef.current?.classList.add(styles.loaded);
    }, 100);

    // Parallax effects for background elements
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && heroRef.current) {
      // Orb 1 - Moves slower (parallax depth)
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: 150,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Orb 2 - Moves in opposite direction
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: -100,
          x: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Orb 3 - Subtle movement
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          y: 80,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      // Grid overlay - Fades out on scroll
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '50% top',
            scrub: 1,
          },
        });
      }
    }

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Ambient Background Effects */}
      <div className={styles.ambientGlow}>
        <div ref={orb1Ref} className={styles.glowOrb1}></div>
        <div ref={orb2Ref} className={styles.glowOrb2}></div>
        <div ref={orb3Ref} className={styles.glowOrb3}></div>
      </div>

      {/* Grid Lines (subtle) */}
      <div ref={gridRef} className={styles.gridOverlay}></div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Main Headline */}
        <h1 className={styles.headline}>
          <span className={styles.headlineMain}>Mandatory Optional</span>
          <span className={styles.headlineAccentRow}>
            <span className={styles.headlineAccent}>Overtime</span>
            <span className={styles.headlineSuffix}>LLC</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className={styles.subheadline}>
          Where your work-life balance goes to die, beautifully. We've perfected the art
          of making simple things unnecessarily complicated—and we're looking for people
          who appreciate that level of commitment to mediocrity.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaGroup}>
          <button className={styles.primaryCta} onClick={onBeginApplication}>
            <span>Apply for a Job</span>
            <ArrowRight size={18} className={styles.ctaArrow} />
          </button>
          <p className={styles.ctaSubtext}>
            Est. time: 12-15 minutes • Satisfaction: Not guaranteed
          </p>
        </div>

        {/* Fourth Wall Break - Disclaimer Callout */}
        <div className={styles.disclaimerCallout}>
          <div className={styles.disclaimerIcon}>
            <AlertCircle size={20} />
          </div>
          <div className={styles.disclaimerContent}>
            <span className={styles.disclaimerLabel}>Breaking character for a moment</span>
            <p className={styles.disclaimerText}>
              Plot twist: This isn't real. It's a <strong>portfolio piece</strong> disguised as
              corporate hell. No data collected. No jobs available. No HR department to complain to.
              Just ~15 minutes of interactive satire about modern work culture.
              Just click <b>Apply for a Job!</b>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.scrollIcon}>
          <div className={styles.scrollDot}></div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className={styles.bottomFade}></div>
    </section>
  );
}
