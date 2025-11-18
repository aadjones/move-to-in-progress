import { describe, it, expect } from 'vitest';
import { getBlockedReason } from './blockedReasons';
import type { Task } from '../taskGraph/types';

describe('getBlockedReason', () => {
  it('returns non-empty strings for all task archetypes', () => {
    const archetypes = ['training', 'approval-request', 'form-submission', 'documentation', 'system-access', 'meeting', 'attestation', 'compliance', 'unknown'];

    archetypes.forEach(archetype => {
      const task: Task = {
        id: 'test-task',
        title: 'Test Task',
        status: 'blocked',
        blockedBy: ['dep1'],
        depth: 1,
        archetype,
        isCompletable: false,
      };

      const reason = getBlockedReason(task);
      expect(reason).toBeTruthy();
      expect(reason.length).toBeGreaterThan(10);
    });
  });

  it('provides variety - returns different reasons on multiple calls', () => {
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
    for (let i = 0; i < 50; i++) {
      reasons.add(getBlockedReason(task));
    }

    expect(reasons.size).toBeGreaterThan(1);
  });
});
