'use client';

import { useState, useEffect } from 'react';
import { Volume2, Sun } from 'lucide-react';
import useAppStore from '@/store/appStore';
import Section from '@/components/Section/Section';
import RequirementsCard from '@/components/RequirementsCard/RequirementsCard';
import CarCrank from './components/CarCrank';
import RotaryDial from './components/RotaryDial';
import styles from './Configuration.module.css';

/**
 * Configuration Section
 *
 * User must:
 * - Crank the car crank to 50% volume (5 full rotations)
 * - Rotate the dial to position 7 to enable brightness
 */
export default function Configuration() {
  const [volume, setVolume] = useState(0);
  const [brightnessEnabled, setBrightnessEnabled] = useState(false);

  const currentSection = useAppStore((state) => state.currentSection);
  const requirements = useAppStore((state) => state.sectionRequirements.configuration);
  const markRequirementComplete = useAppStore((state) => state.markRequirementComplete);
  const isSectionComplete = useAppStore((state) => state.isSectionComplete('configuration'));

  const isActive = currentSection === 'configuration';

  // Check volume requirement (must be exactly 50%)
  useEffect(() => {
    if (volume === 50) {
      markRequirementComplete('configuration', 'volume');
    }
  }, [volume, markRequirementComplete]);

  // Check brightness requirement
  useEffect(() => {
    if (brightnessEnabled) {
      markRequirementComplete('configuration', 'brightness');
    }
  }, [brightnessEnabled, markRequirementComplete]);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleBrightnessChange = (enabled) => {
    setBrightnessEnabled(enabled);
  };

  return (
    <Section show={isActive}>
      <RequirementsCard requirements={requirements} allComplete={isSectionComplete} />

      <div className={`${styles.controlsCard} liquid-glass`}>
        <h2 className={styles.cardTitle}>System Configuration</h2>
        <p className={styles.cardSubtitle}>
          Please configure your system settings to optimal parameters
        </p>

        <div className={styles.controls}>
          {/* Car Crank Volume Control */}
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <div className={styles.controlLabel}>
                <Volume2 size={20} className={styles.controlIcon} />
                <span>Audio Volume Configuration</span>
              </div>
            </div>

            <CarCrank value={volume} onChange={handleVolumeChange} />
          </div>

          {/* Rotary Dial Brightness Control */}
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <div className={styles.controlLabel}>
                <Sun size={20} className={styles.controlIcon} />
                <span>Brightness Optimization</span>
              </div>
            </div>

            <RotaryDial enabled={brightnessEnabled} onChange={handleBrightnessChange} />
          </div>
        </div>
      </div>
    </Section>
  );
}
