'use client';

import useAppStore from '@/store/appStore';
import LandingPage from '@/components/LandingPage/LandingPage';
import TransitionText from '@/components/TransitionText/TransitionText';
import CelebrationOverlay from '@/components/CelebrationOverlay/CelebrationOverlay';
import StackingGame from '@/components/sections/StackingGame/StackingGame';
import Configuration from '@/components/sections/Configuration/Configuration';
import Terms from '@/components/sections/Terms/Terms';
import Form from '@/components/sections/Form/Form';
import Signature from '@/components/sections/Signature/Signature';
import Captcha from '@/components/sections/Captcha/Captcha';
import Success from '@/components/Success/Success';

/**
 * Main Application Page
 *
 * Handles view switching between:
 * - Landing page
 * - Transition text
 * - Active section
 * - Celebration overlay
 * - Success screen
 */
export default function Home() {
  const currentView = useAppStore((state) => state.currentView);
  const transitionText = useAppStore((state) => state.transitionText);
  const isCelebrating = useAppStore((state) => state.isCelebrating);
  const currentSection = useAppStore((state) => state.currentSection);

  return (
    <>
      {/* Landing Page */}
      {currentView === 'landing' && <LandingPage />}

      {/* Transition Text */}
      {currentView === 'transition' && <TransitionText text={transitionText} />}

      {/* Active Section */}
      {currentView === 'section' && (
        <>
          <StackingGame />
          <Configuration />
          <Terms />
          <Form />
          <Signature />
          <Captcha />
        </>
      )}

      {/* Success Screen */}
      {currentView === 'success' && <Success />}

      {/* Celebration Overlay */}
      <CelebrationOverlay show={isCelebrating} />
    </>
  );
}
