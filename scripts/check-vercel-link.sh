#!/usr/bin/env bash
set -euo pipefail

EXPECTED_PROJECT_ID="prj_DAQYyAbBl"
EXPECTED_PROJECT_NAME="site lr"

if [[ ! -f .vercel/project.json ]]; then
  echo "❌ Arquivo .vercel/project.json não encontrado. Rode: vercel link"
  exit 1
fi

PROJECT_ID="$(node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));process.stdout.write(p.projectId||'')")"
PROJECT_NAME="$(node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));process.stdout.write(p.projectName||'')")"

if [[ "$PROJECT_ID" != "$EXPECTED_PROJECT_ID" ]]; then
  echo "❌ Projeto Vercel incorreto: projectId atual '$PROJECT_ID' (esperado '$EXPECTED_PROJECT_ID')."
  echo "➡️  Rode: vercel link"
  exit 1
fi

echo "✅ Projeto Vercel validado: '$PROJECT_NAME' ($PROJECT_ID)."
if [[ "$PROJECT_NAME" != "$EXPECTED_PROJECT_NAME" ]]; then
  echo "⚠️ Nome do projeto diferente do esperado ('${EXPECTED_PROJECT_NAME}'). Verifique no painel da Vercel."
fi
