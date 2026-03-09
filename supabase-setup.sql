-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qlhdslbpgnctshcpiqfv/sql/new

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text,
  cell text,
  email text,
  dob text,
  sin text,
  mortgage_type text,
  type_details jsonb,
  employment_type text,
  company_name text,
  job_title text,
  annual_income text,
  assets jsonb,
  current_address text,
  years_at_address text,
  subject_property jsonb,
  other_properties jsonb,
  additional_notes text,
  num_applicants text,
  province text
);

-- Enable RLS but allow inserts from service role (no auth needed for public form)
alter table applications enable row level security;

-- Allow service role full access
create policy "service role full access" on applications
  using (true)
  with check (true);
