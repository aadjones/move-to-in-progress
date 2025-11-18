# Task Graph & Interaction System - Integration Guide

## Overview

We've built a complete task orchestration system with two main components:

1. **Task Graph System** - Manages task dependencies, spawn rules, and escalation patterns
2. **Interaction System** - Provides mini-games for task completion (forms, videos, quizzes, etc.)

## Architecture

```
TaskManager (orchestration)
  ├─> Task Graph (data model)
  │    ├─ Task nodes with patterns & depth
  │    ├─ Spawn rules (what happens on completion)
  │    └─ Blocking relationships
  │
  └─> Interaction Registry (UI mapping)
       ├─ Maps task archetype → interaction type
       ├─ Depth-based escalation
       └─ Interaction components
```

## Quick Start

### 1. Initialize TaskManager

```typescript
import { TaskManager } from './taskGraph/TaskManager';

// In your component
const [taskManager] = useState(() => new TaskManager());
```

### 2. Display Tasks

```typescript
const tasks = taskManager.getTasks();
const completableTasks = taskManager.getCompletableTasks();

// Render task list
{tasks.map(task => (
  <div key={task.id}>
    <h3>{task.title}</h3>
    <p>{task.description}</p>
    <span>Status: {task.status}</span>

    {task.isCompletable && (
      <button onClick={() => handleTaskClick(task)}>
        Complete Task
      </button>
    )}

    {task.status === 'blocked' && (
      <p>Blocked by {task.blockedBy.length} tasks</p>
    )}
  </div>
))}
```

### 3. Handle Task Completion

```typescript
import { InteractionModal } from './interactions/InteractionModal';

const [selectedTask, setSelectedTask] = useState<Task | null>(null);
const [showInteractionModal, setShowInteractionModal] = useState(false);

const handleTaskClick = (task: Task) => {
  if (!task.isCompletable) return;

  setSelectedTask(task);
  setShowInteractionModal(true);
};

const handleInteractionComplete = (result: InteractionResult) => {
  if (selectedTask) {
    taskManager.completeTask(selectedTask.id);
    setShowInteractionModal(false);
    setSelectedTask(null);

    // Force re-render
    setTasks(taskManager.getTasks());
  }
};

// Render modal
{selectedTask && (
  <InteractionModal
    interaction={taskManager.getTaskInteraction(selectedTask.id)}
    taskTitle={selectedTask.title}
    isOpen={showInteractionModal}
    onClose={() => setShowInteractionModal(false)}
    onComplete={handleInteractionComplete}
  />
)}
```

## Task Patterns

The system has 4 escalation patterns:

### 1. Approval Death Spiral
- Pattern: `'approval'`
- Archetypes: `approval-request`, `form-submission`, `meeting`, `attestation`
- Escalates through manager → director → VP → C-level
- Interactions: Forms with increasing complexity, dropdown hierarchies

### 2. Circular Dependencies
- Pattern: `'circular'`
- Archetypes: `system-access`, `form-submission`, `approval-request`
- Creates catch-22 situations
- Interactions: System access delays, forms requiring each other

### 3. Documentation Ouroboros
- Pattern: `'documentation'`
- Archetypes: `documentation`, `form-submission`, `system-access`
- Documents that reference missing/migrated documents
- Interactions: Scroll documents, typing prompts

### 4. Compliance Hydra
- Pattern: `'compliance'`
- Archetypes: `training`, `compliance`, `attestation`
- Completing one spawns multiple new requirements
- Interactions: Videos, quizzes, checkboxes, multi-step flows

## Depth-Based Escalation

Tasks have a `depth` level that controls:

- **Depth 0-2 (Early Game)**:
  - 40% chance of being blocked
  - Spawns 1-2 tasks on completion
  - Simple interactions (5-10 second videos, basic forms)
  - Patterns don't mix

- **Depth 3-5 (Mid Game)**:
  - 60% chance of being blocked
  - Spawns 2-3 tasks on completion
  - More complex interactions (longer videos, multi-field forms)
  - Patterns start mixing

- **Depth 6+ (Late Game Hell)**:
  - 80% chance of being blocked
  - Spawns 3-4 tasks on completion
  - Multi-step interactions, long delays
  - Patterns freely mix
  - Assimilation options appear

## Escape Hatches

When task count reaches 50+, show escape options:

```typescript
if (taskManager.shouldShowEscapeHatches()) {
  // Show escape buttons
}

// Burn it down
taskManager.executeBurnItDown();

// Delegate to coworker
taskManager.executeDelegate();

// Assimilate into bureaucracy
taskManager.executeAssimilate('Senior Approver');
```

## Interaction Types

Available interaction types (automatically assigned based on task archetype):

- **video**: Watch progress bar for N seconds
- **form**: Fill out bureaucratic forms with validation
- **typing-prompt**: Type exact phrase
- **checkboxes**: Acknowledge all items
- **scroll-document**: Scroll to bottom of corporate jargon
- **loading-delay**: Wait for fake system loading
- **multi-step**: Chain multiple interactions
- **calendar-select**: Pick from time slots
- **dropdown-hierarchy**: Navigate nested dropdowns

## Integration with NightmareZone

Replace the existing subtask system in `NightmareZone.tsx`:

```typescript
// OLD: const [subtasks, setSubtasks] = useState([...])

// NEW:
const [taskManager] = useState(() => new TaskManager());
const [tasks, setTasks] = useState(taskManager.getTasks());

// When task is completed
const handleTaskComplete = (taskId: string) => {
  taskManager.completeTask(taskId);
  setTasks(taskManager.getTasks()); // Force re-render
};
```

## Next Steps

1. **Integrate into NightmareZone**: Replace old subtask system
2. **Add Escape Hatches**: Implement UI for burn/delegate/assimilate
3. **Content Pass**: Improve task title/description templates
4. **Polish Interactions**: Add more corporate humor to forms/videos
5. **Assimilation Endings**: Create proper ending screens

## File Structure

```
src/
├── taskGraph/
│   ├── types.ts              # Task & pattern types
│   ├── taskGenerator.ts      # Task creation & spawn logic
│   └── TaskManager.ts        # Orchestration & state management
│
├── interactions/
│   ├── types.ts              # Interaction type definitions
│   ├── interactionRegistry.ts # Maps tasks → interactions
│   ├── InteractionModal.tsx  # Modal container
│   └── components/
│       ├── VideoInteraction.tsx
│       ├── FormInteraction.tsx
│       ├── TypingPromptInteraction.tsx
│       ├── CheckboxesInteraction.tsx
│       ├── ScrollDocumentInteraction.tsx
│       └── LoadingDelayInteraction.tsx
```

## Key Design Decisions

1. **Separation of Concerns**: Task graph logic is separate from interaction UI
2. **Interaction Assignment**: Registry maps task archetypes to appropriate mini-games
3. **Depth-Based Progression**: Game gets harder as depth increases
4. **Pattern Mixing**: Late game allows patterns to cross-pollinate for chaos
5. **No Multi-Step Nesting**: Removed recursive multi-step to avoid complexity

---

**The system is ready to integrate!** The old subtask system can be replaced wholesale.
