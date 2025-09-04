-- Migration: add per-term amount columns to school_fees and add terms jsonb to payments
-- Run this against your Postgres / Supabase database.

-- add term amount columns to school_fees
ALTER TABLE IF EXISTS school_fees
  ADD COLUMN IF NOT EXISTS term1_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS term2_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS term3_amount numeric(10,2);

-- add terms jsonb column to payments to store array of terms paid in one transaction
ALTER TABLE IF EXISTS payments
  ADD COLUMN IF NOT EXISTS terms jsonb;

-- optional: backfill terms for existing rows where term is set
UPDATE payments
SET terms = to_jsonb(array[term])
WHERE terms IS NULL AND term IS NOT NULL;

-- optional index to speed lookups by session and uin
CREATE INDEX IF NOT EXISTS payments_session_uin_idx ON payments USING btree (session, uin);

-- Done.
