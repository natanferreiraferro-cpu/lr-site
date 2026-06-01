import { useState } from "react";
import { createLead } from "./lib/leadsApi";
import { isSupabaseConfigured } from "./lib/supabaseClient";

const onlyDigits = (value) => value.replace(/\D/g, "");

const formatPhone = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const formatDate = (value) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const formatMoney = (value) => {
  const digits = onlyDigits(value);
  if (!digits) return "";
  const amount = Number(digits) / 100;
  const formatted = amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `R$: ${formatted}`;
};

const emptyForm = {
  nomeCompleto: "",
  cpfCnpj: "",
  email: "",
  celular: "",
  dataNascimento: "",
  rendaMensal: "",
  gastoEnergiaMensal: "",
  cep: "",
  uf: "",
  cidade: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
};

export default function ProjetoSolarApp() {
  const [form, setForm] = useState(emptyForm);
  const [acceptedLgpd, setAcceptedLgpd] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [termsOpen, setTermsOpen] = useState(true);
  const [termsDataShare, setTermsDataShare] = useState(false);
  const [termsBacen, setTermsBacen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;
    if (name === "celular") nextValue = formatPhone(value);
    if (name === "dataNascimento") nextValue = formatDate(value);
    if (name === "rendaMensal" || name === "gastoEnergiaMensal") nextValue = formatMoney(value);

    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const fetchAddressByCep = async (cepValue) => {
    const cep = onlyDigits(cepValue);
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (!response.ok) return;
      const data = await response.json();

      setForm((prev) => ({
        ...prev,
        cep: data.cep || prev.cep,
        uf: data.state || prev.uf,
        cidade: data.city || prev.cidade,
        endereco: data.street || prev.endereco,
        bairro: data.neighborhood || prev.bairro,
      }));
    } catch {
      // silêncio para não interromper o preenchimento manual
    }
  };

  const fetchCompanyByCnpj = async (cpfCnpjValue) => {
    const cnpj = onlyDigits(cpfCnpjValue);
    if (cnpj.length !== 14) return;

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!response.ok) return;
      const data = await response.json();

      setForm((prev) => ({
        ...prev,
        nomeCompleto: data.razao_social || prev.nomeCompleto,
        email: data.email || prev.email,
        celular: data.ddd_telefone_1 || prev.celular,
        cep: data.cep || prev.cep,
        uf: data.uf || prev.uf,
        cidade: data.municipio || prev.cidade,
        endereco: data.logradouro || prev.endereco,
        numero: data.numero || prev.numero,
        complemento: data.complemento || prev.complemento,
        bairro: data.bairro || prev.bairro,
      }));

      if (data.cep) {
        fetchAddressByCep(data.cep);
      }
    } catch {
      // silêncio para não interromper o preenchimento manual
    }
  };


  const canProceedTerms = termsDataShare && termsBacen;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!acceptedLgpd) return;

    const lead = {
      id: `lead-solar-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: "projeto_solar",
      indicatorName: "Site - Projeto solar",
      indicatorCode: "PROJ-SOLAR",
      indicadoNome: form.nomeCompleto,
      indicadoTelefone: form.celular,
      gastoMensal: form.gastoEnergiaMensal,
      status: "em_andamento",
      customerData: { ...form },
      lgpdAccepted: true,
      history: [
        {
          at: new Date().toISOString(),
          status: "em_andamento",
          note: "Lead criado via formulário Projeto Solar",
        },
      ],
    };

    if (!isSupabaseConfigured) {
      setSubmitError("Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
      return;
    }

    try {
      await createLead(lead);
      setSubmitted(true);
      setSubmitError("");
    } catch {
      setSubmitError("Não foi possível enviar seus dados agora. Tente novamente.");
      return;
    }
    setForm(emptyForm);
    setAcceptedLgpd(false);
  };

  return (
    <main className="solarPage">
      <style>{css}</style>
      <section className="solarCard">
        <h1>Projeto solar</h1>
        <p>Preencha os dados para análise do seu projeto solar.</p>

        {submitted && (
          <div className="successMsg">Seus dados estão em análise de aprovação. Boa sorte!</div>
        )}

        {submitError && <div className="empty">{submitError}</div>}

        {termsOpen ? (
          <div className="termsOverlay">
            <div className="termsModal">
              <button type="button" className="termsClose" onClick={() => window.history.back()}>×</button>
              <h2>Termos de consentimento</h2>
              <h3>Compartilhamento de dados pessoais</h3>
              <p>Estou ciente e informei ao titular que os dados pessoais informados serão utilizados pelas instituições financeiras parceiras da LR Soluções Elétricas para registrar e consultar dados das operações de crédito, em conformidade com a LGPD.</p>
              <h3>Resolução BACEN nº 4.571 de 2017, Artigo 10º</h3>
              <p>Autorizamos o registro e consulta dos dados das operações de crédito no Sistema de Informações de Crédito do BACEN, para fins de supervisão de risco de crédito e intercâmbio de informações entre instituições financeiras, conforme legislação vigente.</p>

              <label className="termsCheck">
                <input type="checkbox" checked={termsDataShare} onChange={(e) => setTermsDataShare(e.target.checked)} />
                <span>Estou ciente e informei ao titular sobre o compartilhamento de dados pessoais.</span>
              </label>
              <label className="termsCheck">
                <input type="checkbox" checked={termsBacen} onChange={(e) => setTermsBacen(e.target.checked)} />
                <span>Estou de acordo com a Resolução BACEN nº 4.571 de 2017. Artigo 10º.</span>
              </label>

              <div className="termsActions">
                <button type="button" className="secondary" onClick={() => window.history.back()}>Fechar</button>
                <button type="button" disabled={!canProceedTerms} onClick={() => setTermsOpen(false)}>Prosseguir</button>
              </div>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <h2>Dados do cliente</h2>
          <div className="grid two">
            <label>Nome completo<input required name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} placeholder="Ex: João da Silva Gomes"/></label>
            <label>CPF ou CNPJ<input required name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} onBlur={(e) => fetchCompanyByCnpj(e.target.value)} /></label>
            <label>E-mail<input required type="email" name="email" value={form.email} onChange={handleChange}/></label>
            <label>Celular<input required name="celular" value={form.celular} onChange={handleChange} placeholder="(82) 9 0000-0000"/></label>
            <label>Data de nascimento<input required name="dataNascimento" value={form.dataNascimento} onChange={handleChange} placeholder="00/00/0000"/></label>
            <label>Renda mensal<input required name="rendaMensal" value={form.rendaMensal} onChange={handleChange} placeholder="R$: 300,00"/></label>
            <label>Quanto paga de energia mensal<input required name="gastoEnergiaMensal" value={form.gastoEnergiaMensal} onChange={handleChange} placeholder="R$: 300,00"/></label>
          </div>

          <h2>Dados de endereço / local de instalação</h2>
          <div className="grid three">
            <label>CEP<input required name="cep" value={form.cep} onChange={handleChange} onBlur={(e) => fetchAddressByCep(e.target.value)} placeholder="00000-000"/></label>
            <label>UF<input required name="uf" value={form.uf} onChange={handleChange} placeholder="UF"/></label>
            <label>Cidade<input required name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade"/></label>
          </div>
          <label>Endereço<input required name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço"/></label>
          <div className="grid three">
            <label>Número<input required name="numero" value={form.numero} onChange={handleChange} placeholder="243"/></label>
            <label>Complemento<input name="complemento" value={form.complemento} onChange={handleChange} placeholder="Setor norte"/></label>
            <label>Bairro<input required name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro"/></label>
          </div>

          <label className="check">
            <input type="checkbox" checked={acceptedLgpd} onChange={(e) => setAcceptedLgpd(e.target.checked)} />
            <span>Aceito os termos da LGPD e autorizo o uso dos meus dados para análise do projeto solar.</span>
          </label>

          <div className="actions">
            <button type="button" className="secondary" onClick={() => window.history.back()}>Voltar</button>
            <button type="submit" disabled={!acceptedLgpd}>Enviar projeto para pré-análise</button>
          </div>
        </form>
        )}
      </section>
    </main>
  );
}

const css = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f0f0f0;color:#111}
.solarPage{padding:24px;display:flex;justify-content:center}
.solarCard{width:min(1320px,100%);background:#fff;border-radius:14px;padding:22px}
h1{font-size:46px;margin:0 0 6px}p{margin:0 0 22px;color:#666}
h2{font-size:28px;margin:26px 0 14px}form label{display:flex;flex-direction:column;gap:8px;font-weight:700;font-size:18px;margin-bottom:14px}
input{height:56px;border:1px solid #d2d2d2;border-radius:10px;padding:0 12px;font-size:30px;font-weight:400;color:#222}
.grid{display:grid;gap:14px}.grid.two{grid-template-columns:1.4fr 1fr}.grid.three{grid-template-columns:1fr 1fr 1fr}
.check{display:flex;flex-direction:row;align-items:flex-start;gap:10px;font-size:14px;font-weight:500;margin:18px 0}
.check input{height:18px;width:18px;margin-top:2px}
.actions{display:flex;justify-content:flex-end;gap:12px;margin-top:8px}
button{height:54px;border:none;border-radius:10px;padding:0 22px;font-size:22px;font-weight:700;background:#ff6d00;color:#fff;cursor:pointer}
button.secondary{background:#fff;border:1px solid #ccc;color:#111}
button:disabled{opacity:.5;cursor:not-allowed}
.successMsg{background:#e7f9ec;border:1px solid #96d8aa;color:#176a35;padding:12px;border-radius:10px;margin-bottom:12px;font-weight:700}
.empty{background:#fff4e5;border:1px solid #f5c073;color:#8a5300;padding:12px;border-radius:10px;margin-bottom:12px;font-weight:600}
.termsOverlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.termsModal{position:relative;width:min(980px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:16px;padding:28px}
.termsModal h2{margin:0 0 14px;font-size:46px}.termsModal h3{margin:14px 0 8px;font-size:26px}.termsModal p{margin:0 0 12px;line-height:1.45;color:#333}
.termsClose{position:absolute;right:18px;top:18px;height:44px;width:44px;border:1px solid #aaa;border-radius:10px;background:#fff;color:#333;font-size:28px;line-height:1;cursor:pointer}
.termsCheck{display:flex;flex-direction:row;gap:10px;align-items:flex-start;margin:12px 0;font-size:30px;font-weight:700}
.termsCheck input{height:28px;width:28px;margin-top:4px}
.termsActions{display:flex;justify-content:flex-end;gap:12px;margin-top:18px}
@media (max-width:960px){h1{font-size:34px}h2{font-size:24px}.grid.two,.grid.three{grid-template-columns:1fr}input{font-size:18px;height:48px}form label{font-size:16px}button{font-size:16px;height:48px}}
`;
