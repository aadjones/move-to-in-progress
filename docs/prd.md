# Move to In Progress - PRD (Revised for Claude Code)

**Platform**: Web (React + TypeScript)

**Build Environment**: Claude Code

**Duration**: 3-5 minute experience

**Genre**: Interactive satire / UI horror

## Core Concept

A fake project management tool that begins as a believable ClickUp/Jira clone. When the user drags a task to "In Progress," the interface unravels into a recursive bureaucratic nightmare that satirizes modern knowledge work.

## Technical Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Drag/Drop**: Custom mouse-based implementation (HTML5 drag API has sandbox issues)
- **Audio**: Tone.js for sound generation and distortion
- **Animation**: CSS transitions + requestAnimationFrame for smooth effects

## User Journey

### Phase 1: The Believable Board (30 seconds)

**What the user sees:**

- Clean, minimal ClickUp-style board
- Two columns: "To Do" and "In Progress"
- One task card: "Refactor Notifications System"
- Realistic styling: rounded cards, tags, avatar, timestamps
- Smooth drag-and-drop interaction

**Technical requirements:**

- Mouse-based drag (not HTML5 drag API)
- Ghost card follows cursor during drag
- Card snaps to column on release
- Dragging between To Do ↔ To Do works normally

**Key detail**: Must feel like a real tool. No hints of what's coming.

### Phase 2: The Fall (10-15 seconds)

**Trigger**: User drops task into "In Progress" column

**What happens:**

1. Card hesitates slightly (elastic pull)
2. Card falls off the board downward
3. Page extends to 3000-4000px height
4. User must scroll down to chase the falling card
5. As they scroll:
    - UI colors shift (hue rotation)
    - Floating text fragments appear: "BLOCKED", "DEPRECATED", "Sprint 5", "404"
    - Scanline glitch overlay intensifies
    - Subtle distorted ping sounds begin

**Technical requirements:**

- Falling card: 2-3 second animation with cubic easing
- Dynamic page height extension
- Scroll-based glitch intensity (0 to 1 based on scroll position)
- Fragment spawning every 300ms during fall
- Audio: realistic Slack ping → pitch shift down → stretched tone

**Key detail**: User actively chases the card. They're complicit.

### Phase 3: The Ground (2 seconds)

**What happens:**

- Card lands at ~3000px
- When user scrolls to ~2500px, screen locks
- Scroll disabled
- Red line appears: "▼ YOU HAVE REACHED THE BOTTOM ▼"

**Technical requirements:**

- Detect scroll position
- Lock: [`document.body.style](http://document.body.style).overflow = 'hidden'`
- Trigger Phase 4

### Phase 4: Recursive Subtask Nightmare (2-3 minutes)

**What the user sees:**

- Dark overlay (black background, 90% opacity)
- Original task card centered in white
- Large glowing green button: "✓ Mark Complete"

**First click on "Mark Complete":**

- Spawns 2-3 subtasks below the main card
- Each subtask has:
    - Realistic title (e.g., "Schedule sync with frontend team")
    - Red status: "BLOCKED: timezone conflicts"
    - Small "Expand" button

**Clicking "Expand" on any subtask:**

- Spawns 1-2 more subtasks
- Hydra logic: tasks multiply faster than you can handle them

**Escalating chaos (as subtask count grows):**

**At 3+ subtasks:**

- Cursor starts drifting (offset by 2-5px randomly every 100ms)
- Subtasks wiggle horizontally using sin wave

**At 5+ subtasks:**

- Text appears: "You cannot escape this"
- Ping frequency increases
- Some subtask titles begin to mutate:
    - "Schedule sync" → "Schedule Steve" → "Steve"
    - "Clarify scope" → "Clarify existence"

**At 10+ subtasks:**

- Cursor drift increases to 20px
- Subtasks start moving away from cursor on hover
- Dragging becomes sticky/slow
- One subtask auto-expands on its own

**At 15+ subtasks:**

- Fake Slack toasts appear:
    - "Just checking in on this 😅"
    - "Can we get eyes on this today?"
    - "Adding legal for visibility"
- Toast frequency increases
- Screen begins to flicker

**Subtask Templates:**

```tsx
const subtasks = [
  { title: "Schedule sync with frontend team", status: "BLOCKED: timezone conflicts" },
  { title: "Clarify notification scope with legal", status: "BLOCKED: link is 404" },
  { title: "Confirm with Steve", status: "BLOCKED: Steve has left the company" },
  { title: "Define 'Done'", status: "BLOCKED: team not aligned" },
  { title: "Migrate legacy types", status: "BLOCKED: docs incomplete" },
  { title: "Update test coverage", status: "BLOCKED: CI is down" },
  { title: "Review PR #2847", status: "BLOCKED: merge conflict" },
  { title: "Deploy to staging", status: "BLOCKED: staging is prod" },
  { title: "Get approval from PM", status: "BLOCKED: PM on PTO" },
  { title: "Fix flaky tests", status: "BLOCKED: tests are flaky" },
];
```

### Phase 5: The Cursed Choice (Final)

**Trigger**: After 20+ subtasks OR 90 seconds in nightmare mode

**Two buttons appear:**

**Option 1: "🚪 Mark Complete"**

- Board collapses with animation
- Modal appears: "Project cloned to Q3 Sprint. Assigned to you."
- Fade to original board
- Task reappears with slightly different name: "Refactor Notifications System v2"
- Loop implied but not forced

**Option 2: "🪞 Leave Board"**

- UI dims and fades
- Modal: "You've been removed as assignee. You're now a watcher."
- Another user avatar appears on the original task
- Ghost user drags the card to "In Progress"
- It falls again (user spectates their replacement's doom)

**Alternative endings (pick one or offer choice):**

- "Assign to teammate" → your own name is the only option
- "Escalate to manager" → "No manager found"
- "Delete task" → "You do not have permission"

## Audio Design

**Phase 1**: Silence

**Phase 2 (Descent):**

- Slack ping sound (realistic)
- As glitch intensity increases: pitch shift down, reverb, distortion
- Final: sustained low drone

**Phase 4 (Nightmare):**

- Ping every 3-5 seconds
- Frequency increases with subtask count
- At 15+ subtasks: overlapping pings create chaos
- Optional: distorted keyboard typing sounds

**Technical**: Use Tone.js for real-time pitch shifting and effects

## Visual Style

**Initial State:**

- Color palette: Purple/blue gradients (ClickUp-inspired)
- Font: Inter or similar clean sans-serif
- Rounded corners, subtle shadows
- Professional, trustworthy

**Corruption Progression:**

- Hue rotation: purple → green → red
- Contrast increase
- Scanline overlay (CSS repeating gradient)
- Flickering (opacity animation)

**Nightmare Mode:**

- Dark background (#1a1a1a)
- High contrast white cards
- Red accent for blocked status
- Pulsing animations

## Key Interactions

1. **Cursor drift**: Apply random offset to cursor position, increasing with chaos level
2. **Card avoidance**: When hovering subtask, move it away using transform
3. **Sticky drag**: Increase drag friction by delaying position updates
4. **Auto-expansion**: Randomly trigger "Expand" on a subtask without user input
5. **Title mutation**: Randomly alter subtask text over time

## File Structure

```
src/
├── components/
│   ├── TaskBoard.tsx          # Main board (Phase 1)
│   ├── TaskCard.tsx           # Draggable card component
│   ├── FallingCard.tsx        # Animated falling card (Phase 2)
│   ├── NightmareZone.tsx      # Recursive subtask hell (Phase 4)
│   ├── FloatingFragments.tsx  # Glitch UI elements
│   └── EndingModal.tsx        # Final choice (Phase 5)
├── hooks/
│   ├── useDrag.ts             # Custom drag logic
│   ├── useGlitch.ts           # Glitch intensity calculator
│   └── useAudio.ts            # Tone.js sound management
├── data/
│   └── subtasks.ts            # Subtask templates
├── types/
│   └── index.ts               # TypeScript interfaces
└── App.tsx                     # Main orchestrator
```

## Implementation Priority

**Sprint 1: Core Loop (Minimal Viable Satire)**

1. Draggable board with two columns
2. Falling card animation
3. Nightmare zone with "Mark Complete" button
4. Basic subtask spawning (no chaos mechanics yet)
5. One ending

**Sprint 2: Chaos Mechanics**

1. Cursor drift
2. Subtask wiggle/avoidance
3. Audio (basic pings)
4. Glitch visuals during fall

**Sprint 3: Polish**

1. Title mutations
2. Slack toast notifications
3. Audio distortion effects
4. Both endings
5. Timing/pacing refinement

## Success Metrics

**Emotional arc:**

- Initial trust → confusion → panic → resignation → dark laughter

**The joke lands if:**

- User feels complicit (they chose to drag it)
- Escalation feels inevitable but absurd
- Details are painfully relatable
- Ending offers no real escape

## Critical Design Principles

1. **The joke is in the truth**: Every subtask blocker should be realistic
2. **The horror is in the system logic**: Not jump scares, but bureaucratic dread
3. **Subtlety before chaos**: Start believable, escalate gradually
4. **Player agency → futility**: Let them try, then remove control
5. **3-5 minutes total**: Respect the user's time, land the punch, get out

## Notes for Claude Code

- Use TypeScript for type safety
- Component-based architecture for easy testing
- State management: useState is fine, no need for Redux
- Test drag interaction early and often
- Audio can be added last if needed
- Focus on timing/pacing - this makes or breaks the experience

## Optional Enhancements (If Time Permits)

- **Export gag**: Fake "Export Sprint Summary" button that downloads absurd PDF:
    - "Time In Progress: 97 years"
    - "Stakeholders Consulted: ∞"
    - "Velocity: -12"
- **Audit log lies**: Fake timestamps that contradict themselves
- **Ghost tasks**: Grayed-out tasks from "previous sprints" appear and disappear
- **The Watcher**: After choosing "Leave Board", occasionally show notification that someone is watching you

## Tone Reference

This is **The Stanley Parable** meets **Getting Over It** meets every standup meeting where someone says "just waiting on..."

The user should finish feeling seen, exhausted, and slightly unnerved.