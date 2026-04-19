import React from 'react';
import {
  colors,
  deviceFontSizes,
  fontWeights,
  spacing,
  deviceLayout,
} from '@swym/design-system';
import { formatTimeMs } from '@swym/design-system';
import type { Lap, SetRecord } from '@swym/design-system';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
} from 'recharts';

interface SessionOverviewProps {
  totalDistanceMetres: number;
  elapsedMs: number;
  currentSetIndex: number;
  totalSets: number;
  lastCompletedSet: SetRecord | null;
  toleranceMs: number;
}

/**
 * Solo Screen 3 — The Session Overview Screen
 *
 * ONE JOB: "Where am I in the whole session?"
 *
 * For between-set rest intervals. Frosted glass metric tiles + lap chart.
 */
export const SessionOverview: React.FC<SessionOverviewProps> = ({
  totalDistanceMetres,
  elapsedMs,
  currentSetIndex,
  totalSets,
  lastCompletedSet,
  toleranceMs,
}) => {
  const elapsedStr = formatElapsed(elapsedMs);
  const setsCompleted = currentSetIndex;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: `0 ${deviceLayout.screenPadding}px`,
      paddingBottom: deviceLayout.screenPadding,
      gap: spacing.lg,
    }}>
      {/* Metric row — frosted tiles */}
      <div style={{
        display: 'flex',
        gap: spacing.md,
      }}>
        <MetricTile label="Distance" value={`${totalDistanceMetres}m`} />
        <MetricTile label="Elapsed" value={elapsedStr} />
        <MetricTile
          label="Sets"
          value={totalSets > 0 ? `${setsCompleted} / ${totalSets}` : '—'}
        />
      </div>

      {/* Last set lap chart */}
      {lastCompletedSet && lastCompletedSet.laps.length > 0 && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{
            fontSize: deviceFontSizes.caption,
            fontWeight: fontWeights.light,
            color: 'rgba(255,255,255,0.40)',
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Last Set: {lastCompletedSet.setDefinition.name}
          </div>
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lastCompletedSet.laps.map(l => ({
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
                  y={(lastCompletedSet.setDefinition.targetPacePer100Ms / 100 * lastCompletedSet.setDefinition.poolLength) / 1000}
                  stroke="rgba(255,255,255,0.20)"
                  strokeDasharray="4 4"
                />
                <Bar dataKey="split" radius={[4, 4, 0, 0]}>
                  {lastCompletedSet.laps.map((l, i) => (
                    <Cell
                      key={i}
                      fill={lapColor(l.deltaMs, toleranceMs)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!lastCompletedSet && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: deviceFontSizes.label,
          fontWeight: fontWeights.light,
        }}>
          No completed sets yet
        </div>
      )}
    </div>
  );
};

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 16,
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: deviceFontSizes.caption,
        fontWeight: fontWeights.light,
        color: 'rgba(255,255,255,0.40)',
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: deviceFontSizes.metric,
        fontWeight: fontWeights.medium,
        color: colors.white,
      }}>
        {value}
      </div>
    </div>
  );
}

function lapColor(deltaMs: number, toleranceMs: number): string {
  if (Math.abs(deltaMs) <= toleranceMs) return colors.accent;
  if (deltaMs <= toleranceMs * 4) return colors.amber;
  return colors.red;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
