'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import useAppStore from '@/store/appStore';
import Section from '@/components/Section/Section';
import RequirementsCard from '@/components/RequirementsCard/RequirementsCard';
import styles from './Captcha.module.css';

/**
 * CAPTCHA Section (Placeholder)
 *
 * User must click "I'm a human" button
 * In Phase 2, this will be replaced with Basketball CAPTCHA component
 */
export default function Captcha() {
  const [verified, setVerified] = useState(false);

  const currentSection = useAppStore((state) => state.currentSection);
  const requirements = useAppStore((state) => state.sectionRequirements.captcha);
  const markRequirementComplete = useAppStore((state) => state.markRequirementComplete);
  const isSectionComplete = useAppStore((state) => state.isSectionComplete('captcha'));

  const isActive = currentSection === 'captcha';

  const handleVerify = () => {
    setVerified(true);
    markRequirementComplete('captcha', 'verify');
  };

  return (
    <Section show={isActive}>
      <RequirementsCard requirements={requirements} allComplete={isSectionComplete} />

      <div className={`${styles.captchaCard} liquid-glass`}>
        <div className={styles.cardHeader}>
          <Shield size={24} className={styles.headerIcon} />
          <div>
            <h2 className={styles.cardTitle}>Human Verification</h2>
            <p className={styles.cardSubtitle}>
              Please confirm that you are a biological life form
            </p>
          </div>
        </div>

        <div className={styles.verificationArea}>
          {!verified ? (
            <button onClick={handleVerify} className={styles.verifyButton}>
              <Shield size={20} />
              <span>I'm a Human</span>
            </button>
          ) : (
            <div className={styles.verifiedMessage}>
              <div className={styles.checkmark}>✓</div>
              <span>Humanity Confirmed</span>
            </div>
          )}
        </div>

        <p className={styles.disclaimer}>
          This verification process uses advanced algorithms to distinguish humans from robots,
          aliens, and other sentient beings.
        </p>
      </div>
    </Section>
  );
}
