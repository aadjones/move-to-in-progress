import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStageProgression, getStageNumber } from './useStageProgression';

describe('useStageProgression', () => {
  it('returns initial stage when totalTasks is 0', () => {
    const { result } = renderHook(() => useStageProgression(0));
    expect(result.current).toBe('initial');
  });

  it('progresses to started stage with 1 task', () => {
    const { result } = renderHook(() => useStageProgression(1));
    expect(result.current).toBe('started');
  });

  it('progresses to resolving stage with 3+ tasks', () => {
    const { result } = renderHook(() => useStageProgression(3));
    expect(result.current).toBe('resolving');
  });

  it('progresses to multiplying stage with 8+ tasks', () => {
    const { result } = renderHook(() => useStageProgression(8));
    expect(result.current).toBe('multiplying');
  });

  it('progresses to mutating stage with 12+ tasks', () => {
    const { result } = renderHook(() => useStageProgression(12));
    expect(result.current).toBe('mutating');
  });

  it('progresses to automation stage with 18+ tasks', () => {
    const { result } = renderHook(() => useStageProgression(18));
    expect(result.current).toBe('automation');
  });

  it('progresses to chaos stage with 24+ tasks', () => {
    const { result } = renderHook(() => useStageProgression(24));
    expect(result.current).toBe('chaos');
  });

  it('updates stage when totalTasks changes', () => {
    const { result, rerender } = renderHook(
      ({ count }) => useStageProgression(count),
      { initialProps: { count: 0 } }
    );

    expect(result.current).toBe('initial');

    rerender({ count: 5 });
    expect(result.current).toBe('resolving');

    rerender({ count: 20 });
    expect(result.current).toBe('automation');
  });
});

describe('getStageNumber', () => {
  it('returns correct numbers for each stage', () => {
    expect(getStageNumber('initial')).toBe(1);
    expect(getStageNumber('started')).toBe(2);
    expect(getStageNumber('resolving')).toBe(3);
    expect(getStageNumber('multiplying')).toBe(4);
    expect(getStageNumber('mutating')).toBe(5);
    expect(getStageNumber('automation')).toBe(6);
    expect(getStageNumber('chaos')).toBe(7);
  });
});
