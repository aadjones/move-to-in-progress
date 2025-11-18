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
} from './taskGenerator';
import { getInteractionForTask } from '../interactions/interactionRegistry';

export class TaskManager {
  private graph: TaskGraph;

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
    blocker.interactionType = JSON.stringify(
      getInteractionForTask(blocker.archetype, blocker.depth)
    );

    this.graph.tasks.set(blocker.id, blocker);
    rootTask.blockedBy.push(blocker.id);
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
        task.interactionType = JSON.stringify(
          getInteractionForTask(task.archetype, task.depth)
        );
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
        child.interactionType = JSON.stringify(
          getInteractionForTask(child.archetype, child.depth)
        );
      } else {
        // Generate blocking tasks for blocked tasks
        const blockers = generateBlockingTasks(child, this.graph.config, 1);

        for (const blocker of blockers) {
          blocker.interactionType = JSON.stringify(
            getInteractionForTask(blocker.archetype, blocker.depth)
          );
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
   * Check if escape hatches should be available
   */
  shouldShowEscapeHatches(): boolean {
    return this.getTaskCount() >= 50;
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

    try {
      return JSON.parse(task.interactionType) as InteractionType;
    } catch (e) {
      console.error('Failed to parse interaction type:', e);
      return null;
    }
  }
}
