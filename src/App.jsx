import { useState } from "react";

const FIRST_GALLERY_IMAGE = "/logo.png";

export default function App() {
  const whatsapp = "https://wa.me/5582999390131";
  const [refName, setRefName] = useState("");
  const [refPhone, setRefPhone] = useState("");
  const [refCpf, setRefCpf] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [energyCost, setEnergyCost] = useState("");
  const stats = [
    { value: "+3.200", label: "Clientes atendidos" },
    { value: "+2.000", label: "Usinas solares instaladas" },
    { value: "17.200.000", label: "kWh gerados por ano" },
    { value: "+18", label: "Anos de experiência" },
  ];

  const highlights = [
    "Maior empresa de energia solar de Alagoas",
    "Maior sistema solar Grid Zero do Brasil",
    "Única integradora WEG no estado",
    "Equipe 100% própria (engenharia, execução, vendas e pós-venda)",
    "Projetos personalizados, eficientes e sustentáveis",
  ];

  const services = [
    {
      title: "Energia Solar",
      desc: "Sistemas fotovoltaicos completos: projeto, instalação e homologação com foco em performance e retorno.",
      icon: "☀️",
    },
    {
      title: "Subestações",
      desc: "Projeto, montagem, comissionamento e manutenção de média e alta tensão com segurança e confiabilidade.",
      icon: "🏭",
    },
    {
      title: "Laudos Elétricos",
      desc: "Laudos e medições com instrumentos específicos para conformidade e diagnóstico preciso.",
      icon: "📋",
    },
    {
      title: "Consultoria Especializada",
      desc: "Diagnóstico energético, otimização de sistemas e redução de custos operacionais com engenharia.",
      icon: "⚙️",
    },
    {
      title: "Perícia Judicial",
      desc: "Assistência técnica em processos judiciais e extrajudiciais com pareceres e laudos fundamentados.",
      icon: "⚖️",
    },
    {
      title: "Recarga Veicular",
      desc: "Implantação de estações de recarga para veículos elétricos em condomínios, empresas e comércios.",
      icon: "🔌",
    },
  ];

  const galleryImages = [
    { src: FIRST_GALLERY_IMAGE, alt: "Usina solar em solo com fileiras de painéis" },
    { src: "/projetos/projeto-02.jpg", alt: "Sistema fotovoltaico em cobertura comercial" },
    { src: "/projetos/projeto-03.jpg", alt: "Painéis solares em cobertura rural" },
    { src: "/projetos/projeto-04.jpg", alt: "Usina solar com estrutura em solo" },
    { src: "/projetos/projeto-05.jpg", alt: "Instalação de painéis em cobertura industrial" },
    { src: "/projetos/projeto-06.jpg", alt: "Equipe técnica em atividade elétrica" },
    { src: "/projetos/projeto-07.jpg", alt: "Logística de equipamentos para instalação solar" },
    { src: "/projetos/projeto-08.jpg", alt: "Transformador em subestação" },
    { src: "/projetos/projeto-09.jpg", alt: "Manutenção em painel elétrico" },
    { src: "/projetos/projeto-10.jpg", alt: "Sistema residencial com equipe em campo" },
    { src: "/projetos/projeto-11.jpg", alt: "Cobertura solar noturna" },
    { src: "/projetos/projeto-12.jpg", alt: "Medição térmica em painel elétrico" },
  ];

  const referralMessage = encodeURIComponent(
    `Olá! Quero solicitar um orçamento.

Indicação:
Nome: ${refName || "Não informado"}
Número: ${refPhone || "Não informado"}
CPF: ${refCpf || "Não informado"}

Novo cliente:
Nome: ${clientName || "Não informado"}
Telefone: ${clientPhone || "Não informado"}
Gasto mensal de energia: ${energyCost || "Não informado"}`,
  );
  const whatsappReferralLink = `${whatsapp}?text=${referralMessage}`;

  return (
    <div className="page">
      <style>{css}</style>

      {/* Topbar */}
      <header className="topbar">
        <div className="container topbarInner">
          <a className="brand" href="#inicio" aria-label="LR Soluções Elétricas">
            <img className="brandLogo" src="/logo.png" alt="LR Soluções Elétricas" />
          </a>

          <nav className="nav">
            <a href="#especialidades">Especialidades</a>
            <a href="#numeros">Números</a>
            <a href="#galeria">Galeria</a>
            <a className="navBtn" href={whatsapp} target="_blank" rel="noreferrer">
              Orçamento no WhatsApp
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="hero">
        <div className="container heroGrid">
          <div className="heroLeft">
            <div className="pill">
              <span className="pillDot" />
              Engenharia Elétrica • Energia Solar
            </div>

            <h1>
              Engenharia de Alta Performance
              <span className="h1Accent"> com foco em segurança e resultado</span>.
            </h1>

            <p className="subtitle">
              Soluções completas em engenharia elétrica e energia solar — do projeto à execução industrial,
              com equipe própria e padrão técnico.
            </p>

            <div className="ctaRow">
              <a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">
                Solicitar orçamento
              </a>
              <a className="btn ghost" href="#especialidades">
                Ver especialidades
              </a>
            </div>

            <div className="chips">
              {highlights.slice(0, 4).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div className="heroRight">
            <div className="panelTitle">Atendimento em todo o Brasil</div>
            <div className="panelText">
              Projetos para clientes residenciais, comerciais e industriais — com foco em confiabilidade,
              eficiência energética e retorno.
            </div>

            <div className="stats" id="numeros">
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="statValue">{s.value}</div>
                  <div className="statLabel">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="panelCta">
              <div className="panelCtaText">
                <strong>Pronto para iniciar seu projeto?</strong>
                <span>Fale com nossa equipe técnica agora.</span>
              </div>
              <a className="btn small primary" href={whatsapp} target="_blank" rel="noreferrer">
                Falar agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <main className="container">
        <section id="especialidades" className="section">
          <div className="sectionHead">
            <h2>Nossas Especialidades</h2>
            <p>
              Projetos personalizados, eficientes e sustentáveis — seguindo normas técnicas e boas práticas.
            </p>
          </div>

          <div className="cards">
            {services.map((srv) => (
              <article className="card" key={srv.title}>
                <div className="cardTop">
                  <div className="icon">{srv.icon}</div>
                  <h3>{srv.title}</h3>
                </div>
                <p>{srv.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section className="section">
          <div className="ctaBand">
            <div className="ctaBandText">
              <h2>Diferenciais que fazem a diferença</h2>
              <ul>
                {highlights.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="ctaBandBox">
              <div className="ctaBandBoxTitle">Orçamento rápido</div>
              <div className="ctaBandBoxText">
                Envie sua demanda e receba atendimento direto no WhatsApp.
              </div>
              <a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="galeria" className="section">
          <div className="sectionHead">
            <h2>Galeria de Projetos</h2>
            <p>
              Um recorte dos serviços executados pela nossa equipe em energia solar, subestações e manutenção
              elétrica.
            </p>
          </div>

          <div className="galleryGrid">
            {galleryImages.map((item, index) => (
              <figure className="galleryItem" key={item.src}>
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/logo.png";
                  }}
                />
                <figcaption>Projeto {String(index + 1).padStart(2, "0")}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Widget */}
        <section id="atendimento" className="section">
          <div className="sectionHead">
            <h2>Atendimento por voz</h2>
            <p>Se preferir, fale com nosso agente de voz para iniciar o atendimento.</p>
          </div>

          <div className="widgetWrap">
            <voiceai-widget
              id="V2ViV2lkZ2V0VHlwZTpZd2RYNnc3"
              host="callx.aceleradoramx3.com"
            ></voiceai-widget>
          </div>
        </section>

        {/* CTA final */}
        <section className="section">
          <div className="finalCta">
            <div>
              <h2>Vamos começar?</h2>
              <p>
                Entre em contato diretamente com nossa equipe técnica e receba um orçamento.
              </p>
              <div className="meta">
                <div>
                  <strong>Responsável Técnico:</strong> Eng. Eletricista Laerte Ramon Santos Oliveira
                </div>
                <div>
                  <strong>CREA:</strong> 0221926780 • <strong>CNPJ:</strong> 37.266.810/0001-02
                </div>
              </div>
            </div>

            <form className="referralForm">
              <div className="referralFormTitle">Quem indicou você?</div>
              <label htmlFor="refName">Nome</label>
              <input
                id="refName"
                type="text"
                value={refName}
                onChange={(event) => setRefName(event.target.value)}
                placeholder="Nome da pessoa que indicou"
              />

              <label htmlFor="refPhone">Número</label>
              <input
                id="refPhone"
                type="tel"
                value={refPhone}
                onChange={(event) => setRefPhone(event.target.value)}
                placeholder="(82) 99999-9999"
              />

              <label htmlFor="refCpf">CPF</label>
              <input
                id="refCpf"
                type="text"
                value={refCpf}
                onChange={(event) => setRefCpf(event.target.value)}
                placeholder="000.000.000-00"
              />

              <div className="referralDivider" aria-hidden="true" />

              <div className="referralFormTitle">Dados do novo cliente</div>
              <label htmlFor="clientName">Nome</label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Nome completo do cliente"
              />

              <label htmlFor="clientPhone">Telefone</label>
              <input
                id="clientPhone"
                type="tel"
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                placeholder="(82) 99999-9999"
              />

              <label htmlFor="energyCost">Quanto gasta de energia</label>
              <input
                id="energyCost"
                type="text"
                value={energyCost}
                onChange={(event) => setEnergyCost(event.target.value)}
                placeholder="Ex: R$ 650/mês"
              />

              <a className="btn primary" href={whatsappReferralLink} target="_blank" rel="noreferrer">
                Enviar dados e solicitar orçamento
              </a>
            </form>
          </div>
        </section>
      </main>


      <footer className="footer">
        <div className="container footerInner">
          <span>© {new Date().getFullYear()} LR Soluções Elétricas — Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}

const css = `
:root{
  --brand:#F28C28;
  --brandDark:#C85A14;
  --accent:#FFD200;

  --bg:#0b0b0c;
  --panel:#111114;
  --card:#141419;
  --text:#ffffff;
  --muted:rgba(255,255,255,.78);
  --line:rgba(255,255,255,.12);
  --shadow: 0 18px 50px rgba(0,0,0,.35);
}

*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  background:
    radial-gradient(900px 520px at 12% 12%, rgba(242,140,40,.35), transparent 62%),
    radial-gradient(800px 520px at 88% 18%, rgba(255,210,0,.22), transparent 60%),
    linear-gradient(180deg, #09090a, #101012);
  color:var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}
a{color:inherit;text-decoration:none}
.page{min-height:100vh}

.container{max-width:1120px;margin:0 auto;padding:0 20px}

/* Topbar */
.topbar{
  position:sticky;
  top:0;
  z-index:40;
  backdrop-filter: blur(10px);
  background: rgba(10,10,12,.55);
  border-bottom:1px solid var(--line);
}
.topbarInner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 0;
  gap:14px;
}
.brand{display:flex; align-items:center}
.brandLogo{
  height:48px;
  width:auto;
  border-radius:14px;
  box-shadow: 0 10px 24px rgba(0,0,0,.35);
  border: 1px solid rgba(255,255,255,.10);
}
.nav{display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:flex-end}
.nav a{color:var(--muted); font-weight:700; font-size:14px}
.nav a:hover{color:var(--text)}
.navBtn{
  padding:10px 12px;
  border-radius:12px;
  font-weight:900;
  color:#1b120a !important;
  background: linear-gradient(135deg, var(--brand), var(--brandDark));
  border: 1px solid rgba(0,0,0,.08);
}

/* Hero */
.hero{padding:46px 0 10px}
.heroGrid{
  display:grid;
  grid-template-columns: 1.12fr .88fr;
  gap:18px;
  align-items:stretch;
}
.heroLeft{padding-top:6px}

.pill{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:8px 12px;
  border-radius:999px;
  border:1px solid var(--line);
  background: rgba(255,255,255,.03);
  color:var(--muted);
  font-size:13px;
  font-weight:800;
}
.pillDot{
  width:10px;height:10px;border-radius:999px;
  background: linear-gradient(135deg, var(--accent), var(--brand));
  box-shadow: 0 0 0 3px rgba(255,210,0,.12);
}

h1{
  margin:14px 0 12px;
  font-size:54px;
  line-height:1.03;
  letter-spacing:-.02em;
}
.h1Accent{color: rgba(255,255,255,.88)}

.subtitle{
  margin:0 0 18px;
  color:var(--muted);
  font-size:18px;
  line-height:1.6;
  max-width:64ch;
}

.ctaRow{display:flex; gap:12px; flex-wrap:wrap; margin: 10px 0 16px}
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:12px 16px;
  border-radius:14px;
  border:1px solid var(--line);
  background: rgba(255,255,255,.03);
  font-weight:1000;
  transition: transform .12s ease, background .12s ease, border-color .12s ease, filter .12s ease;
}
.btn:hover{transform: translateY(-1px); background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.18)}
.btn.primary{
  color:#1b120a;
  background: linear-gradient(135deg, var(--brand), var(--brandDark));
  border-color: transparent;
  box-shadow: 0 14px 34px rgba(242,140,40,.18);
}
.btn.primary:hover{filter: brightness(1.05)}
.btn.ghost{background:transparent}
.btn.small{padding:10px 14px; border-radius:12px; font-size:14px}

.chips{display:flex; gap:10px; flex-wrap:wrap; margin-top:8px}
.chips span{
  font-size:13px;
  color: rgba(255,255,255,.82);
  padding:8px 10px;
  border-radius:999px;
  background: rgba(255,255,255,.03);
  border: 1px dashed rgba(255,255,255,.18);
}

/* Right panel */
.heroRight{
  background: rgba(255,255,255,.03);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 18px;
  display:flex;
  flex-direction:column;
  gap:12px;
}
.panelTitle{font-weight:1000; font-size:16px}
.panelText{color:var(--muted); font-size:14px; line-height:1.5}

.stats{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:10px;
}
.stat{
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 16px;
  padding: 12px;
}
.statValue{font-size:22px; font-weight:1100; letter-spacing:-.01em}
.statLabel{margin-top:4px; font-size:12px; color:var(--muted)}

.panelCta{
  margin-top:auto;
  padding-top:12px;
  border-top:1px solid var(--line);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
}
.panelCtaText{color:var(--muted); font-size:13px; line-height:1.3}
.panelCtaText span{display:block; color:var(--text); font-weight:1000; margin-top:4px}

/* Sections */
.section{padding:44px 0}
.sectionHead h2{margin:0 0 8px; font-size:34px; letter-spacing:-.01em}
.sectionHead p{margin:0; color:var(--muted); line-height:1.6; max-width:76ch}

.cards{
  margin-top:18px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:14px;
}
.card{
  background: linear-gradient(135deg, rgba(242,140,40,.08), rgba(255,210,0,.06));
  border: 1px solid rgba(242,140,40,.22);
  border-radius: 20px;
  padding: 18px;
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.card:hover{
  transform: translateY(-3px);
  border-color: rgba(255,210,0,.42);
  box-shadow: 0 0 18px rgba(242,140,40,.18);
}
.cardTop{display:flex; align-items:center; gap:10px; margin-bottom:8px}
.icon{
  width:34px; height:34px;
  display:flex; align-items:center; justify-content:center;
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.10);
}
.card h3{margin:0; font-size:18px; font-weight:1000}
.card p{margin:0; color:var(--muted); line-height:1.55; font-size:14px}

/* Band */
.ctaBand{
  display:grid;
  grid-template-columns: 1.25fr .75fr;
  gap:14px;
  align-items:stretch;
}
.ctaBandText{
  background: rgba(255,255,255,.03);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 20px;
}
.ctaBandText h2{margin:0 0 10px; font-size:28px}
.ctaBandText ul{margin:0; padding-left:18px; color:var(--muted); line-height:1.8}
.ctaBandBox{
  background: linear-gradient(135deg, rgba(242,140,40,.18), rgba(255,210,0,.10));
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 22px;
  padding: 20px;
  display:flex;
  flex-direction:column;
  gap:10px;
  justify-content:space-between;
}
.ctaBandBoxTitle{font-weight:1100; font-size:16px}
.ctaBandBoxText{color:var(--muted); line-height:1.5}

/* Widget */
.widgetWrap{
  margin-top:14px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 14px;
}

/* Gallery */
.galleryGrid{
  margin-top:18px;
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap:12px;
}
.galleryItem{
  margin:0;
  border:1px solid var(--line);
  border-radius: 16px;
  overflow:hidden;
  background: rgba(255,255,255,.03);
}
.galleryItem img{
  width:100%;
  height:220px;
  object-fit:cover;
  display:block;
}
.galleryItem figcaption{
  padding:10px 12px;
  font-size:12px;
  color:var(--muted);
  border-top:1px solid rgba(255,255,255,.08);
}

/* Final CTA */
.finalCta{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
  padding: 22px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.12);
  background: linear-gradient(135deg, rgba(242,140,40,.18), rgba(255,210,0,.10));
}
.finalCta h2{margin:0 0 6px}
.finalCta p{margin:0 0 12px; color:var(--muted); line-height:1.6}
.meta{color: rgba(255,255,255,.88); font-size:13px; display:flex; flex-direction:column; gap:6px}

.referralForm{
  width: min(100%, 360px);
  display:flex;
  flex-direction:column;
  gap:8px;
  padding:16px;
  border:1px solid rgba(255,255,255,.14);
  border-radius:16px;
  background: rgba(0,0,0,.16);
}
.referralFormTitle{
  font-size:15px;
  font-weight:1000;
  margin-bottom:4px;
}
.referralDivider{
  height:1px;
  background: rgba(255,255,255,.14);
  margin:6px 0 2px;
}
.referralForm label{
  color:var(--muted);
  font-size:12px;
  font-weight:700;
}
.referralForm input{
  border-radius:10px;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.03);
  color:var(--text);
  padding:10px 12px;
  font-size:14px;
}



/* Footer */
.footer{
  border-top:1px solid var(--line);
  padding:18px 0;
  color:var(--muted);
  font-size:13px;
}
.footerInner{display:flex; justify-content:center; text-align:center}

/* Responsive */
@media (max-width: 980px){
  h1{font-size:40px}
  .heroGrid{grid-template-columns:1fr}
  .cards{grid-template-columns:1fr}
  .ctaBand{grid-template-columns:1fr}
  .galleryGrid{grid-template-columns:1fr}
  .nav{gap:10px}
}
`;
