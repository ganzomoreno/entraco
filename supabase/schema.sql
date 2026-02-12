-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  first_name text,
  last_name text,
  customer_code text unique,
  pec text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- PODS (Supplies)
create type supply_type as enum ('electricity', 'gas');
create type supply_status as enum ('active', 'inactive', 'pending');

create table pods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  pod_code text not null unique,
  type supply_type not null,
  address text not null,
  status supply_status default 'pending',
  activation_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for PODs
alter table pods enable row level security;
create policy "Users can view own pods" on pods for select using (auth.uid() = user_id);

-- INVOICES
create type invoice_status as enum ('paid', 'unpaid', 'overdue');

create table invoices (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  pod_id uuid references pods(id), -- Nullable for multi-site invoices
  number text not null,
  issue_date date not null,
  due_date date not null,
  amount numeric(10,2) not null,
  status invoice_status default 'unpaid',
  pdf_url text, -- Link to storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Invoices
alter table invoices enable row level security;
create policy "Users can view own invoices" on invoices for select using (auth.uid() = user_id);

-- READINGS (Consumptions)
create type reading_type as enum ('actual', 'estimated', 'auto');

create table readings (
  id uuid default uuid_generate_v4() primary key,
  pod_id uuid references pods(id) on delete cascade not null,
  reading_date date not null,
  value numeric(10,2) not null, -- kWh or Smc
  type reading_type default 'actual',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Readings
alter table readings enable row level security;
create policy "Users can view own readings" on readings 
  for select using (
    exists ( select 1 from pods where pods.id = readings.pod_id and pods.user_id = auth.uid() )
  );

-- CADASTRAL DATA
create table cadastral_data (
  id uuid default uuid_generate_v4() primary key,
  pod_id uuid references pods(id) on delete cascade not null unique,
  section text,
  sheet text,
  parcel text,
  subaltern text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Cadastral Data
alter table cadastral_data enable row level security;
create policy "Users can view own cadastral data" on cadastral_data 
  for select using (
    exists ( select 1 from pods where pods.id = cadastral_data.pod_id and pods.user_id = auth.uid() )
  );

-- TRIGGER: Auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
