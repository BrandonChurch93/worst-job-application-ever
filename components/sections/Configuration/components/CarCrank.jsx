'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './CarCrank.module.css';

/**
 * CarCrank Component
 *
 * Tedious car crank interaction for volume control
 * User must manually rotate the crank to reach exactly 50%
 * Each full rotation (360°) = 10% volume increase
 *
 * @param {number} value - Current volume value (0-100)
 * @param {function} onChange - Callback when value changes
 */
export default function CarCrank({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const crankRef = useRef(null);
  const containerRef = useRef(null);
  const lastAngleRef = useRef(0);
  const totalRotationRef = useRef(0);

  // Calculate angle from mouse position relative to crank center
  const calculateAngle = (clientX, clientY) => {
    if (!containerRef.current) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const angle = calculateAngle(e.clientX, e.clientY);
    lastAngleRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentAngle = calculateAngle(e.clientX, e.clientY);
    let deltaAngle = currentAngle - lastAngleRef.current;

    // Handle angle wrap-around (crossing 180° / -180° boundary)
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    // Only allow clockwise rotation
    if (deltaAngle > 0) {
      totalRotationRef.current += deltaAngle;
      setRotation(totalRotationRef.current);

      // Calculate volume: 10% per full rotation (360°)
      const newVolume = Math.min(100, Math.floor((totalRotationRef.current / 360) * 10));
      onChange(newVolume);
    }

    lastAngleRef.current = currentAngle;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
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
    let deltaAngle = currentAngle - lastAngleRef.current;

    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    if (deltaAngle > 0) {
      totalRotationRef.current += deltaAngle;
      setRotation(totalRotationRef.current);

      const newVolume = Math.min(100, Math.floor((totalRotationRef.current / 360) * 10));
      onChange(newVolume);
    }

    lastAngleRef.current = currentAngle;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add/remove global event listeners
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
  }, [isDragging]);

  return (
    <div className={styles.container}>
      <div className={styles.instructions}>
        <p>Rotate the crank clockwise to adjust volume</p>
        <p className={styles.hint}>Target: 50% (5 full rotations)</p>
      </div>

      <div
        ref={containerRef}
        className={styles.crankContainer}
      >
        {/* Base plate */}
        <div className={styles.basePlate}>
          <div className={styles.baseCenter}></div>
          {/* Tick marks */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={styles.tickMark}
              style={{
                transform: `rotate(${i * 30}deg) translateY(-70px)`
              }}
            />
          ))}
        </div>

        {/* Rotating crank */}
        <div
          ref={crankRef}
          className={`${styles.crank} ${isDragging ? styles.dragging : ''}`}
          style={{
            transform: `rotate(${rotation}deg)`
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Crank arm */}
          <div className={styles.crankArm}></div>

          {/* Crank handle */}
          <div className={styles.crankHandle}>
            <div className={styles.handleGrip}></div>
          </div>

          {/* Center bolt */}
          <div className={styles.centerBolt}></div>
        </div>

        {/* Volume indicator */}
        <div className={styles.volumeIndicator}>
          <span className={styles.volumeValue}>{value}%</span>
        </div>
      </div>

      {/* Rotation counter */}
      <div className={styles.rotationCounter}>
        <span className={styles.counterLabel}>Rotations:</span>
        <span className={styles.counterValue}>
          {(totalRotationRef.current / 360).toFixed(1)}
        </span>
      </div>
    </div>
  );
}
