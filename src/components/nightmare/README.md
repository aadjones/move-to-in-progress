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
- **After extractions**: 466 lines
- **Reduction**: 147 lines (-24%)

### Extracted Components
1. **EscapeHatchPanel** (~30 lines extracted)
2. **ToastManager** (~20 lines extracted)
3. **BlockedTaskModal** (~35 lines extracted)
4. **TaskItem** (~60 lines extracted)
5. **useCursorDrift hook** (~10 lines extracted)

## Future Extractions

Components still to extract from NightmareZone:
- Stage progression logic
- Auto-completion automation
- Main action button logic

Target: Reduce NightmareZone to ~200-250 lines (orchestrator only)
