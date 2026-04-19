import {
  PoolLength,
  Stroke,
  type PaceTarget,
  type SetDefinition,
  type Workout,
  type Lap,
  PaceStatus,
} from '@swym/design-system';
import { calculatePaceStatus } from '@swym/design-system';
import { SessionStateMachine } from './SessionStateMachine';

export interface MockSwimmer {
  ringId: string;
  name: string;
  targetPer100Ms: number;
  /** Standard deviation as fraction of target (0.05 = 5% variance). */
  variance: number;
  /** If true, swimmer slows progressively in the second half. */
  fadePattern: boolean;
}

export interface MockConfig {
  poolLength: PoolLength;
  swimmers: MockSwimmer[];
  setDefinitions: SetDefinition[];
  /** Delay between simulated laps in real ms (controls simulation speed). */
  lapIntervalMs: number;
}

/**
 * Stores the full lap history per ring (the state machine only keeps recent 3).
 */
export interface LapHistory {
  ringId: string;
  swimmerName: string;
  laps: Lap[];
  target: PaceTarget;
}

const DEFAULT_SWIMMERS: MockSwimmer[] = [
  { ringId: 'ring-1', name: 'Arjun', targetPer100Ms: 65000, variance: 0.04, fadePattern: true },
];

const DEFAULT_SET: SetDefinition = {
  id: 'set-1',
  name: 'Main Set — 500m Freestyle',
  stroke: Stroke.Freestyle,
  distanceMetres: 500,
  poolLength: PoolLength.Long,
  targetPacePer100Ms: 65000,
  restIntervalMs: 20000,
  repetitions: 1,
};

export const GROUP_SWIMMERS: MockSwimmer[] = [
  { ringId: 'ring-1', name: 'Arjun', targetPer100Ms: 62000, variance: 0.03, fadePattern: false },
  { ringId: 'ring-2', name: 'Riya', targetPer100Ms: 68000, variance: 0.06, fadePattern: true },
  { ringId: 'ring-3', name: 'Dev', targetPer100Ms: 65000, variance: 0.04, fadePattern: false },
  { ringId: 'ring-4', name: 'Sneha', targetPer100Ms: 70000, variance: 0.05, fadePattern: true },
  { ringId: 'ring-5', name: 'Vikram', targetPer100Ms: 64000, variance: 0.03, fadePattern: false },
  { ringId: 'ring-6', name: 'Meera', targetPer100Ms: 66000, variance: 0.04, fadePattern: false },
];

/**
 * MockUWBService — simulates realistic UWB distance traces and generates
 * lap events at configurable intervals. Drives the SessionStateMachine.
 */
export class MockUWBService {
  private machine: SessionStateMachine;
  private config: MockConfig;
  private intervalHandle: number | null = null;
  private lapCounters: Map<string, number> = new Map();
  private lapHistories: Map<string, LapHistory> = new Map();
  private running = false;

  constructor(machine: SessionStateMachine, config?: Partial<MockConfig>) {
    this.machine = machine;
    this.config = {
      poolLength: config?.poolLength ?? PoolLength.Long,
      swimmers: config?.swimmers ?? DEFAULT_SWIMMERS,
      setDefinitions: config?.setDefinitions ?? [DEFAULT_SET],
      lapIntervalMs: config?.lapIntervalMs ?? 2000,
    };
  }

  getConfig(): MockConfig {
    return this.config;
  }

  getLapHistories(): Map<string, LapHistory> {
    return this.lapHistories;
  }

  getLapHistory(ringId: string): LapHistory | undefined {
    return this.lapHistories.get(ringId);
  }

  start() {
    if (this.running) return;
    this.running = true;

    // Build workout from config
    const workout: Workout = {
      id: 'mock-workout',
      name: 'Mock Training Session',
      sets: this.config.setDefinitions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Register swimmers
    for (const swimmer of this.config.swimmers) {
      const perLapMs = (swimmer.targetPer100Ms / 100) * this.config.poolLength;
      const target: PaceTarget = {
        per100Ms: swimmer.targetPer100Ms,
        perLapMs,
      };
      this.machine.registerRing(swimmer.ringId, swimmer.name, target);
      this.lapCounters.set(swimmer.ringId, 0);
      this.lapHistories.set(swimmer.ringId, {
        ringId: swimmer.ringId,
        swimmerName: swimmer.name,
        laps: [],
        target,
      });
    }

    // Start session
    this.machine.dispatch({ type: 'START_SESSION', workout });

    // Simulate laps at interval
    this.intervalHandle = window.setInterval(() => {
      this.simulateLapForAllSwimmers();
    }, this.config.lapIntervalMs);
  }

  stop() {
    this.running = false;
    if (this.intervalHandle !== null) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  private simulateLapForAllSwimmers() {
    const state = this.machine.getState();
    if (state.phase === 'setComplete' || state.phase === 'sessionComplete') {
      this.stop();
      return;
    }
    // Don't generate laps during wall touch display — wait for dismiss
    if (state.phase === 'wallTouch') return;

    for (const swimmer of this.config.swimmers) {
      const ring = state.rings.get(swimmer.ringId);
      if (!ring || ring.currentLap >= ring.totalLaps) continue;

      const lapNum = (this.lapCounters.get(swimmer.ringId) ?? 0) + 1;
      this.lapCounters.set(swimmer.ringId, lapNum);

      const splitTimeMs = this.generateSplitTime(swimmer, lapNum, ring.totalLaps);
      const timestamp = Date.now();

      // Dispatch to state machine
      this.machine.dispatch({
        type: 'LAP_DETECTED',
        ringId: swimmer.ringId,
        splitTimeMs,
        timestamp,
      });

      // Store in full lap history
      const history = this.lapHistories.get(swimmer.ringId);
      if (history) {
        const cumulativeTimeMs = history.laps.reduce((t, l) => t + l.splitTimeMs, 0) + splitTimeMs;
        const deltaMs = splitTimeMs - history.target.perLapMs;
        history.laps.push({
          lapNumber: lapNum,
          splitTimeMs,
          cumulativeTimeMs,
          deltaMs,
          paceStatus: calculatePaceStatus(deltaMs, state.toleranceMs),
          timestamp,
        });
      }
    }
  }

  /**
   * Generate a realistic split time with optional fade pattern.
   */
  private generateSplitTime(
    swimmer: MockSwimmer,
    lapNumber: number,
    totalLaps: number,
  ): number {
    const basePacePerLap = (swimmer.targetPer100Ms / 100) * this.config.poolLength;

    // Random variance
    const randomFactor = 1 + (Math.random() - 0.5) * 2 * swimmer.variance;

    // Fade pattern: progressively slower in the second half
    let fadeFactor = 1;
    if (swimmer.fadePattern && lapNumber > totalLaps / 2) {
      const fadeProgress = (lapNumber - totalLaps / 2) / (totalLaps / 2);
      fadeFactor = 1 + fadeProgress * 0.12; // up to 12% slower at the end
    }

    return Math.round(basePacePerLap * randomFactor * fadeFactor);
  }
}
