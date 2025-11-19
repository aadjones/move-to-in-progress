/**
 * Task Generation Engine
 *
 * Generates tasks based on pattern, depth, and archetype.
 * Handles spawn rules and escalation logic.
 */

import type {
  Task,
  Pattern,
  TaskArchetype,
  DepthLevel,
  TaskSpawnRule,
  TaskGenerationConfig,
} from './types';

let taskIdCounter = 0;

/**
 * Generate a unique task ID
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${taskIdCounter++}`;
}

/**
 * Default task generation configuration
 */
export const DEFAULT_TASK_CONFIG: TaskGenerationConfig = {
  early: {
    blockProbability: 0.35,
    spawnMultiplier: { min: 1, max: 2 },
    patternMixing: false,
  },
  mid: {
    blockProbability: 0.5,
    spawnMultiplier: { min: 2, max: 3 },
    patternMixing: true,
  },
  late: {
    blockProbability: 0.65,
    spawnMultiplier: { min: 3, max: 4 },
    patternMixing: true,
    assimilationOptionsEnabled: true,
  },
};

/**
 * Get configuration stage based on depth
 */
function getConfigStage(depth: DepthLevel, config: TaskGenerationConfig) {
  if (depth <= 2) return config.early;
  if (depth <= 5) return config.mid;
  return config.late;
}

/**
 * Random int between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Decide if a task should be blocked based on depth/config
 */
function shouldBeBlocked(depth: DepthLevel, config: TaskGenerationConfig): boolean {
  const stage = getConfigStage(depth, config);
  return Math.random() < stage.blockProbability;
}

/**
 * Generate spawn rules for a task based on pattern and depth
 */
export function generateSpawnRules(
  pattern: Pattern,
  depth: DepthLevel,
  config: TaskGenerationConfig
): TaskSpawnRule[] {
  const stage = getConfigStage(depth, config);

  // Base spawn rule
  const baseRule: TaskSpawnRule = {
    count: stage.spawnMultiplier,
    probability: 1.0, // Always spawn at least one set
    patternBehavior: stage.patternMixing ? 'mix' : 'same',
    depthChange: 1, // Go deeper by default
    archetypePool: getArchetypesForPattern(pattern),
  };

  // In late game, sometimes spawn additional chaos
  if (depth >= 6 && Math.random() < 0.3) {
    return [
      baseRule,
      {
        count: { min: 1, max: 2 },
        probability: 0.5,
        patternBehavior: 'mix',
        depthChange: 0, // Lateral sprawl
        archetypePool: ['compliance', 'attestation', 'documentation'],
      },
    ];
  }

  return [baseRule];
}

/**
 * Get appropriate archetypes for a pattern
 */
function getArchetypesForPattern(pattern: Pattern): TaskArchetype[] {
  const archetypeMap: Record<Pattern, TaskArchetype[]> = {
    approval: ['approval-request', 'form-submission', 'meeting', 'attestation'],
    circular: ['system-access', 'form-submission', 'approval-request', 'meeting'],
    documentation: ['documentation', 'form-submission', 'system-access', 'meeting'],
    compliance: ['training', 'compliance', 'attestation', 'meeting'],
  };

  return archetypeMap[pattern];
}

/**
 * Choose a new pattern when mixing is enabled
 */
function chooseNewPattern(currentPattern: Pattern): Pattern {
  const patterns: Pattern[] = ['approval', 'circular', 'documentation', 'compliance'];
  // Filter out current pattern for variety
  const otherPatterns = patterns.filter((p) => p !== currentPattern);
  return randomItem(otherPatterns);
}

/**
 * Generate a task title based on archetype and depth
 * TODO: Replace with proper template system
 */
function generateTaskTitle(archetype: TaskArchetype, depth: DepthLevel): string {
  const depthSuffix = depth > 0 ? ` (Level ${depth})` : '';

  const titleMap: Record<TaskArchetype, string[]> = {
    training: [
      'Complete Mandatory Training Module',
      'Watch Corporate Values Presentation',
      'Review Updated Training Materials',
    ],
    'approval-request': [
      'Request Manager Approval',
      'Submit Director Sign-Off Request',
      'Obtain Stakeholder Approval',
    ],
    'form-submission': [
      'Complete Status Update Form',
      'Submit Progress Report',
      'Fill Out Workflow Documentation',
    ],
    documentation: [
      'Read Updated Documentation',
      'Review Policy Changes',
      'Consult Knowledge Base Article',
    ],
    'system-access': [
      'Access Project Management Portal',
      'Log Into Workflow System',
      'Authenticate With Identity Provider',
    ],
    meeting: [
      'Schedule Approval Meeting',
      'Book Sync With Manager',
      'Arrange Status Review Session',
      'Coordinate Alignment Discussion',
      'Set Up Dependencies Check-In',
      'Book Documentation Review Meeting',
      'Schedule Compliance Discussion',
    ],
    attestation: [
      'Acknowledge Policy Update',
      'Attest Training Completion',
      'Certify Compliance Understanding',
    ],
    compliance: [
      'Complete Compliance Verification',
      'Submit Regulatory Attestation',
      'Verify Standards Adherence',
    ],
  };

  return randomItem(titleMap[archetype]) + depthSuffix;
}

/**
 * Generate a task description based on archetype
 * TODO: Replace with proper template system
 */
function generateTaskDescription(archetype: TaskArchetype, _isBlocked: boolean): string {
  // Don't reveal blocked status in description - player discovers it by attempting
  const descMap: Record<TaskArchetype, string[]> = {
    training: [
      'View the latest corporate training materials to proceed.',
      'This training module is required before continuing.',
      'Complete this module to maintain compliance certification.',
    ],
    'approval-request': [
      'Submit an approval request to your manager.',
      'This action requires authorization from leadership.',
      'Request sign-off from the appropriate stakeholder.',
    ],
    'form-submission': [
      'Complete all required fields to proceed.',
      'Submit the necessary documentation.',
      'Fill out and submit this form for processing.',
    ],
    documentation: [
      'Review the relevant documentation.',
      'Consult the knowledge base for guidance.',
      'Read the updated policy documentation.',
    ],
    'system-access': [
      'Access required to continue.',
      'Log in to the necessary system.',
      'Authenticate to access this resource.',
    ],
    meeting: [
      'Schedule a meeting to discuss next steps.',
      'Coordinate with relevant stakeholders.',
      'Book time with the approval committee.',
      'Arrange a sync to unblock dependencies.',
      'Set up time to review documentation.',
      'Schedule a compliance alignment session.',
    ],
    attestation: [
      'Acknowledge that you understand and agree.',
      'Provide attestation to proceed.',
      'Certify your understanding of the requirements.',
    ],
    compliance: [
      'Verify compliance with current standards.',
      'Complete mandatory compliance checks.',
      'Ensure adherence to regulatory requirements.',
    ],
  };

  return randomItem(descMap[archetype]);
}

/**
 * Core task generation function
 */
export function generateTask(
  pattern: Pattern,
  archetype: TaskArchetype,
  depth: DepthLevel,
  config: TaskGenerationConfig,
  parentId?: string
): Task {
  const id = generateTaskId();
  const isBlocked = shouldBeBlocked(depth, config);
  const isCompletable = !isBlocked;

  const task: Task = {
    id,
    parentId,
    pattern,
    archetype,
    depth,
    status: isBlocked ? 'blocked' : 'pending',
    isCompletable,
    title: generateTaskTitle(archetype, depth),
    description: generateTaskDescription(archetype, isBlocked),
    blockedBy: [], // Will be populated when generating blocking tasks
    spawnsOnComplete: isCompletable ? generateSpawnRules(pattern, depth, config) : [],
    createdAt: Date.now(),
  };

  return task;
}

/**
 * Generate child tasks when a task is completed
 */
export function spawnChildTasks(
  parentTask: Task,
  config: TaskGenerationConfig
): Task[] {
  const children: Task[] = [];

  for (const spawnRule of parentTask.spawnsOnComplete) {
    // Check probability
    if (Math.random() > spawnRule.probability) continue;

    // Determine count
    const count =
      typeof spawnRule.count === 'number'
        ? spawnRule.count
        : randomInt(spawnRule.count.min, spawnRule.count.max);

    // Determine pattern for spawned tasks
    let spawnPattern: Pattern;
    if (spawnRule.patternBehavior === 'same') {
      spawnPattern = parentTask.pattern;
    } else if (spawnRule.patternBehavior === 'mix') {
      spawnPattern = chooseNewPattern(parentTask.pattern);
    } else {
      spawnPattern = spawnRule.patternBehavior; // Specific pattern
    }

    // Generate tasks
    for (let i = 0; i < count; i++) {
      const archetype = randomItem(spawnRule.archetypePool);
      const newDepth = Math.max(0, parentTask.depth + spawnRule.depthChange);

      const childTask = generateTask(spawnPattern, archetype, newDepth, config, parentTask.id);
      children.push(childTask);
    }
  }

  return children;
}

/**
 * Generate blocking tasks for a blocked task
 */
export function generateBlockingTasks(
  blockedTask: Task,
  config: TaskGenerationConfig,
  blockCount: number = 1
): Task[] {
  const blockers: Task[] = [];

  for (let i = 0; i < blockCount; i++) {
    // Blockers are usually same or adjacent depth
    const blockerDepth = Math.max(0, blockedTask.depth + randomInt(-1, 1));

    // Choose an archetype that makes sense as a blocker
    const blockerArchetype = randomItem(getArchetypesForPattern(blockedTask.pattern));

    const blocker = generateTask(
      blockedTask.pattern,
      blockerArchetype,
      blockerDepth,
      config,
      blockedTask.id
    );

    blockers.push(blocker);
  }

  return blockers;
}

/**
 * Initialize the root task for board access (compliance checkpoint)
 */
export function createBoardAccessTask(): Task {
  return {
    id: 'root_task',
    pattern: 'compliance',
    archetype: 'compliance',
    depth: 0,
    status: 'blocked',
    isCompletable: false,
    title: 'Access TaskFlow Board',
    description: 'Complete Q4 compliance training to unlock access to your project management board.',
    flavorText: 'Your work is waiting. Just need to complete some quick mandatory training first.',
    blockedBy: [],
    spawnsOnComplete: [],
    createdAt: Date.now(),
  };
}

/**
 * Initialize the root task for the actual work task (nightmare zone)
 */
export function createRootTask(): Task {
  return {
    id: 'root_task',
    pattern: 'compliance',
    archetype: 'form-submission',
    depth: 0,
    status: 'blocked',
    isCompletable: false,
    title: 'Refactor Notifications System',
    description: 'Refactor the push notification service to support real-time delivery requirements from the Q3 roadmap.',
    flavorText: 'Should be straightforward—the architecture is already documented. 3 story points.',
    blockedBy: [],
    spawnsOnComplete: [],
    createdAt: Date.now(),
  };
}
