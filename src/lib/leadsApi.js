// Cliente de leads usado pela página principal (criação de indicação) e pelo
// Portal (leitura/atualização). Toda a comunicação passa pelas funções
// serverless /api/projeto-lead e /api/leads — a anon key não é mais usada,
// pois a tabela `projeto_solar` só aceita acesso via service_role.

const mapRowToLead = (row) => ({
  id: row.id,
  createdAt: row.created_at,
  indicatorName: row.indicator_name,
  indicatorCode: row.indicator_code,
  indicadoNome: row.nome_completo,
  indicadoTelefone: row.celular,
  gastoMensal: row.gasto_energia_mensal,
  status: row.status,
  source: row.source,
  customerData: {
    cpfCnpj: row.cpf_cnpj || null,
    email: row.email || null,
    rendaMensal: row.renda_mensal || null,
  },
  lgpdAccepted: row.lgpd_accepted,
  history: row.history || [],
});

export const fetchLeads = async () => {
  const response = await fetch("/api/leads");
  if (!response.ok) {
    throw new Error("Não foi possível carregar os leads.");
  }

  const data = await response.json();
  return (data || []).map(mapRowToLead);
};

export const createLead = async (lead) => {
  const response = await fetch("/api/projeto-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "indicacao",
      indicatorName: lead.indicatorName,
      indicatorCode: lead.indicatorCode,
      indicadoNome: lead.indicadoNome,
      indicadoTelefone: lead.indicadoTelefone,
      gastoMensal: lead.gastoMensal,
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar a indicação.");
  }

  return response.json();
};

export const updateLead = async (leadId, partialLead) => {
  const patch = {};
  if (partialLead.status !== undefined) patch.status = partialLead.status;
  if (partialLead.history !== undefined) patch.history = partialLead.history;

  const response = await fetch(`/api/leads?id=${encodeURIComponent(leadId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o lead.");
  }
};
