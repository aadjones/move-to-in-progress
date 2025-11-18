# Nightmare Zone Components

Components extracted from the NightmareZone god object to improve modularity and testability.

## Components

### EscapeHatchPanel
Emergency exit options that appear when player has accumulated too many tasks.

**Props:**
- `visible`: boolean - Whether the panel should display
- `onBurnItDown`: () => void - Handler for "burn it all down" ending
- `onDelegate`: () => void - Handler for "delegate" ending
- `onAssimilate`: () => void - Handler for "join bureaucracy" ending

### ToastManager
Notification toast system that spams messages during chaos phase.

**Props:**
- `active`: boolean - Whether toasts should spawn
- `messages`: string[] - Pool of messages to randomly select from
- `spawnInterval`: number (optional, default: 2500ms) - Time between toasts
- `toastDuration`: number (optional, default: 3000ms) - How long each toast displays
- `onToastAppear`: () => void (optional) - Callback when toast spawns (e.g., play sound)

### BlockedTaskModal
Modal displaying satirical bureaucratic reasons why a task is blocked.

**Props:**
- `visible`: boolean - Whether modal should display
- `taskTitle`: string - Title of the blocked task
- `blockedReason`: string - Bureaucratic explanation
- `onClose`: () => void - Handler to dismiss modal

### TaskItem
Individual task card rendering with all visual effects.

**Props:**
- `task`: Task - The task to render
- `stage`: GameStage - Current game stage for styling
- `cursorDrift`: number - Amount of cursor drift to apply
- `isDiscoveredBlocked`: boolean - Whether this blocked task has been clicked
- `onTaskClick`: (task: Task) => void - Handler when task is clicked

## Refactoring Progress

- **Original NightmareZone**: 613 lines
- **After all extractions**: 318 lines
- **Reduction**: 295 lines (-48%)

### Extracted Components
1. **EscapeHatchPanel** (~30 lines extracted)
2. **ToastManager** (~20 lines extracted)
3. **BlockedTaskModal** (~35 lines extracted)
4. **TaskItem** (~60 lines extracted)

### Extracted Hooks
5. **useCursorDrift** (~10 lines extracted)
6. **useStageProgression** (~25 lines extracted)
7. **useTaskAutomation** (~45 lines extracted)
8. **useEscapeHatches** (~20 lines extracted)
9. **useMainButton** (~25 lines extracted)

### Extracted Utilities
10. **getBlockedReason** (~70 lines extracted)

## Current State

NightmareZone is now **318 lines** - closing in on the target of 200-250 lines for orchestrator-only code. The component is now focused purely on:
- UI orchestration and layout
- Event handling coordination
- Rendering extracted components

The remaining code is primarily JSX and thin event handlers. Major business logic has been successfully extracted into testable, reusable units.
