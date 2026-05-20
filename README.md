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
