export interface Swimmer {
  id: string;
  name: string;
  avatar: string;
  bestPace: string;
  totalDistance: string;
  consistency: number;
}

export interface WorkoutSet {
  type: 'warmup' | 'main' | 'cooldown';
  description: string;
  distance: number;
  targetPace?: string;
  rest?: string;
}

export interface Workout {
  id: string;
  title: string;
  coach: string;
  totalDistance: number;
  sets: WorkoutSet[];
}

export interface WeeklyMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface FeedItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  detail: string;
  time: string;
  likes: number;
}

export interface Challenge {
  id: string;
  title: string;
  progress: number;
  total: number;
  unit: string;
  daysLeft: number;
}

export interface LegendSwimmer {
  id: string;
  name: string;
  event: string;
  pace: string;
  avatar: string;
}

export interface RadarDataPoint {
  label: string;
  value: number;
}

export interface LapSplit {
  lap: number;
  time: number;
  target: number;
}

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  isLive: boolean;
}

export interface PaceMode {
  label: string;
  pace: string;
  color: string;
}

export interface ProfileData {
  name: string;
  tier: string;
  avatar: string;
  ringBattery: number;
  ringConnected: boolean;
  totalDistance: string;
  totalSessions: number;
  memberSince: string;
  goals: { label: string; target: string; current: string }[];
}

export type AnalyticsTab = 'Weekly' | 'Monthly' | 'Stroke' | 'Race Prep';
