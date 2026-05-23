#!/usr/bin/env bash
set -euo pipefail

EXPECTED_PROJECT_NAME="site lr"
EXPECTED_FILE=".vercel/expected-project-id"
EXPECTED_PROJECT_ID="${EXPECTED_VERCEL_PROJECT_ID:-}"

if [[ ! -f .vercel/project.json ]]; then
  echo "❌ Arquivo .vercel/project.json não encontrado. Rode: vercel link"
  exit 1
fi

PROJECT_ID="$(node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));process.stdout.write(p.projectId||'')")"
PROJECT_NAME="$(node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));process.stdout.write(p.projectName||'')")"

if [[ -z "$EXPECTED_PROJECT_ID" && -f "$EXPECTED_FILE" ]]; then
  EXPECTED_PROJECT_ID="$(tr -d '[:space:]' < "$EXPECTED_FILE")"
fi

if [[ -z "$EXPECTED_PROJECT_ID" ]]; then
  echo "⚠️ ID esperado não configurado."
  echo "➡️  Configure com UM destes formatos:"
  echo "   echo '$PROJECT_ID' > $EXPECTED_FILE"
  echo "   EXPECTED_VERCEL_PROJECT_ID=$PROJECT_ID npm run vercel:check-link"
  echo "ℹ️  ID atualmente vinculado: '$PROJECT_ID'"
  exit 1
fi

if [[ "$PROJECT_ID" != "$EXPECTED_PROJECT_ID" ]]; then
  echo "❌ Projeto Vercel incorreto: projectId atual '$PROJECT_ID' (esperado '$EXPECTED_PROJECT_ID')."
  echo "➡️  Rode: vercel link"
  exit 1
fi

echo "✅ Projeto Vercel validado: '$PROJECT_NAME' ($PROJECT_ID)."
if [[ -n "$PROJECT_NAME" && "$PROJECT_NAME" != "$EXPECTED_PROJECT_NAME" ]]; then
  echo "⚠️ Nome do projeto diferente do esperado ('${EXPECTED_PROJECT_NAME}'). Verifique no painel da Vercel."
fi
