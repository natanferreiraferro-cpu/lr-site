create extension if not exists "pgcrypto";

-- Tabela unificada de leads: armazena leads do Projeto Solar
-- (source = 'projeto_solar') e do formulário de indicação da página
-- principal (source = 'indicacao'). Campos sem valor para uma das origens
-- ficam nulos (ex.: cpf_cnpj/email/renda em indicações).
create table if not exists public.projeto_solar (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome_completo text,
  cpf_cnpj text,
  email text,
  celular text,
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
  -- Específicos do formulário de indicação
  indicator_name text,
  indicator_code text,
  -- Timeline de acompanhamento usada pelo Portal
  history jsonb not null default '[]'::jsonb,
  lgpd_accepted boolean not null default false,
  termos_compartilhamento boolean not null default false,
  termos_bacen boolean not null default false,
  source text not null default 'projeto_solar',
  status text not null default 'em_andamento'
);

alter table public.projeto_solar enable row level security;

-- Sem policy anônima (insert, select ou update): todo acesso do browser é
-- feito pelas funções serverless /api/projeto-lead e /api/leads usando a
-- service_role key, que bypassa o RLS.
create policy "Allow authenticated read projeto_solar"
  on public.projeto_solar
  for select
  to authenticated
  using (true);
