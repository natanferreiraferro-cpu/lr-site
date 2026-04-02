import { useMemo, useState } from "react";

const LEADS_STORAGE_KEY = "lr_indicator_leads_v1";
const PORTAL_AUTH_KEY = "lr_indicator_portal_auth_v1";

const PORTAL_USER = "Master";
const PORTAL_PASS = "Soprano@7510";

const STATUS_LABEL = {
  em_andamento: "Em andamento",
  ganho: "Ganho",
  perdido: "Perdido",
};

const readLeads = () => {
  try {
    return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveLeads = (leads) => {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
};

const hasPortalSession = () => sessionStorage.getItem(PORTAL_AUTH_KEY) === "authenticated";

export default function PortalApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasPortalSession());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState(() => readLeads());
  const [query, setQuery] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (username === PORTAL_USER && password === PORTAL_PASS) {
      sessionStorage.setItem(PORTAL_AUTH_KEY, "authenticated");
      setIsAuthenticated(true);
      setAuthError("");
      return;
    }

    setAuthError("Usuário ou senha inválidos.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PORTAL_AUTH_KEY);
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return leads;
    }

    return leads.filter((lead) => {
      return [lead.indicatorName, lead.indicatorCode, lead.indicadoNome, lead.indicadoTelefone]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [leads, query]);

  const counters = useMemo(() => {
    return leads.reduce(
      (acc, lead) => {
        acc.total += 1;
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      },
      { total: 0, em_andamento: 0, ganho: 0, perdido: 0 },
    );
  }, [leads]);

  const updateLead = (leadId, updater) => {
    setLeads((prev) => {
      const updated = prev.map((lead) => (lead.id === leadId ? updater(lead) : lead));
      saveLeads(updated);
      return updated;
    });
  };

  const handleStatusChange = (leadId, status) => {
    updateLead(leadId, (lead) => ({
      ...lead,
      status,
      history: [
        {
          at: new Date().toISOString(),
          status,
          note: `Status alterado para ${STATUS_LABEL[status]}`,
        },
        ...(lead.history || []),
      ],
    }));
  };

  const handleNoteSave = (leadId, note) => {
    if (!note.trim()) {
      return;
    }

    updateLead(leadId, (lead) => ({
      ...lead,
      history: [
        {
          at: new Date().toISOString(),
          status: lead.status,
          note,
        },
        ...(lead.history || []),
      ],
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="portalLoginPage">
        <style>{css}</style>

        <form className="loginCard" onSubmit={handleLogin}>
          <img src="/logo.png" alt="LR" />
          <h1>Portal de Indicadores</h1>
          <p>Faça login para acessar o acompanhamento das indicações.</p>

          <label>
            Usuário
            <input
              required
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Digite o usuário"
            />
          </label>

          <label>
            Senha
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite a senha"
            />
          </label>

          {authError && <span className="authError">{authError}</span>}

          <button type="submit">Entrar no portal</button>
        </form>
      </div>
    );
  }

  return (
    <div className="portal">
      <style>{css}</style>

      <header className="portalHeader">
        <img src="/logo.png" alt="LR" />
        <div>
          <h1>Portal de Acompanhamento dos Indicadores</h1>
          <p>Acompanhe leads, atualize status (ganho/perdido) e visualize o andamento.</p>
        </div>
        <button className="logoutBtn" type="button" onClick={handleLogout}>Sair</button>
      </header>

      <section className="summary">
        <article><strong>{counters.total}</strong><span>Total</span></article>
        <article><strong>{counters.em_andamento}</strong><span>Em andamento</span></article>
        <article><strong>{counters.ganho}</strong><span>Ganho</span></article>
        <article><strong>{counters.perdido}</strong><span>Perdido</span></article>
      </section>

      <div className="searchWrap">
        <input
          type="text"
          placeholder="Buscar por indicador, código, indicado ou telefone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <section className="leadList">
        {filtered.length === 0 && <p className="empty">Nenhuma indicação encontrada.</p>}

        {filtered.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onStatusChange={handleStatusChange}
            onNoteSave={handleNoteSave}
          />
        ))}
      </section>
    </div>
  );
}

function LeadCard({ lead, onStatusChange, onNoteSave }) {
  const [note, setNote] = useState("");

  return (
    <article className="leadCard">
      <div className="leadTop">
        <h2>{lead.indicadoNome}</h2>
        <select value={lead.status} onChange={(e) => onStatusChange(lead.id, e.target.value)}>
          <option value="em_andamento">Em andamento</option>
          <option value="ganho">Ganho</option>
          <option value="perdido">Perdido</option>
        </select>
      </div>

      <div className="grid">
        <p><strong>Indicador:</strong> {lead.indicatorName}</p>
        <p><strong>Código:</strong> {lead.indicatorCode}</p>
        <p><strong>Telefone:</strong> {lead.indicadoTelefone}</p>
        <p><strong>Gasto mensal:</strong> {lead.gastoMensal}</p>
      </div>

      <div className="noteRow">
        <input
          type="text"
          placeholder="Adicionar observação de andamento"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            onNoteSave(lead.id, note);
            setNote("");
          }}
        >
          Salvar nota
        </button>
      </div>

      <div className="timeline">
        {(lead.history || []).slice(0, 5).map((item) => (
          <div key={`${item.at}-${item.note}`}>
            <span>{new Date(item.at).toLocaleString("pt-BR")}</span>
            <p>{item.note}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

const css = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f4f4f4;color:#161616}
.portal{max-width:1100px;margin:0 auto;padding:20px}
.portalLoginPage{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#101216,#2a2d34);padding:20px}
.loginCard{width:min(430px,100%);background:#fff;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:12px;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.loginCard img{height:62px;align-self:flex-start;background:#f3651e;border-radius:8px;padding:4px}
.loginCard h1{margin:0;font-size:28px}.loginCard p{margin:0;color:#666;line-height:1.5}
.loginCard label{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:14px}
.loginCard input{height:42px;border:1px solid #ccc;border-radius:8px;padding:0 10px}
.loginCard button{height:42px;border:none;border-radius:8px;background:#f3651e;color:#fff;font-weight:700;cursor:pointer}
.authError{color:#b91c1c;font-size:13px;font-weight:700}
.portalHeader{display:flex;gap:14px;align-items:center;background:#111;color:#fff;padding:16px;border-radius:12px}
.portalHeader img{height:56px;background:#f3651e;border-radius:8px;padding:4px}
.portalHeader h1{margin:0 0 4px;font-size:26px}.portalHeader p{margin:0;color:#ddd}
.logoutBtn{margin-left:auto;height:38px;border:none;border-radius:8px;background:#f3651e;color:#fff;padding:0 14px;font-weight:700;cursor:pointer}
.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}
.summary article{background:#fff;border-radius:10px;padding:14px;text-align:center;border:1px solid #ececec}
.summary strong{display:block;font-size:28px;color:#f3651e}
.searchWrap input{width:100%;height:44px;border-radius:10px;border:1px solid #ccc;padding:0 12px}
.leadList{display:grid;gap:12px;margin-top:14px}
.leadCard{background:#fff;border-radius:12px;padding:14px;border:1px solid #e7e7e7}
.leadTop{display:flex;align-items:center;justify-content:space-between;gap:12px}
.leadTop h2{margin:0}.leadTop select{height:36px;border-radius:8px;padding:0 8px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;margin:10px 0}
.grid p{margin:0}
.noteRow{display:flex;gap:8px;margin-bottom:10px}
.noteRow input{flex:1;height:40px;border-radius:8px;border:1px solid #ccc;padding:0 10px}
.noteRow button{height:40px;border:none;background:#f3651e;color:#fff;border-radius:8px;padding:0 12px;font-weight:700;cursor:pointer}
.timeline{display:grid;gap:8px}.timeline div{background:#f8f8f8;border-left:3px solid #f3651e;padding:8px 10px;border-radius:6px}
.timeline span{font-size:12px;color:#666}.timeline p{margin:2px 0 0}
.empty{padding:16px;text-align:center;background:#fff;border-radius:10px}
@media (max-width:900px){.summary{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.noteRow{flex-direction:column}.portalHeader{flex-wrap:wrap}.logoutBtn{margin-left:0}}
`;
