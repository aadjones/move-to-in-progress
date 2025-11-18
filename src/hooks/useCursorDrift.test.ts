import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCursorDrift, getDriftTransform } from './useCursorDrift';

describe('useCursorDrift', () => {
  it('returns 0 drift for initial stage', () => {
    const { result } = renderHook(() => useCursorDrift('initial'));
    expect(result.current).toBe(0);
  });

  it('returns 0 drift for early stages', () => {
    const { result } = renderHook(() => useCursorDrift('started'));
    expect(result.current).toBe(0);
  });

  it('returns subtle drift for mutating stage', () => {
    const { result } = renderHook(() => useCursorDrift('mutating'));
    expect(result.current).toBe(15); // CURSOR_DRIFT_SUBTLE
  });

  it('returns obvious drift for automation stage', () => {
    const { result } = renderHook(() => useCursorDrift('automation'));
    expect(result.current).toBe(30); // CURSOR_DRIFT_OBVIOUS
  });

  it('returns insane drift for chaos stage', () => {
    const { result } = renderHook(() => useCursorDrift('chaos'));
    expect(result.current).toBe(50); // CURSOR_DRIFT_INSANE
  });

  it('updates drift when stage changes', () => {
    const { result, rerender } = renderHook(
      ({ stage }) => useCursorDrift(stage),
      { initialProps: { stage: 'initial' as const } }
    );

    expect(result.current).toBe(0);

    rerender({ stage: 'chaos' });
    expect(result.current).toBe(50);
  });
});

describe('getDriftTransform', () => {
  it('returns empty string for 0 drift', () => {
    const transform = getDriftTransform(0);
    expect(transform).toBe('');
  });

  it('returns translate transform for non-zero drift', () => {
    const transform = getDriftTransform(10);
    expect(transform).toMatch(/translate\(-?\d+(\.\d+)?px, -?\d+(\.\d+)?px\)/);
  });

  it('generates values within drift range', () => {
    const drift = 20;
    for (let i = 0; i < 100; i++) {
      const transform = getDriftTransform(drift);
      const matches = transform.match(/translate\((-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px\)/);

      if (matches) {
        const x = parseFloat(matches[1]);
        const y = parseFloat(matches[2]);

        expect(Math.abs(x)).toBeLessThanOrEqual(drift / 2);
        expect(Math.abs(y)).toBeLessThanOrEqual(drift / 2);
      }
    }
  });
});
