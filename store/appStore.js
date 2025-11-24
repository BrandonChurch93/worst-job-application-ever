import { create } from 'zustand';

/**
 * Application Store - The Worst Job Application Ever Made
 *
 * Manages:
 * - Application flow (landing → sections → success)
 * - Section requirements and completion tracking
 * - Timer for completion tracking
 * - Form data storage
 * - Transition states
 */

const useAppStore = create((set, get) => ({
  // ===== APPLICATION STATE =====

  // Current view: 'landing', 'transition', 'section', 'celebration', 'success'
  currentView: 'landing',

  // Current section: 'stackingGame', 'configuration', 'terms', 'form', 'signature', 'captcha'
  currentSection: null,

  // Current transition text to display
  transitionText: '',

  // Is the application showing celebration overlay?
  isCelebrating: false,

  // ===== TIMER STATE =====

  startTime: null,
  endTime: null,
  isTimerRunning: false,

  // ===== SECTION REQUIREMENTS =====

  sectionRequirements: {
    stackingGame: [
      { id: 'complete', label: 'Complete competency evaluation', complete: false }
    ],
    configuration: [
      { id: 'volume', label: 'Configure volume to 50%', complete: false },
      { id: 'brightness', label: 'Adjust brightness settings', complete: false }
    ],
    terms: [
      { id: 'scroll', label: 'Review complete documentation', complete: false },
      { id: 'agree', label: 'Accept terms and conditions', complete: false }
    ],
    form: [
      { id: 'name', label: 'Provide full legal name', complete: false },
      { id: 'phone', label: 'Enter contact number', complete: false },
      { id: 'email', label: 'Provide email address', complete: false }
    ],
    signature: [
      { id: 'sign', label: 'Provide legally binding signature', complete: false }
    ],
    captcha: [
      { id: 'verify', label: 'Complete human verification', complete: false }
    ]
  },

  // ===== FORM DATA =====

  formData: {
    name: '',
    phone: '',
    email: '',
    signature: ''
  },

  // ===== SECTION SEQUENCE =====

  sectionSequence: ['stackingGame', 'configuration', 'terms', 'form', 'signature', 'captcha'],

  transitionTexts: {
    stackingGame: "Before we review your application, we need to assess compatibility. We spent an unreasonable amount of money building this, so you're doing it.",
    configuration: "Let's configure your settings.",
    terms: "Good. Now, the legal stuff.",
    form: "Time to get personal.",
    signature: "Almost there. Sign your life away.",
    captcha: "One last thing. Prove you're human.",
    success: "Processing your application..."
  },

  // ===== ACTIONS =====

  /**
   * Start the application
   * - Starts timer
   * - Shows first transition text
   * - Transitions to first section
   */
  startApplication: () => {
    const firstSection = get().sectionSequence[0];

    set({
      currentView: 'transition',
      startTime: Date.now(),
      isTimerRunning: true,
      transitionText: get().transitionTexts[firstSection]
    });

    // After transition duration (3.2s), show first section
    setTimeout(() => {
      set({
        currentView: 'section',
        currentSection: firstSection
      });
    }, 3200);
  },

  /**
   * Mark a requirement as complete
   * @param {string} sectionId - Section identifier
   * @param {string} requirementId - Requirement identifier
   */
  markRequirementComplete: (sectionId, requirementId) => {
    set((state) => {
      const updatedRequirements = state.sectionRequirements[sectionId].map((req) =>
        req.id === requirementId ? { ...req, complete: true } : req
      );

      const newState = {
        sectionRequirements: {
          ...state.sectionRequirements,
          [sectionId]: updatedRequirements
        }
      };

      // Check if all requirements for this section are now complete
      const allComplete = updatedRequirements.every((req) => req.complete);

      if (allComplete) {
        // Trigger celebration
        setTimeout(() => {
          get().celebrateCompletion();
        }, 300); // Small delay for last checkbox animation
      }

      return newState;
    });
  },

  /**
   * Check if a section is complete
   * @param {string} sectionId - Section identifier
   * @returns {boolean}
   */
  isSectionComplete: (sectionId) => {
    const requirements = get().sectionRequirements[sectionId];
    return requirements.every((req) => req.complete);
  },

  /**
   * Show celebration overlay
   */
  celebrateCompletion: () => {
    set({ isCelebrating: true });

    // After celebration duration (2s), transition to next section
    setTimeout(() => {
      get().transitionToNextSection();
    }, 2000);
  },

  /**
   * Transition to the next section
   * - Hides celebration
   * - Shows transition text
   * - Loads next section (or success screen)
   */
  transitionToNextSection: () => {
    const { currentSection, sectionSequence, transitionTexts } = get();
    const currentIndex = sectionSequence.indexOf(currentSection);
    const isLastSection = currentIndex === sectionSequence.length - 1;

    if (isLastSection) {
      // Go to success screen
      set({
        isCelebrating: false,
        currentView: 'transition',
        transitionText: transitionTexts.success
      });

      setTimeout(() => {
        set({
          currentView: 'success',
          endTime: Date.now(),
          isTimerRunning: false
        });
      }, 3200);
    } else {
      // Go to next section
      const nextSection = sectionSequence[currentIndex + 1];

      set({
        isCelebrating: false,
        currentView: 'transition',
        transitionText: transitionTexts[nextSection]
      });

      setTimeout(() => {
        set({
          currentView: 'section',
          currentSection: nextSection
        });
      }, 3200);
    }
  },

  /**
   * Update form data
   * @param {string} field - Form field name
   * @param {string} value - Field value
   */
  updateFormData: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    }));
  },

  /**
   * Get elapsed time in milliseconds
   * @returns {number}
   */
  getElapsedTime: () => {
    const { startTime, endTime, isTimerRunning } = get();

    if (!startTime) return 0;

    if (endTime) {
      return endTime - startTime;
    }

    if (isTimerRunning) {
      return Date.now() - startTime;
    }

    return 0;
  },

  /**
   * Format elapsed time as MM:SS
   * @returns {string}
   */
  getFormattedTime: () => {
    const elapsed = get().getElapsedTime();
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  /**
   * Reset the entire application state
   */
  resetApplication: () => {
    set({
      currentView: 'landing',
      currentSection: null,
      transitionText: '',
      isCelebrating: false,
      startTime: null,
      endTime: null,
      isTimerRunning: false,
      sectionRequirements: {
        stackingGame: [
          { id: 'complete', label: 'Complete competency evaluation', complete: false }
        ],
        configuration: [
          { id: 'volume', label: 'Configure volume to 50%', complete: false },
          { id: 'brightness', label: 'Adjust brightness settings', complete: false }
        ],
        terms: [
          { id: 'scroll', label: 'Review complete documentation', complete: false },
          { id: 'agree', label: 'Accept terms and conditions', complete: false }
        ],
        form: [
          { id: 'name', label: 'Provide full legal name', complete: false },
          { id: 'phone', label: 'Enter contact number', complete: false },
          { id: 'email', label: 'Provide email address', complete: false }
        ],
        signature: [
          { id: 'sign', label: 'Provide legally binding signature', complete: false }
        ],
        captcha: [
          { id: 'verify', label: 'Complete human verification', complete: false }
        ]
      },
      formData: {
        name: '',
        phone: '',
        email: '',
        signature: ''
      }
    });
  }
}));

export default useAppStore;
