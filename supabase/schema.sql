-- ============================================================
-- Viram Supabase Schema
-- Run this in your Supabase SQL editor to set up the database.
-- ============================================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name              TEXT,
  picture           TEXT,
  coins             INT DEFAULT 0,
  xp                INT DEFAULT 0,
  streak            INT DEFAULT 0,
  discipline_points INT DEFAULT 0,
  last_login        DATE,
  goal              TEXT,
  onboarded         BOOL DEFAULT FALSE,

  -- Onboarding survey answers
  screen_time       REAL DEFAULT 4,
  worst_app         TEXT,
  focus_peak        TEXT,
  mission           TEXT,
  past_attempts     TEXT,
  sleep             REAL DEFAULT 7,
  stress_level      INT DEFAULT 1,
  avatar_name       TEXT,

  -- Avatar stats (calculated from onboarding)
  vitality          INT DEFAULT 50,
  energy            INT DEFAULT 50,
  focus_stat        INT DEFAULT 50,
  discipline_stat   INT DEFAULT 50,
  shield_hp         INT DEFAULT 50,

  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own data only" ON profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Focus sessions
CREATE TABLE IF NOT EXISTS focus_sessions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  duration    INT NOT NULL,                    -- minutes
  xp_earned   INT NOT NULL,
  coins_earned INT NOT NULL,
  intent      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own data only" ON focus_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Confessions
CREATE TABLE IF NOT EXISTS confessions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  trigger     TEXT,
  app         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own data only" ON confessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Intentions (one per user per day)
CREATE TABLE IF NOT EXISTS intentions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  date        DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own data only" ON intentions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
