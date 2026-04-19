import {
  Workout,
  WeeklyMetric,
  FeedItem,
  Challenge,
  LegendSwimmer,
  RadarDataPoint,
  LapSplit,
  StoryUser,
  PaceMode,
  ProfileData,
} from '../types';

// ─── Today's Workout ────────────────────────────────────────────────────────

export const todayWorkout: Workout = {
  id: '1',
  title: 'Threshold Freestyle Session',
  coach: 'Coach Maya Patel',
  totalDistance: 1800,
  sets: [
    { type: 'warmup', description: '4 × 100m Easy Free', distance: 400, targetPace: '1:45', rest: '15s' },
    { type: 'main', description: '6 × 100m Threshold', distance: 600, targetPace: '1:12', rest: '20s' },
    { type: 'main', description: '4 × 50m Fast', distance: 200, targetPace: '0:34', rest: '30s' },
    { type: 'main', description: '4 × 100m Desc 1–4', distance: 400, targetPace: '1:15', rest: '15s' },
    { type: 'cooldown', description: '2 × 100m Easy Choice', distance: 200, targetPace: '1:50', rest: '10s' },
  ],
};

// ─── Weekly Metrics ─────────────────────────────────────────────────────────

export const weeklyMetrics: WeeklyMetric[] = [
  { label: 'DISTANCE', value: '14.2', unit: 'km', trend: 'up' },
  { label: 'SESSIONS', value: '5', trend: 'stable' },
  { label: 'AVG PACE', value: '1:18', unit: '/100m', trend: 'up' },
  { label: 'CONSISTENCY', value: '84', unit: '%', trend: 'up' },
];

// ─── Community Feed ─────────────────────────────────────────────────────────

export const feedItems: FeedItem[] = [
  { id: '1', user: 'Arjun Mehta', avatar: 'AM', action: 'completed', detail: '4.2km freestyle session', time: '2h ago', likes: 12 },
  { id: '2', user: 'Sonia Chen', avatar: 'SC', action: 'hit PB in', detail: '100m freestyle — 58.4s', time: '3h ago', likes: 28 },
  { id: '3', user: 'Coach Patel', avatar: 'MP', action: 'uploaded', detail: 'New sprint technique set', time: '5h ago', likes: 8 },
  { id: '4', user: 'Kai Tanaka', avatar: 'KT', action: 'completed', detail: '10km weekly challenge', time: '6h ago', likes: 34 },
  { id: '5', user: 'Lena Okafor', avatar: 'LO', action: 'joined', detail: 'Under 1:30 Pace Club', time: '8h ago', likes: 15 },
];

// ─── Stories ────────────────────────────────────────────────────────────────

export const storyUsers: StoryUser[] = [
  { id: '1', name: 'Arjun', avatar: 'AM', isLive: true },
  { id: '2', name: 'Sonia', avatar: 'SC', isLive: true },
  { id: '3', name: 'Kai', avatar: 'KT', isLive: false },
  { id: '4', name: 'Lena', avatar: 'LO', isLive: false },
  { id: '5', name: 'Marcus', avatar: 'MR', isLive: true },
  { id: '6', name: 'Priya', avatar: 'PR', isLive: false },
  { id: '7', name: 'Coach P', avatar: 'CP', isLive: false },
];

// ─── Challenges ─────────────────────────────────────────────────────────────

export const challenges: Challenge[] = [
  { id: '1', title: '10km Weekly Challenge', progress: 7.8, total: 10, unit: 'km', daysLeft: 3 },
  { id: '2', title: '5-Day Streak', progress: 3, total: 5, unit: 'days', daysLeft: 2 },
  { id: '3', title: 'Under 1:30 Pace Club', progress: 4, total: 10, unit: 'sessions', daysLeft: 14 },
];

// ─── Swim With Legends ──────────────────────────────────────────────────────

export const legendSwimmers: LegendSwimmer[] = [
  { id: '1', name: 'Katie Ledecky', event: '800m Free', pace: '1:02/100m', avatar: 'KL' },
  { id: '2', name: 'Michael Phelps', event: '200m Fly', pace: '0:58/100m', avatar: 'MP' },
  { id: '3', name: 'Adam Peaty', event: '100m Breast', pace: '0:57/100m', avatar: 'AP' },
];

// ─── Analytics Data ─────────────────────────────────────────────────────────

export const radarData: RadarDataPoint[] = [
  { label: 'Speed', value: 0.78 },
  { label: 'Endurance', value: 0.85 },
  { label: 'Technique', value: 0.72 },
  { label: 'Turns', value: 0.65 },
  { label: 'Consistency', value: 0.84 },
  { label: 'Recovery', value: 0.71 },
];

export const paceTrendData = [
  { week: 'W1', pace: 82 },
  { week: 'W2', pace: 80 },
  { week: 'W3', pace: 81 },
  { week: 'W4', pace: 78 },
  { week: 'W5', pace: 77 },
  { week: 'W6', pace: 75 },
  { week: 'W7', pace: 76 },
  { week: 'W8', pace: 73 },
];

export const splitConsistencyData = [
  { lap: 1, deviation: 0.2 },
  { lap: 2, deviation: -0.5 },
  { lap: 3, deviation: 0.8 },
  { lap: 4, deviation: -0.3 },
  { lap: 5, deviation: 1.2 },
  { lap: 6, deviation: 2.1 },
  { lap: 7, deviation: 1.8 },
  { lap: 8, deviation: 2.5 },
];

export const strokeBreakdownData = [
  { stroke: 'Freestyle', percentage: 62, color: '#707CFF' },
  { stroke: 'Backstroke', percentage: 18, color: '#D1DEDF' },
  { stroke: 'Breaststroke', percentage: 12, color: '#22C55E' },
  { stroke: 'Butterfly', percentage: 8, color: '#F59E0B' },
];

export const pbProgressionData = [
  { month: 'Jan', time: 72.0 },
  { month: 'Feb', time: 71.2 },
  { month: 'Mar', time: 70.5 },
  { month: 'Apr', time: 70.8 },
  { month: 'May', time: 69.8 },
  { month: 'Jun', time: 69.2 },
  { month: 'Jul', time: 68.5 },
  { month: 'Aug', time: 68.1 },
];

export const heatmapData: { date: string; volume: number }[] = (() => {
  const data: { date: string; volume: number }[] = [];
  const volumes = [
    3200, 0, 2800, 0, 3400, 2100, 0,
    2900, 0, 3100, 0, 3600, 1800, 0,
    3500, 0, 2600, 0, 3800, 2400, 0,
    3100, 0, 3300, 0, 3700, 2000, 0,
  ];
  const today = new Date(2026, 3, 19);
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split('T')[0],
      volume: volumes[27 - i],
    });
  }
  return data;
})();

// ─── Live Swim Data ─────────────────────────────────────────────────────────

export const liveLapSplits: LapSplit[] = [
  { lap: 1, time: 31200, target: 32000 },
  { lap: 2, time: 32100, target: 32000 },
  { lap: 3, time: 31800, target: 32000 },
  { lap: 4, time: 33200, target: 32000 },
  { lap: 5, time: 32800, target: 32000 },
  { lap: 6, time: 34100, target: 32000 },
];

// ─── Pace Modes ─────────────────────────────────────────────────────────────

export const paceModes: PaceMode[] = [
  { label: 'Easy', pace: '1:45', color: '#22C55E' },
  { label: 'Threshold', pace: '1:18', color: '#F59E0B' },
  { label: 'Race Pace', pace: '1:08', color: '#707CFF' },
  { label: 'Sprint', pace: '0:58', color: '#EF4444' },
];

// ─── Profile ────────────────────────────────────────────────────────────────

export const profileData: ProfileData = {
  name: 'Alex Chen',
  tier: 'Elite',
  avatar: 'AC',
  ringBattery: 78,
  ringConnected: true,
  totalDistance: '342.6 km',
  totalSessions: 128,
  memberSince: 'Jan 2025',
  goals: [
    { label: 'Weekly Distance', target: '15km', current: '14.2km' },
    { label: 'Best 100m', target: 'Sub 1:05', current: '1:08' },
    { label: 'Monthly Sessions', target: '20', current: '17' },
  ],
};
