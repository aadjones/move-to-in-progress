/**
 * Task Graph System - Core Types
 *
 * This system manages the bureaucratic nightmare task dependency graph.
 * Tasks escalate through 4 patterns: Approval, Circular, Documentation, Compliance
 */

import type { InteractionType } from '../interactions/types';

export type Pattern = 'approval' | 'circular' | 'documentation' | 'compliance';

export type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';

/**
 * Depth levels affect:
 * - Probability of being blocked (higher depth = more blocked)
 * - Number of tasks spawned on completion (higher depth = more spawns)
 * - Absurdity level of task descriptions
 * - Availability of assimilation options
 */
export type DepthLevel = number; // 0 = early game, 6+ = late game hell

/**
 * Task archetype determines what kind of interaction is required
 * and influences the flavor of the task description
 */
export type TaskArchetype =
  | 'training'           // Corporate training modules
  | 'approval-request'   // Request approvals from hierarchy
  | 'form-submission'    // Fill out bureaucratic forms
  | 'documentation'      // Read/update documentation
  | 'system-access'      // Portal/system access tasks
  | 'meeting'            // Schedule/attend meetings
  | 'attestation'        // Sign/acknowledge policies
  | 'compliance';        // Compliance requirements

/**
 * Spawn rules determine what happens when a task is completed
 */
export interface TaskSpawnRule {
  /** How many tasks to spawn (can be a range) */
  count: number | { min: number; max: number };

  /** Probability this spawn rule triggers (0-1) */
  probability: number;

  /** Should spawned tasks stay in the same pattern or branch? */
  patternBehavior: 'same' | 'mix' | Pattern;

  /** Depth progression for spawned tasks */
  depthChange: number; // +1 = go deeper, 0 = lateral, -1 = go shallower

  /** Pool of possible archetypes for spawned tasks */
  archetypePool: TaskArchetype[];
}

/**
 * Assimilation options appear in late game
 * Allow player to "join the bureaucracy" as an ending
 */
export interface AssimilationOption {
  /** What role does the player take? */
  role: string; // e.g., "Approver", "Documentation Board Member"

  /** Description shown to player */
  description: string;

  /** Consequence message after assimilation */
  consequence: string;

  /** Min depth required for this option to appear */
  minDepth: number;
}

/**
 * Core Task node in the graph
 */
export interface Task {
  id: string;
  parentId?: string;

  // Classification
  pattern: Pattern;
  archetype: TaskArchetype;
  depth: DepthLevel;

  // State
  status: TaskStatus;
  isCompletable: boolean;

  // Content (generated based on archetype + depth + pattern)
  title: string;
  description: string;
  flavorText?: string; // Sarcastic helper text

  // Graph edges
  blockedBy: string[]; // IDs of blocking tasks
  spawnsOnComplete: TaskSpawnRule[];

  // Interaction (only for completable tasks)
  interactionType?: InteractionType; // The interaction required to complete this task
  interactionData?: unknown; // Specific data for the interaction

  // Late game options
  assimilationOption?: AssimilationOption;

  // Metadata
  createdAt: number;
  completedAt?: number;
}

/**
 * Template for generating tasks
 * Templates are selected based on pattern + archetype + depth
 */
export interface TaskTemplate {
  archetype: TaskArchetype;
  pattern: Pattern;
  depthRange: { min: number; max: number };

  // Template strings (can use variables)
  titleTemplates: string[];
  descriptionTemplates: string[];
  flavorTextTemplates?: string[];

  // Generation rules
  blockProbability: number; // 0-1, how likely to be blocked
  spawnRules: TaskSpawnRule[];
}

/**
 * Configuration for task generation at different game stages
 */
export interface TaskGenerationConfig {
  // Depth 0-2: Early game
  early: {
    blockProbability: number; // e.g., 0.4
    spawnMultiplier: { min: number; max: number }; // e.g., 1-2 tasks
    patternMixing: boolean; // false = stay in pattern
  };

  // Depth 3-5: Mid game
  mid: {
    blockProbability: number; // e.g., 0.6
    spawnMultiplier: { min: number; max: number }; // e.g., 2-3 tasks
    patternMixing: boolean; // true = can branch patterns
  };

  // Depth 6+: Late game hell
  late: {
    blockProbability: number; // e.g., 0.8
    spawnMultiplier: { min: number; max: number }; // e.g., 3-4 tasks
    patternMixing: boolean; // true
    assimilationOptionsEnabled: boolean; // true
  };
}

/**
 * The complete task graph state
 */
export interface TaskGraph {
  tasks: Map<string, Task>;
  rootTaskId: string; // The original "Move to In Progress" task
  config: TaskGenerationConfig;
}
