import React, { useCallback, useEffect, useState, useRef } from 'react';
import { DeviceMode, type SetDefinition } from '@swym/design-system';
import type { SessionState } from '../services/SessionStateMachine';
import type { LapHistory } from '../services/MockUWBService';

// Solo screens
import { PushOffScreen } from '../screens/solo/PushOffScreen';
import { WallScreen } from '../screens/solo/WallScreen';
import { SessionOverview } from '../screens/solo/SessionOverview';
import { PostSetSummary } from '../screens/solo/PostSetSummary';

// Group screens
import { LaneStatusScreen } from '../screens/group/LaneStatusScreen';
import { DrillDownScreen } from '../screens/group/DrillDownScreen';
import { ComparativeChartScreen } from '../screens/group/ComparativeChartScreen';
import { LeaderboardScreen } from '../screens/group/LeaderboardScreen';
import { GroupSummaryScreen } from '../screens/group/GroupSummaryScreen';

import { colors, deviceFontSizes, fontWeights, spacing } from '@swym/design-system';

interface ScreenControllerProps {
  sessionState: SessionState;
  lapHistories: Map<string, LapHistory>;
  groupAutoCycle: boolean;
}

/**
 * ScreenController — Mode-aware two-button navigation + auto-display logic.
 *
 * Solo cycle: Push-Off → (auto: Wall) → Session Overview → (auto: Summary)
 * Group cycle: Lane Status → Drill-Down → Comparative Chart → Leaderboard → (auto: Summary)
 *
 * Arrow keys and buttons navigate. Wall screen and summary auto-display on events.
 */
export const ScreenController: React.FC<ScreenControllerProps> = ({
  sessionState,
  lapHistories,
  groupAutoCycle,
}) => {
  const { mode, phase } = sessionState;

  // Manual screen index (within the navigable screens, excluding auto-triggered ones)
  const [soloScreenIndex, setSoloScreenIndex] = useState(0); // 0=push-off, 1=overview
  const [groupScreenIndex, setGroupScreenIndex] = useState(0); // 0=lane, 1=drill, 2=chart, 3=leaderboard
  const [drillDownSwimmerIdx, setDrillDownSwimmerIdx] = useState(0);
  const [highlightedRingId, setHighlightedRingId] = useState<string | null>(null);
  const [selectedSummaryRing, setSelectedSummaryRing] = useState<string | null>(null);

  const soloNavCount = 2; // push-off, overview
  const groupNavCount = 4; // lane, drill-down, chart, leaderboard

  const navigate = useCallback((direction: 1 | -1) => {
    if (mode === DeviceMode.Solo) {
      // Wall screen and summary are auto-triggered — dismiss them
      if (phase === 'wallTouch' || phase === 'setComplete') return; // button press dismisses (handled in parent)
      setSoloScreenIndex(prev => ((prev + direction) + soloNavCount) % soloNavCount);
    } else {
      if (phase === 'setComplete') return;
      // In group drill-down, button cycles through swimmers
      if (groupScreenIndex === 1) {
        const ringArr = [...sessionState.rings.values()].filter(r => !r.signalLost);
        setDrillDownSwimmerIdx(prev => ((prev + direction) + ringArr.length) % ringArr.length);
      } else {
        setGroupScreenIndex(prev => ((prev + direction) + groupNavCount) % groupNavCount);
      }
    }
  }, [mode, phase, groupScreenIndex, sessionState.rings]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') navigate(1);
      else if (e.key === 'ArrowLeft' || e.key === 'a') navigate(-1);
      // Number keys for direct screen jump (dev only)
      else if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key) - 1;
        if (mode === DeviceMode.Solo && idx < soloNavCount) setSoloScreenIndex(idx);
        if (mode === DeviceMode.Group && idx < groupNavCount) setGroupScreenIndex(idx);
      }
      // NFC tap simulation: 'n' cycles highlighted ring
      else if (e.key === 'n') {
        const ringArr = [...sessionState.rings.keys()];
        if (ringArr.length > 0) {
          const currentIdx = highlightedRingId ? ringArr.indexOf(highlightedRingId) : -1;
          const nextIdx = (currentIdx + 1) % ringArr.length;
          setHighlightedRingId(ringArr[nextIdx]);
          setSelectedSummaryRing(ringArr[nextIdx]);
          // Also jump to drill-down in group mode
          if (mode === DeviceMode.Group) {
            setGroupScreenIndex(1);
            setDrillDownSwimmerIdx(nextIdx);
          }
        }
      }
      // Clear NFC highlight
      else if (e.key === 'Escape') {
        setHighlightedRingId(null);
        setSelectedSummaryRing(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, mode, sessionState.rings, highlightedRingId]);

  // Auto-cycle: when enabled, always show worst-delta swimmer in drill-down
  useEffect(() => {
    if (groupAutoCycle && mode === DeviceMode.Group && sessionState.worstDeltaRingId) {
      const ringArr = [...sessionState.rings.values()].filter(r => !r.signalLost);
      const idx = ringArr.findIndex(r => r.ringId === sessionState.worstDeltaRingId);
      if (idx >= 0) setDrillDownSwimmerIdx(idx);
    }
  }, [groupAutoCycle, mode, sessionState.worstDeltaRingId, sessionState.rings]);

  const rings = [...sessionState.rings.values()].filter(r => !r.signalLost);
  const currentSet: SetDefinition | null = sessionState.workout?.sets[sessionState.currentSetIndex] ?? null;
  const lastCompletedSet = sessionState.completedSets[sessionState.completedSets.length - 1] ?? null;

  // --- RENDER ---

  // Idle state
  if (phase === 'idle' || phase === 'sessionComplete') {
    return (
      <DeviceFrame mode={mode}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: spacing['2xl'],
        }}>
          <div style={{
            fontSize: deviceFontSizes.metricHero,
            fontWeight: fontWeights.medium,
            color: colors.purple,
            letterSpacing: '-0.02em',
          }}>
            Swym
          </div>
          <div style={{
            fontSize: deviceFontSizes.label,
            color: colors.gray500,
          }}>
            {phase === 'idle' ? 'Ready — waiting for session' : 'Session complete'}
          </div>
        </div>
      </DeviceFrame>
    );
  }

  // --- SOLO MODE ---
  if (mode === DeviceMode.Solo) {
    const ring = rings[0] ?? null;

    // Auto-triggered: wall touch
    if (phase === 'wallTouch') {
      return (
        <DeviceFrame mode={mode} screenLabel="Wall" onButton={() => {}}>
          <WallScreen instruction={sessionState.lastCoachingInstruction} />
        </DeviceFrame>
      );
    }

    // Auto-triggered: set complete
    if (phase === 'setComplete' && lastCompletedSet) {
      return (
        <DeviceFrame mode={mode} screenLabel="Summary" onButton={() => {}}>
          <PostSetSummary setRecord={lastCompletedSet} toleranceMs={sessionState.toleranceMs} />
        </DeviceFrame>
      );
    }

    // Manual screens
    switch (soloScreenIndex) {
      case 0:
        return (
          <DeviceFrame mode={mode} screenLabel="Push-Off" onButton={navigate}>
            <PushOffScreen ring={ring} currentSet={currentSet} />
          </DeviceFrame>
        );
      case 1:
        return (
          <DeviceFrame mode={mode} screenLabel="Overview" onButton={navigate}>
            <SessionOverview
              totalDistanceMetres={sessionState.totalDistanceMetres}
              elapsedMs={sessionState.elapsedMs}
              currentSetIndex={sessionState.currentSetIndex}
              totalSets={sessionState.workout?.sets.length ?? 0}
              lastCompletedSet={lastCompletedSet}
              toleranceMs={sessionState.toleranceMs}
            />
          </DeviceFrame>
        );
      default:
        return null;
    }
  }

  // --- GROUP MODE ---
  const historyArr = [...lapHistories.values()];

  // Auto-triggered: set complete
  if (phase === 'setComplete') {
    return (
      <DeviceFrame mode={mode} screenLabel="Group Summary" onButton={() => {}}>
        <GroupSummaryScreen
          lapHistories={historyArr}
          rings={rings}
          toleranceMs={sessionState.toleranceMs}
          selectedRingId={selectedSummaryRing}
        />
      </DeviceFrame>
    );
  }

  switch (groupScreenIndex) {
    case 0:
      return (
        <DeviceFrame mode={mode} screenLabel="Lane Status" onButton={navigate}>
          <LaneStatusScreen rings={rings} />
        </DeviceFrame>
      );
    case 1: {
      const drillRing = rings[drillDownSwimmerIdx] ?? null;
      return (
        <DeviceFrame mode={mode} screenLabel="Drill-Down" onButton={navigate}>
          <DrillDownScreen
            ring={drillRing}
            toleranceMs={sessionState.toleranceMs}
            swimmerCount={rings.length}
            currentIndex={drillDownSwimmerIdx + 1}
            isAutoCycle={groupAutoCycle}
          />
        </DeviceFrame>
      );
    }
    case 2:
      return (
        <DeviceFrame mode={mode} screenLabel="Comparison" onButton={navigate}>
          <ComparativeChartScreen
            lapHistories={historyArr}
            highlightedRingId={highlightedRingId}
          />
        </DeviceFrame>
      );
    case 3:
      return (
        <DeviceFrame mode={mode} screenLabel="Leaderboard" onButton={navigate}>
          <LeaderboardScreen rings={rings} />
        </DeviceFrame>
      );
    default:
      return null;
  }
};

// --- Device frame wrapper ---

interface DeviceFrameProps {
  mode: DeviceMode;
  screenLabel?: string;
  onButton?: (dir: 1 | -1) => void;
  children: React.ReactNode;
}

function DeviceFrame({ mode, screenLabel, onButton, children }: DeviceFrameProps) {
  return (
    <div style={{
      width: 480,
      height: 320,
      background: colors.gray900,
      borderRadius: 16,
      border: `2px solid ${colors.gray700}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Top bar: mode indicator + screen label */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${spacing.xs}px ${spacing.md}px`,
        background: colors.gray800,
        borderBottom: `1px solid ${colors.gray700}`,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: fontWeights.medium,
          color: colors.purple,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {mode === DeviceMode.Solo ? 'SOLO' : 'GROUP'}
        </span>
        {screenLabel && (
          <span style={{
            fontSize: 11,
            color: colors.gray500,
            fontWeight: fontWeights.medium,
          }}>
            {screenLabel}
          </span>
        )}
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </div>

      {/* Button bar (visible, clickable) */}
      {onButton && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: `${spacing.xs}px ${spacing.md}px`,
          background: colors.gray800,
          borderTop: `1px solid ${colors.gray700}`,
          flexShrink: 0,
        }}>
          <button
            onClick={() => onButton(-1)}
            style={buttonStyle}
          >
            ◄
          </button>
          <button
            onClick={() => onButton(1)}
            style={buttonStyle}
          >
            ►
          </button>
        </div>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  background: colors.gray700,
  color: colors.gray300,
  border: 'none',
  borderRadius: 6,
  padding: '4px 20px',
  fontSize: 16,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
