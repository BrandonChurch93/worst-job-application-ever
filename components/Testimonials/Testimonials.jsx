'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import styles from './Testimonials.module.css';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Testimonials Section - "What They Said"
 *
 * Satirical employee testimonials with:
 * - Redacted names for humor
 * - 5-star ratings (all concerning)
 * - Hidden "redacted" lines revealed on hover
 * - Glassmorphism card styling
 * - Staggered reveal animations
 */

const testimonials = [
  {
    id: 1,
    name: '████████ ██████',
    role: 'Former Senior Synergy Analyst',
    tenure: '3 weeks',
    rating: 5,
    quote: "I learned more in three weeks here than I did in four years of college. Mostly about labor laws and my rights as an employee.",
    hiddenLine: '[EDIT: Testimony given under duress]',
    image: '/testimonials/employee1.JPG',
  },
  {
    id: 2,
    name: 'J███ D██',
    role: 'Ex-Chief Happiness Officer',
    tenure: '6 days',
    rating: 5,
    quote: "The culture here is unlike anything I've ever experienced. I say that as both a compliment and a warning.",
    hiddenLine: '[UPDATE: Now in witness protection]',
    image: '/testimonials/employee2.JPG',
  },
  {
    id: 3,
    name: '██████ ████████',
    role: 'Previously: Unpaid Intern (CEO Track)',
    tenure: '4 months',
    rating: 5,
    quote: "They told me I'd wear many hats. They weren't lying. I was also the hat.",
    hiddenLine: '[NOTE: We still owe them money]',
    image: '/testimonials/employee3.JPG',
  },
  {
    id: 4,
    name: 'A█████ ███████',
    role: 'Former Director of Doing More With Less',
    tenure: '2.5 weeks',
    rating: 5,
    quote: "Work-life balance isn't a myth here. It's more of a legend—something people whisper about but no one's actually seen.",
    hiddenLine: '[ADDENDUM: They found the legend. It was dead.]',
    image: '/testimonials/employee4.JPG',
  },
  {
    id: 5,
    name: '██████████ K.',
    role: 'Ex-VP of Mandatory Fun',
    tenure: '11 days',
    rating: 5,
    quote: "I came for the unlimited PTO. I stayed because my badge stopped working and I couldn't leave the building.",
    hiddenLine: '[STATUS: Badge still doesn\'t work]',
    image: '/testimonials/employee5.JPG',
  },
  {
    id: 6,
    name: '[REDACTED]',
    role: 'No Longer: Meeting Scheduler III',
    tenure: 'Until I wasn\'t',
    rating: 5,
    quote: "This job taught me that 'fast-paced environment' is HR code for 'we haven't hired enough people.' Invaluable insight.",
    hiddenLine: '[REDACTED: Ongoing litigation]',
    image: '/testimonials/employee6.JPG',
  },
];

// Star rating component with staggered animation
const StarRating = ({ rating, animate }) => {
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`${styles.star} ${index < rating ? styles.filled : ''} ${animate ? styles.animate : ''}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Star size={14} />
        </span>
      ))}
    </div>
  );
};

// Individual testimonial card
const TestimonialCard = ({ testimonial, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
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

  return (
    <div
      ref={cardRef}
      className={styles.testimonialCard}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      {/* Quote icon decoration */}
      <div className={styles.quoteIcon}>
        <Quote size={24} />
      </div>

      {/* Employee info header */}
      <div className={styles.cardHeader}>
        {/* Avatar with employee photo */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <Image
              src={testimonial.image}
              alt={`Portrait of ${testimonial.name}`}
              fill
              sizes="56px"
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.avatarGlow}></div>
        </div>

        <div className={styles.employeeInfo}>
          <span className={styles.employeeName}>{testimonial.name}</span>
          <span className={styles.employeeRole}>{testimonial.role}</span>
          <span className={styles.employeeTenure}>Tenure: {testimonial.tenure}</span>
        </div>
      </div>

      {/* Star rating */}
      <StarRating rating={testimonial.rating} animate={true} />

      {/* Quote */}
      <blockquote className={styles.quote}>
        "{testimonial.quote}"
      </blockquote>

      {/* Hidden redacted line - revealed on hover */}
      <div className={styles.hiddenLine}>
        <span className={styles.hiddenLineText}>{testimonial.hiddenLine}</span>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      sectionRef.current?.classList.add(styles.loaded);
    }, 100);

    // GSAP parallax for background glow
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && glowRef.current && sectionRef.current) {
      gsap.to(glowRef.current, {
        y: 100,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background glow */}
      <div ref={glowRef} className={styles.backgroundGlow}></div>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>What They Said</span>
        <h2 className={styles.title}>
          Testimonials From People Who{' '}
          <span className={styles.titleAccent}>Definitely Existed</span>
        </h2>
        <p className={styles.subtitle}>
          Real feedback from real employees.* <span className={styles.asterisk}>(*Employment status: terminated)</span>
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className={styles.grid}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>

      {/* Bottom tagline */}
      <div className={styles.tagline}>
        <p>
          Want to see your name redacted here?{' '}
          <span className={styles.highlight}>Apply today.</span>
        </p>
      </div>
    </section>
  );
}
