import {
  PaceStatus,
  TrendDirection,
  type CoachingInstruction,
  type Lap,
} from '../types';

/**
 * Format milliseconds as m:ss or s.d depending on magnitude.
 */
export function formatTimeMs(ms: number): string {
  const totalSeconds = Math.abs(ms) / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(0).padStart(2, '0')}`;
  }
  return seconds.toFixed(1);
}

/**
 * Calculate pace status from a delta and tolerance window.
 *
 * delta: positive means swimmer is slower than target, negative means faster.
 * toleranceMs: the ± window in ms that counts as "on pace" (default 1000ms).
 */
export function calculatePaceStatus(
  deltaMs: number,
  toleranceMs: number = 1000,
): PaceStatus {
  if (deltaMs < -toleranceMs) return PaceStatus.Ahead;
  if (deltaMs <= toleranceMs) return PaceStatus.OnPace;
  if (deltaMs <= toleranceMs * 4) return PaceStatus.SlightlyOff;
  return PaceStatus.SignificantlyOff;
}

/**
 * Calculate trend direction from the last 3 split times.
 *
 * Each faster → IMPROVING. Each slower → FADING. Otherwise → STEADY.
 * Requires at least 3 splits. Returns STEADY if fewer.
 */
export function calculateTrendDirection(recentSplits: number[]): TrendDirection {
  if (recentSplits.length < 3) return TrendDirection.Steady;

  const last3 = recentSplits.slice(-3);
  const allFaster = last3[1] < last3[0] && last3[2] < last3[1];
  const allSlower = last3[1] > last3[0] && last3[2] > last3[1];

  if (allFaster) return TrendDirection.Improving;
  if (allSlower) return TrendDirection.Fading;
  return TrendDirection.Steady;
}

/**
 * Generate a deterministic coaching instruction based on pace data.
 *
 * Rules (from the product brief):
 * - delta ±1s (within tolerance): on-pace encouragement
 * - delta +2 to +4s slow: gentle push with specific target time
 * - delta +5s+ slow: urgent recovery with target and recovery window
 * - delta negative (ahead of pace): conservation instruction
 * - 3-lap progressive slowing regardless of delta: fading trend instruction
 *
 * The fading trend instruction overrides the delta-based instruction
 * because a trend is more actionable than a single-lap status.
 */
export function generateCoachingInstruction(
  deltaMs: number,
  trendDirection: TrendDirection,
  lapsRemaining: number,
  targetLapMs: number,
  lastLapMs: number,
  toleranceMs: number = 1000,
): CoachingInstruction {
  const paceStatus = calculatePaceStatus(deltaMs, toleranceMs);
  const targetStr = formatTimeMs(targetLapMs);
  const deltaSeconds = Math.round(deltaMs / 1000);
  const absDelta = Math.abs(deltaSeconds);

  let text: string;

  // Fading trend overrides delta-based instruction
  if (trendDirection === TrendDirection.Fading) {
    text = `${lapsRemaining > 2 ? 'Three laps of slowing down.' : 'You are fading.'} Engage your kick now — do not wait until the final metres.`;
  } else if (deltaMs < -toleranceMs) {
    // Ahead of pace — conservation
    text = `Ease back slightly — you are burning early.${lapsRemaining > 2 ? ` Laps ${lapsRemaining - 1} to ${lapsRemaining} will need this reserve.` : ' Save energy for the finish.'}`;
  } else if (Math.abs(deltaMs) <= toleranceMs) {
    // On pace
    text = 'Hold this pace. You are exactly on target.';
  } else if (deltaMs <= 4000) {
    // +2 to +4s slow — gentle push
    const pushTarget = targetLapMs - 1000; // aim 1s faster than target to recover
    text = `Push off the wall harder. Aim for ${formatTimeMs(pushTarget)} this lap — ${absDelta} second${absDelta > 1 ? 's' : ''} faster.`;
  } else {
    // +5s+ slow — urgent recovery
    const sprintTarget = targetLapMs - 2000; // aim 2s faster to recover
    text = `You have drifted ${absDelta} seconds off pace. Sprint this lap. Target ${formatTimeMs(sprintTarget)}.${lapsRemaining > 2 ? ` Recovery window closes in ${Math.min(lapsRemaining, 3)} laps.` : ' This is your last chance to recover.'}`;
  }

  return {
    text,
    paceStatus,
    trendDirection,
    lastLapMs,
    deltaMs,
    targetNextLapMs: targetLapMs,
  };
}

/**
 * Determine if a lap is "on pace" given the tolerance window.
 */
export function isLapOnPace(lap: Lap, toleranceMs: number = 1000): boolean {
  return Math.abs(lap.deltaMs) <= toleranceMs;
}
