
CREATE TABLE public.school_payments (
  id uuid primary key default gen_random_uuid(),
  receipt_no text not null unique,
  parent_name text not null,
  parent_phone text,
  student_name text not null,
  grade text,
  purpose text not null,
  amount text not null,
  method text not null,
  reference_code text not null,
  notes text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.school_payments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.school_payments TO authenticated;
GRANT ALL ON public.school_payments TO service_role;
ALTER TABLE public.school_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit school payments" ON public.school_payments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read school payments" ON public.school_payments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete school payments" ON public.school_payments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
