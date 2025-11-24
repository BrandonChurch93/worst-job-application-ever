# Landing Page Development Guide

> **Purpose:** This document serves as a comprehensive handoff guide for AI assistants (Claude) working on the landing page. It contains all research, decisions, preferences, and progress tracking to ensure continuity across sessions.

> **Last Updated:** November 22, 2024

---

## Table of Contents

1. [Project Context](#project-context)
2. [Client Preferences & Calibration](#client-preferences--calibration)
3. [Research Findings](#research-findings)
4. [Current Landing Page Structure](#current-landing-page-structure)
5. [Implementation Plan & Checklist](#implementation-plan--checklist)
6. [Section Specifications](#section-specifications)
7. [Design System Reference](#design-system-reference)
8. [Quality Standards](#quality-standards)
9. [Session Notes](#session-notes)

---

## Project Context

### What This Is
"The Worst Job Application Ever Made" is a satirical portfolio project that takes users through a hilariously inconvenient, mini-game-packed job application experience for a fake company called **Mandatory Optional Overtime LLC (M.O.O.)**.

### The Goal
Build a **bleeding-edge 2025 landing page** that:
- Captures dbrand-level irreverent humor
- Features premium, cinematic design quality
- Includes rich micro-interactions and scroll animations
- Contains 8-10 distinct sections (currently has 4)
- Sets up the satirical tone before users begin the application

### Quality Bar
The client is a **director-level UI/UX designer and senior front-end engineer** running a successful software development firm. The quality expectation is:
- NOT mediocre
- NOT "2018 looking"
- NOT a college student's first project
- **IS** incredible, bold, fun, and bleeding-edge

### Key Files
- **Landing Page Component:** `components/LandingPage/LandingPage.jsx`
- **Hero:** `components/Hero/Hero.jsx`
- **Marquee:** `components/Marquee/Marquee.jsx` ✅
- **WhyJoinUs:** `components/WhyJoinUs/WhyJoinUs.jsx`
- **Testimonials:** `components/Testimonials/Testimonials.jsx` ✅
- **ProcessTimeline:** `components/ProcessTimeline/ProcessTimeline.jsx` ✅
- **Awards:** `components/Awards/Awards.jsx` ✅
- **Comparison:** `components/Comparison/Comparison.jsx` ✅
- **FAQ:** `components/FAQ/FAQ.jsx` ✅ NEW
- **Disclaimer:** `components/Disclaimer/Disclaimer.jsx`
- **Footer:** `components/Footer/Footer.jsx`
- **Header:** `components/Header/Header.jsx` (to be redone in separate session)
- **Global CSS:** `app/globals.css`
- **Design System Doc:** `documentation/DesignSystem.md`

---

## Client Preferences & Calibration

### Humor Aggression Level: **MAXIMUM**
- Go full dbrand-style roasting
- Direct insults to the reader are encouraged
- "You're fat. Our skins aren't." level of boldness
- No hedging, no softening, no corporate politeness

### Micro-Interactions: **ALL IN**
- Rich hover states on everything
- Animated counters
- Scroll-triggered reveals
- Interactive elements that respond to user input
- Use interactions to convey humor creatively

### Image Generation: **PROVIDE PROMPTS**
- Client has Gemini Pro subscription
- Write detailed image generation prompts for each section
- Client will generate and refine images separately
- Images should be satirical/funny, not just decorative

### Process Preference: **STEP-BY-STEP**
- Build one section at a time
- Content/copy approval BEFORE coding
- Review and refine before moving to next section
- Quality over speed, always

---

## Research Findings

### dbrand Humor DNA (How to Write Like Them)

**Source References:**
- Edify Content: https://edifycontent.com/blog/copy-talk-dbrand-shows-us-how-good-writing-is-done
- Medium Branding Maniacs: https://medium.com/@dhrpatel1995/branding-maniacs-dbrand-5185e4cd959b
- Dentsu Webchutney: https://webchutney.medium.com/is-dbrand-d-most-de-brand-brand-c07a7d743ee5

**Core Techniques:**
1. **Trademark symbols on absurd claims** - "The Idiot-proof Screen Protector.™"
2. **Self-deprecating corporate awareness** - Acknowledge being "just like evil megacorps"
3. **Customer roasting** - "You're fat. Our skins aren't."
4. **Direct address** - "That means you"
5. **Brazen honesty wrapped in snark** - "Cows died for this"
6. **Pop culture jabs** - "Checkmate, Tim" (Apple CEO)
7. **Absurdist feature descriptions** - "clicky buttons" as primary selling point
8. **Zero hedging** - Never say "might" or "could" or "we think"
9. **Call employees "robots"** - Eccentric brand personality

**Copy Formula:**
```
[Bold claim]™ + [Insulting clarification] + [Direct address to reader]
```

**Example Transformations:**
| Before | After (dbrand-style) |
|--------|---------------------|
| "We offer unlimited PTO" | "Unlimited PTO.™ Use it and find out what happens." |
| "Great work-life balance" | "Your work-life balance didn't stand a chance. Neither did the last three employees." |
| "Competitive salary" | "Competitive.™ (With unpaid internships.)" |

---

### 2025 Landing Page Trends

**Source References:**
- Outbrain: https://www.outbrain.com/blog/landing-page-design-trends/
- Codrops GSAP Guide: https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/
- Framer Motion Docs: https://motion.dev/docs/react-scroll-animations
- LogRocket: https://blog.logrocket.com/react-scroll-animations-framer-motion/

**Must-Have Elements:**
1. **Scroll-driven storytelling** - Content unfolds narratively
2. **Parallax depth layers** - Background/foreground at different speeds
3. **Micro-interactions everywhere** - Everything responds to user input
4. **Cinematic section transitions** - Sections flow like scenes
5. **Supersized typography** - Hero text that commands attention
6. **Performance-first animations** - Use transform/opacity for 60fps
7. **Section pinning** - Elements that stay fixed while content scrolls

**Animation Best Practices:**
- Prefer `transform` and `opacity` for hardware acceleration
- Honor `prefers-reduced-motion` for accessibility
- Use Framer Motion's `useScroll` and `useTransform` for scroll-linked animations
- GSAP ScrollTrigger for complex pinning scenarios

---

## Current Landing Page Structure

### What Exists Now
```
LandingPage.jsx
├── Header (to be redone separately)
├── Hero
│   ├── Eyebrow badge ("Now Accepting Applications")
│   ├── Main headline ("Mandatory Optional Overtime LLC")
│   ├── Subheadline
│   ├── CTA button
│   └── Stats row (3 cards)
├── Marquee ✅
│   ├── Row 1 (10 items, scrolls left)
│   ├── Row 2 (10 items, scrolls right, faster)
│   ├── Pause on hover
│   └── Edge fades + border glows
├── WhyJoinUs (Benefits bento grid - 8 cards)
├── Testimonials ✅
│   ├── 6 satirical employee testimonials
│   ├── Redacted names, 5-star ratings
│   ├── Hidden lines revealed on hover
│   └── Staggered card animations
├── ProcessTimeline ✅
│   ├── 5 steps: Discovery → Denial → Assessment → Purgatory → Resolution
│   ├── Animated progress line fills on scroll
│   ├── Horizontal (desktop) / Vertical (mobile)
│   └── Step hover effects with icon glow
├── Awards ✅
│   ├── 6 satirical corporate awards
│   ├── Shimmer effect on hover
│   ├── Footnotes section with asterisk explanations
│   └── Hover highlights corresponding footnote
├── Comparison ✅
│   ├── Us vs. Functional Employers table
│   ├── Staggered row reveal animations
│   ├── Row hover highlights
│   └── Footnotes for asterisked items
├── FAQ ✅ NEW
│   ├── 8 satirical Q&A pairs
│   ├── Accordion expand/collapse
│   ├── Staggered item reveals
│   └── Smooth height animations
├── Disclaimer (Breaks character, explains it's satire)
└── Footer
```

### What's Missing (Gap Analysis)

| Section | Status | Priority |
|---------|--------|----------|
| Marquee/Ticker | ✅ Complete | 1 |
| Testimonials | ✅ Complete | 2 |
| Application Process Timeline | ✅ Complete | 3 |
| Awards & Recognition | ✅ Complete | 4 |
| Comparison Table | ✅ Complete | 5 |
| Company Timeline | ⏭️ Skipped (redundant with ProcessTimeline) | 6 |
| FAQ Section | ✅ Complete | 7 |
| Scroll Animations (enhanced) | ❌ Missing | 8 |
| Copy Sharpening Pass | ❌ Missing | 9 |

---

## Implementation Plan & Checklist

### Build Order Rationale
1. Start with highest visual impact, lowest complexity
2. Build momentum with quick wins
3. Group similar work together
4. Save scroll animation polish for end (applies to all sections)

### Master Checklist

#### Step 0: Foundation
- [x] Conduct comprehensive research
- [x] Create handoff document
- [ ] Client reviews and approves document

#### Step 1: Marquee/Ticker Section
- [x] Write copy/content for approval
- [x] Get client approval on content
- [x] Build component structure
- [x] Add CSS styling (match design system)
- [x] Add micro-interactions
- [x] Write Gemini image prompts (if applicable) — N/A for this section
- [x] Client review and refinement
- [x] Lock and move to next section ✅ COMPLETE

#### Step 2: Testimonials Section
- [x] Write copy/content for approval
- [x] Get client approval on content
- [x] Build component structure
- [x] Add CSS styling (match design system)
- [x] Add micro-interactions (hover reveals, etc.)
- [x] Write Gemini image prompts (employee portraits) — See below
- [ ] Client review and refinement
- [ ] Lock and move to next section

#### Step 3: Application Process Timeline
- [x] Write copy/content for approval
- [x] Get client approval on content
- [x] Build component structure
- [x] Add CSS styling (match design system)
- [x] Add micro-interactions (step animations, progress line fills on scroll)
- [x] Write Gemini image prompts (step icons) — Using Lucide icons
- [ ] Client review and refinement
- [ ] Lock and move to next section

#### Step 4: Awards & Recognition
- [x] Write copy/content for approval
- [x] Get client approval on content
- [x] Build component structure
- [x] Add CSS styling (match design system)
- [x] Add micro-interactions (shimmer effect, footnote highlight on hover)
- [x] Write Gemini image prompts (award badges) — Using Lucide icons
- [ ] Client review and refinement
- [ ] Lock and move to next section

#### Step 5: Comparison Table
- [ ] Write copy/content for approval
- [ ] Get client approval on content
- [ ] Build component structure
- [ ] Add CSS styling (match design system)
- [ ] Add micro-interactions (row highlights)
- [ ] Client review and refinement
- [ ] Lock and move to next section

#### Step 6: Company Timeline
- [ ] Write copy/content for approval
- [ ] Get client approval on content
- [ ] Build component structure
- [ ] Add CSS styling (match design system)
- [ ] Add scroll-triggered animations
- [ ] Client review and refinement
- [ ] Lock and move to next section

#### Step 7: FAQ Section
- [ ] Write copy/content for approval
- [ ] Get client approval on content
- [ ] Build component structure (accordion)
- [ ] Add CSS styling (match design system)
- [ ] Add micro-interactions (expand/collapse)
- [ ] Client review and refinement
- [ ] Lock and move to next section

#### Step 8: Scroll Animations Enhancement Pass
- [ ] Add parallax to background elements
- [ ] Add scroll-triggered section reveals
- [ ] Add scroll-linked progress indicator
- [ ] Implement section pinning where appropriate
- [ ] Performance testing (60fps target)
- [ ] Reduced motion fallbacks
- [ ] Client review and refinement

#### Step 9: Copy Sharpening Pass
- [ ] Review all copy for dbrand-level snark
- [ ] Add trademark symbols where appropriate
- [ ] Ensure consistent voice throughout
- [ ] Add easter eggs and hidden jokes
- [ ] Final client review

---

## Section Specifications

### 1. Marquee/Ticker Section

**Placement:** Between Hero and WhyJoinUs

**Purpose:** High-impact visual element that immediately reinforces the satirical tone and adds dynamic motion to the page.

**Design:**
- Infinite horizontal scroll (two rows, opposite directions)
- Dark background with subtle border
- Items separated by decorative elements (dots, pipes, or custom icons)
- Smooth, continuous motion (not jerky)

**Content Ideas:**
- Fake press quotes with sources
- Absurd statistics
- "Awards" with asterisks
- Company slogans
- Warning messages

**Technical Notes:**
- Use CSS animation for infinite scroll (performant)
- Duplicate content for seamless loop
- Pause on hover (optional micro-interaction)
- Respect prefers-reduced-motion

---

### 2. Testimonials Section

**Placement:** After WhyJoinUs

**Purpose:** Mock social proof with hilariously bad "employee" testimonials that look legitimate at first glance.

**Design:**
- Grid or carousel of testimonial cards
- "Employee" photos (AI-generated via Gemini)
- Star ratings (all 5 stars with concerning quotes)
- Redacted names for humor
- Glassmorphism card styling

**Content Structure:**
```
{
  name: "████ ███████",
  role: "Former Senior Synergy Analyst",
  tenure: "2 weeks",
  rating: 5,
  quote: "The quote that sounds positive but is actually concerning",
  image: "gemini-generated-portrait.jpg"
}
```

**Micro-interactions:**
- Cards lift on hover
- Star rating animates in
- Quote reveals additional "redacted" text on hover

---

### 3. Application Process Timeline

**Placement:** After Testimonials

**Purpose:** Set expectations for the absurd journey ahead while maintaining the satirical corporate tone.

**Design:**
- Horizontal or vertical timeline
- Numbered steps with icons
- Progress line connecting steps
- Each step has title + description

**Content Structure:**
```
Step 1: "Discover Our Posting" - "You clicked. That was your first mistake."
Step 2: "Question Everything" - "This is normal. Embrace the doubt."
Step 3: "47 Assessments" - "Skills, personality, blood type. The usual."
Step 4: "The Waiting" - "6-8 business months. Maybe longer."
Step 5: "Professional Ghosting" - "We'll be in touch.™"
```

**Micro-interactions:**
- Steps animate in on scroll
- Icons have hover animations
- Progress line fills as user scrolls

---

### 4. Awards & Recognition

**Placement:** After Process Timeline

**Purpose:** Mock corporate credibility with obviously fake awards and excessive footnote asterisks.

**Design:**
- Award "badges" or "trophies" in a row/grid
- Each award has name, year, and asterisk count
- Footnotes section at bottom explaining all asterisks
- Subtle shimmer/glow on badges

**Content Structure:**
```
{
  name: "Best Workplace Culture****",
  year: "2024",
  source: "Internal Survey"
}

Footnotes:
* Per our internal survey
** Of companies we surveyed
*** We surveyed ourselves
**** Citation pending indefinitely
```

**Gemini Image Prompts Needed:**
- Fake award badge designs
- Trophy illustrations
- Certificate graphics

---

### 5. Comparison Table

**Placement:** After Awards

**Purpose:** Sharp humor through direct comparison format. "Why choose us vs. reasonable employers?"

**Design:**
- Clean table layout
- "Us" column vs "Them" column
- Checkmarks and X marks (but inverted humor)
- Row hover highlights

**Content Structure:**
| Feature | Mandatory Optional Overtime | Functional Employers |
|---------|---------------------------|---------------------|
| Unlimited PTO | Yes* | Yes |
| *Actually Unlimited | No | Yes |
| Remote Work | "Flexible"** | Yes |
| Living Wage | Competitive*** | Yes |

---

### 6. Company Timeline

**Placement:** After Comparison

**Purpose:** Build the fictional world with an absurd origin story.

**Design:**
- Vertical timeline with alternating sides
- Year markers with brief descriptions
- Connecting line with animated progress
- Milestone markers

**Content Ideas:**
```
2024 Q1: "Founded on the ashes of a failed pivot"
2024 Q2: "Achieved 0% voluntary retention (efficiency!)"
2024 Q3: "Won 'Best Company' award (self-nominated)"
2024 Q4: "Disrupted the disruption industry"
2025 Q1: "You are here. Regretting it already."
```

---

### 7. FAQ Section

**Placement:** Before Disclaimer (after Timeline)

**Purpose:** Address "objections" with maximum snark. Last content section before final CTA.

**Design:**
- Accordion-style expand/collapse
- Question on closed state
- Answer reveals on click
- Smooth height animation

**Content Structure:**
```
Q: "Is this a real job?"
A: "Define 'real.' Define 'job.' Actually, don't. Just apply."

Q: "What's the salary?"
A: "Competitive.™ (With unpaid internships in developing nations.)"

Q: "Why should I apply?"
A: "You probably shouldn't. And yet, here you are. Curious."

Q: "Do you offer remote work?"
A: "Yes! As long as you're available 24/7, respond within 3 minutes, and your 'remote' location is within eyesight of your manager."
```

---

## Design System Reference

### Quick Reference (from globals.css)

**Colors:**
```css
--bg-void: #0a0908;
--bg-dark: #1c1917;
--bg-elevated: #292524;
--primary-orange: #ea580c;
--primary-amber: #f59e0b;
--text-primary: #fafaf9;
--text-secondary: #d6d3d1;
--text-tertiary: #a8a29e;
```

**Spacing (8px base):**
```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-6: 48px;
--space-8: 64px;
```

**Border Radius:**
```css
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-full: 9999px;
```

**Animations:**
```css
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-normal: 300ms;
--duration-slow: 500ms;
```

**Glassmorphism Pattern:**
```css
.liquid-glass {
  background: rgba(41, 37, 36, 0.8);
  backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(217, 119, 6, 0.12);
}
```

---

## Quality Standards

### Code Quality Checklist
- [ ] Uses CSS variables from design system (no hardcoded colors)
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)
- [ ] Respects `prefers-reduced-motion`
- [ ] Semantic HTML structure
- [ ] Consistent naming conventions
- [ ] Component properly exported and imported
- [ ] No console errors or warnings

### Design Quality Checklist
- [ ] Matches existing section styling
- [ ] Proper spacing using design system
- [ ] Smooth animations (60fps)
- [ ] Hover states on interactive elements
- [ ] Visual hierarchy is clear
- [ ] Typography is consistent

### Copy Quality Checklist
- [ ] dbrand-level snark (no hedging)
- [ ] Trademark symbols where appropriate
- [ ] Direct address to reader
- [ ] Self-aware corporate irony
- [ ] Consistent voice with existing sections

---

## Session Notes

### Session 1 - November 22, 2024
**What was accomplished:**
- Conducted comprehensive research on dbrand humor style
- Researched 2025 landing page trends
- Analyzed current landing page structure
- Identified gaps and missing sections
- Created implementation plan with build order
- Established client preferences (max aggression, all micro-interactions, provide Gemini prompts)
- Created this handoff document
- **Built Marquee/Ticker section:**
  - Two rows scrolling opposite directions
  - 20 satirical corporate messages
  - Pause on hover, item glow effects
  - Edge fades, border glows
  - Responsive design, reduced-motion support
  - Files: `components/Marquee/Marquee.jsx`, `components/Marquee/Marquee.module.css`

**Next session should:**
1. Get client review/approval of Testimonials section
2. Generate employee portrait images with Gemini (prompts below)
3. Start Step 3: Application Process Timeline

**Important context:**
- Header is being redone in a separate session (skip for now)
- Client wants to see copy BEFORE any code is written
- Break work into small, focused steps for maximum quality
- Animation library: **GSAP** (not Framer Motion) per DesignSystem.md

---

### Session 2 - November 22, 2024 (Continued)
**What was accomplished:**
- **Built Testimonials section** - 6 satirical employee testimonials with redacted names, hidden hover reveals, star animations
- **Built ProcessTimeline section** - 5-step timeline with scroll-linked progress line animation
- **Built Awards section** - 6 satirical corporate awards with asterisk footnotes, shimmer effects
- **Built Comparison section** - "Us vs. Functional Employers" table with staggered row reveals
- **Built FAQ section** - 8 Q&A accordions with smooth height animations
- **Added ScrollProgress component** - Fixed progress bar at top showing scroll position
- **Scroll animations enhancement pass:**
  - Added GSAP ScrollTrigger parallax to Hero (glow orbs), WhyJoinUs, Testimonials, ProcessTimeline, Awards
  - All background glows now have subtle parallax movement on scroll
  - Respects reduced-motion preferences throughout
- **Copy sharpening pass:**
  - Enhanced Marquee items (NaN instead of Undefined, more dbrand-level zingers)
  - Sharpened Comparison table entries ("lol", "Error 404", "Career Labyrinth")
  - Updated testimonial hidden lines for more punch
  - Polished Disclaimer CTA copy

**Files created/modified:**
- `components/Testimonials/Testimonials.jsx` + `.module.css`
- `components/ProcessTimeline/ProcessTimeline.jsx` + `.module.css`
- `components/Awards/Awards.jsx` + `.module.css`
- `components/Comparison/Comparison.jsx` + `.module.css`
- `components/FAQ/FAQ.jsx` + `.module.css`
- `components/ScrollProgress/ScrollProgress.jsx` + `.module.css`
- `components/LandingPage/LandingPage.jsx` (updated imports)
- Added GSAP parallax to: Hero, WhyJoinUs, Testimonials, ProcessTimeline, Awards

**Current landing page structure:**
1. ScrollProgress (fixed)
2. Header
3. Hero
4. Marquee
5. WhyJoinUs
6. Testimonials
7. ProcessTimeline
8. Awards
9. Comparison
10. FAQ
11. Disclaimer + Final CTA
12. Footer

**What's next:**
- Generate testimonial portrait images using Gemini prompts (already in doc)
- Generate award badges if desired
- Review landing page in browser and refine any visual issues
- Header redesign (separate session)

**Build status:** ✅ Passes (npm run build succeeds)

---

### Session Template (Copy for future sessions)

```
### Session [X] - [Date]
**What was accomplished:**
- [Item 1]
- [Item 2]

**What's next:**
- [Next step from checklist]

**Blockers/Notes:**
- [Any issues or decisions needed]
```

---

## Gemini Image Prompt Templates

### Employee Portrait Template
```
Professional corporate headshot photograph of a [gender] [age range] office worker.
Wearing [business casual/formal attire]. Neutral grey background.
Slightly forced smile that doesn't reach the eyes.
The subtle look of someone who has attended too many mandatory meetings.
High quality, realistic, suitable for a corporate website testimonial section.
Style: Stock photo aesthetic but with a hint of existential dread.
```

### Award Badge Template
```
Luxurious corporate award badge design. Gold and dark grey color scheme.
Text reads: "[Award Name]"
Laurel wreath border. Ribbon banner at bottom with year "[Year]".
Excessive shine and polish. Looks prestigious but slightly over-designed.
Style: The kind of award a company gives itself.
```

### Office Environment Template
```
Modern open-plan office space. Minimalist design with grey tones.
Ping pong table visible but clearly unused and dusty.
Motivational poster on wall with generic inspirational quote.
Empty desks with monitors showing spreadsheets.
Fluorescent lighting creating a slightly oppressive atmosphere.
Style: Corporate dystopia meets Silicon Valley aesthetic.
```

---

## Testimonials Section - Specific Portrait Prompts

Save these to `/public/testimonials/` as `employee-1.jpg` through `employee-6.jpg`:

### Employee 1 (████████ ██████ - Former Senior Synergy Analyst)
```
Professional corporate headshot of a woman in her early 30s. Business casual attire (navy blazer). Clean grey studio background. Polished but generic appearance - the kind of stock photo that appears on every corporate website. Pleasant smile that doesn't quite reach the eyes. Subtle hint of exhaustion beneath the professional veneer. High resolution, well-lit, suitable for web.
```

### Employee 2 (J███ D██ - Ex-Chief Happiness Officer)
```
Professional corporate headshot of a man in his late 20s. Wearing a light blue button-down shirt, no tie. Warm grey background. Overly enthusiastic smile - almost unsettlingly happy. The kind of expression HR would approve of. Clean-shaven, well-groomed. Looks like he just finished mandatory team-building exercises. High resolution, professional lighting.
```

### Employee 3 (██████ ████████ - Unpaid Intern CEO Track)
```
Professional corporate headshot of a young person in their early 20s. Wearing multiple items suggesting "many hats" - maybe a lanyard with several badges, or layered business casual. Slightly overwhelmed expression hidden behind a polite smile. Fresh out of college energy mixed with dawning realization. Neutral background, professional quality.
```

### Employee 4 (A█████ ███████ - Director of Doing More With Less)
```
Professional corporate headshot of a woman in her 40s. Executive attire (charcoal blazer, simple jewelry). Sophisticated grey background. Knowing, sardonic half-smile - the expression of someone who has seen things. Distinguished but tired. Silver-streaked hair adds gravitas. The kind of leader who's survived multiple "restructurings." High resolution.
```

### Employee 5 (██████████ K. - Ex-VP of Mandatory Fun)
```
Professional corporate headshot of a man in his mid-30s. Casual Friday attire (henley shirt, blazer optional). Looking slightly off-camera as if checking the exit. Friendly but distracted expression. The badge on his lanyard is prominently visible and slightly crooked. Hints of "I should not still be here" energy. Professional quality, warm lighting.
```

### Employee 6 ([REDACTED] - Meeting Scheduler III)
```
Professional corporate headshot that's intentionally obscured or corrupted. Perhaps heavy lens flare, or the face is partially in shadow. Alternatively: a completely generic, almost AI-generated-looking face that feels uncanny. Gender ambiguous, age indeterminate. The person who knows too much. Unsettling but professional quality.
```

---

*End of Document*
