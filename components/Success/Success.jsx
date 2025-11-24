'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Twitter, Linkedin, Link as LinkIcon, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import useAppStore from '@/store/appStore';
import styles from './Success.module.css';

/**
 * Success Screen Component
 *
 * Shows completion stats, time, and share options
 */
export default function Success() {
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);

  const getFormattedTime = useAppStore((state) => state.getFormattedTime);
  const formData = useAppStore((state) => state.formData);

  // Fire confetti on mount
  useEffect(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ea580c', '#f59e0b', '#fb923c', '#fcd34d'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });

      confetti({
        particleCount: 5,
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

    // Center bursts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

    // Show content after a short delay
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const completionTime = getFormattedTime();

  const handleShare = (platform) => {
    const text = `I just completed "The Worst Job Application Ever Made" in ${completionTime}! 🎉`;
    const url = typeof window !== 'undefined' ? window.location.href : '';

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank'
      );
    }
  };

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Effects */}
      <div className={styles.bgEffects}>
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-texture"></div>
      </div>

      {/* Content */}
      <div className={`${styles.content} ${showContent ? styles.show : ''}`}>
        {/* Checkmark Icon */}
        <div className={styles.iconContainer}>
          <CheckCircle2 className={styles.checkIcon} size={80} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className={styles.title}>Application Complete!</h1>
        <p className={styles.subtitle}>
          Congratulations, {formData.name || 'applicant'}! Your submission has been received and
          filed in our comprehensive database.
        </p>

        {/* Stats Card */}
        <div className={`${styles.statsCard} liquid-glass`}>
          <div className={styles.statsHeader}>
            <h3 className={styles.statsTitle}>Performance Metrics</h3>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Your Time</span>
              <span className={`${styles.statValue} ${styles.primary}`}>{completionTime}</span>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Average Time</span>
              <span className={styles.statValue}>14:32</span>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Target Time</span>
              <span className={styles.statValue}>02:00</span>
            </div>
          </div>

          <div className={styles.applicantNumber}>
            <span>Applicant #420,069</span>
          </div>
        </div>

        {/* Share Section */}
        <div className={styles.shareSection}>
          <h3 className={styles.shareTitle}>Share Your Achievement</h3>

          <div className={styles.shareButtons}>
            <button
              onClick={() => handleShare('twitter')}
              className={`${styles.shareButton} ${styles.twitter}`}
            >
              <Twitter size={20} />
              <span>Twitter</span>
            </button>

            <button
              onClick={() => handleShare('linkedin')}
              className={`${styles.shareButton} ${styles.linkedin}`}
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </button>

            <button
              onClick={handleCopyLink}
              className={`${styles.shareButton} ${styles.copy}`}
            >
              <LinkIcon size={20} />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Case Study Link */}
        <a href="#" className={styles.caseStudyLink}>
          <span>View Case Study</span>
          <ExternalLink size={16} />
        </a>

        {/* Footer Note */}
        <p className={styles.footerNote}>
          Thank you for experiencing this satirical art project. No actual applications were
          processed in the making of this experience.
        </p>
      </div>
    </div>
  );
}
