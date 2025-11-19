# Architecture: Move to In Progress

> **TL;DR**: An interactive satire game disguised as a task management tool. The architecture is designed as a **descending elevator through corporate hell**, where each phase represents a distinct floor that progressively breaks the player's sanity.

---

## 🎮 The Game Metaphor

Think of the entire application as **a trap door that opens beneath you**:

```
┌─────────────────────────────────────┐
│  FLOOR 0: Normal Kanban Board       │  ← You start here (safe, predictable)
│  "Just drag this card..."           │
└─────────────────────────────────────┘
              ↓ [User drags card]
┌─────────────────────────────────────┐
│  FLOOR -1: The Fall                 │  ← Card falls infinitely
│  "Keep scrolling to catch it..."    │     (you chase the card down)
└─────────────────────────────────────┘
              ↓ [5000px scroll]
┌─────────────────────────────────────┐
│  FLOOR -2: Ground Hit               │  ← Brief moment of relief
│  "You've reached the bottom"        │
└─────────────────────────────────────┘
              ↓ [3 second timer]
┌─────────────────────────────────────┐
│  FLOOR -3: Bureaucratic Hell        │  ← The nightmare begins
│  "Complete 1 task to proceed..."    │     (spoiler: it multiplies)
│   └→ 1 becomes 2 becomes 4...       │
└─────────────────────────────────────┘
              ↓ [Escape or completion]
┌─────────────────────────────────────┐
│  FLOOR -4: The Ending               │  ← Different exits based on
│  "You completed X tasks..."         │     how you escaped
└─────────────────────────────────────┘
```

Each floor is a **phase** in the game. The architecture enforces this linear descent—there's no going back up.

---

## 🏗️ System Architecture (High-Level)

### The Three Pillars

The entire system rests on three interconnected systems:

```
┌──────────────────────────────────────────────────────────────┐
│                      🧠 STATE MACHINE                        │
│          (GameStateMachine - The Brain)                      │
│   Controls which "floor" you're on and when you descend      │
└──────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌───────────────────┐                  ┌────────────────────┐
│   📊 TASK GRAPH   │                  │   🎨 REACT UI      │
│   (TaskManager)   │ ←──────────────→ │   (Components)     │
│                   │                  │                    │
│ Generates tasks   │                  │ Displays current   │
│ & dependencies    │                  │ phase visually     │
└───────────────────┘                  └────────────────────┘
         ↓                                       ↓
┌───────────────────┐                  ┌────────────────────┐
│  🎯 INTERACTIONS  │                  │   🔊 AUDIO         │
│  (Mini-games)     │                  │   (Tone.js)        │
│                   │                  │                    │
│ Task completion   │                  │ Sonic descent      │
│ mechanics         │                  │ (pings → drones)   │
└───────────────────┘                  └────────────────────┘
```

---

## 📂 Directory Map (The Elevator Shafts)

Each directory is like a **service shaft** in the elevator—specialized systems that serve specific floors:

```
/src
│
├── 🎛️ /core                    [THE CONTROL ROOM]
│   └── GameStateMachine.ts      Single source of truth for game state
│                                Finite state machine with 5 phases
│
├── 🏠 /components               [THE FLOORS - Visual layers]
│   ├── TaskBoard.tsx             Phase 1: Normal board (the bait)
│   ├── FallingCard.tsx           Phase 2: Falling animation
│   ├── FloatingFragments.tsx     Phase 2: Glitch particles
│   ├── NightmareZone.tsx         Phase 4: Main gameplay arena
│   ├── GameEndingScreen.tsx      Phase 5: Resolution/endings
│   └── /nightmare/               Sub-components for hell
│       ├── TaskItem.tsx           Individual task cards
│       ├── BlockedTaskModal.tsx   Shows absurd blocking reasons
│       ├── ToastManager.tsx       Notification spam engine
│       └── EscapeHatchPanel.tsx   Emergency exits
│
├── 📊 /taskGraph                [THE BUREAUCRACY ENGINE]
│   ├── types.ts                  Task, Pattern, Archetype definitions
│   ├── taskGenerator.ts          Procedural task factory
│   └── TaskManager.ts            Task orchestration & spawning logic
│
├── 🎯 /interactions             [THE MINI-GAME ARCADE]
│   ├── types.ts                  Interaction definitions
│   ├── interactionRegistry.ts    Maps task types → mechanics
│   ├── InteractionModal.tsx      Container for all interactions
│   └── /components/              Individual mini-games:
│       ├── VideoInteraction           Wait for fake video progress
│       ├── FormInteraction            Fill bureaucratic forms
│       ├── TypingPromptInteraction    Type exact corporate phrases
│       ├── CheckboxesInteraction      Acknowledge policies
│       ├── ScrollDocumentInteraction  Read meaningless jargon
│       └── LoadingDelayInteraction    Wait for fake loading
│
├── 🪝 /hooks                    [THE AUTOMATION SYSTEMS]
│   ├── useStageProgression.ts    Auto-advances nightmare stages
│   ├── useCursorDrift.ts         Progressive cursor interference
│   ├── useTaskAutomation.ts      Background task spawning
│   ├── useEscapeHatches.ts       Escape option handlers
│   ├── useGlitch.ts              Visual corruption effects
│   ├── useDrag.ts                Drag-and-drop mechanics
│   ├── useAudio.ts               Audio playback hooks
│   └── useMainButton.ts          Primary action button logic
│
├── ⚙️ /config                   [THE CONTROL PANEL]
│   ├── gameConfig.ts             Chaos thresholds, audio settings
│   ├── animations.ts             Phase timing constants
│   └── /constants/
│       └── gameBalance.ts         Ending tier thresholds
│
├── 🛠️ /utils                    [THE TOOL SHED]
│   ├── audio.ts                  AudioManager singleton (Tone.js)
│   ├── blockedReasons.ts         Generates absurd blocking messages
│   └── subtaskTree.ts            (Legacy - being replaced)
│
├── 📝 /data                     [THE CONTENT LIBRARY]
│   ├── taskContent.ts            Task descriptions & templates
│   ├── subtasks.ts               Toast messages, flavor text
│   └── characters.ts             NPC personas
│
└── 📋 /types                    [THE BLUEPRINTS]
    └── index.ts                  Global TypeScript types
```

---

## 🎯 Core Gameplay Loop (The Descent)

### Phase Transitions (The Elevator Mechanism)

The game is driven by a **finite state machine** with these phases:

```typescript
type GamePhase =
  | 'board'      // Floor 0: Safe zone
  | 'falling'    // Floor -1: Descent animation
  | 'ground'     // Floor -2: Impact transition
  | 'nightmare'  // Floor -3: Main gameplay
  | 'ending'     // Floor -4: Resolution

// State transitions are ONE-WAY (no going back up):
board → falling → ground → nightmare → ending
```

### The Trigger Chain (How You Fall)

```
👤 User drags task to "In Progress"
    ↓
📋 TaskBoard detects drop event
    ↓
📤 Dispatch: TASK_MOVED_TO_IN_PROGRESS
    ↓
🧠 GameStateMachine transitions: board → falling
    ↓
🎨 App.tsx re-renders with FallingCard component
    ↓
📜 User scrolls 5000px to follow card
    ↓
📤 Dispatch: REACHED_GROUND
    ↓
🧠 State transitions: falling → ground
    ↓
⏱️ 3-second timer completes
    ↓
📤 Dispatch: GROUND_TIMER_COMPLETE
    ↓
🧠 State transitions: ground → nightmare
    ↓
😱 Game begins
```

---

## 🌀 The Nightmare Engine (Core Gameplay)

### The Bureaucratic Hydra

When you enter the nightmare phase, you're stuck in a **corporate compliance portal** that blocks access to your actual work:

```
Initial state:
┌─────────────────────────────────┐
│ ⚠️ Work Blocked                 │
│                                 │
│ "Complete mandatory training    │
│  before accessing task"         │
│                                 │
│  [ Start Training ]             │
└─────────────────────────────────┘

After clicking (Stage 1 → 2):
┌─────────────────────────────────┐
│ 📋 Task Queue (1)               │
│                                 │
│  ☐ Watch Training Video        │ ← Click this
└─────────────────────────────────┘

After completing (Stage 2 → 3):
┌─────────────────────────────────┐
│ 📋 Task Queue (3)  ⬆️ GREW!    │
│                                 │
│  ✓ Watch Training Video        │
│  ☐ Complete Training Quiz       │ ← It spawned 2 children!
│  ☐ Submit Completion Form       │
└─────────────────────────────────┘
```

**The Hook**: Completing tasks **creates more tasks**. The counter never goes down.

### 7 Stages of Nightmare (Progressive Descent)

The nightmare has **7 escalating stages** that auto-advance as task count grows:

| Stage | Tasks | Name | Effects |
|-------|-------|------|---------|
| 1 | 0 | **Initial** | Root task shown, waiting for user |
| 2 | 1+ | **Started** | Tasks begin appearing |
| 3 | 3+ | **Resolving** | Interactions required |
| 4 | 8+ | **Multiplying** | Tasks spawn faster |
| 5 | 12+ | **Mutating** | 🎯 Cursor drift begins |
| 6 | 18+ | **Automation** | 🤖 Tasks spawn in background |
| 7 | 24+ | **Chaos** | 💥 Toast spam, full effects |

**Escape Threshold**: 30-50+ tasks unlocks escape hatches

### Task Generation (The Procedural Factory)

Tasks are generated using **patterns** and **archetypes**:

#### 4 Escalation Patterns
```
1. APPROVAL      → Manager → Director → VP chain
2. CIRCULAR      → Task A blocks Task B blocks Task A (Catch-22)
3. DOCUMENTATION → Docs reference missing docs
4. COMPLIANCE    → Training spawns more training
```

#### 8 Task Archetypes
```
training            → Corporate training modules
approval-request    → Request manager signatures
form-submission     → Bureaucratic forms
documentation       → Read/update docs
system-access       → Portal access requests
meeting             → Schedule meetings
attestation         → Sign policies
compliance          → Compliance checks
```

#### Depth-Based Difficulty Scaling
```
Depth 0-2:  35% tasks blocked, spawns 1-2 children
Depth 3-5:  50% tasks blocked, spawns 2-3 children
Depth 6+:   65% tasks blocked, spawns 3-4 children
```

---

## 🎯 Interaction System (Mini-Games)

Each task requires a **mini-game** to complete. The type depends on the task archetype:

```
Task Archetype       →  Interaction Type      →  Player Action
───────────────────────────────────────────────────────────────
training             →  video                 →  Wait for progress bar
form-submission      →  form                  →  Fill 3-8 fields
attestation          →  typing-prompt         →  Type exact phrase
compliance           →  checkboxes            →  Check all boxes
documentation        →  scroll-document       →  Scroll to bottom
system-access        →  loading-delay         →  Wait for fake system
approval-request     →  multi-step            →  Chain 2-4 interactions
meeting              →  calendar-select       →  Pick time slots
```

**Design Goal**: Make each interaction feel **tedious but plausible**—like real corporate software.

---

## 🔊 Audio Architecture (Sonic Descent)

Audio is **procedurally generated** using Tone.js to reflect game state:

```
Phase        Audio Effect                    Metaphor
─────────────────────────────────────────────────────────
Board        Clean "ping" notification       Normal office sounds
Falling      Pitch-shifted pings (down)      Doppler effect of descent
Ground       Low drone (2 octaves down)      Impact reverb
Nightmare    Repeating pings (faster)        System heartbeat
Chaos        "Knock-knock" sounds            Notification hell
```

**Audio Chain**: `Synth → PitchShift → Reverb → Distortion`

**Dynamic Behavior**:
- Ping frequency increases with task count
- Distortion increases with nightmare stage
- All synthesis happens in real-time (no pre-recorded files)

---

## 🎨 Visual Effects (The Glitch Aesthetic)

### Falling Phase Effects
```
Scroll Progress: 0% → 100%
     ↓
Hue Rotation:    0° → 180°     (colors shift red → blue)
Scanlines:       0% → 50%      (CRT monitor effect)
Fragments:       spawn rate ↑   (particle system)
```

### Nightmare Phase Effects
```
Stage 5 (Mutating):
  • useCursorDrift: Mouse position shifts 5-15px randomly

Stage 6 (Automation):
  • useTaskAutomation: Tasks spawn every 8-12 seconds

Stage 7 (Chaos):
  • ToastManager: Notifications spam every 2-5 seconds
  • Full cursor interference (15-30px drift)
```

---

## 🚪 Escape Hatches (3 Endings)

When task count hits **50+**, player unlocks 3 desperate exits:

```
┌────────────────────────────────────────┐
│  🔥 Burn It Down                       │  → Rage-quit ending
│     "Delete everything and start over" │     (most destructive)
├────────────────────────────────────────┤
│  📧 Delegate to Colleague              │  → Pass-the-buck ending
│     "Forward all tasks to Bob"         │     (self-preservation)
├────────────────────────────────────────┤
│  🤝 Assimilate                         │  → Join-them ending
│     "Become part of the bureaucracy"   │     (most cynical)
└────────────────────────────────────────┘
```

Each ending has a unique **GameEndingScreen** with stats and flavor text.

---

## 🧵 Data Flow Patterns

### State → UI (Downward Flow)
```
GameStateMachine (single source of truth)
        ↓ subscribe
    App.tsx (owns gameState)
        ↓ phase-based routing
    Phase Components (TaskBoard, NightmareZone, etc.)
        ↓ props
    Child Components (TaskItem, InteractionModal, etc.)
```

### UI → State (Event Flow)
```
User Interaction (click, drag, scroll)
        ↓
    Event Handler (onClick, onDrop, etc.)
        ↓
    stateMachine.dispatch(EVENT)
        ↓
    State Transition (internal FSM logic)
        ↓
    Notify Listeners
        ↓
    App re-renders with new state
```

### Task Lifecycle (Hydra Growth)
```
TaskManager (owns Map<id, Task>)
        ↓
    getTasks() → Array
        ↓
    React State (NightmareZone)
        ↓
    User completes interaction
        ↓
    taskManager.completeTask(id)
        ↓
    Spawn 1-4 children based on depth/pattern
        ↓
    Children added to graph
        ↓
    getTasks() → Re-render with new tasks
```

---

## 🛡️ Key Design Decisions

### 1. **Finite State Machine > Redux**
**Why**: Game has 5 discrete phases with clear transitions. FSM is simpler and enforces one-way flow (no going back up the elevator).

### 2. **Procedural Generation**
**Why**: Hand-crafting 50+ tasks would be tedious. Procedural system creates infinite variety while maintaining satirical patterns.

### 3. **Separation: TaskGraph ↔ Interactions**
**Why**: Task logic (dependencies, spawning) is independent of completion mechanics (mini-games). Allows content and mechanics to evolve separately.

### 4. **Custom Hooks for Stage Effects**
**Why**: Each nightmare stage has distinct behaviors (cursor drift, automation). Hooks encapsulate this cleanly without polluting main component.

### 5. **Real-Time Audio Synthesis**
**Why**: Pre-recorded audio would be static. Tone.js allows **dynamic** pitch-shifting and distortion that reflects current game state.

### 6. **No Persistence**
**Why**: This is a single-session experience. When you close the tab, it's gone. Reinforces the futility theme—progress is meaningless.

---

## 🧪 Testing Philosophy

Following the project's testing guidelines:

### ✅ What We Test
- **Core game logic**: Stage progression, cursor drift calculations
- **Task generation**: Blocking reason strings, depth scaling
- **State transitions**: FSM event handling

### ❌ What We Don't Test
- React UI components (no Streamlit-style interaction tests)
- Complex mocking (Tone.js, browser APIs)
- Implementation details (internal function calls)

### 🎯 Test Quality
- **Behavioral assertions**: "Cursor drift increases with stage" (not exact pixel values)
- **Edge cases**: Empty task lists, boundary conditions
- **Fast & isolated**: No external dependencies

---

## 📊 Performance Considerations

### Current Optimizations
- `useMemo` for GameStateMachine instance
- Event listener cleanup in useEffect
- Map-based task storage (O(1) lookup)
- Debounced scroll handlers

### Known Bottlenecks
- **100+ tasks**: May slow rendering (React reconciliation)
- **Continuous scroll**: High-frequency event handlers during falling
- **Audio scheduling**: Many overlapping Tone.js events

---

## 🔮 Future Architecture Ideas

Based on code TODOs:

1. **Template System**: Replace string arrays with proper template engine
2. **Assimilation Endings**: Fully implement role-based endings (manager, director, etc.)
3. **Content Pipeline**: Move task content to JSON files for easier editing
4. **Accessibility**: Add keyboard navigation, screen reader support
5. **Analytics**: Track player behavior (completion rates, escape points)

---

## 🎭 The Satirical Design Loop

Every architectural decision reinforces the satire:

```
State Machine      → Enforces inexorable descent (no escape until threshold)
Task Graph         → Creates exponential complexity (1 → 2 → 4 → 8...)
Interaction System → Creates tedium (watch timers, fill forms, type phrases)
Audio System       → Creates unease (pitch shifts, drones, distortion)
Visual Effects     → Creates corruption (glitches, drift, chaos)
```

**Result**: A memorable critique of corporate tooling that feels *visceral*, not preachy.

---

## 🗺️ Quick Reference Map

| I want to...                          | Look in...                          |
|---------------------------------------|-------------------------------------|
| Add a new game phase                  | `core/GameStateMachine.ts`          |
| Create a new task archetype           | `taskGraph/types.ts`, `taskGenerator.ts` |
| Add a new mini-game interaction       | `interactions/components/`, update registry |
| Change stage progression thresholds   | `config/gameConfig.ts`              |
| Modify audio behavior                 | `utils/audio.ts`, `hooks/useAudio.ts` |
| Edit task descriptions                | `data/taskContent.ts`               |
| Adjust cursor drift intensity         | `hooks/useCursorDrift.ts`           |
| Add a new escape hatch ending         | `components/GameEndingScreen.tsx`   |
| Change falling animation duration     | `config/animations.ts`              |
| Edit blocked task reasons             | `utils/blockedReasons.ts`           |

---

**This architecture is designed to make you feel what the satire criticizes.**

Every technical choice—from the one-way state machine to the exponential task spawning—is in service of that goal. The code *is* the commentary.
