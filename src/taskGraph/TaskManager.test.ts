/**
 * TaskManager Tests
 *
 * Tests for task management and deadlock prevention
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TaskManager } from './TaskManager';

describe('TaskManager', () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  describe('Initialization', () => {
    it('should initialize with a root task', () => {
      const rootTask = taskManager.getRootTask();
      expect(rootTask).toBeDefined();
      expect(rootTask?.title).toBe('Access TaskFlow Board');
    });

    it('should initialize with at least one completable task', () => {
      const completableTasks = taskManager.getCompletableTasks();
      expect(completableTasks.length).toBeGreaterThan(0);
    });

    it('should have exactly 2 tasks initially (root + 1 blocker)', () => {
      expect(taskManager.getTaskCount()).toBe(2);
    });
  });

  describe('Deadlock Prevention', () => {
    it('should always have at least one completable task after initialization', () => {
      // The initial setup already has one completable task
      const completableTasks = taskManager.getCompletableTasks();
      expect(completableTasks.length).toBeGreaterThanOrEqual(1);
    });

    it('should prevent deadlock after completing tasks', () => {
      // Complete the first task multiple times and verify we never get stuck
      for (let i = 0; i < 10; i++) {
        const completableTasks = taskManager.getCompletableTasks();
        const rootTask = taskManager.getRootTask();

        // There should always be at least one completable task
        // UNLESS the game is complete (root task is done)
        if (rootTask?.status !== 'completed') {
          expect(completableTasks.length).toBeGreaterThan(0);
        }

        if (completableTasks.length > 0) {
          // Complete a random task
          const taskToComplete = completableTasks[0];
          taskManager.completeTask(taskToComplete.id);
        } else {
          // No completable tasks - game must be complete
          expect(rootTask?.status).toBe('completed');
          break; // Exit loop since game is done
        }

        // After completing, check again
        const newCompletableTasks = taskManager.getCompletableTasks();
        const rootTaskAfter = taskManager.getRootTask();

        if (rootTaskAfter?.status !== 'completed') {
          // If game is not complete, there must be at least one completable task
          expect(newCompletableTasks.length).toBeGreaterThan(0);
        }
      }
    });

    it('should handle scenarios where all spawned tasks are blocked', () => {
      // This is a probabilistic test - run multiple times
      // to increase chance of hitting the blocking edge case
      for (let trial = 0; trial < 20; trial++) {
        const manager = new TaskManager();

        // Complete several tasks rapidly
        for (let i = 0; i < 5; i++) {
          const completable = manager.getCompletableTasks();
          if (completable.length > 0) {
            manager.completeTask(completable[0].id);
          }
        }

        // After all operations, there should still be completable tasks
        // UNLESS the root task was completed (game is done)
        const finalCompletable = manager.getCompletableTasks();
        const rootTask = manager.getRootTask();

        if (rootTask?.status !== 'completed') {
          // If game is not complete, there must be at least one completable task
          expect(finalCompletable.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Task Completion', () => {
    it('should mark task as completed', () => {
      const completableTasks = taskManager.getCompletableTasks();
      const taskToComplete = completableTasks[0];

      taskManager.completeTask(taskToComplete.id);

      const completedTask = taskManager.getTask(taskToComplete.id);
      expect(completedTask?.status).toBe('completed');
      expect(completedTask?.completedAt).toBeDefined();
    });

    it('should spawn child tasks after completion', () => {
      const initialCount = taskManager.getTaskCount();
      const completableTasks = taskManager.getCompletableTasks();

      taskManager.completeTask(completableTasks[0].id);

      const newCount = taskManager.getTaskCount();
      // Should have more tasks after spawning children
      expect(newCount).toBeGreaterThan(initialCount);
    });

    it('should not complete non-completable tasks', () => {
      const blockedTasks = taskManager.getTasksByStatus('blocked');

      if (blockedTasks.length > 0) {
        const blockedTask = blockedTasks[0];
        const initialStatus = blockedTask.status;

        taskManager.completeTask(blockedTask.id);

        // Should still be in original state
        const taskAfter = taskManager.getTask(blockedTask.id);
        expect(taskAfter?.status).toBe(initialStatus);
      }
    });
  });

  describe('Task Queries', () => {
    it('should get tasks by status', () => {
      const pendingTasks = taskManager.getTasksByStatus('pending');
      expect(Array.isArray(pendingTasks)).toBe(true);

      // At least one task should be pending (the initial blocker)
      expect(pendingTasks.length).toBeGreaterThan(0);
    });

    it('should identify completable tasks correctly', () => {
      const completableTasks = taskManager.getCompletableTasks();

      completableTasks.forEach((task) => {
        expect(task.isCompletable).toBe(true);
        expect(task.status).not.toBe('completed');
      });
    });

    it('should get task by ID', () => {
      const rootTask = taskManager.getRootTask();
      const foundTask = taskManager.getTask(rootTask!.id);

      expect(foundTask).toBeDefined();
      expect(foundTask?.id).toBe(rootTask?.id);
    });
  });

  describe('Escape Hatches', () => {
    it('should show escape hatches after 50 tasks', () => {
      // Complete tasks until we have 50+ with safety limit
      let iterations = 0;
      const MAX_ITERATIONS = 100; // Safety limit to prevent infinite loops

      while (taskManager.getTaskCount() < 50 && iterations < MAX_ITERATIONS) {
        const completable = taskManager.getCompletableTasks();
        if (completable.length > 0) {
          taskManager.completeTask(completable[0].id);
        }
        iterations++;
      }

      // If we reached 50 tasks, verify escape hatches work
      if (taskManager.getTaskCount() >= 50) {
        expect(taskManager.shouldShowEscapeHatches()).toBe(true);
      } else {
        // If we couldn't reach 50 (game completed or task spawning was minimal),
        // just verify the logic works correctly
        expect(taskManager.shouldShowEscapeHatches()).toBe(false);
      }
    });

    it('should not show escape hatches before 50 tasks', () => {
      expect(taskManager.shouldShowEscapeHatches()).toBe(false);
    });

    it('should execute burn it down correctly', () => {
      // Add some tasks
      const completable = taskManager.getCompletableTasks();
      taskManager.completeTask(completable[0].id);

      taskManager.executeBurnItDown();

      // Should only have root task left
      expect(taskManager.getTaskCount()).toBe(1);

      const rootTask = taskManager.getRootTask();
      expect(rootTask?.status).toBe('completed');
    });
  });
});
