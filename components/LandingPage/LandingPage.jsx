'use client';

import { useState } from 'react';
import useAppStore from '@/store/appStore';
import Header from '@/components/Header/Header';
import NavModal from '@/components/Header/NavModal';
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress';
import Hero from '@/components/Hero/Hero';
import Marquee from '@/components/Marquee/Marquee';
import WhyJoinUs from '@/components/WhyJoinUs/WhyJoinUs';
import Testimonials from '@/components/Testimonials/Testimonials';
import Awards from '@/components/Awards/Awards';
import FAQ from '@/components/FAQ/FAQ';
import Disclaimer from '@/components/Disclaimer/Disclaimer';
import Footer from '@/components/Footer/Footer';
import styles from './LandingPage.module.css';

/**
 * LandingPage Component
 *
 * The initial landing page before the application starts
 * Features:
 * - Premium Header with decorative mega menu
 * - Hero Section with company branding
 * - Marquee ticker with satirical corporate messaging
 * - Why Join Us benefits showcase
 * - Testimonials from "former employees"
 * - Awards & Recognition with satirical accolades
 * - FAQ section
 * - Disclaimer (breaks character for transparency)
 * - Footer with easter eggs
 */
export default function LandingPage() {
  const startApplication = useAppStore((state) => state.startApplication);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedNavItem, setClickedNavItem] = useState(null);

  const handleNavClick = (item) => {
    setClickedNavItem(item);
    setModalOpen(true);
  };

  return (
    <div className={styles.landingPage}>
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Header */}
      <Header onNavClick={handleNavClick} onBeginApplication={startApplication} />

      {/* Nav Modal */}
      <NavModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        clickedItem={clickedNavItem}
      />

      {/* Hero Section */}
      <Hero onBeginApplication={startApplication} />

      {/* Marquee Ticker */}
      <Marquee />

      {/* Why Join Us Section */}
      <WhyJoinUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Awards & Recognition */}
      <Awards />

      {/* FAQ Section */}
      <FAQ />

      {/* Disclaimer + Final CTA */}
      <Disclaimer onBeginApplication={startApplication} />

      {/* Footer */}
      <Footer onNavClick={handleNavClick} />
    </div>
  );
}
