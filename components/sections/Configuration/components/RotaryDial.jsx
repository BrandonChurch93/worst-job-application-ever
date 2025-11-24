'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './RotaryDial.module.css';

/**
 * RotaryDial Component
 *
 * Tedious rotary dial interaction for brightness control
 * User must rotate to position 7 (out of 10) to enable brightness
 * Has click-stop positions like a real rotary dial
 *
 * @param {boolean} enabled - Whether brightness is enabled
 * @param {function} onChange - Callback when position changes to target
 */
export default function RotaryDial({ enabled, onChange }) {
  const TARGET_POSITION = 7; // Position that enables brightness
  const TOTAL_POSITIONS = 10;
  const DEGREES_PER_POSITION = 360 / TOTAL_POSITIONS; // 36°

  const [currentPosition, setCurrentPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef(null);
  const containerRef = useRef(null);
  const lastAngleRef = useRef(0);

  // Calculate angle from mouse position relative to dial center
  const calculateAngle = (clientX, clientY) => {
    if (!containerRef.current) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    // Normalize to 0-360
    angle = (angle + 90 + 360) % 360;
    return angle;
  };

  // Snap angle to nearest position
  const snapToPosition = (angle) => {
    const position = Math.round(angle / DEGREES_PER_POSITION) % TOTAL_POSITIONS;
    return position;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const angle = calculateAngle(e.clientX, e.clientY);
    lastAngleRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentAngle = calculateAngle(e.clientX, e.clientY);
    const newPosition = snapToPosition(currentAngle);

    if (newPosition !== currentPosition) {
      setCurrentPosition(newPosition);

      // Play click sound (placeholder for now)
      // TODO: Add Howler.js sound

      // Animate to snapped position
      const targetRotation = newPosition * DEGREES_PER_POSITION;
      gsap.to(dialRef.current, {
        rotation: targetRotation,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Check if target position reached
      if (newPosition === TARGET_POSITION && !enabled) {
        onChange(true);
      } else if (newPosition !== TARGET_POSITION && enabled) {
        onChange(false);
      }
    }

    lastAngleRef.current = currentAngle;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    const angle = calculateAngle(touch.clientX, touch.clientY);
    lastAngleRef.current = angle;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentAngle = calculateAngle(touch.clientX, touch.clientY);
    const newPosition = snapToPosition(currentAngle);

    if (newPosition !== currentPosition) {
      setCurrentPosition(newPosition);

      const targetRotation = newPosition * DEGREES_PER_POSITION;
      gsap.to(dialRef.current, {
        rotation: targetRotation,
        duration: 0.1,
        ease: 'power2.out'
      });

      if (newPosition === TARGET_POSITION && !enabled) {
        onChange(true);
      } else if (newPosition !== TARGET_POSITION && enabled) {
        onChange(false);
      }
    }

    lastAngleRef.current = currentAngle;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, currentPosition, enabled]);

  return (
    <div className={styles.container}>
      <div className={styles.instructions}>
        <p>Rotate the dial to position 7 to enable brightness optimization</p>
        <p className={styles.hint}>Current position: {currentPosition}</p>
      </div>

      <div
        ref={containerRef}
        className={styles.dialContainer}
      >
        {/* Outer ring with position markers */}
        <div className={styles.outerRing}>
          {[...Array(TOTAL_POSITIONS)].map((_, i) => (
            <div
              key={i}
              className={`${styles.positionMarker} ${i === TARGET_POSITION ? styles.target : ''}`}
              style={{
                transform: `rotate(${i * DEGREES_PER_POSITION}deg) translateY(-85px)`
              }}
            >
              <span className={styles.positionNumber}>{i}</span>
            </div>
          ))}
        </div>

        {/* Rotating dial */}
        <div
          ref={dialRef}
          className={`${styles.dial} ${isDragging ? styles.dragging : ''} ${enabled ? styles.enabled : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Dial face with texture */}
          <div className={styles.dialFace}>
            {/* Radial lines for grip texture */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={styles.gripLine}
                style={{
                  transform: `rotate(${i * 30}deg)`
                }}
              />
            ))}

            {/* Pointer indicator */}
            <div className={styles.pointer}></div>

            {/* Center cap */}
            <div className={styles.centerCap}></div>
          </div>
        </div>

        {/* Indicator arrow (fixed) */}
        <div className={styles.indicatorArrow}></div>
      </div>

      {/* Status display */}
      <div className={`${styles.statusDisplay} ${enabled ? styles.active : ''}`}>
        <span className={styles.statusText}>
          {enabled ? '✓ Brightness Enabled' : 'Rotate to position 7'}
        </span>
      </div>
    </div>
  );
}
