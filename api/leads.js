// Função serverless da Vercel: leitura e atualização dos leads da tabela
// unificada `projeto_solar`, usada pelo Portal de Indicadores. Usa a
// service_role key (somente servidor), já que a tabela não tem acesso anônimo.
//
//   GET            → lista todos os leads (mais recentes primeiro)
//   PATCH ?id=<id> → atualiza status e/ou history de um lead

const supabaseHeaders = (serviceRoleKey, extra = {}) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
  ...extra,
});

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    res.status(500).json({ error: "Supabase não configurado no servidor." });
    return;
  }

  const baseUrl = `${supabaseUrl}/rest/v1/projeto_solar`;

  if (req.method === "GET") {
    try {
      const response = await fetch(`${baseUrl}?select=*&order=created_at.desc`, {
        headers: supabaseHeaders(serviceRoleKey),
      });

      if (!response.ok) {
        res.status(502).json({ error: "Falha ao carregar os leads." });
        return;
      }

      res.status(200).json(await response.json());
    } catch {
      res.status(502).json({ error: "Falha ao carregar os leads." });
    }
    return;
  }

  if (req.method === "PATCH") {
    const id = req.query?.id;
    if (!id) {
      res.status(400).json({ error: "Parâmetro id é obrigatório." });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const patch = {};
    if (body.status !== undefined) patch.status = body.status;
    if (body.history !== undefined) patch.history = body.history;

    if (Object.keys(patch).length === 0) {
      res.status(400).json({ error: "Nada para atualizar." });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}?id=eq.${id}`, {
        method: "PATCH",
        headers: supabaseHeaders(serviceRoleKey, { Prefer: "return=minimal" }),
        body: JSON.stringify(patch),
      });

      if (!response.ok) {
        res.status(502).json({ error: "Falha ao atualizar o lead." });
        return;
      }

      res.status(200).json({ ok: true });
    } catch {
      res.status(502).json({ error: "Falha ao atualizar o lead." });
    }
    return;
  }

  res.status(405).json({ error: "Método não permitido." });
}
