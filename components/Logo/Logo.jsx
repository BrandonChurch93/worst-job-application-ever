'use client';

import styles from './Logo.module.css';

/**
 * Logo Component - Mandatory Optional Overtime LLC
 *
 * An angry cow logo representing the overworked spirit of M.O.O.
 * Features steam coming from nostrils and an angry expression.
 *
 * @param {number} size - Width of the logo (height auto-scales)
 * @param {string} className - Additional CSS classes
 */
export default function Logo({ size, className = '' }) {
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <div
      className={`${styles.logoWrapper} ${className}`}
      style={sizeStyle}
    >
      <svg
        viewBox="0 0 500 400"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logo}
      >
        {/* Head - main body */}
        <ellipse
          cx="280"
          cy="200"
          rx="140"
          ry="120"
          fill="#ea580c"
          stroke="#c2410c"
          strokeWidth="3"
        />

        {/* Snout/nose area pointing up-right */}
        <ellipse
          cx="380"
          cy="160"
          rx="60"
          ry="50"
          fill="#f59e0b"
          stroke="#c2410c"
          strokeWidth="3"
        />

        {/* Nostrils */}
        <ellipse cx="370" cy="150" rx="12" ry="18" fill="#1c1917" />
        <ellipse cx="400" cy="145" rx="12" ry="18" fill="#1c1917" />

        {/* Steam from nostrils */}
        <g className={styles.steam} opacity="0.7">
          <path
            d="M 370 140 Q 365 120 370 100"
            stroke="#fafaf9"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 400 135 Q 405 115 400 95"
            stroke="#fafaf9"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Open mouth - yelling */}
        <path
          d="M 420 170 Q 440 190 430 210 Q 420 220 400 215 L 390 180 Z"
          fill="#1c1917"
          stroke="#c2410c"
          strokeWidth="2"
        />

        {/* Tongue inside mouth */}
        <ellipse
          cx="410"
          cy="200"
          rx="15"
          ry="12"
          fill="#c84c28"
        />

        {/* Lower jaw line */}
        <path
          d="M 380 220 Q 340 240 300 245"
          stroke="#c2410c"
          strokeWidth="3"
          fill="none"
        />

        {/* Ear */}
        <ellipse
          cx="220"
          cy="150"
          rx="35"
          ry="55"
          fill="#f59e0b"
          stroke="#c2410c"
          strokeWidth="3"
          transform="rotate(-20 220 150)"
        />
        <ellipse
          cx="220"
          cy="155"
          rx="18"
          ry="35"
          fill="#fb923c"
          transform="rotate(-20 220 155)"
        />

        {/* Angry eye */}
        <g>
          {/* Eye white */}
          <ellipse
            cx="300"
            cy="180"
            rx="28"
            ry="22"
            fill="#fafaf9"
          />
          {/* Pupil - angry/determined */}
          <circle
            cx="310"
            cy="180"
            r="14"
            fill="#1c1917"
          />
          {/* Highlight */}
          <circle
            cx="315"
            cy="175"
            r="5"
            fill="#fafaf9"
          />
          {/* Angry eyebrow */}
          <path
            className={styles.eyebrow}
            d="M 265 160 L 330 165"
            stroke="#c2410c"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        {/* Horn 1 - left horn */}
        <path
          d="M 250 100 Q 242 70 248 45 Q 253 40 258 45 Q 262 70 258 100"
          fill="#d6d3d1"
          stroke="#a8a29e"
          strokeWidth="2"
        />

        {/* Horn 2 - right horn */}
        <path
          d="M 310 95 Q 305 65 311 40 Q 316 35 321 40 Q 325 65 318 95"
          fill="#d6d3d1"
          stroke="#a8a29e"
          strokeWidth="2"
        />

        {/* Cow spots */}
        <ellipse
          cx="185"
          cy="220"
          rx="20"
          ry="28"
          fill="#c2410c"
          opacity="0.6"
          transform="rotate(10 185 220)"
        />
        <ellipse
          cx="270"
          cy="250"
          rx="28"
          ry="18"
          fill="#c2410c"
          opacity="0.6"
          transform="rotate(-5 270 250)"
        />
      </svg>
    </div>
  );
}
