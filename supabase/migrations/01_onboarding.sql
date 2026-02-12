-- Add Onboarding fields to profiles table
alter table profiles 
add column if not exists fiscal_code text,
add column if not exists terms_accepted_at timestamp with time zone,
add column if not exists consent_marketing boolean default false,
add column if not exists consent_profiling boolean default false,
add column if not exists consent_third_party boolean default false;

-- Create policy to allow users to update their own profile (if not exists)
-- (Already created in initial schema, but reinforcing just in case)
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles 
for update using (auth.uid() = id);
