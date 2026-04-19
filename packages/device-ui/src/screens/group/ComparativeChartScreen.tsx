import React from 'react';
import {
  colors,
  deviceFontSizes,
  fontWeights,
  spacing,
  deviceLayout,
} from '@swym/design-system';
import type { Lap } from '@swym/design-system';
import type { LapHistory } from '../../services/MockUWBService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';

// Swimmer identity colors for group chart lines
const SWIMMER_COLORS = [
  '#1D9E75', // teal
  '#EF9F27', // amber
  '#534AB7', // purple
  '#E24B4A', // red
  '#639922', // green
  '#4ECDC4', // cyan
  '#FF6B6B', // coral
  '#45B7D1', // sky
];

interface ComparativeChartScreenProps {
  lapHistories: LapHistory[];
  /** Ring ID of swimmer to highlight (via NFC tap), or null for all */
  highlightedRingId: string | null;
}

/**
 * Group Screen 3 — The Comparative Chart Screen
 *
 * ONE JOB: "How is the lane performing as a group?"
 *
 * All swimmers' pace lines on one chart. 10-20 second read for rest intervals.
 * NFC ring tap highlights one swimmer's line, dims all others.
 */
export const ComparativeChartScreen: React.FC<ComparativeChartScreenProps> = ({
  lapHistories,
  highlightedRingId,
}) => {
  // Build chart data: one row per lap number, one column per swimmer
  const maxLaps = Math.max(...lapHistories.map(h => h.laps.length), 0);
  const chartData = [];
  for (let i = 0; i < maxLaps; i++) {
    const row: Record<string, number | string> = { lap: i + 1 };
    for (const history of lapHistories) {
      if (history.laps[i]) {
        row[history.ringId] = history.laps[i].splitTimeMs / 1000;
      }
    }
    // Add target line from first swimmer (simplified)
    if (lapHistories[0]) {
      row['target'] = lapHistories[0].target.perLapMs / 1000;
    }
    chartData.push(row);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: deviceLayout.screenPadding,
      gap: spacing.md,
    }}>
      {/* Header */}
      <div style={{
        fontSize: deviceFontSizes.heading,
        fontWeight: fontWeights.medium,
        color: colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textAlign: 'center',
      }}>
        Pace Comparison
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
      }}>
        {lapHistories.map((h, i) => (
          <div
            key={h.ringId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              opacity: highlightedRingId && highlightedRingId !== h.ringId ? 0.3 : 1,
            }}
          >
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: SWIMMER_COLORS[i % SWIMMER_COLORS.length],
            }} />
            <span style={{
              fontSize: 13,
              color: colors.gray300,
              fontWeight: fontWeights.medium,
            }}>
              {h.swimmerName}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="lap"
              tick={{ fill: colors.gray500, fontSize: 12 }}
              axisLine={{ stroke: colors.gray700 }}
              tickLine={false}
              label={{ value: 'Lap', fill: colors.gray500, fontSize: 12, position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tick={{ fill: colors.gray500, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={45}
              label={{ value: 'Split (s)', fill: colors.gray500, fontSize: 12, angle: -90, position: 'insideLeft' }}
            />
            {/* Target line — dashed */}
            <Line
              dataKey="target"
              stroke={colors.gray500}
              strokeDasharray="6 4"
              dot={false}
              strokeWidth={1.5}
            />
            {/* Swimmer lines */}
            {lapHistories.map((h, i) => (
              <Line
                key={h.ringId}
                dataKey={h.ringId}
                stroke={SWIMMER_COLORS[i % SWIMMER_COLORS.length]}
                strokeWidth={highlightedRingId === h.ringId ? 3 : 1.5}
                strokeOpacity={highlightedRingId && highlightedRingId !== h.ringId ? 0.2 : 1}
                dot={false}
                activeDot={highlightedRingId === h.ringId ? { r: 4 } : false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.body,
        color: colors.gray500,
      }}>
        tap ring to highlight swimmer
      </div>
    </div>
  );
};
