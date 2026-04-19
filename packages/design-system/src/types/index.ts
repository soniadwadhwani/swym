// ============================================================
// Swym — Shared TypeScript Types
// ============================================================

// --- Enums ---

export enum Stroke {
  Freestyle = 'freestyle',
  Backstroke = 'backstroke',
  Breaststroke = 'breaststroke',
  Butterfly = 'butterfly',
  IndividualMedley = 'im',
}

export enum PaceStatus {
  OnPace = 'onPace',
  SlightlyOff = 'slightlyOff',
  SignificantlyOff = 'significantlyOff',
  Ahead = 'ahead',
}

export enum TrendDirection {
  Improving = 'IMPROVING',
  Steady = 'STEADY',
  Fading = 'FADING',
}

export enum AccountType {
  Individual = 'individual',
  Coach = 'coach',
}

export enum FitnessTier {
  Light = 'light',
  Moderate = 'moderate',
  Heavy = 'heavy',
}

export enum PoolLength {
  Short = 25,
  Long = 50,
}

export enum HapticSensitivity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum DeviceMode {
  Solo = 'solo',
  Group = 'group',
}

// --- Core data types ---

export interface Lap {
  lapNumber: number;
  splitTimeMs: number;       // milliseconds for this lap
  cumulativeTimeMs: number;  // total elapsed since set start
  deltaMs: number;           // vs target: positive = slow, negative = fast
  paceStatus: PaceStatus;
  timestamp: number;         // epoch ms of wall touch
}

export interface SetDefinition {
  id: string;
  name: string;              // e.g. "main set", "kick set"
  stroke: Stroke;
  distanceMetres: number;
  poolLength: PoolLength;
  targetPacePer100Ms: number; // target pace per 100m in milliseconds
  restIntervalMs: number;
  repetitions: number;
}

export interface Workout {
  id: string;
  name: string;
  sets: SetDefinition[];
  createdAt: number;
  updatedAt: number;
}

export interface PaceTarget {
  per100Ms: number;          // target pace per 100m in ms
  perLapMs: number;          // target pace per lap in ms (derived from pool length)
}

export interface Ghost {
  id: string;
  name: string;              // e.g. "200m freestyle PB — March 2025"
  event: string;             // e.g. "200m freestyle"
  lapTimes: number[];        // array of split times in ms per lap
  totalTimeMs: number;
  createdAt: number;
  sourceSessionId?: string;
}

// --- Session data ---

export interface SessionRecord {
  id: string;
  workoutId?: string;
  workoutName: string;
  sets: SetRecord[];
  totalDistanceMetres: number;
  totalTimeMs: number;
  startedAt: number;
  endedAt: number;
  poolLength: PoolLength;
}

export interface SetRecord {
  setDefinition: SetDefinition;
  laps: Lap[];
  totalTimeMs: number;
  bestLap: Lap;
  worstLap: Lap;
  onPaceCount: number;
  totalLaps: number;
  insight: string;
}

export interface SessionSummary {
  sessionId: string;
  date: number;
  workoutName: string;
  totalDistanceMetres: number;
  totalTimeMs: number;
  onPacePercentage: number;
  bestLapTimeMs: number;
  bestLapNumber: number;
}

// --- Swimmer & Ring ---

export interface Swimmer {
  id: string;
  name: string;
  ringId?: string;
  accountType: AccountType;
  squadId?: string;
}

export interface Ring {
  hardwareId: string;
  name: string;
  assignedSwimmerId?: string;
  hapticSensitivity: HapticSensitivity;
  batteryPercent?: number;
}

export interface RingState {
  ringId: string;
  swimmerId: string;
  swimmerName: string;
  currentLap: number;
  totalLaps: number;
  lastSplitMs: number;
  deltaMs: number;
  paceStatus: PaceStatus;
  trendDirection: TrendDirection;
  recentSplits: number[];    // last 3 split times in ms
  distanceMetres: number;    // current UWB distance from device
  signalLost: boolean;
  target: PaceTarget;
}

// --- Coaching ---

export interface CoachingInstruction {
  text: string;
  paceStatus: PaceStatus;
  trendDirection: TrendDirection;
  lastLapMs: number;
  deltaMs: number;
  targetNextLapMs: number;
}

// --- Squad (coach only) ---

export interface SquadMember {
  swimmer: Swimmer;
  fitnessTier: FitnessTier;
  lastSessionDate?: number;
  trendDirection: TrendDirection;
  consistencyScore: number;   // percentage of laps on pace across all sessions
}

export interface Squad {
  id: string;
  name: string;
  coachId: string;
  memberIds: string[];
}

// --- Device state ---

export interface DeviceState {
  mode: DeviceMode;
  batteryPercent: number;
  sessionActive: boolean;
  connectedRings: RingState[];
  currentSetIndex: number;
  workout?: Workout;
}

// --- LED strip ---

export interface LEDStripConfig {
  enabled: boolean;
  sectorCount: number;       // auto-matches current set lap count
  connected: boolean;
}

// --- Settings ---

export interface PaceWindowTolerance {
  toleranceMs: number;       // ±1000, ±2000, or ±3000
}

export interface DeviceSettings {
  poolLength: PoolLength;
  paceWindowTolerance: PaceWindowTolerance;
  groupAutoCycle: boolean;   // auto-show worst-delta swimmer on drill-down
  ledStrip: LEDStripConfig;
}
