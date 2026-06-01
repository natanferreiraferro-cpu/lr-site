create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  indicator_name text,
  indicator_code text,
  indicado_nome text,
  indicado_telefone text,
  gasto_mensal text,
  status text not null default 'em_andamento',
  source text,
  customer_data jsonb,
  lgpd_accepted boolean not null default false,
  history jsonb not null default '[]'::jsonb
);

alter table public.leads enable row level security;

create policy "Allow anonymous insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

create policy "Allow authenticated read leads"
  on public.leads
  for select
  to authenticated
  using (true);

create policy "Allow authenticated update leads"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);
