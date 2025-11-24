'use client';

import { Linkedin, Coffee, Heart, ExternalLink } from 'lucide-react';
import Logo from '@/components/Logo';
import styles from './Footer.module.css';

/**
 * Footer Component - Redesigned 2025
 *
 * Premium minimalist footer with satirical content
 * Features:
 * - Clean horizontal layout on desktop
 * - Stacked mobile-first design
 * - Integrated cow logo
 * - Links trigger NavModal (passed via onNavClick)
 * - Easter egg preserved
 */

const footerLinks = [
  { label: 'About', trigger: 'about' },
  { label: 'Careers', trigger: 'careers' },
  { label: 'Press', trigger: 'press' },
  { label: 'Contact', trigger: 'contact' },
  { label: 'Privacy', trigger: 'privacy' },
  { label: 'Terms', trigger: 'terms' },
];

export default function Footer({ onNavClick }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, trigger) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(trigger);
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Gradient Top Border */}
      <div className={styles.topBorder}></div>

      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoLink}>
              <Logo className={styles.logoIcon} />
              <div className={styles.brandText}>
                <span className={styles.brandName}>M.O.O.</span>
                <span className={styles.brandFull}>Mandatory Optional Overtime</span>
              </div>
            </div>
            <p className={styles.tagline}>
              Making simple things unnecessarily complicated since 2024.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className={styles.navSection}>
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={styles.navLink}
                onClick={(e) => handleLinkClick(e, link.trigger)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className={styles.socialSection}>
            <a
              href="https://www.linkedin.com/in/brandon-church-frontend/"
              className={styles.socialLink}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} Mandatory Optional Overtime LLC
            <span className={styles.copyrightNote}> (Not a real company)</span>
          </p>

          <div className={styles.creditSection}>
            <p className={styles.credit}>
              Made with <Coffee size={14} className={styles.iconCoffee} /> &{' '}
              <Heart size={14} className={styles.iconHeart} />
            </p>
            <span className={styles.creditDivider}>|</span>
            <a
              href="https://brandon-church-portfolio.vercel.app/"
              className={styles.developerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Developed by Brandon Church
              <ExternalLink size={12} className={styles.externalIcon} />
            </a>
          </div>
        </div>

        {/* Easter Egg */}
        <div className={styles.easterEgg}>
          <p>
            If you're reading this, you've scrolled to the absolute bottom. Impressive commitment.
            We'd hire you, but we're not hiring. We're not even a real company.
            But if we were, you'd definitely be on the shortlist for our "Professional Footer Reader" position.
          </p>
        </div>
      </div>
    </footer>
  );
}
