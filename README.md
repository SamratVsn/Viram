# Viram — Turn Your Goals Into Milestones

> *"In the age of distraction, attention is rebellion."*

Viram is a calm, intentional productivity platform that helps you reclaim focus, build discipline, and track your progress through a gamified avatar system. No shaming streaks. No dark patterns. Just honest awareness and steady growth.

---

## Philosophy

Most productivity tools treat your attention as something to optimize for output. Viram treats it as something to protect. Every feature is designed around a single principle: **awareness precedes change**.

- **Confessions** — a private, expiring journal for slip-ups (30-day auto-delete)
- **Focus Engine** — a distraction-free timer with intent-setting and XP rewards
- **Digital Fast** — a 2-hour screen break with streak bonuses
- **Morning Intention** — set a daily north star before the noise begins

Your progress is reflected through an **avatar** with stats (Vitality, Focus, Discipline, Shield HP) shaped by your onboarding answers and real activity.

---

## Features

### Dashboard (`/dashboard`)
Central hub showing your goal, streak, focus minutes, coins, confession count, avatar, companion illustration, curiosity seed, digital fast widget, and a daily reflection quote.

### Focus Timer (`/focus`)
Pomodoro-style timer with 15/25/45/60 min durations. Dark mode activates while running. Set an intent before starting. Earns XP and coins on completion. Tracks today's sessions, total focused minutes, and XP via Supabase.

### Confessions (`/confess`)
Private journal for logging slip-ups. Entries auto-expire after 30 days. Syncs to Supabase for cross-device persistence with localStorage fallback. Each confession awards +1 coin and +2 discipline points.

### Goal Setting (`/goal-setting`)
Onboarding step to define your north star goal. Displayed on your dashboard as a persistent reminder. Pre-fills if you already have a goal set.

### Onboarding Wizard (`/onboarding`)
8-step questionnaire to build your avatar:
1. **Screen time** (range: 0–14 hrs)
2. **Worst app** (Instagram, YouTube, WhatsApp, Twitter, Games, All)
3. **Peak focus window** (Early morning, Morning, Afternoon, Evening)
4. **Mission** (Academic, Deep Work, Health, Discipline, Digital Detox)
5. **Past attempts** (Screen limits, Pomodoro, Willpower, Apps, Nothing)
6. **Sleep** (range: 2–12 hrs)
7. **Stress level** (Calm, Moderate, High, Burning out)
8. **Avatar name** (free text)

Your archetype is determined by your mission: **Scholar**, **Architect**, **Athlete**, **Warrior**, or **Monk**.

### Digital Fast (`/digital-fast`)
A 2-hour countdown that blocks distraction. Completing a fast earns a streak bonus tracked in your profile.

### Morning Intention
Daily intention-setter. One line each morning — stored in Supabase, displayed on your dashboard.

### Skill Tracker (`/skills`)
Track skills you're building. Currently localStorage-based (no cross-device sync).

### Library (`/library`)
Curated collection of reading material and reflections.

### Profile (`/profile`)
Full profile with avatar stats, XP bar, achievement milestones, coin balance, and progress overview.

### Settings (`/settings`)
User preferences for focus timer (default duration, sound, reminders, theme). Exports `loadPrefs()` used by the Focus timer.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v4 + inline styles + CSS-in-JS `<style>` blocks |
| **Animation** | Framer Motion v12 |
| **Auth** | Supabase Auth (Google OAuth + Email/Password) |
| **Database** | Supabase (PostgreSQL) |
| **Icons** | React Icons (Remix Icon set) |
| **Google OAuth** | @react-oauth/google |
| **Deployment** | Vercel |

---

## Routes

### Public (no auth required)
| Route | Component |
|-------|-----------|
| `/` | Landing Page |
| `/start` | Auth (login/signup) |
| `/callback` | OAuth callback handler |
| `/about` | About page |
| `/contact` | Contact page |
| `/library` | Public library |

### Protected (requires auth)
| Route | Component |
|-------|-----------|
| `/onboarding` | Avatar creation wizard |
| `/home` | Redirects to `/dashboard` |
| `/dashboard` | Main dashboard |
| `/focus` | Focus timer |
| `/confess` | Confessions journal |
| `/profile` | User profile |
| `/settings` | User preferences |
| `/goal-setting` | Goal wizard |
| `/problems` | Problem/trigger discovery |
| `*` | 404 (auth-aware: links to dashboard or start) |

---

## Authentication Flow

```
User clicks "Sign in with Google"
  → Start.jsx → supabase.auth.signInWithOAuth()
  → Google OAuth redirect → /callback
  → AuthCallback.jsx:
      1. upsertProfile (creates Supabase profile row)
      2. getProfile (reads onboarded status)
      3. Navigate to /onboarding or /dashboard

Email signup:
  → Start.jsx → supabase.auth.signUp()
  → upsertProfile called immediately
  → 2s success screen → navigate to /onboarding
```

**Protected routes** use `AuthGuard.jsx` which checks `supabase.auth.getSession()` and listens for `onAuthStateChange`. Unauthenticated users are redirected to `/start`.

---

## Gamification System

### Coins
Earned through focus sessions (+1 per 5 min), confessions (+1), and digital fasts. Tracked in `viram_user` localStorage and Supabase profile.

### XP
Earned from focus sessions (30 base + 1.4 per minute). Displayed on the profile page with milestones.

### Streak (Discipline Index)
Tracks consecutive days logged in. Updated via a dashboard effect that compares `lastLoginDate` with today. Resets mismanagement via the `updatingStreak` ref guard.

### Archetypes
Determined by onboarding mission:
- **Scholar** — Academic focus
- **Architect** — Deep work / career
- **Athlete** — Health & fitness
- **Warrior** — General discipline
- **Monk** — Digital detox

### Avatar Stats
Calculated from onboarding answers:
- **Vitality** (15–100)
- **Energy** (15–100)
- **Discipline** (20–100)
- **Focus** (20–100)
- **Shield HP** (10–100)

### Milestones
Tracked via `AdvancementToast.jsx`. Currently supports coin-based milestones with bronze/silver/gold/emerald tier colors and celebration animations.

---

## Database Schema (Supabase)

### `profiles` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, matches auth.users |
| `name` | TEXT | |
| `picture` | TEXT | Avatar URL |
| `email` | TEXT | |
| `onboarded` | BOOLEAN | |
| `goal` | TEXT | North star goal |
| `streak` | INTEGER | Discipline index |
| `discipline_points` | INTEGER | |
| `last_login` | TEXT | Date string |
| `screen_time` | NUMERIC | Hours |
| `worst_app` | TEXT | |
| `focus_peak` | TEXT | |
| `past_attempts` | TEXT | |
| `sleep` | NUMERIC | Hours |
| `stress_level` | INTEGER | 0–3 |
| `avatar_name` | TEXT | |
| `coins` | INTEGER | |
| `xp` | INTEGER | |
| `vitality` | INTEGER | |
| `energy` | INTEGER | |
| `discipline_stat` | INTEGER | |
| `focus_stat` | INTEGER | |
| `shield_hp` | INTEGER | |

### `focus_sessions` table
| Column | Type |
|--------|------|
| `id` | UUID |
| `user_id` | UUID (FK → profiles.id) |
| `duration` | INTEGER (minutes) |
| `xp_earned` | INTEGER |
| `coins_earned` | INTEGER |
| `intent` | TEXT |
| `created_at` | TIMESTAMPTZ |

### `confessions` table
| Column | Type |
|--------|------|
| `id` | UUID |
| `user_id` | UUID (FK → profiles.id) |
| `text` | TEXT |
| `trigger` | TEXT |
| `app` | TEXT |
| `created_at` | TIMESTAMPTZ |

### `intentions` table
| Column | Type |
|--------|------|
| `id` | UUID |
| `user_id` | UUID (FK → profiles.id) |
| `text` | TEXT |
| `date` | DATE |
| `created_at` | TIMESTAMPTZ |

---

## Setup

```bash
# Clone the repository
git clone https://github.com/your-username/viram.git
cd viram

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase credentials and Google OAuth client ID
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_ANON_KEY=your-anon-key
#   VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Start development server
npm run dev

# Build for production
npm run build
```

### Supabase Setup

1. Create a Supabase project
2. Enable **Google Auth** in Authentication → Providers
3. Create tables: `profiles`, `focus_sessions`, `confessions`, `intentions`
4. Set up **Row Level Security (RLS)** policies so users can only read/write their own data
5. Set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env`

### Vercel Deployment

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables (same as `.env`)
4. Deploy — Vite handles the build automatically

> ⚠️ **Note:** The file `src/lib/supabase.js` uses a lowercase name. Ensure your deployment filesystem is case-sensitive compatible (Vercel's Linux environment is).

---

## Architecture Notes

- **Data flow**: Components → `db.js` (data layer) → Supabase client → PostgreSQL
- **State**: `useViramData.js` hook centralizes user profile, focus stats, confessions, and intention data with a unified `refresh()` function
- **Case convention**: All Supabase columns use `snake_case`. The `db.js` `updateProfile` and `upsertProfile` functions handle camelCase → snake_case mapping automatically
- **Config**: `vite.config.js` uses React plugin + Tailwind v4 Vite plugin. No path aliases configured
- **Fonts**: Cormorant Garamond (serif headings) + Jost (sans-serif body) loaded from Google Fonts via `<link>` in `index.html`

---

## Project Structure

```
src/
├── App.jsx                    # Route definitions
├── main.jsx                   # Entry point
├── index.css                  # Global styles
├── lib/
│   ├── supabase.js            # Supabase client init
│   └── db.js                  # Database operations
├── hooks/
│   └── useViramData.js        # Central data hook
├── components/
│   ├── AuthGuard.jsx          # Route protection
│   ├── GoalSetting.jsx        # Goal wizard
│   ├── Onboarding.jsx         # Avatar creation
│   ├── MorningIntention.jsx   # Daily intention
│   ├── DigitalFast.jsx        # 2-hour fast timer
│   ├── SkillTracker.jsx       # Skill tracking
│   ├── CuriositySeed.jsx      # Knowledge snippets
│   ├── AdvancementToast.jsx   # Gamification toasts
│   └── NavBar.jsx             # Navigation
├── pages/
│   ├── LandingPage.jsx        # Landing / marketing
│   ├── Start.jsx              # Auth page
│   ├── Dashboard.jsx          # Main dashboard
│   ├── Focus.jsx              # Focus timer
│   ├── Confess.jsx            # Confession journal
│   ├── Profile.jsx            # User profile
│   ├── Setting.jsx            # Preferences
│   ├── Library.jsx            # Reading library
│   ├── Problems.jsx           # Trigger discovery
│   ├── AuthCallback.jsx       # OAuth callback
│   ├── NotFound.jsx           # 404 page
│   ├── Home.jsx               # Redirect wrapper
│   ├── About.jsx              # About page
│   └── Contact.jsx            # Contact page
└── assets/
    ├── 3dmodel.png            # Companion illustration
    └── mainlogo.png           # Favicon
```

---

## Contributing

PRs are welcome. The codebase uses inline styles with design tokens (`T` object) repeated across components — a shared theme file is the most impactful refactor on the roadmap.
