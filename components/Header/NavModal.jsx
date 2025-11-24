'use client';

import { useEffect } from 'react';
import { X, Clock, Coffee, AlertCircle } from 'lucide-react';
import styles from './NavModal.module.css';

/**
 * NavModal Component
 *
 * Displays a funny "coming soon" modal when users click on
 * the decorative navigation items.
 */

// Different funny responses based on what was clicked
const getModalContent = (clickedItem) => {
  const responses = {
    default: {
      icon: Clock,
      title: "This Feature Is Coming Soon™",
      body: "Our development team is hard at work. And by \"hard at work,\" we mean they're in a 4-hour meeting about having fewer meetings.",
      footer: "Estimated delivery: Right after the Q3 roadmap gets re-prioritized. Again.",
      buttonText: "Understood"
    },
    careers: {
      icon: AlertCircle,
      title: "Position Filled",
      body: "This role has been filled by the CEO's nephew. We appreciate your interest and will keep your resume on file for 0-3 business days.",
      footer: "Don't call us. We definitely won't call you.",
      buttonText: "Accept Rejection"
    },
    culture: {
      icon: Coffee,
      title: "Culture Is Loading...",
      body: "Our Culture page is being reviewed by Legal, HR, the Vibes Committee, and three external consultants who charge $500/hour to tell us what we already know.",
      footer: "In the meantime, please enjoy this reminder that we're like a family.",
      buttonText: "I Feel Valued"
    },
    about: {
      icon: Clock,
      title: "About Us (Redacted)",
      body: "Our company history is currently being \"reframed\" following our 7th pivot this quarter. Please check back when we figure out what we actually do.",
      footer: "Founded: Yes. By: Someone. For: Reasons.",
      buttonText: "Crystal Clear"
    },
    apply: {
      icon: AlertCircle,
      title: "Whoa There, Eager Beaver",
      body: "You'll need to complete our official application process first. Don't worry, it only takes 12-15 minutes of your life you'll never get back.",
      footer: "Scroll down to begin your journey toward voluntary mandatory overtime.",
      buttonText: "I'm Ready To Suffer"
    },
    home: {
      icon: Coffee,
      title: "You're Already Home",
      body: "This is it. You're looking at it. The homepage. The one you're on. Right now. This very moment.",
      footer: "We spent $40,000 on a consultant to tell us the logo should be 2px larger.",
      buttonText: "Money Well Spent"
    }
  };

  // Match clicked item to response category
  const item = clickedItem?.toLowerCase() || '';

  if (item.includes('career') || item.includes('position') || item.includes('senior') || item.includes('chief') || item.includes('intern') || item.includes('scheduler')) {
    return responses.careers;
  }
  if (item.includes('culture') || item.includes('value') || item.includes('perk') || item.includes('benefit') || item.includes('pto') || item.includes('snack')) {
    return responses.culture;
  }
  if (item.includes('about') || item.includes('story') || item.includes('mission') || item.includes('leadership') || item.includes('press') || item.includes('recognition') || item.includes('award') || item.includes('satisfaction') || item.includes('glassdoor')) {
    return responses.about;
  }
  if (item === 'apply' || item === 'apply now') {
    return responses.apply;
  }
  if (item === 'home') {
    return responses.home;
  }

  return responses.default;
};

export default function NavModal({ isOpen, onClose, clickedItem }) {
  const content = getModalContent(clickedItem);
  const IconComponent = content.icon;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Icon */}
        <div className={styles.iconWrapper}>
          <IconComponent size={32} />
        </div>

        {/* Content */}
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.body}>{content.body}</p>
        <p className={styles.footer}>{content.footer}</p>

        {/* Action Button */}
        <button className={styles.actionButton} onClick={onClose}>
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}
