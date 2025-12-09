'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import { CheckCircle2, Check, AlertTriangle, Trophy, XCircle } from 'lucide-react';
import useAppStore from '@/store/appStore';
import Section from '@/components/Section/Section';
import styles from './StackingGame.module.css';

// ========================================================================
// ⚠️ CRITICAL: BLOCK SCALING SYSTEM - DO NOT MODIFY
// ========================================================================
// These values have been EXTENSIVELY TESTED and FINE-TUNED across:
// - iPhone 14 Pro Max (393px viewport)
// - iPad Mini (768px viewport, 600px canvas)
// - iPad Pro (834px viewport)
// - MacBook Pro 16" (1728px viewport, ~700px canvas)
// - 4K displays (3840px viewport)
//
// Each viewport has a specific blockScaleRatio that ensures exactly 10 blocks
// can stack vertically without collision issues. Changing these values will
// break the carefully calibrated physics and block placement.
//
// If you need to modify UI elements, adjust CSS only - NEVER touch:
// 1. REFERENCE_WIDTH / REFERENCE_HEIGHT constants
// 2. blockScaleRatio calculations in any viewport range
// 3. Canvas max-width / max-height / aspect-ratio in CSS
// 4. Spawn clearance calculations
// ========================================================================

const REFERENCE_WIDTH = 500; // ⚠️ DO NOT CHANGE
const REFERENCE_HEIGHT = 700; // ⚠️ DO NOT CHANGE

// ⚠️ CRITICAL: Object dimensions are part of the fine-tuned system
// These base dimensions work with blockScaleRatio to create proper block sizes
// DO NOT modify width/height values without extensive cross-viewport testing
const objectTypes = [
  {
    name: "Pizza Party (In Lieu of Raises)",
    width: 100, // ⚠️ DO NOT CHANGE
    height: 40, // ⚠️ DO NOT CHANGE
    color: "#ea580c", // Primary Orange
    type: "rect",
  },
  {
    name: "Unpaid Overtime",
    width: 90, // ⚠️ DO NOT CHANGE
    height: 55, // ⚠️ DO NOT CHANGE
    color: "#f59e0b", // Primary Amber
    type: "rect",
  },
  {
    name: "Wearing Multiple Hats",
    width: 95, // ⚠️ DO NOT CHANGE
    height: 35, // ⚠️ DO NOT CHANGE
    color: "#fb923c", // Primary Light Orange
    type: "rect",
  },
  {
    name: "Entry-Level (5 Years Required)",
    width: 90, // ⚠️ DO NOT CHANGE
    height: 45, // ⚠️ DO NOT CHANGE
    color: "#c84c28", // Terracotta
    type: "rect",
  },
  {
    name: "Reply-All Company Email",
    width: 85, // ⚠️ DO NOT CHANGE
    height: 60, // ⚠️ DO NOT CHANGE
    color: "#d6a24e", // Gold
    type: "rect",
  },
  {
    name: "Micromanagement",
    width: 75, // ⚠️ DO NOT CHANGE
    height: 55, // ⚠️ DO NOT CHANGE
    color: "#b45309", // Rust
    type: "rect",
  },
  {
    name: "Aggressive Deadlines",
    width: 70, // ⚠️ DO NOT CHANGE
    height: 50, // ⚠️ DO NOT CHANGE
    color: "#78350f", // Clay
    type: "rect",
  },
  {
    name: "Performance Improvement Plan",
    width: 65, // ⚠️ DO NOT CHANGE
    height: 80, // ⚠️ DO NOT CHANGE
    color: "#dc2626", // Deep Red
    type: "rect",
  },
  {
    name: "CEO's Motivational LinkedIn Post",
    width: 50, // ⚠️ DO NOT CHANGE
    height: 50, // ⚠️ DO NOT CHANGE
    color: "#ca8a04", // Golden Brown
    type: "circle",
  },
  {
    name: "Mandatory Team Building",
    width: 65, // ⚠️ DO NOT CHANGE
    height: 45, // ⚠️ DO NOT CHANGE
    color: "#92400e", // Dark Brown
    type: "lshape",
  },
];

// Block descriptions - conversational, challenging, sarcastic
// Block name is wrapped in <strong> tags for emphasis
const blockSentences = [
  "First up: <strong>Pizza Party (In Lieu of Raises)</strong>. Management's favorite.",
  "Here comes <strong>Unpaid Overtime</strong>. You weren't using those evenings anyway.",
  "<strong>Wearing Multiple Hats</strong>. Also known as 'we're understaffed.'",
  "<strong>Entry-Level (5 Years Required)</strong>. The math checks out. Trust us.",
  "The dreaded <strong>Reply-All Company Email</strong>. Everyone saw that.",
  "<strong>Micromanagement</strong>. We're watching. Always watching.",
  "<strong>Aggressive Deadlines</strong>. Due yesterday.",
  "<strong>Performance Improvement Plan</strong>. This is a warning.",
  "<strong>CEO's Motivational LinkedIn Post</strong>. Hustle. Grind. Family. 🙏",
  "Finally, <strong>Mandatory Team Building</strong>. Fun is now required.",
];

export default function StackingGame() {
  const currentSection = useAppStore((state) => state.currentSection);
  const markRequirementComplete = useAppStore((state) => state.markRequirementComplete);
  const isActive = currentSection === 'stackingGame';

  // Refs for DOM elements
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const particleContainerRef = useRef(null);
  const customCursorRef = useRef(null);
  const messageOverlayRef = useRef(null);
  const slowmoRef = useRef(null);
  const blockNameDisplayRef = useRef(null);
  const blockNameTextRef = useRef(null);
  const perfectFlashRef = useRef(null);
  const goodFlashRef = useRef(null);
  const thresholdFlashRef = useRef(null);
  const collapseFlashRef = useRef(null);
  const collapseVignetteRef = useRef(null);
  const winFlashRef = useRef(null);
  const winVignetteRef = useRef(null);
  const dangerBorderRef = useRef(null);
  const comboCounterRef = useRef(null);
  const comboValueRef = useRef(null);
  const progressFillRef = useRef(null);
  const progressTextRef = useRef(null);
  const stackedCountRef = useRef(null);
  const perfectCountRef = useRef(null);
  const comboCountRef = useRef(null);
  const gameOverScreenRef = useRef(null);
  const gameOverTitleRef = useRef(null);
  const gameOverMessageRef = useRef(null);
  const towerScreenshotRef = useRef(null);
  const finalTimeRef = useRef(null);
  const finalPerfectRef = useRef(null);
  const finalComboRef = useRef(null);
  const skipButtonRef = useRef(null);
  const restartButtonRef = useRef(null);
  const gameOverContentRef = useRef(null);
  const roastContentRef = useRef(null);

  // Matter.js refs
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const groundRef = useRef(null);
  const leftWallRef = useRef(null);
  const rightWallRef = useRef(null);

  // Audio context ref
  const audioContextRef = useRef(null);

  // Canvas dimension refs
  const canvasWidthRef = useRef(0);
  const canvasHeightRef = useRef(0);
  const scaleRatioRef = useRef(1);
  const blockScaleRatioRef = useRef(1);

  // Refs for physics loop (to avoid setState in every frame)
  const slideXRef = useRef(0);
  const slideDirectionRef = useRef(1);
  const slideSpeedRef = useRef(2.5);
  const slideMinXRef = useRef(0);
  const slideMaxXRef = useRef(0);
  const currentObjectRef = useRef(null);
  const isHoldingObjectRef = useRef(true);
  const towerBodiesRef = useRef([]);

  // Refs for game state values needed in physics loop
  const isGameOverRef = useRef(false);
  const objectsStackedRef = useRef(0);
  const hasPassedThresholdRef = useRef(false);

  // Game state
  const [gameState, setGameState] = useState({
    objectsStacked: 0,
    totalObjects: 10,
    perfectPlacements: 0,
    currentCombo: 0,
    isGameOver: false,
    groundY: 0,
    centerX: 0,
    canPlace: true,
    isSlowMo: false,
    startTime: null,
    endTime: null,
    hasPassedThreshold: false,
  });

  // Toast notification queue
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  // Calculate canvas dimensions and block scale ratio
  const calculateCanvasDimensions = useCallback(() => {
    if (!canvasContainerRef.current) return { width: 0, height: 0 };

    const container = canvasContainerRef.current;
    // Use clientWidth/clientHeight to get inner dimensions excluding borders
    // This ensures Matter.js coordinates match the particleContainer for glow effects
    canvasWidthRef.current = container.clientWidth;
    canvasHeightRef.current = container.clientHeight;

    // Canvas scales normally relative to reference width
    scaleRatioRef.current = canvasWidthRef.current / REFERENCE_WIDTH;

    const canvasWidth = canvasWidthRef.current;

    // ⚠️ CRITICAL: VIEWPORT-SPECIFIC BLOCK SCALING - DO NOT MODIFY
    // Each range has been tested to ensure all 10 blocks fit perfectly
    if (canvasWidth <= 430) {
      // iPhone 14 Pro Max (393px canvas): Slightly smaller than mobile base
      blockScaleRatioRef.current = scaleRatioRef.current * 0.88; // ⚠️ DO NOT CHANGE - Tested: fits 10 blocks
    } else if (canvasWidth <= 500) {
      // Larger phones (up to 500px canvas)
      blockScaleRatioRef.current = scaleRatioRef.current * 0.92; // ⚠️ DO NOT CHANGE - Tested: fits 10 blocks
    } else if (canvasWidth <= 600) {
      // iPad Mini (600px canvas): Blocks SMALLER than mobile for vertical space
      blockScaleRatioRef.current = scaleRatioRef.current * 0.64; // ⚠️ DO NOT CHANGE - Tested: fits 10 blocks
    } else if (canvasWidth <= 780) {
      // MacBook 16" (~700px canvas): Blocks need to be much smaller to fit all 10
      blockScaleRatioRef.current = scaleRatioRef.current * 0.64; // ⚠️ DO NOT CHANGE - Tested: fits 10 blocks
    } else if (canvasWidth <= 850) {
      // iPad Pro (834px canvas)
      blockScaleRatioRef.current = 1 + (scaleRatioRef.current - 1) * 0.22; // ⚠️ DO NOT CHANGE - 78% dampening, tested: fits 10 blocks
    } else {
      // 4K and large displays (>850px canvas)
      blockScaleRatioRef.current = 1 + (scaleRatioRef.current - 1) * 0.35; // ⚠️ DO NOT CHANGE - 65% dampening, tested: fits 10 blocks
    }

    return { width: canvasWidthRef.current, height: canvasHeightRef.current };
  }, []);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current || !renderRef.current || !engineRef.current) return;

    const dimensions = calculateCanvasDimensions();
    const canvas = canvasRef.current;
    const render = renderRef.current;
    const engine = engineRef.current;
    const { Body } = Matter;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    render.options.width = dimensions.width;
    render.options.height = dimensions.height;
    render.canvas.width = dimensions.width;
    render.canvas.height = dimensions.height;

    const canvasWidth = canvasWidthRef.current;
    const canvasHeight = canvasHeightRef.current;
    const scaleRatio = scaleRatioRef.current;

    slideMinXRef.current = canvasWidth * 0.15;
    slideMaxXRef.current = canvasWidth * 0.85;

    setGameState(prev => ({
      ...prev,
      centerX: canvasWidth / 2,
      groundY: canvasHeight - 50 * scaleRatio,
    }));

    if (groundRef.current) {
      Body.setPosition(groundRef.current, {
        x: canvasWidth / 2,
        y: canvasHeight - 25 * scaleRatio,
      });

      Body.setVertices(groundRef.current, [
        { x: 0, y: canvasHeight - 50 * scaleRatio },
        { x: canvasWidth, y: canvasHeight - 50 * scaleRatio },
        { x: canvasWidth, y: canvasHeight },
        { x: 0, y: canvasHeight },
      ]);
    }

    if (leftWallRef.current) {
      Body.setPosition(leftWallRef.current, { x: -10, y: canvasHeight / 2 });
    }

    if (rightWallRef.current) {
      Body.setPosition(rightWallRef.current, { x: canvasWidth + 10, y: canvasHeight / 2 });
    }
  }, [calculateCanvasDimensions]);

  // Update custom cursor visibility
  const updateCursor = useCallback(() => {
    if (!customCursorRef.current) return;

    const customCursor = customCursorRef.current;
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
      customCursor.style.display = 'block';
      document.body.style.cursor = 'none';
    } else {
      customCursor.style.display = 'none';
      document.body.style.cursor = 'auto';
    }
  }, []);

  // Audio functions
  const createNote = useCallback((frequency, startTime, duration, volume = 0.3, waveType = 'sine') => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = waveType;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(volume * 0.7, startTime + 0.05);
    gain.gain.setValueAtTime(volume * 0.7, startTime + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }, []);

  // Soft, satisfying "plop" sound for block drop - subtle and pleasant
  const playDropSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;

    // Create a soft "pop/plop" using noise burst + filtered tone
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Use triangle wave for softer sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    // Low-pass filter for muffled "thud" quality
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    // Quick attack, fast decay - very short "pop"
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }, []);

  // Pleasant chime for perfect placement - clean melodic tones without bass thud
  const playPerfectSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    const chord = [
      { freq: 523.25, vol: 0.15 },  // C5
      { freq: 659.25, vol: 0.12 },  // E5
      { freq: 783.99, vol: 0.10 },  // G5
    ];
    chord.forEach((note) => {
      createNote(note.freq, now, 0.35, note.vol, 'sine');
    });
    // Sparkle note on top
    createNote(1046.5, now + 0.05, 0.25, 0.08, 'sine');
  }, [createNote]);

  // Pleasant tone for good placement - simple and clean without bass thud
  const playGoodSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    createNote(523.25, now, 0.2, 0.12, 'sine');  // C5
    createNote(659.25, now, 0.2, 0.08, 'sine');  // E5
  }, [createNote]);

  const playWobbleSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    createNote(293.66, now, 0.2, 0.18, 'sine');
    createNote(311.13, now, 0.2, 0.15, 'sine');
  }, [createNote]);

  const playWinSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    const melody = [
      { freq: 523.25, time: 0, dur: 0.15 },
      { freq: 659.25, time: 0.1, dur: 0.15 },
      { freq: 783.99, time: 0.2, dur: 0.15 },
      { freq: 1046.5, time: 0.3, dur: 0.4 },
    ];
    melody.forEach((note) => {
      createNote(note.freq, now + note.time, note.dur, 0.2, 'sine');
      createNote(note.freq * 2, now + note.time, note.dur, 0.08, 'sine');
    });
  }, [createNote]);

  const playLoseSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    const descent = [
      { freq: 440.0, time: 0, dur: 0.2 },
      { freq: 349.23, time: 0.15, dur: 0.2 },
      { freq: 293.66, time: 0.3, dur: 0.2 },
      { freq: 220.0, time: 0.45, dur: 0.35 },
    ];
    descent.forEach((note) => {
      createNote(note.freq, now + note.time, note.dur, 0.2, 'sine');
    });
  }, [createNote]);

  // Visual effects
  const screenShake = useCallback((intensity = 10, duration = 200) => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const originalTransform = container.style.transform;
    const startTime = Date.now();

    function shake() {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const currentIntensity = intensity * (1 - progress);
        const x = (Math.random() - 0.5) * currentIntensity;
        const y = (Math.random() - 0.5) * currentIntensity;
        container.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(shake);
      } else {
        container.style.transform = originalTransform;
      }
    }
    shake();
  }, []);

  // Create block glow pulse effect - glows directly on the placed block
  const createBlockGlow = useCallback((body, intensity = 'normal') => {
    if (!particleContainerRef.current || !body || !body.bounds) return;

    const bounds = body.bounds;
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const x = body.position.x;
    const y = body.position.y;

    // Set glow color based on intensity
    const glowColor = intensity === 'perfect'
      ? 'rgba(132, 204, 22, 0.7)' // Green for perfect
      : 'rgba(245, 158, 11, 0.7)'; // Amber for good

    const glow = document.createElement('div');
    glow.className = intensity === 'perfect'
      ? `${styles.blockGlow} ${styles.perfect}`
      : styles.blockGlow;
    glow.style.left = x + 'px';
    glow.style.top = y + 'px';
    glow.style.width = (width + 20) + 'px';
    glow.style.height = (height + 20) + 'px';
    glow.style.setProperty('--glow-color', glowColor);

    particleContainerRef.current.appendChild(glow);
    setTimeout(() => glow.remove(), 400);
  }, []);

  // Show good placement flash (amber)
  const showGoodFlash = useCallback(() => {
    if (!goodFlashRef.current) return;

    const flashEl = goodFlashRef.current;
    flashEl.classList.add(styles.flash);

    setTimeout(() => {
      flashEl.classList.remove(styles.flash);
    }, 350);
  }, []);

  // Show threshold milestone flash (green)
  const showThresholdFlash = useCallback(() => {
    if (!thresholdFlashRef.current) return;

    const flashEl = thresholdFlashRef.current;
    flashEl.classList.add(styles.flash);

    setTimeout(() => {
      flashEl.classList.remove(styles.flash);
    }, 500);
  }, []);

  // Show floating text above a block position
  const showFloatingText = useCallback((x, y, text, type = 'good') => {
    if (!particleContainerRef.current) return;

    const floatingText = document.createElement('div');
    floatingText.className = `${styles.floatingText} ${styles[type]}`;
    floatingText.textContent = text;
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';

    particleContainerRef.current.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 1050); // Slightly longer than 1000ms animation
  }, []);

  // Show milestone text (centered, larger) for game end states
  const showMilestoneText = useCallback((text, type = 'success') => {
    if (!particleContainerRef.current) return;

    const milestoneText = document.createElement('div');
    milestoneText.className = type === 'failure'
      ? `${styles.milestoneText} ${styles.failure}`
      : styles.milestoneText;
    milestoneText.textContent = text;

    particleContainerRef.current.appendChild(milestoneText);
    setTimeout(() => milestoneText.remove(), 1550); // Slightly longer than 1500ms animation
  }, []);

  // Show danger border pulse effect
  const showDangerBorder = useCallback(() => {
    if (!dangerBorderRef.current) return;

    const borderEl = dangerBorderRef.current;
    borderEl.classList.add(styles.active);

    setTimeout(() => {
      borderEl.classList.remove(styles.active);
    }, 600);
  }, []);

  const showBlockName = useCallback((htmlContent) => {
    if (!blockNameDisplayRef.current || !blockNameTextRef.current) return;

    blockNameTextRef.current.innerHTML = htmlContent;
    blockNameDisplayRef.current.classList.add(styles.show);
  }, []);

  const hideBlockName = useCallback(() => {
    if (!blockNameDisplayRef.current) return;
    blockNameDisplayRef.current.classList.remove(styles.show);
  }, []);

  const showPerfectFlash = useCallback(() => {
    if (!perfectFlashRef.current) return;

    const flashEl = perfectFlashRef.current;
    flashEl.classList.add(styles.flash);

    // Remove class after animation completes
    setTimeout(() => {
      flashEl.classList.remove(styles.flash);
    }, 400);
  }, []);

  // Show dramatic collapse effect - multi-layered visual feedback
  const showCollapseEffect = useCallback(() => {
    if (!collapseFlashRef.current || !collapseVignetteRef.current) return;

    // 1. Red flash overlay
    const flashEl = collapseFlashRef.current;
    flashEl.classList.add(styles.collapse);
    setTimeout(() => {
      flashEl.classList.remove(styles.collapse);
    }, 800);

    // 2. Red vignette pulse
    const vignetteEl = collapseVignetteRef.current;
    vignetteEl.classList.add(styles.pulse);
    setTimeout(() => {
      vignetteEl.classList.remove(styles.pulse);
    }, 1200);

    // 3. Enhanced screen shake
    screenShake();

    // 4. Brief slow-motion effect on physics engine
    if (engineRef.current) {
      const engine = engineRef.current;
      // Slow down to 30% speed for dramatic effect
      engine.timing.timeScale = 0.3;

      // Restore normal speed after 500ms
      setTimeout(() => {
        if (engineRef.current) {
          engineRef.current.timing.timeScale = 1.0;
        }
      }, 500);
    }
  }, [screenShake]);

  // Show victory win effect - green multi-layered visual feedback for game completion
  const showWinEffect = useCallback(() => {
    if (!winFlashRef.current || !winVignetteRef.current) return;

    // 1. Green flash overlay
    const flashEl = winFlashRef.current;
    flashEl.classList.add(styles.win);
    setTimeout(() => {
      flashEl.classList.remove(styles.win);
    }, 1000);

    // 2. Green vignette pulse
    const vignetteEl = winVignetteRef.current;
    vignetteEl.classList.add(styles.pulse);
    setTimeout(() => {
      vignetteEl.classList.remove(styles.pulse);
    }, 1200);
  }, []);

  // Show toast notification with icon
  const showToast = useCallback((text, type) => {
    const id = toastIdRef.current++;

    // Map types to Lucide icons
    const iconMap = {
      perfect: CheckCircle2,
      good: Check,
      danger: AlertTriangle,
      win: Trophy,
      lose: XCircle,
      threshold: CheckCircle2,
    };

    const Icon = iconMap[type] || Check;

    const newToast = {
      id,
      text,
      type,
      Icon,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after animation (2s)
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  // Check placement quality
  const checkPlacementQuality = useCallback((body) => {
    const distance = Math.abs(body.position.x - gameState.centerX);
    // ⚠️ Thresholds scale with blockScaleRatio for consistency
    const perfectThreshold = 15 * blockScaleRatioRef.current;
    const goodThreshold = 50 * blockScaleRatioRef.current;

    if (distance < perfectThreshold) return 'perfect';
    if (distance < goodThreshold) return 'good';
    return 'okay';
  }, [gameState.centerX]);

  // Tower stability checks
  const checkTowerStability = useCallback(() => {
    if (towerBodiesRef.current.length === 0) return true;

    let totalMovement = 0;
    let hasWildMovement = false;

    towerBodiesRef.current.forEach((body) => {
      const movement =
        Math.abs(body.angularVelocity) +
        Math.abs(body.velocity.x) +
        Math.abs(body.velocity.y);
      totalMovement += movement;
      if (movement > 15) hasWildMovement = true;
    });

    const avgMovement = totalMovement / towerBodiesRef.current.length;

    if (avgMovement > 2.5 && !gameState.isSlowMo) {
      setGameState(prev => ({ ...prev, isSlowMo: true }));

      // Show floating danger text near the top of the tower
      const topBlock = towerBodiesRef.current.reduce((highest, body) =>
        body.position.y < highest.position.y ? body : highest
      , towerBodiesRef.current[0]);

      if (topBlock) {
        showFloatingText(topBlock.position.x, topBlock.position.y - 30, 'DANGER!', 'danger');
      }
      showDangerBorder();
      playWobbleSound();

      setTimeout(() => {
        setGameState(prev => ({ ...prev, isSlowMo: false }));
      }, 500);
    }

    if (hasWildMovement) return false;
    return avgMovement < 8;
  }, [gameState.isSlowMo, playWobbleSound, showFloatingText, showDangerBorder]);

  const checkTowerFallen = useCallback(() => {
    if (towerBodiesRef.current.length === 0) return false;

    let fallenCount = 0;
    let totalX = 0;

    towerBodiesRef.current.forEach((body) => {
      totalX += body.position.x;
    });

    const centerOfMass = totalX / towerBodiesRef.current.length;
    const canvasWidth = canvasWidthRef.current;
    const scaleRatio = scaleRatioRef.current;

    const edgeThreshold = canvasWidth * 0.095;
    const massDistanceThreshold = canvasWidth * 0.238;

    for (let body of towerBodiesRef.current) {
      let isFallen = false;

      if (
        body.position.x < edgeThreshold ||
        body.position.x > canvasWidth - edgeThreshold
      ) {
        isFallen = true;
      }

      if (body.position.y > gameState.groundY + 50 * scaleRatio) {
        isFallen = true;
      }

      const angle = Math.abs(body.angle % (Math.PI * 2));
      if (angle > Math.PI / 3 && angle < (5 * Math.PI) / 3) {
        isFallen = true;
      }

      const distanceFromCenter = Math.abs(body.position.x - centerOfMass);
      if (distanceFromCenter > massDistanceThreshold) {
        isFallen = true;
      }

      if (isFallen) fallenCount++;
    }

    return fallenCount >= 3;
  }, [gameState.groundY]);

  // Capture tower screenshot
  const captureTowerScreenshot = useCallback(() => {
    if (!canvasRef.current) return null;

    try {
      const dataURL = canvasRef.current.toDataURL('image/png');
      return dataURL;
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      return null;
    }
  }, []);

  // End game
  const endGame = useCallback((won) => {
    // Set ref immediately to prevent any pending timeouts from showing block name
    isGameOverRef.current = true;

    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      endTime: Date.now(),
    }));

    // Hide block description immediately when game ends
    hideBlockName();

    if (!gameOverScreenRef.current || !gameOverTitleRef.current || !gameOverMessageRef.current) return;

    const gameOverScreen = gameOverScreenRef.current;
    const gameOverTitle = gameOverTitleRef.current;
    const gameOverMessage = gameOverMessageRef.current;
    const timeElapsed = ((Date.now() - (gameState.startTime || Date.now())) / 1000).toFixed(1);

    if (towerScreenshotRef.current) {
      towerScreenshotRef.current.innerHTML = '';
    }

    if (won) {
      showMilestoneText('ASSESSMENT PASSED');
      showWinEffect(); // Green screen pulse for victory
      playWinSound();

      // Victory confetti celebration!
      const colors = ['#ea580c', '#f59e0b', '#fb923c', '#fcd34d'];
      const duration = 1500;
      const animationEnd = Date.now() + duration;

      const fireConfetti = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(fireConfetti);
        }
      };

      fireConfetti();

      // Center burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });

      const screenshot = captureTowerScreenshot();
      if (screenshot && towerScreenshotRef.current) {
        const img = document.createElement('img');
        img.src = screenshot;
        img.alt = 'Your completed tower';
        towerScreenshotRef.current.appendChild(img);
      }

      gameOverTitle.textContent = 'ASSESSMENT COMPLETE';
      gameOverTitle.className = `${styles.gameOverTitle} ${styles.win}`;
      gameOverMessage.textContent = "You passed. Don't get excited - so did the last guy, and he's currently restocking vending machines in Building C.";

      // Fix: Show both "Try Again" and "Continue" buttons
      if (restartButtonRef.current && skipButtonRef.current) {
        restartButtonRef.current.style.display = 'inline-block';
        restartButtonRef.current.textContent = 'Try Again';
        skipButtonRef.current.style.display = 'inline-block';
        skipButtonRef.current.textContent = 'Continue';
      }

      // Fix: Removed auto-continue - user must click "Continue" button
    } else {
      showCollapseEffect(); // Dramatic multi-layered collapse visual (red)
      showMilestoneText('ASSESSMENT FAILED', 'failure');
      playLoseSound();

      gameOverTitle.textContent = 'ASSESSMENT FAILED';
      gameOverTitle.className = `${styles.gameOverTitle} ${styles.lose}`;
      gameOverMessage.innerHTML = 'Based on this performance, we\'ve identified a career better suited to your skill set. <a href="#" id="fakeJobLink">View recommended position →</a>';

      if (restartButtonRef.current && skipButtonRef.current) {
        restartButtonRef.current.style.display = 'inline-block';
        skipButtonRef.current.style.display = 'inline-block';
        restartButtonRef.current.textContent = 'Try Again';
        skipButtonRef.current.textContent = 'Skip Challenge (Accept Defeat)';
      }
    }

    if (finalTimeRef.current) {
      finalTimeRef.current.textContent = timeElapsed + 's';
    }
    if (finalPerfectRef.current) {
      finalPerfectRef.current.textContent = gameState.perfectPlacements + '/' + gameState.totalObjects;
    }
    if (finalComboRef.current) {
      finalComboRef.current.textContent = gameState.currentCombo;
    }

    setTimeout(() => {
      gameOverScreen.classList.add(styles.show);
    }, 1500);
  }, [gameState, showMilestoneText, showWinEffect, playWinSound, playLoseSound, screenShake, captureTowerScreenshot, markRequirementComplete, showCollapseEffect, hideBlockName]);

  // Spawn next object
  const spawnNextObject = useCallback(() => {
    if (gameState.objectsStacked >= gameState.totalObjects || !engineRef.current) return;

    const { World, Bodies, Body } = Matter;

    // Clean up any existing currentObject that wasn't properly added to tower
    if (currentObjectRef.current && isHoldingObjectRef.current) {
      // If we still have a floating object that was never dropped, remove it
      try {
        World.remove(engineRef.current.world, currentObjectRef.current);
      } catch (e) {
        // Object might not be in world, that's ok
      }
      currentObjectRef.current = null;
    }

    const objectDef = objectTypes[gameState.objectsStacked];

    hideBlockName();
    setTimeout(() => {
      // Don't show block name if game has ended
      // Use ref value to get current objectsStacked (avoids stale closure)
      if (!isGameOverRef.current) {
        showBlockName(blockSentences[objectsStackedRef.current]);
      }
    }, 100);

    const slideDirection = gameState.objectsStacked % 2 === 0 ? 1 : -1;
    const slideX = slideDirection === 1 ? slideMinXRef.current : slideMaxXRef.current;

    const speedMultiplier = 1 + gameState.objectsStacked * 0.08;
    const slideSpeed = 2.5 * speedMultiplier * scaleRatioRef.current;

    // ⚠️ CRITICAL: Spawn positioning is calibrated for all viewports
    // DO NOT modify the clearance calculations
    let spawnY;
    const canvasHeight = canvasHeightRef.current;
    const blockScaleRatio = blockScaleRatioRef.current;

    if (gameState.objectsStacked === 0) {
      spawnY = canvasHeight * 0.5;
    } else {
      const towerTopY =
        towerBodiesRef.current.length > 0
          ? Math.min(...towerBodiesRef.current.map((b) => b.position.y))
          : gameState.groundY;

      const clearanceDistance = canvasHeight * (0.26 + blockScaleRatio * 0.1);
      spawnY = towerTopY - clearanceDistance;

      const minSpawnY = canvasHeight * 0.08;
      spawnY = Math.max(spawnY, minSpawnY);
    }

    // ⚠️ CRITICAL: Scale dimensions using blockScaleRatio
    const scaledWidth = objectDef.width * blockScaleRatio;
    const scaledHeight = objectDef.height * blockScaleRatio;

    let body;
    const baseFriction = 0.8;
    const baseRestitution = 0.2;

    if (objectDef.type === 'circle') {
      body = Bodies.circle(slideX, spawnY, scaledWidth / 2, {
        isStatic: true,
        restitution: baseRestitution,
        friction: baseFriction * 0.85,
        density: 0.001,
        render: {
          fillStyle: objectDef.color,
          strokeStyle: '#fff',
          lineWidth: 3,
        },
      });
    } else if (objectDef.type === 'lshape') {
      const part1 = Bodies.rectangle(0, 0, scaledWidth, 20 * blockScaleRatio, {
        density: 0.001,
      });
      const part2 = Bodies.rectangle(
        -scaledWidth / 4,
        scaledHeight / 2 - 10 * blockScaleRatio,
        20 * blockScaleRatio,
        scaledHeight,
        { density: 0.001 }
      );
      body = Body.create({
        parts: [part1, part2],
        isStatic: true,
        restitution: baseRestitution,
        friction: baseFriction,
        render: {
          fillStyle: objectDef.color,
          strokeStyle: '#fff',
          lineWidth: 3,
        },
      });
      Body.setPosition(body, { x: slideX, y: spawnY });
    } else {
      body = Bodies.rectangle(slideX, spawnY, scaledWidth, scaledHeight, {
        isStatic: true,
        restitution: baseRestitution,
        friction: baseFriction,
        density: 0.001,
        render: {
          fillStyle: objectDef.color,
          strokeStyle: '#fff',
          lineWidth: 3,
        },
      });
    }

    body.objectName = objectDef.name;
    body.isFloating = true;

    // Use refs for sliding state
    currentObjectRef.current = body;
    isHoldingObjectRef.current = true;
    slideDirectionRef.current = slideDirection;
    slideSpeedRef.current = slideSpeed;
    slideXRef.current = slideX;

    setGameState(prev => ({
      ...prev,
      canPlace: true,
    }));

    World.add(engineRef.current.world, body);

    if (customCursorRef.current) {
      customCursorRef.current.classList.add(styles.holding);
    }
  }, [gameState.objectsStacked, gameState.totalObjects, gameState.groundY, hideBlockName, showBlockName]);

  // Handle drop
  const handleDrop = useCallback(() => {
    if (!isHoldingObjectRef.current || !gameState.canPlace || gameState.isGameOver || !currentObjectRef.current) return;

    const { Body } = Matter;
    const body = currentObjectRef.current;

    if (gameState.startTime === null) {
      setGameState(prev => ({ ...prev, startTime: Date.now() }));
    }

    Body.setStatic(body, false);
    body.isFloating = false;

    isHoldingObjectRef.current = false;

    setGameState(prev => ({
      ...prev,
      canPlace: false,
    }));

    if (customCursorRef.current) {
      customCursorRef.current.classList.remove(styles.holding);
    }

    playDropSound();

    setTimeout(() => {
      const quality = checkPlacementQuality(body);
      let isActuallyStacked = false;

      // Stack threshold scales with both block size AND canvas height for tall viewports
      // This ensures blocks don't get rejected as "not stacked" on tall tablet/desktop canvases
      const baseThreshold = 100 * blockScaleRatioRef.current;
      const canvasHeight = canvasHeightRef.current;
      const heightBonus = canvasHeight > 600 ? (canvasHeight - 600) * 0.15 : 0;
      const stackThreshold = baseThreshold + heightBonus;

      // DEBUG: Log values to understand iPad Pro behavior (remove after debugging)
      console.log('DROP DEBUG:', {
        canvasHeight,
        canvasWidth: canvasWidthRef.current,
        blockScaleRatio: blockScaleRatioRef.current,
        baseThreshold,
        heightBonus,
        stackThreshold,
        bodyY: body.position.y,
        groundY: gameState.groundY,
        groundYMinusThreshold: gameState.groundY - stackThreshold,
        wouldBeStacked: body.position.y > gameState.groundY - stackThreshold,
        towerLength: towerBodiesRef.current.length
      });

      if (towerBodiesRef.current.length === 0) {
        isActuallyStacked = body.position.y > gameState.groundY - stackThreshold;
      } else {
        const currentY = body.position.y;
        for (let prevBody of towerBodiesRef.current) {
          const prevY = prevBody.position.y;
          if (currentY < prevY - 20) {
            isActuallyStacked = true;
            break;
          }
        }
      }

      if (!isActuallyStacked && engineRef.current) {
        Matter.World.remove(engineRef.current.world, body);
        showFloatingText(body.position.x, body.position.y - 20, 'Stack it UP!', 'good');
        playGoodSound();
        setGameState(prev => ({ ...prev, currentCombo: 0 }));
        setTimeout(() => spawnNextObjectRef.current(), 500);
        return;
      }

      let newPerfectPlacements = gameState.perfectPlacements;
      let newCurrentCombo = gameState.currentCombo;

      if (quality === 'perfect') {
        showFloatingText(body.position.x, body.position.y - 30, 'PERFECT!', 'perfect');
        playPerfectSound();
        createBlockGlow(body, 'perfect');
        showPerfectFlash(); // Brief green flash on perfect placement
        newPerfectPlacements++;
        newCurrentCombo++;
      } else if (quality === 'good') {
        showFloatingText(body.position.x, body.position.y - 30, 'GOOD!', 'good');
        playGoodSound();
        createBlockGlow(body, 'normal');
        showGoodFlash(); // Brief amber flash on good placement
        newCurrentCombo++;
      } else {
        newCurrentCombo = 0;
      }

      // Add to tower using ref
      towerBodiesRef.current = [...towerBodiesRef.current, body];

      setGameState(prev => {
        const newObjectsStacked = prev.objectsStacked + 1;
        const newHasPassedThreshold = newObjectsStacked >= 8 ? true : prev.hasPassedThreshold;

        return {
          ...prev,
          objectsStacked: newObjectsStacked,
          perfectPlacements: newPerfectPlacements,
          currentCombo: newCurrentCombo,
          hasPassedThreshold: newHasPassedThreshold,
        };
      });

      // Check if reached threshold (8 blocks = passing)
      setTimeout(() => {
        const newObjectsStacked = gameState.objectsStacked + 1;
        if (newObjectsStacked >= 8 && !gameState.hasPassedThreshold) {
          // Green flash only - no text (progress bar shows status)
          showThresholdFlash();
        }

        if (newObjectsStacked >= gameState.totalObjects) {
          let checkTimer = 0;
          const checkInterval = setInterval(() => {
            checkTimer += 100;
            const newHasPassedThreshold = newObjectsStacked >= 8;
            if (checkTowerFallen() || !checkTowerStability()) {
              clearInterval(checkInterval);
              endGame(newHasPassedThreshold);
            } else if (checkTimer >= 2000) {
              clearInterval(checkInterval);
              endGame(newHasPassedThreshold);
            }
          }, 100);
        } else {
          setTimeout(() => spawnNextObjectRef.current(), 300);
        }
      }, 100);
    }, 600);
  }, [gameState, playDropSound, screenShake, checkPlacementQuality, showFloatingText, showMilestoneText, playPerfectSound, playGoodSound, createBlockGlow, showGoodFlash, showThresholdFlash, checkTowerFallen, checkTowerStability, endGame, showPerfectFlash]);

  // Initialize Matter.js
  useEffect(() => {
    if (!isActive || !canvasRef.current || !canvasContainerRef.current) return;

    const { Engine, Render, World, Bodies, Body, Events, Runner } = Matter;

    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Calculate initial dimensions
    const dimensions = calculateCanvasDimensions();

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1.3 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    const scaleRatio = scaleRatioRef.current;
    const canvasWidth = canvasWidthRef.current;
    const canvasHeight = canvasHeightRef.current;

    // Create ground
    const ground = Bodies.rectangle(
      canvasWidth / 2,
      canvasHeight - 25 * scaleRatio,
      canvasWidth,
      50 * scaleRatio,
      {
        isStatic: true,
        render: {
          fillStyle: '#292524', // Dark stone foundation
          strokeStyle: '#292524', // Match color so border is invisible
          lineWidth: 4,
        },
      }
    );
    groundRef.current = ground;
    World.add(engine.world, ground);

    // Create walls
    const leftWall = Bodies.rectangle(-10, canvasHeight / 2, 20, canvasHeight, {
      isStatic: true,
    });
    leftWallRef.current = leftWall;

    const rightWall = Bodies.rectangle(canvasWidth + 10, canvasHeight / 2, 20, canvasHeight, {
      isStatic: true,
    });
    rightWallRef.current = rightWall;

    World.add(engine.world, [leftWall, rightWall]);

    // Initialize game state and refs with calculated values
    slideMinXRef.current = canvasWidth * 0.15;
    slideMaxXRef.current = canvasWidth * 0.85;
    slideXRef.current = canvasWidth * 0.15;

    setGameState(prev => ({
      ...prev,
      groundY: canvasHeight - 50 * scaleRatio,
      centerX: canvasWidth / 2,
    }));

    // Set up before update event for sliding blocks
    // ⚠️ CRITICAL: Use refs here to avoid setState on every frame
    Events.on(engine, 'beforeUpdate', () => {
      // Sliding logic
      if (isHoldingObjectRef.current && currentObjectRef.current) {
        let newSlideX = slideXRef.current + slideDirectionRef.current * slideSpeedRef.current;
        let newSlideDirection = slideDirectionRef.current;

        if (newSlideX <= slideMinXRef.current) {
          newSlideX = slideMinXRef.current;
          newSlideDirection = 1;
        } else if (newSlideX >= slideMaxXRef.current) {
          newSlideX = slideMaxXRef.current;
          newSlideDirection = -1;
        }

        Body.setPosition(currentObjectRef.current, {
          x: newSlideX,
          y: currentObjectRef.current.position.y,
        });

        slideXRef.current = newSlideX;
        slideDirectionRef.current = newSlideDirection;
      }

      // Tower stability checking - triggers loss if tower falls before threshold
      if (!isGameOverRef.current && objectsStackedRef.current > 0) {
        if (checkTowerFallenRef.current() || !checkTowerStabilityRef.current()) {
          if (!isHoldingObjectRef.current && !hasPassedThresholdRef.current) {
            endGameRef.current(false);
          }
        }
      }
    });

    // Start engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Add edge highlight effect to blocks (clean, non-muddy look)
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      const canvasWidth = canvasWidthRef.current;
      const canvasHeight = canvasHeightRef.current;
      const scaleRatio = scaleRatioRef.current;

      // Draw industrial metal plate pattern on ground
      const groundY = canvasHeight - 50 * scaleRatio;
      const groundHeight = 50 * scaleRatio;

      context.save();

      // Draw diagonal hatching pattern (industrial floor plate)
      context.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      context.lineWidth = 1;

      const spacing = 12; // Space between diagonal lines
      const patternHeight = groundHeight;

      // Draw diagonal lines going one direction (/)
      for (let x = -patternHeight; x < canvasWidth + patternHeight; x += spacing) {
        context.beginPath();
        context.moveTo(x, groundY);
        context.lineTo(x + patternHeight, groundY + patternHeight);
        context.stroke();
      }

      // Draw diagonal lines going other direction (\)
      for (let x = -patternHeight; x < canvasWidth + patternHeight; x += spacing) {
        context.beginPath();
        context.moveTo(x + patternHeight, groundY);
        context.lineTo(x, groundY + patternHeight);
        context.stroke();
      }

      // Add subtle top edge highlight on ground
      context.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, groundY);
      context.lineTo(canvasWidth, groundY);
      context.stroke();

      context.restore();

      // Helper function to apply clean edge lighting to blocks
      const drawBlockEdgeHighlight = (body) => {
        if (!body || !body.vertices || body.vertices.length < 3) return;

        const vertices = body.vertices;

        context.save();

        // Find top-left and bottom-right edges based on rotation
        // We'll draw a bright edge on top and left sides
        const bounds = body.bounds;
        const centerX = body.position.x;
        const centerY = body.position.y;

        // Draw highlight on top and left edges (simulating light from top-left)
        context.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        // For each edge, check if it's on the "lit" side (top or left relative to center)
        for (let i = 0; i < vertices.length; i++) {
          const v1 = vertices[i];
          const v2 = vertices[(i + 1) % vertices.length];

          // Calculate edge midpoint
          const midX = (v1.x + v2.x) / 2;
          const midY = (v1.y + v2.y) / 2;

          // Calculate edge normal (pointing outward)
          const edgeDx = v2.x - v1.x;
          const edgeDy = v2.y - v1.y;
          const normalX = -edgeDy;
          const normalY = edgeDx;

          // Check if this edge faces top-left (light source direction)
          // Light comes from top-left, so we want edges with normals pointing up-left
          const lightDirX = -1;
          const lightDirY = -1;
          const dot = normalX * lightDirX + normalY * lightDirY;

          if (dot > 0) {
            // This edge faces the light - draw bright highlight
            context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            context.beginPath();
            context.moveTo(v1.x, v1.y);
            context.lineTo(v2.x, v2.y);
            context.stroke();
          }
        }

        // Draw subtle shadow on bottom-right edges
        context.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        context.lineWidth = 1;

        for (let i = 0; i < vertices.length; i++) {
          const v1 = vertices[i];
          const v2 = vertices[(i + 1) % vertices.length];

          const edgeDx = v2.x - v1.x;
          const edgeDy = v2.y - v1.y;
          const normalX = -edgeDy;
          const normalY = edgeDx;

          // Check if this edge faces bottom-right (shadow side)
          const lightDirX = 1;
          const lightDirY = 1;
          const dot = normalX * lightDirX + normalY * lightDirY;

          if (dot > 0) {
            context.beginPath();
            context.moveTo(v1.x, v1.y);
            context.lineTo(v2.x, v2.y);
            context.stroke();
          }
        }

        context.restore();
      };

      // Render for stacked blocks
      towerBodiesRef.current.forEach(drawBlockEdgeHighlight);

      // Also render for the current moving block
      if (currentObjectRef.current) {
        drawBlockEdgeHighlight(currentObjectRef.current);
      }
    });

    // Spawn first object after section animation completes (600ms from Section component)
    const spawnTimeout = setTimeout(() => {
      spawnNextObjectRef.current();
    }, 800);

    // Update cursor
    updateCursor();

    // Cleanup
    return () => {
      clearTimeout(spawnTimeout);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas = null;
      render.context = null;
      render.textures = {};
      // Clear refs
      currentObjectRef.current = null;
      towerBodiesRef.current = [];
      isHoldingObjectRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Handle resize
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => {
      // Update cursor
      if (customCursorRef.current) {
        const customCursor = customCursorRef.current;
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
          customCursor.style.display = 'block';
          document.body.style.cursor = 'none';
        } else {
          customCursor.style.display = 'none';
          document.body.style.cursor = 'auto';
        }
      }

      // Resize canvas
      if (!canvasRef.current || !renderRef.current || !engineRef.current) return;

      const dimensions = calculateCanvasDimensions();
      const canvas = canvasRef.current;
      const render = renderRef.current;
      const { Body } = Matter;

      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      render.options.width = dimensions.width;
      render.options.height = dimensions.height;
      render.canvas.width = dimensions.width;
      render.canvas.height = dimensions.height;

      const canvasWidth = canvasWidthRef.current;
      const canvasHeight = canvasHeightRef.current;
      const scaleRatio = scaleRatioRef.current;

      slideMinXRef.current = canvasWidth * 0.15;
      slideMaxXRef.current = canvasWidth * 0.85;

      setGameState(prev => ({
        ...prev,
        centerX: canvasWidth / 2,
        groundY: canvasHeight - 50 * scaleRatio,
      }));

      if (groundRef.current) {
        Body.setPosition(groundRef.current, {
          x: canvasWidth / 2,
          y: canvasHeight - 25 * scaleRatio,
        });

        Body.setVertices(groundRef.current, [
          { x: 0, y: canvasHeight - 50 * scaleRatio },
          { x: canvasWidth, y: canvasHeight - 50 * scaleRatio },
          { x: canvasWidth, y: canvasHeight },
          { x: 0, y: canvasHeight },
        ]);
      }

      if (leftWallRef.current) {
        Body.setPosition(leftWallRef.current, { x: -10, y: canvasHeight / 2 });
      }

      if (rightWallRef.current) {
        Body.setPosition(rightWallRef.current, { x: canvasWidth + 10, y: canvasHeight / 2 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Handle cursor movement
  useEffect(() => {
    if (!isActive || !customCursorRef.current) return;

    const cursor = customCursorRef.current;

    const handleMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  // Update stats when game state changes
  useEffect(() => {
    if (!isActive) return;

    // Update stat displays
    if (stackedCountRef.current) {
      stackedCountRef.current.textContent = `${gameState.objectsStacked}/${gameState.totalObjects}`;
    }
    if (perfectCountRef.current) {
      perfectCountRef.current.textContent = gameState.perfectPlacements;
    }
    if (comboCountRef.current) {
      comboCountRef.current.textContent = gameState.currentCombo;
    }


    // Update progress bar
    if (progressFillRef.current && progressTextRef.current) {
      const percentage = (gameState.objectsStacked / gameState.totalObjects) * 100;
      progressFillRef.current.style.width = percentage + '%';
      if (percentage > 0) progressFillRef.current.classList.add(styles.active);
      progressTextRef.current.textContent = `${gameState.objectsStacked}/10 Stacked`;

      // Border color stays orange throughout - no difficulty color changes
    }

    // Update combo display
    if (comboCounterRef.current && comboValueRef.current) {
      if (gameState.currentCombo >= 2) {
        comboValueRef.current.textContent = `x${gameState.currentCombo}`;
        comboCounterRef.current.classList.add(styles.show);
      } else {
        comboCounterRef.current.classList.remove(styles.show);
      }
    }
  }, [isActive, gameState.objectsStacked, gameState.totalObjects, gameState.perfectPlacements, gameState.currentCombo]);

  // Store callbacks in refs so event listeners and timeouts always use latest version
  const handleDropRef = useRef(handleDrop);
  const spawnNextObjectRef = useRef(spawnNextObject);
  const checkTowerFallenRef = useRef(checkTowerFallen);
  const checkTowerStabilityRef = useRef(checkTowerStability);
  const endGameRef = useRef(endGame);

  useEffect(() => {
    handleDropRef.current = handleDrop;
  }, [handleDrop]);

  useEffect(() => {
    spawnNextObjectRef.current = spawnNextObject;
  }, [spawnNextObject]);

  useEffect(() => {
    checkTowerFallenRef.current = checkTowerFallen;
  }, [checkTowerFallen]);

  useEffect(() => {
    checkTowerStabilityRef.current = checkTowerStability;
  }, [checkTowerStability]);

  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);

  // Keep game state refs in sync for physics loop
  useEffect(() => {
    isGameOverRef.current = gameState.isGameOver;
    objectsStackedRef.current = gameState.objectsStacked;
    hasPassedThresholdRef.current = gameState.hasPassedThreshold;
  }, [gameState.isGameOver, gameState.objectsStacked, gameState.hasPassedThreshold]);

  // Handle click/touch
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;

    const handleClick = () => {
      handleDropRef.current();
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      handleDropRef.current();
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive]);

  // Reset game state and restart
  const resetGame = useCallback(() => {
    if (!engineRef.current) return;

    const { World } = Matter;

    // Hide block description immediately to prevent flash of old content
    hideBlockName();

    // Hide game over screen and reset content visibility
    if (gameOverScreenRef.current) {
      gameOverScreenRef.current.classList.remove(styles.show);
    }
    if (gameOverContentRef.current) {
      gameOverContentRef.current.style.display = 'flex';
    }
    if (roastContentRef.current) {
      roastContentRef.current.style.display = 'none';
    }

    // Clear all bodies except ground and walls
    const bodiesToRemove = engineRef.current.world.bodies.filter(
      body => body !== groundRef.current && body !== leftWallRef.current && body !== rightWallRef.current
    );
    World.remove(engineRef.current.world, bodiesToRemove);

    // Reset refs
    currentObjectRef.current = null;
    towerBodiesRef.current = [];
    isHoldingObjectRef.current = true;
    isGameOverRef.current = false;
    objectsStackedRef.current = 0;
    hasPassedThresholdRef.current = false;

    // Reset game state
    setGameState({
      objectsStacked: 0,
      totalObjects: 10,
      perfectPlacements: 0,
      currentCombo: 0,
      isGameOver: false,
      groundY: gameState.groundY,
      centerX: gameState.centerX,
      canPlace: true,
      isSlowMo: false,
      startTime: null,
      endTime: null,
      hasPassedThreshold: false,
    });

    // Reset canvas border
    if (canvasContainerRef.current) {
      canvasContainerRef.current.style.borderColor = '';
    }

    // Spawn first object
    setTimeout(() => {
      spawnNextObjectRef.current();
    }, 500);
  }, [gameState.groundY, gameState.centerX, hideBlockName]);

  // Restart button handler
  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Skip button handler - handles both "Continue" (win) and "Skip Challenge" (lose)
  const handleSkip = useCallback(() => {
    if (!gameOverContentRef.current || !roastContentRef.current) return;

    // Check if this is a win or loss based on the button text
    const buttonText = skipButtonRef.current?.textContent || '';

    if (buttonText === 'Continue') {
      // Win scenario: Progress to next section
      markRequirementComplete('stackingGame', 'complete');
    } else {
      // Lose scenario: Show roast content (CSS handles flex layout)
      gameOverContentRef.current.style.display = 'none';
      roastContentRef.current.style.display = 'flex';
    }
  }, [markRequirementComplete]);

  // Back to results handler - restarts game instead of showing game over screen
  const handleBackToResults = useCallback(() => {
    if (!gameOverContentRef.current || !roastContentRef.current) return;

    // Hide roast content
    roastContentRef.current.style.display = 'none';
    gameOverContentRef.current.style.display = 'flex';

    // Restart the game immediately
    resetGame();
  }, [resetGame]);

  // Give up handler - accept defeat and proceed to next section
  const handleGiveUp = useCallback(() => {
    // Mark requirement as complete to proceed (they gave up but can continue)
    markRequirementComplete('stackingGame', 'complete');
  }, [markRequirementComplete]);

  // Handle fake job link click
  useEffect(() => {
    if (!isActive) return;

    const handleFakeJobClick = (e) => {
      if (e.target && e.target.id === 'fakeJobLink') {
        e.preventDefault();
        handleSkip();
      }
    };

    document.addEventListener('click', handleFakeJobClick);
    return () => document.removeEventListener('click', handleFakeJobClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <Section show={isActive}>
      {/* Custom Cursor */}
      <div ref={customCursorRef} className={styles.customCursor}></div>

      {/* Main Game Container */}
      <div className={styles.gameContainer}>
        <div className={styles.gameContentWrapper}>
          {/* Header Section */}
          <div className={styles.gameHeader}>
            <h1>TOXICITY TOLERANCE ASSESSMENT</h1>
            <p className={styles.objective}>
              We spent $4.7 million on this. Shareholders were furious. Stack{' '}
              <strong>8 workplace essentials</strong> without causing a workplace
              incident. HR is watching. They're always watching.
            </p>
          </div>

          {/* Canvas Container */}
          <div ref={canvasContainerRef} className={styles.canvasContainer}>
            <canvas ref={canvasRef} className={styles.gameCanvas}></canvas>

            {/* Particle Container - for overflow effects */}
            <div ref={particleContainerRef} className={styles.particleContainer}></div>

            {/* Placement Flash Effects */}
            <div ref={perfectFlashRef} className={styles.perfectFlash}></div>
            <div ref={goodFlashRef} className={styles.goodFlash}></div>
            <div ref={thresholdFlashRef} className={styles.thresholdFlash}></div>

            {/* Tower Collapse Effects */}
            <div ref={collapseFlashRef} className={styles.collapseFlash}></div>
            <div ref={collapseVignetteRef} className={styles.collapseVignette}></div>

            {/* Victory Win Effects */}
            <div ref={winFlashRef} className={styles.winFlash}></div>
            <div ref={winVignetteRef} className={styles.winVignette}></div>

            {/* Danger Border Effect */}
            <div ref={dangerBorderRef} className={styles.dangerBorder}></div>

            {/* Toast Notifications */}
            <div className={styles.toastContainer}>
              {toasts.map(toast => (
                <div key={toast.id} className={`${styles.toast} ${styles.show} ${styles[toast.type]}`}>
                  <div className={styles.toastIcon}>
                    <toast.Icon size={20} />
                  </div>
                  <div className={styles.toastText}>{toast.text}</div>
                </div>
              ))}
            </div>

            {/* Block Name Display */}
            <div ref={blockNameDisplayRef} className={styles.blockNameDisplay}>
              <div ref={blockNameTextRef} className={styles.blockName}>
                Pizza Party (In Lieu of Raises)
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div className={styles.progressTrack}>
                <div ref={progressFillRef} className={styles.progressFill}></div>
                <div className={styles.progressThreshold}></div>
              </div>
              <div className={styles.progressLabel}>
                <span ref={progressTextRef} className={styles.progressText}>0/10 Stacked</span>
                <span className={styles.thresholdLabel}>Workload</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Screen */}
      <div ref={gameOverScreenRef} className={styles.gameOverScreen}>
        {/* Main game over content */}
        <div ref={gameOverContentRef} className={styles.gameOverContent}>
          <div ref={gameOverTitleRef} className={`${styles.gameOverTitle} ${styles.win}`}>
            🎉 YOU WIN! 🎉
          </div>
          <div ref={towerScreenshotRef} className={styles.towerScreenshot}></div>
          <div className={styles.gameOverStats}>
            <div className={styles.gameOverStat}>
              <span ref={finalTimeRef}>0s</span>
              <div className={styles.gameOverStatLabel}>Time</div>
            </div>
            <div className={styles.gameOverStat}>
              <span ref={finalPerfectRef}>0/10</span>
              <div className={styles.gameOverStatLabel}>Perfect</div>
            </div>
            <div className={styles.gameOverStat}>
              <span ref={finalComboRef}>0</span>
              <div className={styles.gameOverStatLabel}>Combo</div>
            </div>
          </div>
          <p ref={gameOverMessageRef} className={styles.gameOverMessage}></p>
          <div className={styles.buttonGroup}>
            <button ref={restartButtonRef} className={styles.restartButton} onClick={handleRestart}>Try Again</button>
            <button ref={skipButtonRef} className={styles.skipButton} style={{ display: 'none' }} onClick={handleSkip}>
              Skip Challenge
            </button>
          </div>
        </div>

        {/* Roast content */}
        <div ref={roastContentRef} className={styles.roastContent} style={{ display: 'none' }}>
          <h2 className={styles.roastTitle}>
            <span className={styles.roastTitleText}>Did you actually click that?</span>
            <br />
            <span className={styles.roastEmoji}>😂</span>
          </h2>
          <div className={styles.roastImageWrapper}>
            <img
              src="/images/Mcdonalds.jpg"
              alt="Career recommendation"
              className={styles.roastImage}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.backToResultsButton} onClick={handleBackToResults}>Try Again</button>
            <button className={styles.giveUpButton} onClick={handleGiveUp}>Skip Challenge (Accept Defeat)</button>
          </div>
        </div>
      </div>
    </Section>
  );
}
