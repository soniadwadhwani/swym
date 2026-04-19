import {
  DeviceMode,
  PaceStatus,
  TrendDirection,
  type Lap,
  type PaceTarget,
  type RingState,
  type SetDefinition,
  type SetRecord,
  type Workout,
} from '@swym/design-system';
import {
  calculatePaceStatus,
  calculateTrendDirection,
  generateCoachingInstruction,
  generateSessionInsight,
  isLapOnPace,
  type CoachingInstruction,
} from '@swym/design-system';

// --- Session state machine types ---

export type SessionPhase =
  | 'idle'
  | 'sessionActive'
  | 'setInProgress'
  | 'wallTouch'
  | 'restInterval'
  | 'setComplete'
  | 'sessionComplete';

export type DeviceEvent =
  | { type: 'START_SESSION'; workout?: Workout }
  | { type: 'LAP_DETECTED'; ringId: string; splitTimeMs: number; timestamp: number }
  | { type: 'WALL_DISMISSED' }
  | { type: 'SUMMARY_DISMISSED' }
  | { type: 'END_SESSION' };

export interface SessionState {
  phase: SessionPhase;
  mode: DeviceMode;
  workout: Workout | null;
  currentSetIndex: number;
  rings: Map<string, RingState>;
  completedSets: SetRecord[];
  sessionStartMs: number;
  elapsedMs: number;
  totalDistanceMetres: number;
  // The ring that last triggered a wall touch (for solo wall screen)
  lastWallTouchRingId: string | null;
  // Auto-cycle: the ring with the worst delta (for group drill-down)
  worstDeltaRingId: string | null;
  // Coaching instruction for the last wall touch
  lastCoachingInstruction: CoachingInstruction | null;
  toleranceMs: number;
}

export type SessionListener = (state: SessionState) => void;

export function createInitialState(toleranceMs: number = 1000): SessionState {
  return {
    phase: 'idle',
    mode: DeviceMode.Solo,
    workout: null,
    currentSetIndex: 0,
    rings: new Map(),
    completedSets: [],
    sessionStartMs: 0,
    elapsedMs: 0,
    totalDistanceMetres: 0,
    lastWallTouchRingId: null,
    worstDeltaRingId: null,
    lastCoachingInstruction: null,
    toleranceMs,
  };
}

/**
 * SessionStateMachine — manages all per-ring state, lap counting,
 * delta calculation, trend tracking, and coaching instruction generation.
 */
export class SessionStateMachine {
  private state: SessionState;
  private listeners: Set<SessionListener> = new Set();
  private timerHandle: number | null = null;

  constructor(toleranceMs: number = 1000) {
    this.state = createInitialState(toleranceMs);
  }

  getState(): SessionState {
    return this.state;
  }

  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const snapshot = { ...this.state };
    this.listeners.forEach(l => l(snapshot));
  }

  dispatch(event: DeviceEvent) {
    switch (event.type) {
      case 'START_SESSION':
        this.startSession(event.workout);
        break;
      case 'LAP_DETECTED':
        this.handleLapDetected(event.ringId, event.splitTimeMs, event.timestamp);
        break;
      case 'WALL_DISMISSED':
        this.handleWallDismissed();
        break;
      case 'SUMMARY_DISMISSED':
        this.handleSummaryDismissed();
        break;
      case 'END_SESSION':
        this.endSession();
        break;
    }
  }

  registerRing(ringId: string, swimmerName: string, target: PaceTarget) {
    const currentSet = this.getCurrentSet();
    const totalLaps = currentSet
      ? currentSet.distanceMetres / currentSet.poolLength
      : 0;

    this.state.rings.set(ringId, {
      ringId,
      swimmerId: ringId, // simplified: use ringId as swimmerId
      swimmerName,
      currentLap: 0,
      totalLaps,
      lastSplitMs: 0,
      deltaMs: 0,
      paceStatus: PaceStatus.OnPace,
      trendDirection: TrendDirection.Steady,
      recentSplits: [],
      distanceMetres: 0,
      signalLost: false,
      target,
    });

    // Update mode based on ring count
    this.state.mode = this.state.rings.size >= 2 ? DeviceMode.Group : DeviceMode.Solo;
    this.notify();
  }

  private getCurrentSet(): SetDefinition | null {
    if (!this.state.workout) return null;
    return this.state.workout.sets[this.state.currentSetIndex] ?? null;
  }

  private startSession(workout?: Workout) {
    this.state.phase = 'sessionActive';
    this.state.workout = workout ?? null;
    this.state.currentSetIndex = 0;
    this.state.completedSets = [];
    this.state.sessionStartMs = Date.now();
    this.state.totalDistanceMetres = 0;

    // Reset ring lap counts for new set
    const currentSet = this.getCurrentSet();
    if (currentSet) {
      const totalLaps = currentSet.distanceMetres / currentSet.poolLength;
      for (const ring of this.state.rings.values()) {
        ring.currentLap = 0;
        ring.totalLaps = totalLaps;
        ring.recentSplits = [];
        ring.lastSplitMs = 0;
        ring.deltaMs = 0;
        ring.paceStatus = PaceStatus.OnPace;
        ring.trendDirection = TrendDirection.Steady;
      }
    }

    this.state.phase = 'setInProgress';
    this.startTimer();
    this.notify();
  }

  private handleLapDetected(ringId: string, splitTimeMs: number, timestamp: number) {
    const ring = this.state.rings.get(ringId);
    if (!ring || ring.signalLost) return;

    const currentSet = this.getCurrentSet();
    ring.currentLap++;
    ring.lastSplitMs = splitTimeMs;
    ring.recentSplits = [...ring.recentSplits.slice(-2), splitTimeMs];

    // Calculate delta vs target
    ring.deltaMs = splitTimeMs - ring.target.perLapMs;
    ring.paceStatus = calculatePaceStatus(ring.deltaMs, this.state.toleranceMs);
    ring.trendDirection = calculateTrendDirection(ring.recentSplits);

    // Track distance
    if (currentSet) {
      this.state.totalDistanceMetres += currentSet.poolLength;
    }

    // Store the lap record
    const lap: Lap = {
      lapNumber: ring.currentLap,
      splitTimeMs,
      cumulativeTimeMs: ring.recentSplits.reduce((a, b) => a + b, 0),
      deltaMs: ring.deltaMs,
      paceStatus: ring.paceStatus,
      timestamp,
    };

    // Generate coaching instruction for this wall touch
    this.state.lastWallTouchRingId = ringId;
    this.state.lastCoachingInstruction = generateCoachingInstruction(
      ring.deltaMs,
      ring.trendDirection,
      ring.totalLaps - ring.currentLap,
      ring.target.perLapMs,
      splitTimeMs,
      this.state.toleranceMs,
    );

    // Update worst delta for group auto-cycle
    this.updateWorstDelta();

    // Check if this ring completed the set
    if (ring.currentLap >= ring.totalLaps) {
      // Check if ALL rings have completed their laps
      const allComplete = [...this.state.rings.values()].every(
        r => r.currentLap >= r.totalLaps || r.signalLost,
      );

      if (allComplete) {
        this.completeSet();
        return;
      }
    }

    // Solo mode: auto-show wall screen
    this.state.phase = 'wallTouch';
    this.notify();
  }

  private handleWallDismissed() {
    if (this.state.phase === 'wallTouch') {
      this.state.phase = 'setInProgress';
      this.state.lastWallTouchRingId = null;
      this.notify();
    }
  }

  private completeSet() {
    const currentSet = this.getCurrentSet();
    if (currentSet) {
      // Build set record from ring data
      const laps = this.buildLapsFromRings();
      const onPaceCount = laps.filter(l => isLapOnPace(l, this.state.toleranceMs)).length;
      const bestLap = laps.reduce((a, b) => a.splitTimeMs < b.splitTimeMs ? a : b, laps[0]);
      const worstLap = laps.reduce((a, b) => a.splitTimeMs > b.splitTimeMs ? a : b, laps[0]);
      const totalTimeMs = laps.reduce((t, l) => t + l.splitTimeMs, 0);

      const setRecord: SetRecord = {
        setDefinition: currentSet,
        laps,
        totalTimeMs,
        bestLap,
        worstLap,
        onPaceCount,
        totalLaps: laps.length,
        insight: generateSessionInsight(laps, this.state.toleranceMs),
      };
      this.state.completedSets.push(setRecord);
    }

    this.state.phase = 'setComplete';
    this.notify();
  }

  private handleSummaryDismissed() {
    if (this.state.phase !== 'setComplete') return;

    // Advance to next set or end session
    this.state.currentSetIndex++;
    const nextSet = this.getCurrentSet();

    if (!nextSet) {
      this.endSession();
      return;
    }

    // Reset rings for next set
    const totalLaps = nextSet.distanceMetres / nextSet.poolLength;
    for (const ring of this.state.rings.values()) {
      ring.currentLap = 0;
      ring.totalLaps = totalLaps;
      ring.recentSplits = [];
      ring.lastSplitMs = 0;
      ring.deltaMs = 0;
      ring.paceStatus = PaceStatus.OnPace;
      ring.trendDirection = TrendDirection.Steady;
    }

    this.state.phase = 'setInProgress';
    this.notify();
  }

  private endSession() {
    this.state.phase = 'sessionComplete';
    this.stopTimer();
    this.notify();
  }

  private updateWorstDelta() {
    let worst: RingState | null = null;
    for (const ring of this.state.rings.values()) {
      if (ring.signalLost) continue;
      if (!worst || ring.deltaMs > worst.deltaMs) {
        worst = ring;
      }
    }
    this.state.worstDeltaRingId = worst?.ringId ?? null;
  }

  private buildLapsFromRings(): Lap[] {
    // In solo mode, use the single ring's splits.
    // In group mode, aggregate the first ring's laps (caller filters by swimmer).
    const firstRing = [...this.state.rings.values()][0];
    if (!firstRing) return [];

    let cumulative = 0;
    return firstRing.recentSplits.length > 0
      ? firstRing.recentSplits.map((splitMs, i) => {
          // For a proper implementation, we'd store all laps not just recent 3.
          // This is handled by the mock data service which stores the full history.
          cumulative += splitMs;
          return {
            lapNumber: i + 1,
            splitTimeMs: splitMs,
            cumulativeTimeMs: cumulative,
            deltaMs: splitMs - firstRing.target.perLapMs,
            paceStatus: calculatePaceStatus(
              splitMs - firstRing.target.perLapMs,
              this.state.toleranceMs,
            ),
            timestamp: Date.now(),
          };
        })
      : [];
  }

  private startTimer() {
    this.stopTimer();
    const start = Date.now();
    const tick = () => {
      this.state.elapsedMs = Date.now() - start;
      this.timerHandle = requestAnimationFrame(tick);
    };
    this.timerHandle = requestAnimationFrame(tick);
  }

  private stopTimer() {
    if (this.timerHandle !== null) {
      cancelAnimationFrame(this.timerHandle);
      this.timerHandle = null;
    }
  }
}
