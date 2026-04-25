-- Ajaccio Estimation - MVP schema for lead capture and callbacks
-- Run this file in Supabase SQL editor for the ESTIM CORSICA project.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  property_type text not null check (property_type in ('appartement', 'villa', 'maison')),
  postal_code text not null check (postal_code in ('20000', '20090', '20167')),
  commune text not null default 'Ajaccio',
  commune_code_insee text not null default '2A004',
  address text not null default '',
  surface integer not null check (surface >= 10),
  rooms integer not null check (rooms >= 1),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  floor integer,
  total_floors integer,
  land_surface integer,
  year_built integer,
  condition text not null check (condition in ('neuf', 'tres_bon', 'bon', 'a_rafraichir', 'a_renover')),
  features jsonb not null default '[]'::jsonb,
  estimated_price_low integer not null,
  estimated_price_high integer not null,
  estimated_price_sqm integer not null,
  comparable_count integer not null default 0,
  query_level integer not null check (query_level between 1 and 3),
  precision_level integer not null check (precision_level between 0 and 3),
  source text not null default 'unknown',
  status text not null default 'new',
  gdpr_consent boolean not null default false,
  gdpr_consent_date timestamptz
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_postal_property on public.leads (postal_code, property_type);
create index if not exists idx_leads_status on public.leads (status);

create table if not exists public.estimations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  property_type text not null check (property_type in ('appartement', 'villa', 'maison')),
  postal_code text not null check (postal_code in ('20000', '20090', '20167')),
  commune text not null default 'Ajaccio',
  commune_code_insee text not null default '2A004',
  address text not null default '',
  surface integer not null check (surface >= 10),
  rooms integer not null check (rooms >= 1),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  floor integer,
  total_floors integer,
  land_surface integer,
  year_built integer,
  condition text not null check (condition in ('neuf', 'tres_bon', 'bon', 'a_rafraichir', 'a_renover')),
  features jsonb not null default '[]'::jsonb,
  estimated_price_low integer not null,
  estimated_price_high integer not null,
  estimated_price_sqm integer not null,
  comparable_count integer not null default 0,
  query_level integer not null check (query_level between 1 and 3),
  precision_level integer not null check (precision_level between 0 and 3),
  source text not null default 'unknown',
  gdpr_consent boolean not null default false,
  gdpr_consent_date timestamptz
);

create index if not exists idx_estimations_created_at on public.estimations (created_at desc);
create index if not exists idx_estimations_postal_property on public.estimations (postal_code, property_type);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  message text not null default '',
  source_page text not null default '',
  preferred_time_slot text not null default 'any' check (preferred_time_slot in ('morning', 'afternoon', 'any')),
  preferred_days jsonb not null default '[]'::jsonb,
  status text not null default 'new'
);

create index if not exists idx_contact_requests_created_at on public.contact_requests (created_at desc);
create index if not exists idx_contact_requests_status on public.contact_requests (status);
