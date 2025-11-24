'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail } from 'lucide-react';
import useAppStore from '@/store/appStore';
import Section from '@/components/Section/Section';
import RequirementsCard from '@/components/RequirementsCard/RequirementsCard';
import styles from './Form.module.css';

/**
 * Form Section
 *
 * User must provide:
 * - Full name (3+ characters)
 * - Phone number (10 digits)
 * - Email address (valid format)
 */
export default function Form() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const currentSection = useAppStore((state) => state.currentSection);
  const requirements = useAppStore((state) => state.sectionRequirements.form);
  const markRequirementComplete = useAppStore((state) => state.markRequirementComplete);
  const updateFormData = useAppStore((state) => state.updateFormData);
  const isSectionComplete = useAppStore((state) => state.isSectionComplete('form'));

  const isActive = currentSection === 'form';

  // Validate name (3+ characters)
  useEffect(() => {
    if (name.trim().length >= 3) {
      markRequirementComplete('form', 'name');
      updateFormData('name', name);
    }
  }, [name, markRequirementComplete, updateFormData]);

  // Validate phone (10 digits)
  useEffect(() => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      markRequirementComplete('form', 'phone');
      updateFormData('phone', phone);
    }
  }, [phone, markRequirementComplete, updateFormData]);

  // Validate email (basic format check)
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      markRequirementComplete('form', 'email');
      updateFormData('email', email);
    }
  }, [email, markRequirementComplete, updateFormData]);

  const handlePhoneChange = (e) => {
    // Auto-format phone number
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;

    if (value.length > 3 && value.length <= 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }

    setPhone(formatted);
  };

  return (
    <Section show={isActive}>
      <RequirementsCard requirements={requirements} allComplete={isSectionComplete} />

      <div className={`${styles.formCard} liquid-glass`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Personal Information</h2>
          <p className={styles.cardSubtitle}>
            Please provide your details for our comprehensive records
          </p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* Name Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              <User size={18} className={styles.labelIcon} />
              <span>Full Legal Name</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={styles.input}
            />
            <span className={styles.hint}>Minimum 3 characters required</span>
          </div>

          {/* Phone Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="phone" className={styles.label}>
              <Phone size={18} className={styles.labelIcon} />
              <span>Contact Number</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className={styles.input}
              maxLength={14}
            />
            <span className={styles.hint}>10-digit phone number</span>
          </div>

          {/* Email Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={18} className={styles.labelIcon} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={styles.input}
            />
            <span className={styles.hint}>Valid email format required</span>
          </div>
        </form>
      </div>
    </Section>
  );
}
