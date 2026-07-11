
ALTER TABLE public.admissions
  ADD COLUMN IF NOT EXISTS choice_level TEXT,
  ADD COLUMN IF NOT EXISTS parent_relationship TEXT,
  ADD COLUMN IF NOT EXISTS parent_id_no TEXT,
  ADD COLUMN IF NOT EXISTS parent_address TEXT,
  ADD COLUMN IF NOT EXISTS application_no TEXT;

-- Backfill choice_level from the legacy class_of_interest column when present
UPDATE public.admissions SET choice_level = class_of_interest WHERE choice_level IS NULL AND class_of_interest IS NOT NULL;
