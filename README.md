# LR Site

Projeto React + Vite do site da LR Soluções Elétricas.

## Ambiente local

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Fluxo rápido para atualizar uma PR nova

Quando você abrir uma PR nova e quiser garantir atualização no projeto certo:

```bash
npm run build
npm run vercel:check-link
npm run deploy:prod:safe
```

## Deploy no projeto correto da Vercel

Se as mudanças estiverem indo para um projeto antigo, faça o relink do diretório local para o projeto certo antes de publicar:

```bash
vercel logout
vercel login
vercel link
```

Durante o `vercel link`, selecione o projeto correspondente ao ambiente atual:

- `lr-site-ndut4rbe6-natanferreiraferro-cpus-projects.vercel.app`

Depois publique:

```bash
vercel --prod
```

> Observação: o vínculo de projeto da Vercel fica em `.vercel/project.json` (arquivo local, normalmente não versionado). Se ele apontar para outro projeto, os deploys irão para o lugar errado.

## Quando ainda publica no projeto antigo (Git Integration)

Se mesmo após `vercel link` a atualização continuar no projeto antigo, o problema normalmente é a integração Git da Vercel:

1. Abra o projeto **site lr** na Vercel.
2. Vá em **Settings → Git**.
3. Confirme se o repositório conectado é este repo e se o branch de produção está correto (ex.: `main`).
4. Em **Ignored Build Step** (se existir), remova qualquer regra que bloqueie seu branch atual.
5. No projeto antigo, desconecte a integração Git para evitar deploy automático duplicado.

Checklist rápido antes do deploy:

- `vercel whoami`
- `vercel link` (deve mostrar o projeto `site lr`)
- `vercel deploy --prod`

## Diferença entre Pré-visualização e Produção (causa comum)

Se na tela de implantação aparecer **Ambiente: Pré-visualização**, essa URL não substitui o site de produção automaticamente.

Para publicar no site principal:

1. Faça merge no branch de produção (normalmente `main`) **ou** rode `vercel --prod`.
2. Em **Project Settings → Domains**, confirme que o domínio principal (ex.: `lrsolucoes.solar`) está apontando para **Production** deste projeto.
3. No projeto antigo, remova o domínio principal para evitar que ele continue servindo a versão antiga.

Checklist do print:

- Se o card da implantação mostrar **Pré-visualização**, é esperado gerar domínio `*.vercel.app` temporário.
- Só considere atualização “no ar” quando a implantação estiver em **Produção** e o domínio principal estiver anexado a ela.

### Trava de segurança para não publicar no projeto antigo

Este repositório possui uma checagem local de vínculo Vercel antes do deploy:

```bash
npm run vercel:check-link
```

Se o diretório local estiver vinculado ao projeto errado, o comando falha e orienta executar `vercel link`.

Deploy seguro (só publica se o vínculo estiver correto):

```bash
npm run deploy:prod:safe
```

## Erro ao enviar formulário ("Não foi possível enviar seus dados agora")

Se esse erro continuar mesmo com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` corretas, siga esta ordem:

1. Faça **novo deploy de produção** após salvar variáveis (valor novo só entra no build novo).
2. Abra o navegador em produção e use **F12 → Network** para capturar a requisição que falha.
3. Verifique o status da chamada:
   - `401/403`: problema de permissão (RLS/policy no Supabase).
   - `400`: payload inválido ou campo obrigatório ausente.
   - `500`: erro interno na função/endpoint.
4. No Supabase, confirme:
   - policy de `INSERT` liberada para role `anon` (se o formulário grava direto no cliente);
   - tabela/colunas com tipos corretos e sem `NOT NULL` inesperado;
   - projeto/URL da API iguais aos da Vercel.

> Observação: o simulador está embutido por `iframe` externo (`azume.com.br`). Se o erro vier do backend do simulador, o ajuste precisa ser feito no próprio serviço do simulador (não neste frontend).
