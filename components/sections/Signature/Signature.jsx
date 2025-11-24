'use client';

import { useState, useEffect } from 'react';
import { PenTool } from 'lucide-react';
import useAppStore from '@/store/appStore';
import Section from '@/components/Section/Section';
import RequirementsCard from '@/components/RequirementsCard/RequirementsCard';
import styles from './Signature.module.css';

/**
 * Signature Section (Placeholder)
 *
 * User must type their signature (3+ characters)
 * In Phase 2, this will be replaced with Etch A Sketch component
 */
export default function Signature() {
  const [signature, setSignature] = useState('');

  const currentSection = useAppStore((state) => state.currentSection);
  const requirements = useAppStore((state) => state.sectionRequirements.signature);
  const markRequirementComplete = useAppStore((state) => state.markRequirementComplete);
  const updateFormData = useAppStore((state) => state.updateFormData);
  const isSectionComplete = useAppStore((state) => state.isSectionComplete('signature'));

  const isActive = currentSection === 'signature';

  // Validate signature (3+ characters for placeholder)
  useEffect(() => {
    if (signature.trim().length >= 3) {
      markRequirementComplete('signature', 'sign');
      updateFormData('signature', signature);
    }
  }, [signature, markRequirementComplete, updateFormData]);

  return (
    <Section show={isActive}>
      <RequirementsCard requirements={requirements} allComplete={isSectionComplete} />

      <div className={`${styles.signatureCard} liquid-glass`}>
        <div className={styles.cardHeader}>
          <PenTool size={24} className={styles.headerIcon} />
          <div>
            <h2 className={styles.cardTitle}>Digital Signature</h2>
            <p className={styles.cardSubtitle}>
              Please provide your legally binding signature
            </p>
          </div>
        </div>

        <div className={styles.signatureArea}>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type your signature here..."
            className={styles.input}
          />
          <span className={styles.hint}>Minimum 3 characters</span>
        </div>

        <p className={styles.disclaimer}>
          This signature will be used for all legal documentation and cannot be revoked across any dimension of spacetime.
        </p>
      </div>
    </Section>
  );
}
