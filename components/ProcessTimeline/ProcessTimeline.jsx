'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Brain, ClipboardList, Clock, Ghost } from 'lucide-react';
import styles from './ProcessTimeline.module.css';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ProcessTimeline Section - "Your Journey to Disappointment™"
 *
 * A horizontal timeline (vertical on mobile) showing the application process.
 * Features:
 * - 5 satirical steps with icons
 * - Animated progress line on scroll
 * - Staggered step reveals
 * - Icon hover effects
 * - Responsive vertical layout on mobile
 */

const steps = [
  {
    id: 1,
    phase: 'Discovery',
    icon: Search,
    title: 'Find Our Job Posting',
    description: "You clicked a link. That was your first mistake. There's no going back now.",
  },
  {
    id: 2,
    phase: 'Denial',
    icon: Brain,
    title: 'Question Everything',
    description: "Is this real? Should I apply? What is the meaning of work? All valid questions. None will be answered.",
  },
  {
    id: 3,
    phase: 'Assessment',
    icon: ClipboardList,
    title: '47 Mandatory Assessments',
    description: "Personality, skills, blood type, credit score, childhood trauma. The usual pre-screening.",
  },
  {
    id: 4,
    phase: 'Purgatory',
    icon: Clock,
    title: 'The Waiting Period',
    description: "6-8 business months. Your application is very important to us. Please hold.",
  },
  {
    id: 5,
    phase: 'Resolution',
    icon: Ghost,
    title: 'Professional Ghosting',
    description: "We'll be in touch.™ (We won't. But the automated rejection email is beautifully designed.)",
  },
];

// Individual step component
const TimelineStep = ({ step, index, isVisible }) => {
  const stepRef = useRef(null);

  return (
    <div
      ref={stepRef}
      className={`${styles.step} ${isVisible ? styles.visible : ''}`}
      style={{ '--delay': `${index * 0.15}s` }}
    >
      {/* Step number badge */}
      <div className={styles.stepNumber}>
        <span>{step.id}</span>
      </div>

      {/* Icon container */}
      <div className={styles.iconContainer}>
        <div className={styles.iconWrapper}>
          <step.icon size={28} strokeWidth={1.5} />
        </div>
        <div className={styles.iconGlow}></div>
      </div>

      {/* Content */}
      <div className={styles.stepContent}>
        <span className={styles.phase}>{step.phase}</span>
        <h3 className={styles.stepTitle}>{step.title}</h3>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
    </div>
  );
};

export default function ProcessTimeline() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const glowRef = useRef(null);
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline) return;

    // GSAP parallax for background glow
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && glowRef.current) {
      gsap.to(glowRef.current, {
        y: 80,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }

    // Observe individual steps
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const stepIndex = parseInt(entry.target.dataset.index, 10);
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set([...prev, stepIndex]));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    // Observe all steps
    const stepElements = timeline.querySelectorAll(`.${styles.step}`);
    stepElements.forEach((el, index) => {
      el.dataset.index = index;
      stepObserver.observe(el);
    });

    // Progress line scroll tracking
    const handleScroll = () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the timeline is visible/passed
      const timelineTop = rect.top;
      const timelineHeight = rect.height;

      // Start filling when timeline enters viewport, complete when it's mostly passed
      const startPoint = windowHeight * 0.7;
      const endPoint = windowHeight * 0.3;

      if (timelineTop > startPoint) {
        setLineProgress(0);
      } else if (timelineTop < endPoint - timelineHeight) {
        setLineProgress(100);
      } else {
        const totalDistance = startPoint - (endPoint - timelineHeight);
        const currentProgress = startPoint - timelineTop;
        const percentage = Math.min(100, Math.max(0, (currentProgress / totalDistance) * 100));
        setLineProgress(percentage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      stepObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background */}
      <div ref={glowRef} className={styles.backgroundGlow}></div>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>The Process</span>
        <h2 className={styles.title}>
          Your Journey to{' '}
          <span className={styles.titleAccent}>Disappointment™</span>
        </h2>
        <p className={styles.subtitle}>
          Five simple steps. Endless opportunities for regret.
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className={styles.timeline}>
        {/* Progress line (background) */}
        <div className={styles.progressLineTrack}>
          <div
            className={styles.progressLineFill}
            style={{ '--progress': `${lineProgress}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              index={index}
              isVisible={visibleSteps.has(index)}
            />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className={styles.tagline}>
        <p>
          Current wait time: <span className={styles.highlight}>∞</span>
          <span className={styles.taglineNote}> (Results may vary. They won't.)</span>
        </p>
      </div>
    </section>
  );
}
