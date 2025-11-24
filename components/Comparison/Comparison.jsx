'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X, Minus } from 'lucide-react';
import styles from './Comparison.module.css';

/**
 * Comparison Section - "Why Choose Us?"
 *
 * A comparison table showing "Us vs. Functional Employers"
 * Features:
 * - Animated checkmarks and X marks
 * - Row hover highlights
 * - Staggered row reveals on scroll
 * - Footnotes for asterisked items
 */

const comparisonData = [
  {
    feature: 'Unlimited PTO',
    us: { value: true, note: '*' },
    them: { value: true, note: null },
  },
  {
    feature: 'Actually Unlimited',
    us: { value: false, note: null },
    them: { value: true, note: null },
  },
  {
    feature: 'Remote Work',
    us: { value: 'text', text: '"Flexible"', note: '**' },
    them: { value: true, note: null },
  },
  {
    feature: 'Competitive Salary',
    us: { value: true, note: '***' },
    them: { value: true, note: null },
  },
  {
    feature: 'Living Wage',
    us: { value: 'text', text: 'Technically Not Illegal', note: null },
    them: { value: true, note: null },
  },
  {
    feature: 'Health Insurance',
    us: { value: 'text', text: 'Meditation App (Free Tier)', note: null },
    them: { value: true, note: null },
  },
  {
    feature: '401(k) Match',
    us: { value: 'text', text: "We'll Match Your Energy™", note: null },
    them: { value: true, note: null },
  },
  {
    feature: 'Work-Life Balance',
    us: { value: 'text', text: 'Error 404', note: null },
    them: { value: true, note: null },
  },
  {
    feature: 'Clear Career Path',
    us: { value: 'text', text: 'Career Labyrinth', note: null },
    them: { value: true, note: null },
  },
  {
    feature: 'Responds to Applications',
    us: { value: 'text', text: 'lol', note: null },
    them: { value: true, note: null },
  },
];

const footnotes = [
  { marker: '*', text: "Unlimited if you don't count the guilt." },
  { marker: '**', text: "Flexible means we're flexible about when you come to the office." },
  { marker: '***', text: 'Competitive with 2003 salary data, adjusted for our benefit.' },
];

// Cell value renderer
const CellValue = ({ data, isUs }) => {
  if (data.value === true) {
    return (
      <span className={`${styles.cellIcon} ${isUs ? styles.checkUs : styles.checkThem}`}>
        <Check size={18} strokeWidth={2.5} />
        {data.note && <span className={styles.noteMarker}>{data.note}</span>}
      </span>
    );
  }

  if (data.value === false) {
    return (
      <span className={`${styles.cellIcon} ${styles.xMark}`}>
        <X size={18} strokeWidth={2.5} />
      </span>
    );
  }

  if (data.value === 'text') {
    return (
      <span className={`${styles.cellText} ${isUs ? styles.textUs : ''}`}>
        {data.text}
        {data.note && <span className={styles.noteMarker}>{data.note}</span>}
      </span>
    );
  }

  return <Minus size={16} className={styles.dash} />;
};

// Table row component
const TableRow = ({ row, index, isVisible }) => {
  return (
    <tr
      className={`${styles.row} ${isVisible ? styles.visible : ''}`}
      style={{ '--delay': `${index * 0.05}s` }}
    >
      <td className={styles.featureCell}>{row.feature}</td>
      <td className={styles.valueCell}>
        <CellValue data={row.us} isUs={true} />
      </td>
      <td className={styles.valueCell}>
        <CellValue data={row.them} isUs={false} />
      </td>
    </tr>
  );
};

export default function Comparison() {
  const sectionRef = useRef(null);
  const tableRef = useRef(null);
  const [visibleRows, setVisibleRows] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger all rows to animate in sequence
            comparisonData.forEach((_, index) => {
              setTimeout(() => {
                setVisibleRows((prev) => new Set([...prev, index]));
              }, index * 80);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background */}
      <div className={styles.backgroundGlow}></div>

      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.eyebrow}>The Competition</span>
        <h2 className={styles.title}>
          Why Choose <span className={styles.titleAccent}>Us?</span>
        </h2>
        <p className={styles.subtitle}>
          A fair and balanced comparison. <span className={styles.subtitleNote}>(We wrote it.)</span>
        </p>
      </div>

      {/* Comparison Table */}
      <div className={styles.tableWrapper}>
        <table ref={tableRef} className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.featureHeader}>Feature</th>
              <th className={styles.companyHeader}>
                <span className={styles.companyName}>Mandatory Optional Overtime</span>
                <span className={styles.companySubtext}>LLC</span>
              </th>
              <th className={styles.companyHeader}>
                <span className={styles.companyName}>Functional Employers</span>
                <span className={styles.companySubtext}>Everywhere Else</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <TableRow
                key={row.feature}
                row={row}
                index={index}
                isVisible={visibleRows.has(index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footnotes */}
      <div className={styles.footnotes}>
        {footnotes.map((note) => (
          <p key={note.marker} className={styles.footnote}>
            <span className={styles.footnoteMarker}>{note.marker}</span>
            {note.text}
          </p>
        ))}
      </div>
    </section>
  );
}
