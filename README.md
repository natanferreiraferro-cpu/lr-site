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
