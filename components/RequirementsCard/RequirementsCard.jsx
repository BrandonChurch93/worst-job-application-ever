'use client';

import RequirementItem from './RequirementItem';
import styles from './RequirementsCard.module.css';

/**
 * RequirementsCard Component
 *
 * Displays section requirements with progress tracking
 *
 * @param {Array} requirements - Array of requirement objects { id, label, complete }
 * @param {boolean} allComplete - Whether all requirements are satisfied
 */
export default function RequirementsCard({ requirements, allComplete = false }) {
  const completedCount = requirements.filter((req) => req.complete).length;
  const totalCount = requirements.length;

  return (
    <div className={`${styles.card} liquid-glass ${allComplete ? styles.complete : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {allComplete ? 'ALL REQUIREMENTS SATISFIED' : 'REQUIREMENTS'}
        </h3>
      </div>

      <div className={styles.list}>
        {requirements.map((req) => (
          <RequirementItem key={req.id} label={req.label} complete={req.complete} />
        ))}
      </div>

      <div className={styles.progress}>
        <span className={styles.progressText}>
          Progress: {completedCount}/{totalCount} complete
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {allComplete && (
        <div className={styles.completeMessage}>
          <span className={styles.emoji}>🎉</span>
          <span className={styles.proceedingText}>Proceeding to next section...</span>
        </div>
      )}
    </div>
  );
}
