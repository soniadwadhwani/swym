# SWYM — Project Context

## What is SWYM?

SWYM (WeSwym) is a real-time pace coaching system for competitive swimmers using Ultra-Wideband (UWB) technology and smart rings. It delivers split-second, actionable coaching instructions during swimming — for both individual swimmers and coaches managing group training sessions.

The device UI is designed for pool-side visibility: large fonts, high contrast, dark backgrounds, and color-coded status (green = on-pace, amber = slightly off, red = significantly off). Navigation is intentionally two-button simple for wet/cold use.

---

## Architecture

Turbo-based **pnpm monorepo** with two packages:

```
swym/
├── packages/
│   ├── design-system/   — Pure TypeScript library (tokens, types, utilities)
│   └── device-ui/       — React 19 + Vite web app (480×320 device simulator)
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── package.json
```

**Key technologies:** TypeScript 5.7, React 19, Vite 6.2, Recharts 2.15, Turbo 2.4, pnpm 9.15

---

## Design System (`@swym/design-system`)

### Tokens
- **Colors:** Semantic pace colors (green/amber/red), brand purple, teal for swimmer identity, gray scale
- **Spacing:** 4px base unit scale, device-specific layout constants (screen padding, row height, tap targets)
- **Typography:** Inter font, two weights (Regular 400, Medium 500), device sizes 16–36px for pool visibility

### Types
- **Enums:** `Stroke`, `PaceStatus`, `TrendDirection`, `DeviceMode`, `PoolLength`, `HapticSensitivity`, `AccountType`, `FitnessTier`
- **Interfaces:** `Lap`, `SetDefinition`, `Workout`, `RingState`, `SessionRecord`, `SessionSummary`, `Swimmer`, `Ring`, `CoachingInstruction`, `Squad`, `SquadMember`, `DeviceState`, `DeviceSettings`, `LEDStripConfig`

### Utilities
- **Coaching Logic:** `formatTimeMs()`, `calculatePaceStatus()`, `calculateTrendDirection()`, `generateCoachingInstruction()` — rule-based instruction generation with fading trend overrides
- **Insight Generator:** `generateSessionInsight()` (1–2 sentence set summary), `generateSetVerdict()` (on-pace % classification)
- **Trend Calculator:** `calculateSwimmerTrend()` (linear slope), `calculateWeeklyVolume()`, `detectOvertrainingRisk()`, `calculateConsistencyScore()`

---

## Device UI (`@swym/device-ui`)

### Solo Mode Screens (4 screens)
| Screen | Job | Trigger |
|--------|-----|---------|
| **Push-Off** | "What does this lap need from me?" | Manual — shows target pace, current lap |
| **Wall** | "How was that lap, what do I adjust?" | Auto on wall touch — coaching instruction, delta, trend |
| **Session Overview** | "Where am I in the session?" | Manual — total distance, elapsed, lap chart |
| **Post-Set Summary** | "How did the whole set go?" | Auto on final lap — verdict, best/worst, insight |

### Group Mode Screens (5 screens)
| Screen | Job | Trigger |
|--------|-----|---------|
| **Lane Status** | "Who needs attention?" | Manual — ranked list sorted by delta, color-coded pills |
| **Drill-Down** | "What's happening with this swimmer?" | Manual — per-swimmer detail with coaching instruction |
| **Comparative Chart** | "How is the lane performing?" | Manual — multi-line Recharts chart, NFC tap to highlight |
| **Leaderboard** | "Who is winning?" | Manual — pure competitive ranking, designed for social pressure |
| **Group Summary** | "How did everyone do?" | Auto on set complete — on-pace %, NFC tap for individual detail |

### Reusable Components
- **StatusPill** — Color-coded pace status pill (green/amber/red)
- **PaceDelta** — Delta display ("+2s" / "-1s") with color coding
- **TrendWord** — Single uppercase word: IMPROVING / STEADY / FADING
- **VerdictBadge** — Set-level verdict: "On Target" / "Slightly Off" / "Significantly Off"

### Navigation (ScreenController)
- Mode-aware routing (solo vs group)
- Keyboard controls: arrow keys navigate, Space/Enter dismiss, N simulates NFC ring tap, 1–5 jump to screen
- NFC simulation: tap ring highlights swimmer, jumps to drill-down, shows individual detail
- Auto-cycle option in group mode shows worst-delta swimmer

### Services
- **SessionStateMachine** — Full session lifecycle: idle → sessionActive → setInProgress → wallTouch → setComplete → sessionComplete. Per-ring state tracking, lap processing, coaching instruction generation, listener pattern for UI subscriptions
- **MockUWBService** — Simulates realistic UWB traces with per-swimmer variance and fade patterns. 6 mock swimmers with distinct characteristics (fast/slow, consistent/variable, fade/no-fade)

---

## What's Built vs What's Not

### Implemented
- Complete design system (tokens, types, all utilities)
- All 9 device screens (4 solo + 5 group) fully functional
- Session state machine with full lifecycle
- Mock UWB service with realistic simulation
- Coaching logic with rule-based instruction generation
- Recharts integration (bar charts + line charts)
- Keyboard navigation and NFC simulation
- Interactive demo harness with mode toggle and speed control

### Not Started
- Real UWB hardware integration (MockUWBService only)
- Smart ring communication (type definitions ready)
- Database / backend / persistence layer
- Mobile app (mentioned in scripts, no code)
- Coach app (type definitions ready for Squad/SquadMember)
- LED strip integration (type definitions ready)
- Haptic feedback (type definitions ready)
- Formal test suite (vitest configured but no tests)

---

## Design Principles

1. **One job per screen** — each screen answers one specific question
2. **Color-first coaching** — coach's eye goes to color (red), not numbers
3. **Pool visibility** — large fonts, high contrast, dark backgrounds, 1–2m readability
4. **Trend over delta** — fading trends override single-lap status
5. **Minimalist information** — show only what the user needs in the next 2–10 seconds
6. **Two-button navigation** — intentional simplicity for wet/cold conditions
7. **Consistency over speed** — on-pace % is the key metric, not absolute times

---

## Running the Project

```bash
pnpm install              # Install all dependencies
pnpm dev:device           # Start device UI dev server (port 5173)
pnpm build                # Build all packages
```

Node.js >= 20 required.
