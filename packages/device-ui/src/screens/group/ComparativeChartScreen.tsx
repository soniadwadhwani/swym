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

// Swimmer identity colors — teal-forward palette
const SWIMMER_COLORS = [
  '#09b1be', // teal accent
  '#EF9F27', // amber
  '#a78bfa', // lavender
  '#E24B4A', // red
  '#34d399', // emerald
  '#f472b6', // pink
  '#fbbf24', // gold
  '#60a5fa', // sky
];

interface ComparativeChartScreenProps {
  lapHistories: LapHistory[];
  highlightedRingId: string | null;
}

/**
 * Group Screen 3 — The Comparative Chart Screen
 *
 * ONE JOB: "How is the lane performing as a group?"
 *
 * Multi-line chart, minimal axis styling, NFC highlight.
 */
export const ComparativeChartScreen: React.FC<ComparativeChartScreenProps> = ({
  lapHistories,
  highlightedRingId,
}) => {
  const maxLaps = Math.max(...lapHistories.map(h => h.laps.length), 0);
  const chartData = [];
  for (let i = 0; i < maxLaps; i++) {
    const row: Record<string, number | string> = { lap: i + 1 };
    for (const history of lapHistories) {
      if (history.laps[i]) {
        row[history.ringId] = history.laps[i].splitTimeMs / 1000;
      }
    }
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
      padding: `0 ${deviceLayout.screenPadding}px`,
      paddingBottom: deviceLayout.screenPadding,
      gap: spacing.sm,
    }}>
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
              opacity: highlightedRingId && highlightedRingId !== h.ringId ? 0.25 : 1,
            }}
          >
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: SWIMMER_COLORS[i % SWIMMER_COLORS.length],
            }} />
            <span style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.60)',
              fontWeight: fontWeights.light,
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
              tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            {/* Target line — dashed */}
            <Line
              dataKey="target"
              stroke="rgba(255,255,255,0.20)"
              strokeDasharray="6 4"
              dot={false}
              strokeWidth={1}
            />
            {/* Swimmer lines */}
            {lapHistories.map((h, i) => (
              <Line
                key={h.ringId}
                dataKey={h.ringId}
                stroke={SWIMMER_COLORS[i % SWIMMER_COLORS.length]}
                strokeWidth={highlightedRingId === h.ringId ? 2.5 : 1.5}
                strokeOpacity={highlightedRingId && highlightedRingId !== h.ringId ? 0.15 : 0.9}
                dot={false}
                activeDot={highlightedRingId === h.ringId ? { r: 3 } : false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.hint,
        color: 'rgba(255,255,255,0.40)',
      }}>
        tap ring to highlight swimmer
      </div>
    </div>
  );
};
