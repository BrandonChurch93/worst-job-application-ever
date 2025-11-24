'use client';

import { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import useAppStore from '@/store/appStore';
import Section from '@/components/Section/Section';
import RequirementsCard from '@/components/RequirementsCard/RequirementsCard';
import styles from './Terms.module.css';

/**
 * Terms & Conditions Section
 *
 * User must:
 * - Scroll to the bottom of the terms
 * - Check the agreement checkbox (disabled until scrolled)
 */
export default function Terms() {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const scrollContainerRef = useRef(null);

  const currentSection = useAppStore((state) => state.currentSection);
  const requirements = useAppStore((state) => state.sectionRequirements.terms);
  const markRequirementComplete = useAppStore((state) => state.markRequirementComplete);
  const isSectionComplete = useAppStore((state) => state.isSectionComplete('terms'));

  const isActive = currentSection === 'terms';

  // Check if user has scrolled to bottom
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      markRequirementComplete('terms', 'scroll');
    }
  };

  const handleAgreeChange = (e) => {
    if (e.target.checked && hasScrolledToBottom) {
      setHasAgreed(true);
      markRequirementComplete('terms', 'agree');
    }
  };

  return (
    <Section show={isActive}>
      <RequirementsCard requirements={requirements} allComplete={isSectionComplete} />

      <div className={`${styles.termsCard} liquid-glass`}>
        <div className={styles.cardHeader}>
          <FileText size={24} className={styles.headerIcon} />
          <div>
            <h2 className={styles.cardTitle}>Terms & Conditions</h2>
            <p className={styles.cardSubtitle}>Please review our comprehensive legal documentation</p>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={styles.scrollContainer}
        >
          <div className={styles.termsContent}>
            <h3 className={styles.sectionTitle}>1. Acceptance of Terms</h3>
            <p className={styles.paragraph}>
              By initiating this application process, you hereby acknowledge and irrevocably consent
              to be bound by these Terms and Conditions in perpetuity, across all dimensions of
              spacetime, and within any parallel universes that may or may not exist. Your continued
              participation constitutes acceptance of all provisions herein, whether you've read them
              or not, understood them or not, or agree with them or not.
            </p>

            <h3 className={styles.sectionTitle}>2. Data Collection & Privacy</h3>
            <p className={styles.paragraph}>
              We collect, process, and store an unnecessarily comprehensive array of data points
              including but not limited to: your full legal name, aliases, nicknames, social media
              handles, favorite colors, breakfast preferences, and the exact coordinates of your
              childhood home. This data will be meticulously organized, categorized, and stored in
              our secure database, which we promise to occasionally remember to back up.
            </p>

            <h3 className={styles.sectionTitle}>3. Application Processing Time</h3>
            <p className={styles.paragraph}>
              Your application will be processed with the utmost care and attention, utilizing our
              proprietary review algorithm that combines advanced machine learning, a magic 8-ball,
              and the alignment of celestial bodies. Processing times typically range from 3-5
              business days to several geological epochs, depending on current Mercury retrograde
              conditions.
            </p>

            <h3 className={styles.sectionTitle}>4. Liability Limitations</h3>
            <p className={styles.paragraph}>
              Under no circumstances shall we be liable for any direct, indirect, incidental,
              consequential, special, exemplary, punitive, or cosmic damages arising from your use of
              this application system. This includes but is not limited to: frustration, existential
              dread, carpal tunnel syndrome, coffee spills caused by rage-clicking, or spontaneous
              combustion.
            </p>

            <h3 className={styles.sectionTitle}>5. Modification Rights</h3>
            <p className={styles.paragraph}>
              We reserve the right to modify, amend, update, revise, rewrite, reimagine, or
              completely obliterate these terms at any time, for any reason, or for no reason at all.
              Such modifications will become effective immediately upon posting, retroactively to the
              beginning of time, and will apply to all past, present, and future applicants across
              all possible timelines.
            </p>

            <h3 className={styles.sectionTitle}>6. Dispute Resolution</h3>
            <p className={styles.paragraph}>
              Any disputes arising from these terms shall be resolved through binding arbitration
              conducted in a location of our choosing, in a language you may or may not speak, with
              arbitrators selected by a complex algorithm involving dice, tarot cards, and a
              particularly opinionated parrot named Gerald.
            </p>

            <h3 className={styles.sectionTitle}>7. Acknowledgment</h3>
            <p className={styles.paragraph}>
              By scrolling to this point, you acknowledge that this is a satirical art project
              designed to highlight the absurdity of modern digital interactions and unnecessarily
              complex user experiences. No actual employment is being offered, and your data is not
              being collected (beyond what your browser naturally does). You also acknowledge that
              you've spent valuable minutes of your life reading this fictional legal document, and
              for that, we are genuinely sorry but also somewhat impressed by your dedication.
            </p>
          </div>
        </div>

        <div className={styles.agreementSection}>
          <label
            className={`${styles.checkboxLabel} ${!hasScrolledToBottom ? styles.disabled : ''}`}
          >
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={handleAgreeChange}
              disabled={!hasScrolledToBottom}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              I have read and agree to the Terms and Conditions
              {!hasScrolledToBottom && (
                <span className={styles.scrollHint}> (scroll to bottom to enable)</span>
              )}
            </span>
          </label>
        </div>
      </div>
    </Section>
  );
}
