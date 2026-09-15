import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRoundTimer } from './useRoundTimer';

describe('useRoundTimer', () => {
  afterEach(() => vi.useRealTimers());
  it('expires once and cleans up its interval', () => { vi.useFakeTimers(); vi.setSystemTime(new Date('2025-01-01T00:00:00Z')); const expired = vi.fn(); const clearSpy = vi.spyOn(window, 'clearInterval'); const { result, unmount } = renderHook(() => useRoundTimer(2, true, 'round-1', expired)); act(() => { vi.advanceTimersByTime(2100); }); expect(result.current).toBe(0); expect(expired).toHaveBeenCalledTimes(1); unmount(); expect(clearSpy).toHaveBeenCalled(); });
});
