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

## Refactoring Progress

- **Original NightmareZone**: 613 lines
- **After extractions**: 538 lines
- **Reduction**: 75 lines (-12%)

## Future Extractions

Components still to extract from NightmareZone:
- TaskListView (~100 lines) - Task rendering and layout
- ChaosEffects (hook) (~80 lines) - Cursor drift and visual chaos
- Task button logic and rendering

Target: Reduce NightmareZone to ~200-250 lines (orchestrator only)
