import React from 'react';
import {
  colors,
  deviceFontSizes,
  fontWeights,
  spacing,
  deviceLayout,
} from '@swym/design-system';
import { formatTimeMs, generateSetVerdict } from '@swym/design-system';
import type { Lap, SetRecord } from '@swym/design-system';
import { VerdictBadge } from '../../components/VerdictBadge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
} from 'recharts';

interface PostSetSummaryProps {
  setRecord: SetRecord;
  toleranceMs: number;
}

/**
 * Solo Screen 4 — The Post-Set Summary Screen
 *
 * ONE JOB: "How did the whole set go?"
 *
 * Frosted glass tiles, full lap chart, written insight, verdict pill.
 */
export const PostSetSummary: React.FC<PostSetSummaryProps> = ({
  setRecord,
  toleranceMs,
}) => {
  const { laps, bestLap, worstLap, onPaceCount, totalLaps, insight, setDefinition } = setRecord;
  const onPacePct = totalLaps > 0 ? Math.round((onPaceCount / totalLaps) * 100) : 0;
  const verdict = generateSetVerdict(onPacePct);
  const targetPerLapSec = (setDefinition.targetPacePer100Ms / 100 * setDefinition.poolLength) / 1000;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: `0 ${deviceLayout.screenPadding}px`,
      paddingBottom: spacing.lg,
      gap: spacing.md,
    }}>
      {/* Header row: set name + verdict badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: deviceFontSizes.caption,
          fontWeight: fontWeights.light,
          color: 'rgba(255,255,255,0.40)',
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
        }}>
          {setDefinition.name}
        </div>
        <VerdictBadge verdict={verdict} />
      </div>

      {/* 3-column frosted metric grid */}
      <div style={{ display: 'flex', gap: spacing.md }}>
        <SummaryTile
          label="Best Lap"
          value={formatTimeMs(bestLap.splitTimeMs)}
          sub={`Lap ${bestLap.lapNumber}`}
          color={colors.accent}
        />
        <SummaryTile
          label="Worst Lap"
          value={formatTimeMs(worstLap.splitTimeMs)}
          sub={`Lap ${worstLap.lapNumber}`}
          color={colors.red}
        />
        <SummaryTile
          label="On Pace"
          value={`${onPaceCount}/${totalLaps}`}
          sub={`${onPacePct}%`}
          color={colors.accent}
        />
      </div>

      {/* Full-width lap-by-lap bar chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={laps.map(l => ({
            lap: l.lapNumber,
            split: l.splitTimeMs / 1000,
            delta: l.deltaMs,
          }))}>
            <XAxis
              dataKey="lap"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <ReferenceLine
              y={targetPerLapSec}
              stroke="rgba(255,255,255,0.20)"
              strokeDasharray="4 4"
            />
            <Bar dataKey="split" radius={[4, 4, 0, 0]}>
              {laps.map((l, i) => (
                <Cell key={i} fill={lapBarColor(l.deltaMs, toleranceMs)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Written insight */}
      <div style={{
        fontSize: deviceFontSizes.body,
        color: 'rgba(255,255,255,0.60)',
        lineHeight: 1.5,
        textAlign: 'center',
        fontWeight: fontWeights.light,
      }}>
        {insight}
      </div>

      {/* Footer hint */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.hint,
        color: 'rgba(255,255,255,0.40)',
      }}>
        press either button to continue
      </div>
    </div>
  );
};

function SummaryTile({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 16,
      padding: '8px 10px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: fontWeights.light,
        color: 'rgba(255,255,255,0.40)',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: deviceFontSizes.metric,
        fontWeight: fontWeights.medium,
        color,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        marginTop: 1,
      }}>
        {sub}
      </div>
    </div>
  );
}

function lapBarColor(deltaMs: number, toleranceMs: number): string {
  if (Math.abs(deltaMs) <= toleranceMs) return colors.accent;
  if (deltaMs <= toleranceMs * 4) return colors.amber;
  return colors.red;
}
