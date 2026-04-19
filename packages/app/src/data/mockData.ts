// ─── Mock Data ─────────────────────────────────────────────
// All data is static for UI prototype. No backend required.

export const user = {
  name: 'Arjun',
  fullName: 'Arjun Kapoor',
  avatar: null,
  tier: 'Pro Athlete',
  memberSince: 'Jan 2025',
};

export const ringStatus = {
  connected: true,
  battery: 72,
  name: 'SWYM Ring Pro',
};

export const todayWorkout = {
  coach: 'Coach Maya Patel',
  title: 'Threshold Freestyle Session',
  distance: 1800,
  sets: [
    { label: 'Warmup', detail: '4×100m Easy Free', distance: 400, color: '#22C55E' },
    { label: 'Pre-set', detail: '4×50m Build', distance: 200, color: '#F59E0B' },
    { label: 'Main Set', detail: '6×100m @ 1:20 Threshold', distance: 600, color: '#707CFF' },
    { label: 'Kick', detail: '4×50m Kick w/ Board', distance: 200, color: '#EF4444' },
    { label: 'Pull', detail: '4×100m Pull Buoy', distance: 400, color: '#D1DEDF' },
  ],
  totalTime: '~52 min',
};

export const weeklyStats = {
  distance: { value: '14.2', unit: 'km', change: '+1.8' },
  sessions: { value: '5', unit: 'sessions', change: '+1' },
  avgPace: { value: '1:08', unit: '/100m', change: '-2s' },
  consistency: { value: '84', unit: '%', change: '+3%' },
};

export const paceModes = [
  { label: 'Easy', pace: '1:25', color: '#22C55E' },
  { label: 'Threshold', pace: '1:12', color: '#F59E0B' },
  { label: 'Race Pace', pace: '1:08', color: '#707CFF' },
  { label: 'Sprint', pace: '0:58', color: '#EF4444' },
];

export const aiInsight = {
  title: 'AI Coach Insight',
  body: 'Your pace drops consistently after lap 6 in longer sets. Recommend adding threshold endurance sets twice a week to build sustained speed.',
  tag: 'Endurance',
};

export const lastSession = {
  name: 'Tuesday AM Freestyle',
  date: 'Yesterday',
  distance: '2,400m',
  pace: '1:10/100m',
  progress: 0.72,
};

export const recovery = {
  score: 82,
  nextSwim: '6:30 PM',
};

// ─── Community ─────────────────────────────────────────────

export const stories = [
  { id: '1', name: 'Sonia', active: true },
  { id: '2', name: 'Dev', active: true },
  { id: '3', name: 'Meera', active: false },
  { id: '4', name: 'Vikram', active: true },
  { id: '5', name: 'Priya', active: false },
  { id: '6', name: 'Rahul', active: true },
];

export const feedItems = [
  {
    id: '1',
    user: 'Arjun Kapoor',
    action: 'swam 4.2km',
    detail: 'Morning freestyle session · Avg 1:08/100m',
    time: '2h ago',
    likes: 24,
    type: 'swim' as const,
  },
  {
    id: '2',
    user: 'Sonia Mehta',
    action: 'hit PB in 100m freestyle',
    detail: '1:02.4 · Personal best by 1.2s 🏆',
    time: '4h ago',
    likes: 67,
    type: 'pb' as const,
  },
  {
    id: '3',
    user: 'Coach Maya',
    action: 'uploaded new set',
    detail: 'Threshold Endurance Pack · 6 workouts',
    time: '6h ago',
    likes: 41,
    type: 'coach' as const,
  },
];

export const challenges = [
  { id: '1', title: '10km Weekly', progress: 0.88, participants: 234, icon: '🏊' },
  { id: '2', title: '5-Day Streak', progress: 0.6, participants: 512, icon: '🔥' },
  { id: '3', title: 'Under 1:30 Club', progress: 1.0, participants: 89, icon: '⚡' },
];

export const legends = [
  { name: 'Katie Ledecky', event: '800m Free', pace: '1:02/100m', emoji: '🇺🇸' },
  { name: 'Michael Phelps', event: '200m Fly', pace: '0:56/100m', emoji: '🇺🇸' },
  { name: 'Adam Peaty', event: '100m Breast', pace: '0:58/100m', emoji: '🇬🇧' },
];

// ─── Analytics ─────────────────────────────────────────────

export const paceData = [
  { day: 'Mon', pace: 72, target: 68 },
  { day: 'Tue', pace: 68, target: 68 },
  { day: 'Wed', pace: 70, target: 68 },
  { day: 'Thu', pace: 65, target: 68 },
  { day: 'Fri', pace: 67, target: 68 },
  { day: 'Sat', pace: 64, target: 68 },
  { day: 'Sun', pace: 66, target: 68 },
];

export const splitData = [
  { lap: 1, time: 32.1 },
  { lap: 2, time: 31.4 },
  { lap: 3, time: 31.8 },
  { lap: 4, time: 32.5 },
  { lap: 5, time: 33.2 },
  { lap: 6, time: 34.1 },
  { lap: 7, time: 34.8 },
  { lap: 8, time: 33.9 },
];

export const strokeDistribution = [
  { stroke: 'Freestyle', pct: 55, color: '#707CFF' },
  { stroke: 'Backstroke', pct: 18, color: '#22C55E' },
  { stroke: 'Breaststroke', pct: 15, color: '#F59E0B' },
  { stroke: 'Butterfly', pct: 12, color: '#EF4444' },
];

export const radarStats = {
  Speed: 0.82,
  Endurance: 0.75,
  Technique: 0.68,
  Turns: 0.55,
  Consistency: 0.84,
  Recovery: 0.78,
};

export const heatmapData: number[][] = [
  // 7 columns (Mon-Sun), 4 rows (weeks), value 0-4 for intensity
  [3, 2, 4, 0, 3, 4, 1],
  [2, 3, 0, 4, 2, 3, 0],
  [4, 2, 3, 2, 0, 4, 2],
  [3, 0, 4, 3, 2, 3, 4],
];

export const analyticsAI = {
  title: 'AI Performance Summary',
  body: 'Strong endurance gains this month — your average pace improved 3s/100m. Turns need work; your wall times are 0.4s slower than your stroke pace suggests. Focus on underwater dolphin kicks.',
};

// ─── Profile ───────────────────────────────────────────────

export const goals = [
  { label: 'Weekly Distance', target: '15km', current: '14.2km', progress: 0.95 },
  { label: 'Best 100m Pace', target: '1:05', current: '1:08', progress: 0.78 },
  { label: 'Sessions/Week', target: '6', current: '5', progress: 0.83 },
];
