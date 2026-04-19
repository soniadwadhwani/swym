import { TrendDirection } from '../types';
import type { SessionSummary } from '../types';

/**
 * Calculate a swimmer's overall trend from their last N sessions.
 * Uses average pace per 100m: if improving over last 5 → IMPROVING,
 * if declining → FADING, else STEADY.
 */
export function calculateSwimmerTrend(
  sessions: SessionSummary[],
  count: number = 5,
): TrendDirection {
  if (sessions.length < 3) return TrendDirection.Steady;

  const recent = sessions
    .slice(-count)
    .map(s => s.totalTimeMs / (s.totalDistanceMetres / 100)); // pace per 100m in ms

  // Linear regression slope — negative slope means getting faster
  const slope = linearSlope(recent);
  const avgPace = recent.reduce((a, b) => a + b, 0) / recent.length;
  const thresholdPct = 0.02; // 2% change is meaningful

  if (slope < -avgPace * thresholdPct) return TrendDirection.Improving;
  if (slope > avgPace * thresholdPct) return TrendDirection.Fading;
  return TrendDirection.Steady;
}

/**
 * Calculate weekly training volume in metres.
 */
export function calculateWeeklyVolume(
  sessions: SessionSummary[],
  weekStartTimestamp: number,
  weekEndTimestamp: number,
): number {
  return sessions
    .filter(s => s.date >= weekStartTimestamp && s.date < weekEndTimestamp)
    .reduce((total, s) => total + s.totalDistanceMetres, 0);
}

/**
 * Detect overtraining risk: >10% week-on-week volume increase.
 * Returns true if the current week exceeds last week by more than 10%.
 */
export function detectOvertrainingRisk(
  currentWeekVolume: number,
  previousWeekVolume: number,
): boolean {
  if (previousWeekVolume === 0) return false;
  const increase = (currentWeekVolume - previousWeekVolume) / previousWeekVolume;
  return increase > 0.1;
}

/**
 * Calculate consistency score: percentage of laps on pace across all sessions.
 */
export function calculateConsistencyScore(
  totalOnPaceLaps: number,
  totalLaps: number,
): number {
  if (totalLaps === 0) return 0;
  return Math.round((totalOnPaceLaps / totalLaps) * 100);
}

function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}
