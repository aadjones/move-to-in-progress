import { describe, it, expect } from 'vitest';
import { getBlockedReason } from './blockedReasons';
import type { Task } from '../taskGraph/types';

describe('getBlockedReason', () => {
  it('returns a string reason for any task', () => {
    const task: Task = {
      id: 'test-task',
      title: 'Test Task',
      status: 'blocked',
      blockedBy: ['dep1'],
      depth: 1,
      archetype: 'training',
      isCompletable: false,
    };

    const reason = getBlockedReason(task);
    expect(typeof reason).toBe('string');
    expect(reason.length).toBeGreaterThan(0);
  });

  it('returns archetype-specific reasons for known archetypes', () => {
    const trainingTask: Task = {
      id: 'task1',
      title: 'Training',
      status: 'blocked',
      blockedBy: [],
      depth: 1,
      archetype: 'training',
      isCompletable: false,
    };

    const reason = getBlockedReason(trainingTask);
    expect(reason).toContain('training');
  });

  it('returns generic reasons for unknown archetypes', () => {
    const unknownTask: Task = {
      id: 'task1',
      title: 'Unknown',
      status: 'blocked',
      blockedBy: ['dep1', 'dep2'],
      depth: 1,
      archetype: 'unknown-archetype',
      isCompletable: false,
    };

    const reason = getBlockedReason(unknownTask);
    expect(typeof reason).toBe('string');
    expect(reason.length).toBeGreaterThan(0);
  });

  it('returns different reasons on multiple calls (random selection)', () => {
    const task: Task = {
      id: 'task1',
      title: 'Test',
      status: 'blocked',
      blockedBy: [],
      depth: 1,
      archetype: 'training',
      isCompletable: false,
    };

    const reasons = new Set<string>();
    for (let i = 0; i < 20; i++) {
      reasons.add(getBlockedReason(task));
    }

    // Should get at least 2 different reasons out of 20 calls
    expect(reasons.size).toBeGreaterThan(1);
  });
});
