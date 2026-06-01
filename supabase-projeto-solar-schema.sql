create extension if not exists "pgcrypto";

create table if not exists public.projeto_solar (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome_completo text not null,
  cpf_cnpj text not null,
  email text not null,
  celular text not null,
  data_nascimento text,
  renda_mensal text,
  gasto_energia_mensal text,
  cep text,
  uf text,
  cidade text,
  endereco text,
  numero text,
  complemento text,
  bairro text,
  lgpd_accepted boolean not null default false,
  termos_compartilhamento boolean not null default false,
  termos_bacen boolean not null default false,
  source text not null default 'projeto_solar',
  status text not null default 'em_andamento'
);

alter table public.projeto_solar enable row level security;

-- Sem policy de insert para anon: a gravação é feita pela função serverless
-- /api/projeto-lead usando a service_role key, que bypassa o RLS.
create policy "Allow authenticated read projeto_solar"
  on public.projeto_solar
  for select
  to authenticated
  using (true);
