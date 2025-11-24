'use client';

import { useEffect, useRef } from 'react';
import styles from './Marquee.module.css';

/**
 * Marquee Component - Infinite Scrolling Ticker
 *
 * Two rows of satirical corporate messaging scrolling in opposite directions.
 * Features:
 * - CSS-based infinite scroll (performant)
 * - Pause on hover (invites closer reading)
 * - Glowing amber separators
 * - Respects prefers-reduced-motion
 */

const row1Items = [
  '"Best Place to Work*" — Forbes (*they didn\'t say this)',
  'Bathroom Breaks: Tracked (For Your Safety™)',
  'Ping Pong Table: Decorative Only',
  '"I\'ve never felt more alive" — Former Employee (RIP)',
  'Your Data: Sold. Twice.',
  'Coffee Machine Status: Yes (Broken)',
  'Promotion Timeline: Heat Death of Universe',
  'The Printer: Haunted (Confirmed)',
  'Open Door Policy* (*door removed, frame remains)',
  'Severance Package: lol',
];

const row2Items = [
  'Voted #1 by Ourselves™ — Three Years Running',
  'Free Lunch: There Isn\'t One. Literally.',
  '"We\'re Like a Family"™ — The Toxic Kind',
  'Work Hours: 9-5 (AM to AM)',
  'Now Hiring: Nobody (Position Filled Internally)',
  'Conference Room C: Condemned (Spiritually)',
  'Unlimited PTO (Usage: 0 hrs | Guilt: ∞)',
  '"Revolutionizing Mediocrity Since 2022"™',
  '0 Days Without an HR Incident 🏆',
  'Company Retreat: One Survivor',
];

// Separator component with glow effect
const Separator = () => (
  <span className={styles.separator} aria-hidden="true">
    <span className={styles.separatorDot}></span>
  </span>
);

// Single marquee row with duplicated content for seamless loop
const MarqueeRow = ({ items, direction = 'left', speed = 'normal' }) => {
  const rowRef = useRef(null);

  return (
    <div
      className={`${styles.marqueeRow} ${styles[direction]} ${styles[speed]}`}
      ref={rowRef}
    >
      {/* First set of items */}
      <div className={styles.marqueeContent} aria-hidden="false">
        {items.map((item, index) => (
          <span key={`a-${index}`} className={styles.marqueeItem}>
            <span className={styles.itemText}>{item}</span>
            <Separator />
          </span>
        ))}
      </div>

      {/* Duplicate for seamless loop */}
      <div className={styles.marqueeContent} aria-hidden="true">
        {items.map((item, index) => (
          <span key={`b-${index}`} className={styles.marqueeItem}>
            <span className={styles.itemText}>{item}</span>
            <Separator />
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Marquee() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Add loaded class for entrance animation
    const timer = setTimeout(() => {
      containerRef.current?.classList.add(styles.loaded);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} className={styles.marquee} aria-label="Company highlights ticker">
      {/* Decorative edge fades */}
      <div className={styles.edgeFadeLeft}></div>
      <div className={styles.edgeFadeRight}></div>

      {/* Top border glow */}
      <div className={styles.borderGlow}></div>

      {/* Row 1 - Scrolls left (default) */}
      <MarqueeRow items={row1Items} direction="left" speed="normal" />

      {/* Divider line */}
      <div className={styles.rowDivider}></div>

      {/* Row 2 - Scrolls right, slightly faster */}
      <MarqueeRow items={row2Items} direction="right" speed="fast" />

      {/* Bottom border glow */}
      <div className={styles.borderGlowBottom}></div>
    </section>
  );
}
