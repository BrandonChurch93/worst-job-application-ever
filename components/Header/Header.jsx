'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Briefcase, Heart, Users } from 'lucide-react';
import Logo from '@/components/Logo';
import styles from './Header.module.css';

/**
 * Header Component - Mandatory Optional Overtime LLC
 *
 * Premium header with glassmorphism styling and hover mega menus.
 * Features:
 * - Smooth hover-triggered dropdowns (with gap bridging)
 * - Mobile hamburger menu
 * - No Apply Now button (CTA is in Hero/Disclaimer)
 */

const navItems = [
  {
    label: 'Careers',
    icon: Briefcase,
    sections: [
      {
        title: 'Open Positions',
        links: ['Senior Burnout Specialist', 'Chief Synergy Officer', 'Unpaid Intern (CEO Track)', 'Meeting Scheduler III']
      },
      {
        title: 'Departments',
        links: ['Mandatory Fun Committee', 'Blame Delegation', 'Passive Aggressive HR', 'Buzzword Engineering']
      }
    ]
  },
  {
    label: 'Culture',
    icon: Heart,
    sections: [
      {
        title: 'Our Values',
        links: ['Work-Life Imbalance', 'Aggressive Collaboration', 'Transparent Opacity', 'Sustainable Burnout']
      },
      {
        title: 'Perks & Benefits',
        links: ['Unlimited PTO (Don\'t Use It)', 'Free Snacks (Expired)', 'Ping Pong Table (Broken)', 'Team Building (Mandatory)']
      }
    ]
  },
  {
    label: 'About',
    icon: Users,
    sections: [
      {
        title: 'Our Story',
        links: ['Founded on a Pivot', 'Mission & Vision (TBD)', 'Leadership (Rotating)', 'Press (We Wish)']
      },
      {
        title: 'Recognition',
        links: ['Best Place to Work*', 'Innovation Award**', 'Employee Satisfaction***', 'Glassdoor Rating****']
      }
    ]
  }
];

export default function Header({ onNavClick, onBeginApplication }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef(null);

  // Trigger load animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll state for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, label) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(label);
    }
  };

  // Use timeouts to handle hover state with gap bridging
  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay allows mouse to reach dropdown
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${loaded ? styles.loaded : ''}`}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <a href="#" className={styles.logo} onClick={(e) => handleNavClick(e, 'Home')}>
            <Logo className={styles.logoIcon} />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>M.O.O.</span>
              <span className={styles.logoFull}>Mandatory Optional Overtime</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navItems.map((item, index) => (
              <div
                key={item.label}
                className={`${styles.navItem} ${activeDropdown === index ? styles.navItemActive : ''}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`${styles.navButton} ${activeDropdown === index ? styles.active : ''}`}
                  aria-expanded={activeDropdown === index}
                  aria-haspopup="true"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={14}
                    className={`${styles.chevron} ${activeDropdown === index ? styles.rotated : ''}`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                <div
                  className={`${styles.megaMenu} ${activeDropdown === index ? styles.visible : ''}`}
                >
                  <div className={styles.megaMenuInner}>
                    {item.sections.map((section, sIdx) => (
                      <div key={sIdx} className={styles.megaMenuSection}>
                        <h4 className={styles.sectionTitle}>{section.title}</h4>
                        <ul className={styles.sectionLinks}>
                          {section.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <a
                                href="#"
                                className={styles.megaLink}
                                onClick={(e) => handleNavClick(e, link)}
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className={styles.megaMenuFooter}>
                      <span className={styles.megaMenuNote}>* Terms and Whose Reality Apply</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Desktop CTA Button */}
            <button className={styles.headerCta} onClick={onBeginApplication}>
              Apply for a Job
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Outside header to avoid stacking context issues */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navItems.map((item) => (
            <div key={item.label} className={styles.mobileNavItem}>
              <button
                className={styles.mobileNavButton}
                onClick={(e) => {
                  handleNavClick(e, item.label);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Mobile CTA Button */}
        <button
          className={styles.mobileCta}
          onClick={() => {
            setMobileMenuOpen(false);
            if (onBeginApplication) onBeginApplication();
          }}
        >
          Apply for a Job
        </button>

        {/* Mobile Footer Note */}
        <p className={styles.mobileNote}>
          Ready to embrace the chaos?
        </p>
      </div>
    </>
  );
}
