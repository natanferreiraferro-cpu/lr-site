import { useEffect, useMemo, useState } from "react";
import { fetchLeads, updateLead } from "./lib/leadsApi";

const PORTAL_AUTH_KEY = "lr_indicator_portal_auth_v1";

const PORTAL_USER = "Master";
const PORTAL_PASS = "Soprano@7510";

const STATUS_LABEL = {
  em_andamento: "Em andamento",
  ganho: "Ganho",
  perdido: "Perdido",
};

const PAGE_SIZE = 10;

const hasPortalSession = () => sessionStorage.getItem(PORTAL_AUTH_KEY) === "authenticated";

export default function PortalApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasPortalSession());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [detailLead, setDetailLead] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchLeads().then(setLeads).catch(() => {
      setLoadError("Não foi possível carregar os leads do banco.");
    });
  }, []);

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

    return leads.filter((lead) => {
      if (statusFilter && lead.status !== statusFilter) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return [lead.indicatorName, lead.indicatorCode, lead.indicadoNome, lead.indicadoTelefone, lead.customerData?.cpfCnpj, lead.customerData?.email]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [leads, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const toggleStatus = (status) => {
    setStatusFilter((current) => (current === status ? "" : status));
  };

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

  const updateLeadState = async (leadId, updater) => {
    const current = leads.find((lead) => lead.id === leadId);
    if (!current) return;
    const next = updater(current);

    await updateLead(leadId, { status: next.status, history: next.history });
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? next : lead)));
  };

  const handleStatusChange = (leadId, status) => {
    updateLeadState(leadId, (lead) => ({
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

    updateLeadState(leadId, (lead) => ({
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
        <button
          type="button"
          className={`summaryCard${statusFilter === "" ? " is-active" : ""}`}
          onClick={() => setStatusFilter("")}
        >
          <strong>{counters.total}</strong><span>Total</span>
        </button>
        <button
          type="button"
          className={`summaryCard status-em_andamento${statusFilter === "em_andamento" ? " is-active" : ""}`}
          onClick={() => toggleStatus("em_andamento")}
        >
          <strong>{counters.em_andamento}</strong><span>Em andamento</span>
        </button>
        <button
          type="button"
          className={`summaryCard status-ganho${statusFilter === "ganho" ? " is-active" : ""}`}
          onClick={() => toggleStatus("ganho")}
        >
          <strong>{counters.ganho}</strong><span>Ganho</span>
        </button>
        <button
          type="button"
          className={`summaryCard status-perdido${statusFilter === "perdido" ? " is-active" : ""}`}
          onClick={() => toggleStatus("perdido")}
        >
          <strong>{counters.perdido}</strong><span>Perdido</span>
        </button>
      </section>

      <div className="searchWrap">
        <input
          type="text"
          placeholder="Buscar por indicador, código, indicado ou telefone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loadError && <p className="empty">{loadError}</p>}

      <section className="leadList">
        {filtered.length === 0 && <p className="empty">Nenhuma indicação encontrada.</p>}

        {paginated.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onStatusChange={handleStatusChange}
            onNoteSave={handleNoteSave}
            onOpenDetails={setDetailLead}
          />
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Próxima
          </button>
        </nav>
      )}

      {detailLead && (
        <LeadDetailsModal
          lead={leads.find((lead) => lead.id === detailLead.id) || detailLead}
          onClose={() => setDetailLead(null)}
        />
      )}
    </div>
  );
}

function LeadCard({ lead, onStatusChange, onNoteSave, onOpenDetails }) {
  const [note, setNote] = useState("");
  const history = lead.history || [];

  return (
    <article className="leadCard">
      <div className="leadTop">
        <div className="leadTitle">
          <span className={`statusBadge status-${lead.status}`}>
            {STATUS_LABEL[lead.status] || lead.status}
          </span>
          <h2>{lead.indicadoNome}</h2>
        </div>
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
        {lead.customerData?.cpfCnpj && <p><strong>CPF/CNPJ:</strong> {lead.customerData.cpfCnpj}</p>}
        {lead.customerData?.email && <p><strong>E-mail:</strong> {lead.customerData.email}</p>}
        {lead.customerData?.rendaMensal && <p><strong>Renda mensal:</strong> {lead.customerData.rendaMensal}</p>}
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

      <div className="cardFooter">
        <div className="timeline">
          {history.slice(0, 3).map((item) => (
            <div key={`${item.at}-${item.note}`}>
              <span>{new Date(item.at).toLocaleString("pt-BR")}</span>
              <p>{item.note}</p>
            </div>
          ))}
          {history.length === 0 && <p className="timelineEmpty">Sem histórico ainda.</p>}
        </div>

        <button type="button" className="detailsBtn" onClick={() => onOpenDetails(lead)}>
          Ver histórico completo{history.length > 3 ? ` (${history.length})` : ""}
        </button>
      </div>
    </article>
  );
}

function LeadDetailsModal({ lead, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const history = lead.history || [];

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modalHeader">
          <div className="leadTitle">
            <span className={`statusBadge status-${lead.status}`}>
              {STATUS_LABEL[lead.status] || lead.status}
            </span>
            <h2>{lead.indicadoNome}</h2>
          </div>
          <button type="button" className="modalClose" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="grid">
          <p><strong>Indicador:</strong> {lead.indicatorName}</p>
          <p><strong>Código:</strong> {lead.indicatorCode}</p>
          <p><strong>Telefone:</strong> {lead.indicadoTelefone}</p>
          <p><strong>Gasto mensal:</strong> {lead.gastoMensal}</p>
          {lead.customerData?.cpfCnpj && <p><strong>CPF/CNPJ:</strong> {lead.customerData.cpfCnpj}</p>}
          {lead.customerData?.email && <p><strong>E-mail:</strong> {lead.customerData.email}</p>}
          {lead.customerData?.rendaMensal && <p><strong>Renda mensal:</strong> {lead.customerData.rendaMensal}</p>}
        </div>

        <h3 className="modalSubtitle">Histórico completo</h3>
        <div className="timeline modalTimeline">
          {history.length === 0 && <p className="timelineEmpty">Sem histórico ainda.</p>}
          {history.map((item) => (
            <div key={`${item.at}-${item.note}`}>
              <span>
                {new Date(item.at).toLocaleString("pt-BR")}
                {item.status ? ` · ${STATUS_LABEL[item.status] || item.status}` : ""}
              </span>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const css = `
*{box-sizing:border-box}body{margin:0;font-family:'Roboto',Arial,sans-serif;background:#f4f4f4;color:#161616}
.portal{max-width:1100px;margin:0 auto;padding:20px}
.portalLoginPage{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#101216,#2a2d34);padding:20px}
.loginCard{width:min(430px,100%);background:#fff;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:12px;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.loginCard img{height:62px;align-self:flex-start;background:#f3651e;border-radius:8px;padding:4px}
.loginCard h1{margin:0;font-size:28px}.loginCard p{margin:0;color:#666;line-height:1.5}
.loginCard label{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:14px}
.loginCard input{height:42px;border:1px solid #ccc;border-radius:8px;padding:0 10px;font-family:inherit}
.loginCard button{height:42px;border:none;border-radius:8px;background:#f3651e;color:#fff;font-weight:700;cursor:pointer;font-family:inherit}
.authError{color:#b91c1c;font-size:13px;font-weight:700}
.portalHeader{display:flex;gap:14px;align-items:center;background:#111;color:#fff;padding:16px;border-radius:12px}
.portalHeader img{height:56px;background:#f3651e;border-radius:8px;padding:4px}
.portalHeader h1{margin:0 0 4px;font-size:26px}.portalHeader p{margin:0;color:#ddd}
.logoutBtn{margin-left:auto;height:38px;border:none;border-radius:8px;background:#f3651e;color:#fff;padding:0 14px;font-weight:700;cursor:pointer;font-family:inherit}
.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}
.summaryCard{background:#fff;border-radius:10px;padding:14px;text-align:center;border:2px solid #ececec;cursor:pointer;font-family:inherit;transition:border-color .15s,box-shadow .15s,transform .05s;display:flex;flex-direction:column;gap:2px}
.summaryCard span{color:#444;font-size:14px}
.summaryCard:hover{border-color:#f3651e}
.summaryCard:active{transform:translateY(1px)}
.summaryCard.is-active{border-color:#f3651e;box-shadow:0 6px 16px rgba(243,101,30,.18)}
.summary strong{display:block;font-size:28px;color:#f3651e}
.summaryCard.status-em_andamento strong{color:#b45309}
.summaryCard.status-ganho strong{color:#15803d}
.summaryCard.status-perdido strong{color:#b91c1c}
.searchWrap input{width:100%;height:44px;border-radius:10px;border:1px solid #ccc;padding:0 12px;font-family:inherit}
.leadList{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:14px;align-items:stretch}
.leadCard{background:#fff;border-radius:12px;padding:14px;border:1px solid #e7e7e7;display:flex;flex-direction:column;height:100%}
.leadTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.leadTitle{display:flex;flex-direction:column;gap:6px;min-width:0}
.leadTitle h2{margin:0;font-size:19px;overflow-wrap:anywhere}
.leadTop select{height:36px;border-radius:8px;padding:0 8px;font-family:inherit;flex:none}
.statusBadge{align-self:flex-start;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.03em}
.statusBadge.status-em_andamento{background:#fef3c7;color:#b45309}
.statusBadge.status-ganho{background:#dcfce7;color:#15803d}
.statusBadge.status-perdido{background:#fee2e2;color:#b91c1c}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;margin:10px 0}
.grid p{margin:0;overflow-wrap:anywhere}
.noteRow{display:flex;gap:8px;margin-bottom:10px}
.noteRow input{flex:1;height:40px;border-radius:8px;border:1px solid #ccc;padding:0 10px;font-family:inherit}
.noteRow button{height:40px;border:none;background:#f3651e;color:#fff;border-radius:8px;padding:0 12px;font-weight:700;cursor:pointer;font-family:inherit}
.cardFooter{margin-top:auto;display:flex;flex-direction:column;gap:10px}
.timeline{display:grid;gap:8px}.timeline div{background:#f8f8f8;border-left:3px solid #f3651e;padding:8px 10px;border-radius:6px}
.timeline span{font-size:12px;color:#666}.timeline p{margin:2px 0 0}
.timelineEmpty{margin:0;color:#888;font-size:13px;font-style:italic}
.detailsBtn{align-self:flex-start;background:transparent;border:1px solid #f3651e;color:#f3651e;border-radius:8px;padding:8px 12px;font-weight:700;cursor:pointer;font-family:inherit}
.detailsBtn:hover{background:#f3651e;color:#fff}
.pagination{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:18px}
.pagination button{height:38px;border:1px solid #ccc;background:#fff;border-radius:8px;padding:0 16px;font-weight:700;cursor:pointer;font-family:inherit}
.pagination button:disabled{opacity:.45;cursor:not-allowed}
.pagination span{font-size:14px;color:#444}
.empty{padding:16px;text-align:center;background:#fff;border-radius:10px}
.modalOverlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px;z-index:50}
.modal{background:#fff;border-radius:14px;padding:20px;width:min(620px,100%);max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.modalHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.modalClose{flex:none;width:36px;height:36px;border:none;border-radius:8px;background:#f1f1f1;font-size:22px;line-height:1;cursor:pointer;font-family:inherit}
.modalClose:hover{background:#e2e2e2}
.modalSubtitle{margin:16px 0 8px;font-size:16px}
.modalTimeline{max-height:42vh;overflow-y:auto}
@media (max-width:900px){.summary{grid-template-columns:repeat(2,1fr)}.leadList{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.noteRow{flex-direction:column}.portalHeader{flex-wrap:wrap}.logoutBtn{margin-left:0}}
`;
