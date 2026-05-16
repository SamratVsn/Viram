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

DROP POLICY IF EXISTS "own data only" ON profiles;
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

DROP POLICY IF EXISTS "own data only" ON focus_sessions;
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

DROP POLICY IF EXISTS "own data only" ON confessions;
CREATE POLICY "own data only" ON confessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "rate limit confessions" ON confessions;
CREATE POLICY "rate limit confessions" ON confessions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      SELECT COUNT(*) FROM confessions WHERE user_id = auth.uid()
    ) < 100
  );

-- Rate-limit focus sessions: max 20 per user per day
DROP POLICY IF EXISTS "rate limit focus sessions daily" ON focus_sessions;
CREATE POLICY "rate limit focus sessions daily" ON focus_sessions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      SELECT COUNT(*) FROM focus_sessions
      WHERE user_id = auth.uid()
        AND created_at >= DATE_TRUNC('day', NOW())
    ) < 20
  );

-- ── Auto-delete confessions older than 30 days (called via pg_cron or Edge Function) ──
CREATE OR REPLACE FUNCTION delete_expired_confessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM confessions
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- To enable scheduled execution, run in Supabase SQL editor:
--   CREATE EXTENSION IF NOT EXISTS pg_cron;
--   SELECT cron.schedule('delete-expired-confessions', '0 3 * * *', $$SELECT delete_expired_confessions()$$);
--
-- Alternatively, call this function via a Supabase Edge Function cron trigger.

-- 4. Intentions (one per user per day)
CREATE TABLE IF NOT EXISTS intentions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  date        DATE DEFAULT CURRENT_DATE,
  checkin     TEXT,  -- 'yes', 'partial', or 'no' — end-of-day follow-through
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own data only" ON intentions;
CREATE POLICY "own data only" ON intentions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
