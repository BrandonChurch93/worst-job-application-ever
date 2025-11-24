'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import styles from './FAQ.module.css';

/**
 * FAQ Section - "Questions We'd Rather You Not Ask"
 *
 * Accordion-style FAQ with satirical Q&A pairs.
 * Features:
 * - Smooth expand/collapse animations
 * - One item open at a time (optional)
 * - Staggered reveal on scroll
 * - Hover effects
 */

const faqs = [
  {
    id: 1,
    question: 'Is this a real job?',
    answer: "Define 'real.' Define 'job.' Actually, don't. Just apply and find out. Or don't. We're not your career counselor.",
  },
  {
    id: 2,
    question: "What's the salary?",
    answer: "Competitive.™ We've compared our salaries to unpaid internships in 2003 and adjusted for inflation (downward). You'll be thrilled to learn you'll make money. Some of it.",
  },
  {
    id: 3,
    question: 'Why should I apply?',
    answer: "You probably shouldn't. And yet, here you are, reading a FAQ on a satirical job application. That tells us everything we need to know about your decision-making skills. You'll fit right in.",
  },
  {
    id: 4,
    question: 'Do you offer remote work?',
    answer: "Absolutely! Work from anywhere in the world, as long as you're available 24/7, respond to Slack within 3 minutes, and your 'anywhere' is within a 15-minute commute of the office for 'occasional' in-person syncs.",
  },
  {
    id: 5,
    question: 'How long does the application take?',
    answer: "The application itself takes 12-15 minutes. The existential crisis afterward is free and lasts considerably longer. Budget accordingly.",
  },
  {
    id: 6,
    question: 'Will my data be collected?',
    answer: "No. Unlike actual corporations, we have no interest in your data, your browsing habits, or selling your information to third parties. Everything stays in your browser. We couldn't monetize you even if we wanted to. (We don't.)",
  },
  {
    id: 7,
    question: "What happens after I submit?",
    answer: "Nothing. This isn't a real application. You'll receive no confirmation email, no follow-up, and no rejection letter. Consider it a preview of applying to actual companies, but faster.",
  },
  {
    id: 8,
    question: 'Is this actually funny?',
    answer: "That depends entirely on your current employment situation. If you're job hunting, it's either cathartic or triggering. If you're happily employed, it's hilarious. If you're in HR, it's 'concerning.'",
  },
];

// Individual FAQ item component
const FAQItem = ({ faq, isOpen, onToggle, index, isVisible }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div
      className={`${styles.faqItem} ${isOpen ? styles.open : ''} ${isVisible ? styles.visible : ''}`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      <button
        className={styles.questionButton}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span className={styles.questionText}>{faq.question}</span>
        <span className={styles.chevron}>
          <ChevronDown size={20} />
        </span>
      </button>

      <div
        id={`faq-answer-${faq.id}`}
        className={styles.answerWrapper}
        style={{ maxHeight: isOpen ? `${height}px` : '0px' }}
      >
        <div ref={contentRef} className={styles.answerContent}>
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  const sectionRef = useRef(null);
  const [openId, setOpenId] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger all items to animate in sequence
            faqs.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => new Set([...prev, index]));
              }, index * 100);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background */}
      <div className={styles.backgroundGlow}></div>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>
          <HelpCircle size={14} />
          FAQ
        </span>
        <h2 className={styles.title}>
          Questions We'd Rather
          <br />
          <span className={styles.titleAccent}>You Not Ask</span>
        </h2>
        <p className={styles.subtitle}>
          But since you're going to anyway, here are some pre-written deflections.
        </p>
      </div>

      {/* FAQ List */}
      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => handleToggle(faq.id)}
            index={index}
            isVisible={visibleItems.has(index)}
          />
        ))}
      </div>

      {/* Bottom tagline */}
      <div className={styles.tagline}>
        <p>
          Still have questions? <span className={styles.highlight}>So do we.</span>
        </p>
      </div>
    </section>
  );
}
