ALTER TABLE public.admissions
ADD COLUMN IF NOT EXISTS admission_fee_paid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_confirmation_code text;