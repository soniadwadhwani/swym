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
 * Auto-triggers on final lap detection.
 * Verdict badge, best/worst/on-pace grid, full lap chart, written insight.
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
      padding: deviceLayout.screenPadding,
      gap: spacing.md,
    }}>
      {/* Header row: set name + verdict badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: deviceFontSizes.heading,
          fontWeight: fontWeights.medium,
          color: colors.gray400,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {setDefinition.name}
        </div>
        <VerdictBadge verdict={verdict} />
      </div>

      {/* 3-column metric grid */}
      <div style={{ display: 'flex', gap: spacing.md }}>
        <SummaryTile
          label="Best Lap"
          value={formatTimeMs(bestLap.splitTimeMs)}
          sub={`Lap ${bestLap.lapNumber}`}
          color={colors.green}
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
          color={colors.purple}
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
              tick={{ fill: colors.gray500, fontSize: 12 }}
              axisLine={{ stroke: colors.gray700 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: colors.gray500, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <ReferenceLine
              y={targetPerLapSec}
              stroke={colors.gray500}
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
        color: colors.gray300,
        lineHeight: 1.5,
        textAlign: 'center',
        padding: `${spacing.sm}px 0`,
      }}>
        {insight}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.body,
        color: colors.gray500,
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
      background: colors.gray800,
      borderRadius: 8,
      padding: spacing.md,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: fontWeights.medium,
        color: colors.gray400,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
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
        fontSize: 13,
        color: colors.gray500,
        marginTop: 2,
      }}>
        {sub}
      </div>
    </div>
  );
}

function lapBarColor(deltaMs: number, toleranceMs: number): string {
  if (Math.abs(deltaMs) <= toleranceMs) return colors.green;
  if (deltaMs <= toleranceMs * 4) return colors.amber;
  return colors.red;
}
