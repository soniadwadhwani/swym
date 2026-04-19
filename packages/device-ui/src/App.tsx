import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PoolLength, Stroke, DeviceMode, type SetDefinition } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights, spacing } from '@swym/design-system';
import { SessionStateMachine, type SessionState } from './services/SessionStateMachine';
import { MockUWBService, GROUP_SWIMMERS, type MockSwimmer, type LapHistory } from './services/MockUWBService';
import { ScreenController } from './navigation/ScreenController';

const SOLO_SET: SetDefinition = {
  id: 'set-main',
  name: 'Main Set — 500m Freestyle',
  stroke: Stroke.Freestyle,
  distanceMetres: 500,
  poolLength: PoolLength.Long,
  targetPacePer100Ms: 65000,
  restIntervalMs: 20000,
  repetitions: 1,
};

const GROUP_SET: SetDefinition = {
  id: 'set-group',
  name: 'Group Set — 400m Freestyle',
  stroke: Stroke.Freestyle,
  distanceMetres: 400,
  poolLength: PoolLength.Long,
  targetPacePer100Ms: 65000,
  restIntervalMs: 20000,
  repetitions: 1,
};

type DemoMode = 'solo' | 'group';

export const App: React.FC = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>('solo');
  const [isRunning, setIsRunning] = useState(false);
  const [groupAutoCycle, setGroupAutoCycle] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [lapHistories, setLapHistories] = useState<Map<string, LapHistory>>(new Map());
  const [simSpeed, setSimSpeed] = useState(2000);

  const machineRef = useRef<SessionStateMachine | null>(null);
  const mockRef = useRef<MockUWBService | null>(null);

  const startSimulation = useCallback(() => {
    // Create fresh machine and mock
    const machine = new SessionStateMachine(1000);
    machineRef.current = machine;

    const swimmers: MockSwimmer[] = demoMode === 'solo'
      ? [{ ringId: 'ring-1', name: 'Arjun', targetPer100Ms: 65000, variance: 0.05, fadePattern: true }]
      : GROUP_SWIMMERS;

    const setDef = demoMode === 'solo' ? SOLO_SET : GROUP_SET;

    const mock = new MockUWBService(machine, {
      poolLength: PoolLength.Long,
      swimmers,
      setDefinitions: [setDef],
      lapIntervalMs: simSpeed,
    });
    mockRef.current = mock;

    // Subscribe to state updates
    machine.subscribe((state) => {
      setSessionState({ ...state });
      setLapHistories(new Map(mock.getLapHistories()));
    });

    mock.start();
    setIsRunning(true);
    setSessionState(machine.getState());
  }, [demoMode, simSpeed]);

  const stopSimulation = useCallback(() => {
    mockRef.current?.stop();
    machineRef.current?.dispatch({ type: 'END_SESSION' });
    setIsRunning(false);
  }, []);

  // Handle wall dismiss and summary dismiss via keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!machineRef.current) return;
      const state = machineRef.current.getState();
      if (e.key === ' ' || e.key === 'Enter') {
        if (state.phase === 'wallTouch') {
          machineRef.current.dispatch({ type: 'WALL_DISMISSED' });
        } else if (state.phase === 'setComplete') {
          machineRef.current.dispatch({ type: 'SUMMARY_DISMISSED' });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing['3xl'],
      padding: spacing['3xl'],
      minHeight: '100vh',
    }}>
      {/* Control panel */}
      <div style={{
        display: 'flex',
        gap: spacing.lg,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: deviceFontSizes.heading,
          fontWeight: fontWeights.medium,
          color: colors.purple,
          marginRight: spacing.lg,
        }}>
          WeSwym Device
        </div>

        {/* Mode toggle */}
        <ToggleButton
          label="Solo"
          active={demoMode === 'solo'}
          onClick={() => { if (!isRunning) setDemoMode('solo'); }}
        />
        <ToggleButton
          label="Group (6)"
          active={demoMode === 'group'}
          onClick={() => { if (!isRunning) setDemoMode('group'); }}
        />

        <div style={{ width: 1, height: 24, background: colors.gray700 }} />

        {/* Speed control */}
        <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.gray400, fontSize: 13 }}>
          Speed
          <select
            value={simSpeed}
            onChange={e => { if (!isRunning) setSimSpeed(Number(e.target.value)); }}
            style={{
              background: colors.gray800,
              color: colors.white,
              border: `1px solid ${colors.gray700}`,
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 13,
            }}
          >
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={2000}>Slow (2s)</option>
            <option value={3000}>Very Slow (3s)</option>
          </select>
        </label>

        {/* Auto-cycle toggle (group only) */}
        {demoMode === 'group' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.gray400, fontSize: 13, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={groupAutoCycle}
              onChange={e => setGroupAutoCycle(e.target.checked)}
              style={{ accentColor: colors.purple }}
            />
            Auto-cycle
          </label>
        )}

        <div style={{ width: 1, height: 24, background: colors.gray700 }} />

        {/* Start / Stop */}
        {!isRunning ? (
          <button onClick={startSimulation} style={primaryBtnStyle}>
            Start Session
          </button>
        ) : (
          <button onClick={stopSimulation} style={{ ...primaryBtnStyle, background: colors.red }}>
            End Session
          </button>
        )}
      </div>

      {/* Device screen */}
      {sessionState ? (
        <ScreenController
          sessionState={sessionState}
          lapHistories={lapHistories}
          groupAutoCycle={groupAutoCycle}
        />
      ) : (
        <div style={{
          width: 480,
          height: 320,
          background: colors.gray900,
          borderRadius: 16,
          border: `2px solid ${colors.gray700}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.gray600,
          fontSize: deviceFontSizes.heading,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          Press "Start Session" to begin
        </div>
      )}

      {/* Keyboard hints */}
      <div style={{
        display: 'flex',
        gap: spacing['2xl'],
        color: colors.gray600,
        fontSize: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span>← → Navigate screens</span>
        <span>Space / Enter — Dismiss wall / summary</span>
        <span>N — Simulate NFC tap (cycle swimmer)</span>
        <span>Esc — Clear NFC selection</span>
        <span>1-5 — Jump to screen</span>
      </div>
    </div>
  );
};

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? colors.purple : colors.gray800,
        color: active ? colors.white : colors.gray400,
        border: `1px solid ${active ? colors.purple : colors.gray700}`,
        borderRadius: 6,
        padding: '6px 16px',
        fontSize: 13,
        fontWeight: fontWeights.medium,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  background: colors.purple,
  color: colors.white,
  border: 'none',
  borderRadius: 8,
  padding: '8px 24px',
  fontSize: 14,
  fontWeight: '500',
  cursor: 'pointer',
  fontFamily: 'inherit',
};
