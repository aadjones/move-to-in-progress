/**
 * Task Manager
 *
 * Orchestrates the task graph, handles task completion, spawning, and state management.
 */

import type { Task, TaskGraph } from './types';
import type { InteractionType } from '../interactions/types';
import {
  DEFAULT_TASK_CONFIG,
  createBoardAccessTask,
  generateTask,
  spawnChildTasks,
  generateBlockingTasks,
  generateSpawnRules,
  createCrisisResponseTask,
} from './taskGenerator';
import { getInteractionForTask } from '../interactions/interactionRegistry';

export class TaskManager {
  private graph: TaskGraph;
  private crisisTaskId: string | null = null; // Track if crisis task exists

  constructor() {
    const rootTask = createBoardAccessTask();

    this.graph = {
      tasks: new Map([[rootTask.id, rootTask]]),
      rootTaskId: rootTask.id,
      config: DEFAULT_TASK_CONFIG,
    };

    // Initialize with some blocking tasks for the root
    this.initializeRootBlockers();
  }

  /**
   * Initialize blocking tasks for the root task
   */
  private initializeRootBlockers(): void {
    const rootTask = this.graph.tasks.get(this.graph.rootTaskId);
    if (!rootTask) return;

    // Create initial blocker - a simple training task
    const blocker = generateTask(
      'compliance',
      'training',
      0,
      this.graph.config,
      rootTask.id
    );

    // FORCE the first task to be completable (override random blocking)
    blocker.isCompletable = true;
    blocker.status = 'pending';
    blocker.blockedBy = [];
    blocker.spawnsOnComplete = generateSpawnRules(blocker.pattern, blocker.depth, this.graph.config);

    // Assign interaction
    blocker.interactionType = getInteractionForTask(blocker.archetype, blocker.depth);

    this.graph.tasks.set(blocker.id, blocker);
    rootTask.blockedBy.push(blocker.id);

    // Ensure we have at least one completable task (safety net)
    this.ensureAtLeastOneCompletable();
  }

  /**
   * Get all tasks
   */
  getTasks(): Task[] {
    return Array.from(this.graph.tasks.values());
  }

  /**
   * Get task by ID
   */
  getTask(id: string): Task | undefined {
    return this.graph.tasks.get(id);
  }

  /**
   * Get the root task
   */
  getRootTask(): Task | undefined {
    return this.graph.tasks.get(this.graph.rootTaskId);
  }

  /**
   * Get total task count
   */
  getTaskCount(): number {
    return this.graph.tasks.size;
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: Task['status']): Task[] {
    return this.getTasks().filter((task) => task.status === status);
  }

  /**
   * Get completable tasks (not blocked, not completed)
   */
  getCompletableTasks(): Task[] {
    return this.getTasks().filter(
      (task) => task.isCompletable && task.status !== 'completed'
    );
  }

  /**
   * Public method to check and prevent deadlocks
   * Can be called by components to ensure game remains playable
   */
  checkForDeadlock(): void {
    this.ensureAtLeastOneCompletable();
  }

  /**
   * Ensure at least one task is completable to prevent deadlocks
   * This is a safety net to prevent soft-locking the game when RNG blocks all tasks
   */
  private ensureAtLeastOneCompletable(): void {
    const completable = this.getCompletableTasks();

    if (completable.length === 0) {
      // Deadlock detected! Find a non-completable task and force it to be completable
      const nonCompletableTasks = this.getTasks().filter(
        (task) => !task.isCompletable && task.status !== 'completed'
      );

      if (nonCompletableTasks.length > 0) {
        // Unblock the first non-completable task (could also pick randomly)
        const taskToUnblock = nonCompletableTasks[0];
        console.warn(
          `[TaskManager] Deadlock prevented: forcing task "${taskToUnblock.title}" to be completable`
        );

        // Mark all blockers as completed to clean up the graph
        taskToUnblock.blockedBy.forEach((blockerId) => {
          const blocker = this.graph.tasks.get(blockerId);
          if (blocker && blocker.status !== 'completed') {
            console.warn(
              `[TaskManager] Auto-completing blocker "${blocker.title}" to resolve deadlock`
            );
            blocker.status = 'completed';
            blocker.completedAt = Date.now();
          }
        });

        taskToUnblock.status = 'pending';
        taskToUnblock.isCompletable = true;
        taskToUnblock.blockedBy = [];

        // Assign interaction if it doesn't have one
        if (!taskToUnblock.interactionType) {
          taskToUnblock.interactionType = getInteractionForTask(
            taskToUnblock.archetype,
            taskToUnblock.depth
          );
        }
      }
    }
  }

  /**
   * Check if a task is blocked
   */
  isTaskBlocked(taskId: string): boolean {
    const task = this.getTask(taskId);
    if (!task) return false;

    if (task.blockedBy.length === 0) return false;

    // Check if any blockers are still incomplete
    return task.blockedBy.some((blockerId) => {
      const blocker = this.getTask(blockerId);
      return blocker && blocker.status !== 'completed';
    });
  }

  /**
   * Update task state after blockers are resolved
   */
  private updateTaskAfterBlockersResolved(taskId: string): void {
    const task = this.getTask(taskId);
    if (!task) return;

    if (!this.isTaskBlocked(taskId)) {
      task.status = 'pending';
      task.isCompletable = true;

      // Assign interaction if it doesn't have one
      if (!task.interactionType) {
        task.interactionType = getInteractionForTask(task.archetype, task.depth);
      }
    }
  }

  /**
   * Complete a task and spawn children
   */
  completeTask(taskId: string): void {
    const task = this.getTask(taskId);
    if (!task) return;

    if (!task.isCompletable || task.status === 'completed') {
      console.warn('Task is not completable or already completed');
      return;
    }

    // Mark as completed
    task.status = 'completed';
    task.completedAt = Date.now();

    // Spawn child tasks
    const children = spawnChildTasks(task, this.graph.config);
    console.log(`[TaskManager] Completed task "${task.title}", spawning ${children.length} children`);

    const rootTask = this.getRootTask();

    for (const child of children) {
      // Assign interaction for completable tasks
      if (child.isCompletable) {
        child.interactionType = getInteractionForTask(child.archetype, child.depth);
      } else {
        // Generate blocking tasks for blocked tasks
        const blockers = generateBlockingTasks(child, this.graph.config, 1);

        for (const blocker of blockers) {
          blocker.interactionType = getInteractionForTask(blocker.archetype, blocker.depth);
          this.graph.tasks.set(blocker.id, blocker);
          child.blockedBy.push(blocker.id);

          // Link blocker to root task
          if (rootTask) {
            rootTask.blockedBy.push(blocker.id);
          }
        }
      }

      this.graph.tasks.set(child.id, child);

      // Link child to root task
      if (rootTask) {
        rootTask.blockedBy.push(child.id);
      }
    }

    // Update any tasks that were blocked by this one
    this.getTasks().forEach((t) => {
      if (t.blockedBy.includes(taskId)) {
        this.updateTaskAfterBlockersResolved(t.id);
      }
    });

    // Update root task if it was blocked by this task
    if (rootTask && rootTask.blockedBy.includes(taskId)) {
      this.updateTaskAfterBlockersResolved(rootTask.id);
    }

    // Ensure we have at least one completable task (safety net)
    this.ensureAtLeastOneCompletable();
  }

  /**
   * Get task hierarchy (for rendering)
   */
  getTaskHierarchy(): Task[] {
    const rootTask = this.getRootTask();
    if (!rootTask) return [];

    // Return root and all its blockers as a flat list for now
    // TODO: Build proper tree structure if needed
    return this.getTasks();
  }

  /**
   * Check if escape hatches should be available (old system - now deprecated)
   */
  shouldShowEscapeHatches(): boolean {
    // Keep this for backwards compatibility but always return false
    // Crisis task replaces the escape hatch panel
    return false;
  }

  /**
   * Try to spawn the crisis response task if conditions are met
   * Returns true if task was spawned or already exists
   */
  trySpawnCrisisTask(currentStage: number): boolean {
    // Only spawn at Stage 7+ (breakdown or later)
    if (currentStage < 7) {
      return false;
    }

    // If crisis task already exists and is not completed, don't spawn again
    if (this.crisisTaskId) {
      const existingTask = this.getTask(this.crisisTaskId);
      if (existingTask && existingTask.status !== 'completed') {
        return true; // Task exists
      }
      // Task was completed or removed, allow respawn
      this.crisisTaskId = null;
    }

    // Spawn chance increases with stage progression
    // Stage 7-8 (Breakdown/Annihilation): 30% chance
    // Stage 9 (Singularity approach): 60% chance
    // Stage 10 (Singularity): 95% chance - nearly guaranteed
    const spawnChance = currentStage >= 10 ? 0.95 : currentStage >= 9 ? 0.6 : 0.3;

    if (Math.random() > spawnChance) {
      return false;
    }

    // Create and add the crisis task
    const crisisTask = createCrisisResponseTask();
    crisisTask.interactionType = getInteractionForTask('crisis-response', 10);

    this.graph.tasks.set(crisisTask.id, crisisTask);
    this.crisisTaskId = crisisTask.id;

    // Link to root task
    const rootTask = this.getRootTask();
    if (rootTask) {
      rootTask.blockedBy.push(crisisTask.id);
    }

    console.log('[TaskManager] Crisis response task spawned');
    return true;
  }

  /**
   * Check if crisis task currently exists
   */
  hasCrisisTask(): boolean {
    if (!this.crisisTaskId) return false;
    const task = this.getTask(this.crisisTaskId);
    return task !== undefined && task.status !== 'completed';
  }

  /**
   * Execute "burn it down" escape hatch
   */
  executeBurnItDown(): void {
    // Clear all tasks except root
    const rootTask = this.getRootTask();
    this.graph.tasks.clear();

    if (rootTask) {
      rootTask.status = 'completed';
      rootTask.completedAt = Date.now();
      this.graph.tasks.set(rootTask.id, rootTask);
    }
  }

  /**
   * Execute "delegate" escape hatch
   */
  executeDelegate(): void {
    // Similar to burn it down
    this.executeBurnItDown();
  }

  /**
   * Execute "assimilate" escape hatch
   */
  executeAssimilate(role: string): void {
    // Mark a special "assimilated" state
    const rootTask = this.getRootTask();
    if (rootTask) {
      rootTask.status = 'completed';
      rootTask.completedAt = Date.now();
      rootTask.flavorText = `You are now: ${role}`;
    }
  }

  /**
   * Get interaction for a task
   */
  getTaskInteraction(taskId: string): InteractionType | null {
    const task = this.getTask(taskId);
    if (!task || !task.interactionType) return null;

    return task.interactionType;
  }
}
