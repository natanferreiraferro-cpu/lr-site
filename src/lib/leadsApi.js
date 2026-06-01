import { isSupabaseConfigured, supabaseConfig } from "./supabaseClient";

const TABLE = "leads";

const supabaseRequest = async (path, options = {}) => {
  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${supabaseConfig.anonKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error("Erro de integração com Supabase");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const fetchLeads = async () => {
  if (!isSupabaseConfigured) throw new Error("Supabase não configurado.");

  const data = await supabaseRequest(`${TABLE}?select=*&order=created_at.desc`);

  return (data || []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    indicatorName: row.indicator_name,
    indicatorCode: row.indicator_code,
    indicadoNome: row.indicado_nome,
    indicadoTelefone: row.indicado_telefone,
    gastoMensal: row.gasto_mensal,
    status: row.status,
    source: row.source,
    customerData: row.customer_data || null,
    lgpdAccepted: row.lgpd_accepted,
    history: row.history || [],
  }));
};

export const createLead = async (lead) => {
  if (!isSupabaseConfigured) throw new Error("Supabase não configurado.");

  const payload = {
    indicator_name: lead.indicatorName || null,
    indicator_code: lead.indicatorCode || null,
    indicado_nome: lead.indicadoNome || null,
    indicado_telefone: lead.indicadoTelefone || null,
    gasto_mensal: lead.gastoMensal || null,
    status: lead.status || "em_andamento",
    source: lead.source || "site",
    customer_data: lead.customerData || null,
    lgpd_accepted: Boolean(lead.lgpdAccepted),
    history: lead.history || [],
  };

  return supabaseRequest(TABLE, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
};

export const updateLead = async (leadId, partialLead) => {
  if (!isSupabaseConfigured) throw new Error("Supabase não configurado.");

  const patch = {};
  if (partialLead.status !== undefined) patch.status = partialLead.status;
  if (partialLead.history !== undefined) patch.history = partialLead.history;

  await supabaseRequest(`${TABLE}?id=eq.${leadId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
};
