-- Migração: unificar leads de indicação na tabela `projeto_solar`.
-- A tabela passa a armazenar tanto leads do Projeto Solar (source = 'projeto_solar')
-- quanto leads do formulário de indicação da página principal (source = 'indicacao').
-- Execute uma vez no SQL editor do Supabase.

-- 1. Relaxar NOT NULL: o formulário de indicação não coleta CPF/CNPJ nem e-mail.
alter table public.projeto_solar
  alter column nome_completo drop not null,
  alter column cpf_cnpj      drop not null,
  alter column email         drop not null,
  alter column celular       drop not null;

-- 2. Colunas específicas da indicação + histórico/timeline usado pelo Portal.
alter table public.projeto_solar
  add column if not exists indicator_name text,
  add column if not exists indicator_code text,
  add column if not exists history jsonb not null default '[]'::jsonb;

-- 3. (Opcional) Migração única dos dados existentes da antiga tabela `leads`,
--    caso ela esteja no mesmo banco. Revise antes de executar e remova o comentário.
--
-- insert into public.projeto_solar (
--   created_at, nome_completo, celular, gasto_energia_mensal,
--   indicator_name, indicator_code, status, source, lgpd_accepted, history,
--   cpf_cnpj, email, renda_mensal
-- )
-- select
--   created_at,
--   indicado_nome,
--   indicado_telefone,
--   gasto_mensal,
--   indicator_name,
--   indicator_code,
--   status,
--   coalesce(source, 'indicacao'),
--   coalesce(lgpd_accepted, false),
--   coalesce(history, '[]'::jsonb),
--   customer_data->>'cpfCnpj',
--   customer_data->>'email',
--   customer_data->>'rendaMensal'
-- from public.leads;
