// Função serverless da Vercel: grava leads do Projeto Solar na tabela
// `projeto_solar` do Supabase usando a service_role key (somente servidor).
// A tabela tem RLS habilitada sem policy de insert anônimo, então a escrita
// só é possível por aqui.

const REQUIRED_FIELDS = ["nomeCompleto", "cpfCnpj", "email", "celular"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    res.status(500).json({ error: "Supabase não configurado no servidor." });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  const missing = REQUIRED_FIELDS.filter((field) => !body[field]);
  if (!body.lgpdAccepted || missing.length > 0) {
    res.status(400).json({ error: "Dados obrigatórios ausentes ou termos não aceitos." });
    return;
  }

  const payload = {
    nome_completo: body.nomeCompleto,
    cpf_cnpj: body.cpfCnpj,
    email: body.email,
    celular: body.celular,
    data_nascimento: body.dataNascimento || null,
    renda_mensal: body.rendaMensal || null,
    gasto_energia_mensal: body.gastoEnergiaMensal || null,
    cep: body.cep || null,
    uf: body.uf || null,
    cidade: body.cidade || null,
    endereco: body.endereco || null,
    numero: body.numero || null,
    complemento: body.complemento || null,
    bairro: body.bairro || null,
    lgpd_accepted: Boolean(body.lgpdAccepted),
    termos_compartilhamento: Boolean(body.termosCompartilhamento),
    termos_bacen: Boolean(body.termosBacen),
    source: "projeto_solar",
    status: "em_andamento",
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/projeto_solar`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      res.status(502).json({ error: "Falha ao gravar no banco." });
      return;
    }

    res.status(201).json({ ok: true });
  } catch {
    res.status(502).json({ error: "Falha ao gravar no banco." });
  }
}
