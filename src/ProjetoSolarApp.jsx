import { useState } from "react";

const LEADS_STORAGE_KEY = "lr_indicator_leads_v1";

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

const onlyDigits = (value) => value.replace(/\D/g, "");

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (event) => {
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

    const leads = readLeads();
    saveLeads([lead, ...leads]);
    setSubmitted(true);
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

        <form onSubmit={handleSubmit}>
          <h2>Dados do cliente</h2>
          <div className="grid two">
            <label>Nome completo<input required name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} placeholder="Ex: João da Silva Gomes"/></label>
            <label>CPF ou CNPJ<input required name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} onBlur={(e) => fetchCompanyByCnpj(e.target.value)} /></label>
            <label>E-mail<input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="comprador@email.com.br"/></label>
            <label>Celular<input required name="celular" value={form.celular} onChange={handleChange} placeholder="(XX) 00000-0000"/></label>
            <label>Data de nascimento<input required name="dataNascimento" value={form.dataNascimento} onChange={handleChange} placeholder="DD/MM/AAAA"/></label>
            <label>Renda mensal<input required name="rendaMensal" value={form.rendaMensal} onChange={handleChange} placeholder="R$ 0,00"/></label>
            <label>Quanto paga de energia mensal<input required name="gastoEnergiaMensal" value={form.gastoEnergiaMensal} onChange={handleChange} placeholder="R$ 0,00"/></label>
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
@media (max-width:960px){h1{font-size:34px}h2{font-size:24px}.grid.two,.grid.three{grid-template-columns:1fr}input{font-size:18px;height:48px}form label{font-size:16px}button{font-size:16px;height:48px}}
`;
