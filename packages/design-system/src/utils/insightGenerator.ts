import type { Lap, SetRecord } from '../types';
import { formatTimeMs, isLapOnPace } from './coachingLogic';

/**
 * Generate a 1-2 sentence textual insight for a completed set.
 *
 * Identifies the key pattern in the data: strong/weak start, fade point,
 * negative split, consistency, etc.
 */
export function generateSessionInsight(
  laps: Lap[],
  toleranceMs: number = 1000,
): string {
  if (laps.length === 0) return '';
  if (laps.length === 1) {
    return isLapOnPace(laps[0], toleranceMs)
      ? 'Single lap completed on target.'
      : `Single lap completed ${formatTimeMs(Math.abs(laps[0].deltaMs))}s ${laps[0].deltaMs > 0 ? 'behind' : 'ahead of'} target.`;
  }

  const onPaceCount = laps.filter(l => isLapOnPace(l, toleranceMs)).length;
  const onPacePct = Math.round((onPaceCount / laps.length) * 100);
  const mid = Math.floor(laps.length / 2);

  const firstHalfAvg = average(laps.slice(0, mid).map(l => l.splitTimeMs));
  const secondHalfAvg = average(laps.slice(mid).map(l => l.splitTimeMs));
  const negativeSplit = secondHalfAvg < firstHalfAvg;

  // Find the worst consecutive fade
  let fadeStart = -1;
  let fadeLen = 0;
  let maxFadeStart = -1;
  let maxFadeLen = 0;
  for (let i = 1; i < laps.length; i++) {
    if (laps[i].splitTimeMs > laps[i - 1].splitTimeMs + toleranceMs) {
      if (fadeLen === 0) fadeStart = i - 1;
      fadeLen++;
      if (fadeLen > maxFadeLen) {
        maxFadeLen = fadeLen;
        maxFadeStart = fadeStart;
      }
    } else {
      fadeLen = 0;
    }
  }

  // Find best and worst laps
  const best = laps.reduce((a, b) => a.splitTimeMs < b.splitTimeMs ? a : b);
  const worst = laps.reduce((a, b) => a.splitTimeMs > b.splitTimeMs ? a : b);

  const parts: string[] = [];

  if (onPacePct >= 80) {
    parts.push(`Strong consistency — ${onPacePct}% of laps on pace.`);
  }

  if (negativeSplit) {
    parts.push('Negative split achieved — second half faster than first.');
  } else if (maxFadeLen >= 2 && maxFadeStart >= 0) {
    const fadeDistMetres = (maxFadeStart + 1) * 50; // rough estimate assuming 50m laps
    parts.push(
      `Fatigue visible from lap ${maxFadeStart + 1} onward — likely at the ${fadeDistMetres}m mark.`,
    );
  }

  if (parts.length === 0) {
    if (onPacePct >= 60) {
      parts.push(`Solid set — ${onPacePct}% of laps within the pace window.`);
      parts.push(
        `Best lap was ${formatTimeMs(best.splitTimeMs)} (lap ${best.lapNumber}), worst was ${formatTimeMs(worst.splitTimeMs)} (lap ${worst.lapNumber}).`,
      );
    } else {
      parts.push(
        `Only ${onPacePct}% of laps hit the target pace. Best: ${formatTimeMs(best.splitTimeMs)} on lap ${best.lapNumber}.`,
      );
    }
  }

  // Cap at 2 sentences
  return parts.slice(0, 2).join(' ');
}

/**
 * Generate the overall verdict for a set.
 */
export function generateSetVerdict(
  onPacePercentage: number,
): 'On Target' | 'Slightly Off' | 'Significantly Off' {
  if (onPacePercentage >= 70) return 'On Target';
  if (onPacePercentage >= 40) return 'Slightly Off';
  return 'Significantly Off';
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
