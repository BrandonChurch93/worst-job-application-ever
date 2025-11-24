'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, Trophy, Medal, Star, Shield, Crown } from 'lucide-react';
import styles from './Awards.module.css';

/**
 * Awards Section - "Awards We Definitely Earned"
 *
 * Redesigned with "Legitimacy Meter" concept.
 * Each award is self-contained with its own humor - no separate footnotes.
 * Features:
 * - Clean card layout
 * - Animated legitimacy meter (always suspiciously low)
 * - Staggered reveal animations
 * - Self-deprecating award sources
 */

const awards = [
  {
    id: 1,
    name: 'Best Workplace Culture',
    source: 'Quarterly Internal Survey',
    year: '2024',
    icon: Trophy,
    legitimacy: 12,
    note: 'Survey conducted during mandatory retreat',
  },
  {
    id: 2,
    name: 'Innovation in Human Resources',
    source: 'HR Monthly (Self-Submitted)',
    year: '2024',
    icon: Award,
    legitimacy: 8,
    note: 'We wrote the nomination ourselves',
  },
  {
    id: 3,
    name: 'Top Employer',
    source: 'Companies We\'ve Heard Of Magazine',
    year: '2023',
    icon: Medal,
    legitimacy: 23,
    note: 'Of companies we compared ourselves to',
  },
  {
    id: 4,
    name: 'Excellence in Synergy',
    source: 'The Synergy Foundation',
    year: '2024',
    icon: Star,
    legitimacy: 3,
    note: 'We founded this organization',
  },
  {
    id: 5,
    name: 'Most Transparent Company',
    source: 'Trust Us Weekly',
    year: '2023',
    icon: Shield,
    legitimacy: 15,
    note: 'Transparent about our lack of transparency',
  },
  {
    id: 6,
    name: 'Employee Choice Award',
    source: 'Glassdoor (Pending Approval)',
    year: '2024',
    icon: Crown,
    legitimacy: 6,
    note: 'Employees chose correctly',
  },
];

// Legitimacy Meter component with animation
const LegitimacyMeter = ({ value, isVisible }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Animate from 0 to target value
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, value]);

  return (
    <div className={styles.legitimacyMeter}>
      <div className={styles.meterLabel}>
        <span>Legitimacy</span>
        <span className={styles.meterValue}>{animatedValue}%</span>
      </div>
      <div className={styles.meterTrack}>
        <div
          className={styles.meterFill}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  );
};

// Individual award card
const AwardCard = ({ award, index }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const IconComponent = award.icon;

  return (
    <div
      ref={cardRef}
      className={`${styles.awardCard} ${isVisible ? styles.visible : ''}`}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      {/* Icon */}
      <div className={styles.iconWrapper}>
        <IconComponent size={28} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className={styles.awardContent}>
        <h3 className={styles.awardName}>{award.name}</h3>
        <div className={styles.awardMeta}>
          <span className={styles.source}>{award.source}</span>
          <span className={styles.year}>{award.year}</span>
        </div>
        <p className={styles.awardNote}>{award.note}</p>
      </div>

      {/* Legitimacy Meter */}
      <LegitimacyMeter value={award.legitimacy} isVisible={isVisible} />
    </div>
  );
};

export default function Awards() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background */}
      <div className={styles.backgroundGlow}></div>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>Recognition</span>
        <h2 className={styles.title}>
          Awards We{' '}
          <span className={styles.titleAccent}>Definitely Earned</span>
        </h2>
        <p className={styles.subtitle}>
          Industry recognition that speaks for itself. Quietly. In a room by itself.
        </p>
      </div>

      {/* Awards Grid */}
      <div className={styles.grid}>
        {awards.map((award, index) => (
          <AwardCard key={award.id} award={award} index={index} />
        ))}
      </div>

      {/* Bottom Tagline */}
      <div className={styles.tagline}>
        <p>
          All awards verified by <span className={styles.highlight}>our legal team</span>
          <span className={styles.taglineNote}> (they said "technically not false")</span>
        </p>
      </div>
    </section>
  );
}
