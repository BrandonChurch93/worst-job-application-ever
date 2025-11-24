'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Coffee,
  Zap,
  Shield,
  Trophy,
  Heart,
  Rocket,
  Clock,
  Users,
  Star
} from 'lucide-react';
import styles from './WhyJoinUs.module.css';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Why Join Us Section - ENHANCED
 *
 * Premium benefits showcase with satirical corporate perks
 * Features:
 * - Bento grid layout
 * - Hover reveals "Translation" (what it actually means)
 * - Employee star ratings (always low)
 * - Rich micro-interactions
 * - dbrand-style irreverent copy
 */

const benefits = [
  {
    icon: Coffee,
    title: 'Unlimited PTO',
    description: "Take as many days off as you want!",
    translation: "People who use it tend to get 'restructured' pretty quickly.",
    rating: 1.5,
    tag: 'Most Popular',
    size: 'large'
  },
  {
    icon: Zap,
    title: 'Competitive Salary',
    description: "Industry-standard compensation package.",
    translation: "Competitive with unpaid internships from 2003.",
    rating: 2,
    tag: null,
    size: 'small'
  },
  {
    icon: Shield,
    title: 'Health Benefits',
    description: "Comprehensive wellness program included.",
    translation: "Free meditation app. Premium features cost extra.",
    rating: 1,
    tag: null,
    size: 'small'
  },
  {
    icon: Trophy,
    title: 'Growth Opportunities',
    description: "Clear path for career advancement.",
    translation: "Responsibilities grow. Title and pay? We'll circle back.",
    rating: 0.5,
    tag: 'Fast Track',
    size: 'medium'
  },
  {
    icon: Heart,
    title: 'Work-Life Balance',
    description: "We respect your personal time.",
    translation: "All 'optional' team events are Saturday mornings.",
    rating: 1,
    tag: null,
    size: 'medium'
  },
  {
    icon: Rocket,
    title: 'Remote Friendly',
    description: "Work from anywhere in the world!",
    translation: "If you're available 24/7 and reply to Slack in 3 min.",
    rating: 2.5,
    tag: 'New',
    size: 'small'
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: "Choose your own schedule.",
    translation: "Start between 8:00-8:15 AM. Leave when your manager leaves. (Never.)",
    rating: 0.5,
    tag: null,
    size: 'small'
  },
  {
    icon: Users,
    title: 'Amazing Culture',
    description: "We're like a family here.",
    translation: "The kind that argues at Thanksgiving and avoids real issues.",
    rating: 1.5,
    tag: 'Award Winning',
    size: 'large'
  }
];

// Star Rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={styles.starRating}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={12} className={styles.starFull} />
      ))}
      {hasHalf && (
        <div className={styles.starHalf}>
          <Star size={12} className={styles.starFull} />
          <Star size={12} className={styles.starEmpty} />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={12} className={styles.starEmpty} />
      ))}
      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
    </div>
  );
};

// Individual Benefit Card
const BenefitCard = ({ benefit, index }) => {
  const cardRef = useRef(null);
  const IconComponent = benefit.icon;

  return (
    <div
      ref={cardRef}
      className={`${styles.benefitCard} ${styles[benefit.size]}`}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      {benefit.tag && (
        <span className={styles.tag}>{benefit.tag}</span>
      )}

      {/* Icon with glow */}
      <div className={styles.iconWrapper}>
        <IconComponent size={24} strokeWidth={1.5} />
        <div className={styles.iconGlow}></div>
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <h3 className={styles.benefitTitle}>{benefit.title}</h3>

        {/* Description - the marketing speak */}
        <p className={styles.benefitDescription}>{benefit.description}</p>

        {/* Translation - the reality */}
        <p className={styles.translation}>{benefit.translation}</p>

        {/* Employee Rating */}
        <div className={styles.ratingWrapper}>
          <span className={styles.ratingLabel}>Employee Rating</span>
          <StarRating rating={benefit.rating} />
        </div>
      </div>
    </div>
  );
};

export default function WhyJoinUs() {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // IntersectionObserver for card reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll(`.${styles.benefitCard}`);
    cards?.forEach((card) => observer.observe(card));

    // GSAP parallax for background glow
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && glowRef.current && sectionRef.current) {
      gsap.to(glowRef.current, {
        y: -80,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    return () => {
      observer.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background Elements */}
      <div ref={glowRef} className={styles.backgroundGlow}></div>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>Why Join Us?</span>
        <h2 className={styles.title}>
          Benefits That Sound <span className={styles.titleAccent}>Too Good</span>
          <br />
          To Be True
        </h2>
        <p className={styles.subtitle}>
          Because they probably are. We've included the fine print for free.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className={styles.grid}>
        {benefits.map((benefit, index) => (
          <BenefitCard key={benefit.title} benefit={benefit} index={index} />
        ))}
      </div>

      {/* Bottom Tagline */}
      <div className={styles.tagline}>
        <p>
          Still interested? Either you didn't read the fine print, or you're exactly the kind of
          <span className={styles.highlight}> team player </span>
          we're looking for.
        </p>
      </div>
    </section>
  );
}
