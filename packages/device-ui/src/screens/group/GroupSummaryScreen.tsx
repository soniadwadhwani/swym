import React from 'react';
import {
  colors,
  deviceFontSizes,
  fontWeights,
  spacing,
  deviceLayout,
  TrendDirection,
} from '@swym/design-system';
import { formatTimeMs, isLapOnPace } from '@swym/design-system';
import type { RingState, SetRecord } from '@swym/design-system';
import type { LapHistory } from '../../services/MockUWBService';
import { TrendWord } from '../../components/TrendWord';
import { VerdictBadge } from '../../components/VerdictBadge';
import { generateSetVerdict } from '@swym/design-system';

interface GroupSummaryScreenProps {
  lapHistories: LapHistory[];
  rings: RingState[];
  toleranceMs: number;
  /** Ring ID selected via NFC tap for expanded detail, or null for overview */
  selectedRingId: string | null;
}

/**
 * Group Screen 5 — The Group Post-Set Summary
 *
 * ONE JOB: "How did everyone do?"
 *
 * Each swimmer gets a compact row: name, on-pace %, best lap, trend direction.
 * Coach can scan the whole lane's performance in 15 seconds.
 * NFC ring tap shows only that swimmer's full individual summary.
 */
export const GroupSummaryScreen: React.FC<GroupSummaryScreenProps> = ({
  lapHistories,
  rings,
  toleranceMs,
  selectedRingId,
}) => {
  // If a swimmer is selected via NFC, show their detailed summary
  if (selectedRingId) {
    const history = lapHistories.find(h => h.ringId === selectedRingId);
    const ring = rings.find(r => r.ringId === selectedRingId);
    if (history && ring) {
      return <IndividualDetail history={history} ring={ring} toleranceMs={toleranceMs} />;
    }
  }

  // Group overview: one row per swimmer
  const swimmerRows = lapHistories.map(history => {
    const ring = rings.find(r => r.ringId === history.ringId);
    const onPaceCount = history.laps.filter(l => isLapOnPace(l, toleranceMs)).length;
    const onPacePct = history.laps.length > 0
      ? Math.round((onPaceCount / history.laps.length) * 100)
      : 0;
    const bestLap = history.laps.length > 0
      ? history.laps.reduce((a, b) => a.splitTimeMs < b.splitTimeMs ? a : b)
      : null;

    return {
      ringId: history.ringId,
      name: history.swimmerName,
      onPacePct,
      bestLapMs: bestLap?.splitTimeMs ?? 0,
      trendDirection: ring?.trendDirection ?? TrendDirection.Steady,
    };
  });

  // Sort by on-pace percentage descending
  swimmerRows.sort((a, b) => b.onPacePct - a.onPacePct);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: deviceLayout.screenPadding,
    }}>
      {/* Header */}
      <div style={{
        fontSize: deviceFontSizes.heading,
        fontWeight: fontWeights.medium,
        color: colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textAlign: 'center',
        marginBottom: spacing.lg,
      }}>
        Set Summary
      </div>

      {/* Column headers */}
      <div style={{
        display: 'flex',
        padding: `0 ${spacing.md}px`,
        marginBottom: spacing.sm,
      }}>
        <div style={{ flex: 1, ...headerStyle }}>Swimmer</div>
        <div style={{ width: 70, textAlign: 'center', ...headerStyle }}>On Pace</div>
        <div style={{ width: 70, textAlign: 'center', ...headerStyle }}>Best</div>
        <div style={{ width: 90, textAlign: 'center', ...headerStyle }}>Trend</div>
      </div>

      {/* Swimmer rows */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
      }}>
        {swimmerRows.map(row => (
          <div
            key={row.ringId}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: deviceLayout.rowHeight,
              padding: `0 ${spacing.md}px`,
              background: colors.gray800,
              borderRadius: 8,
            }}
          >
            <div style={{
              flex: 1,
              fontSize: deviceFontSizes.label,
              fontWeight: fontWeights.medium,
              color: colors.white,
            }}>
              {row.name}
            </div>
            <div style={{
              width: 70,
              textAlign: 'center',
              fontSize: deviceFontSizes.label,
              fontWeight: fontWeights.medium,
              color: row.onPacePct >= 70 ? colors.green : row.onPacePct >= 40 ? colors.amber : colors.red,
            }}>
              {row.onPacePct}%
            </div>
            <div style={{
              width: 70,
              textAlign: 'center',
              fontSize: deviceFontSizes.label,
              color: colors.gray300,
            }}>
              {row.bestLapMs > 0 ? formatTimeMs(row.bestLapMs) : '—'}
            </div>
            <div style={{ width: 90, textAlign: 'center' }}>
              <TrendWord direction={row.trendDirection} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.body,
        color: colors.gray500,
        paddingTop: spacing.md,
      }}>
        tap ring for individual detail • press button to continue
      </div>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: '500',
  color: colors.gray500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

/**
 * Individual swimmer detail within the group summary (shown on NFC tap).
 */
function IndividualDetail({
  history,
  ring,
  toleranceMs,
}: {
  history: LapHistory;
  ring: RingState;
  toleranceMs: number;
}) {
  const { laps } = history;
  if (laps.length === 0) return null;

  const onPaceCount = laps.filter(l => isLapOnPace(l, toleranceMs)).length;
  const onPacePct = Math.round((onPaceCount / laps.length) * 100);
  const best = laps.reduce((a, b) => a.splitTimeMs < b.splitTimeMs ? a : b);
  const worst = laps.reduce((a, b) => a.splitTimeMs > b.splitTimeMs ? a : b);
  const verdict = generateSetVerdict(onPacePct);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: deviceLayout.screenPadding,
      gap: spacing.md,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: deviceFontSizes.heading,
          fontWeight: fontWeights.medium,
          color: colors.teal,
        }}>
          {ring.swimmerName}
        </div>
        <VerdictBadge verdict={verdict} />
      </div>

      <div style={{ display: 'flex', gap: spacing.md }}>
        <DetailTile label="Best Lap" value={formatTimeMs(best.splitTimeMs)} sub={`Lap ${best.lapNumber}`} color={colors.green} />
        <DetailTile label="Worst Lap" value={formatTimeMs(worst.splitTimeMs)} sub={`Lap ${worst.lapNumber}`} color={colors.red} />
        <DetailTile label="On Pace" value={`${onPaceCount}/${laps.length}`} sub={`${onPacePct}%`} color={colors.purple} />
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.body,
        color: colors.gray500,
        marginTop: 'auto',
      }}>
        tap ring again to return to group view
      </div>
    </div>
  );
}

function DetailTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      flex: 1,
      background: colors.gray800,
      borderRadius: 8,
      padding: spacing.md,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: fontWeights.medium, color: colors.gray400, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: deviceFontSizes.metric, fontWeight: fontWeights.medium, color }}>{value}</div>
      <div style={{ fontSize: 13, color: colors.gray500, marginTop: 2 }}>{sub}</div>
    </div>
  );
}
