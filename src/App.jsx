export default function App() {
  const whatsapp = "https://wa.me/558299390131";

  const services = [
    {
      title: "Grandes Projetos Solar",
      desc: "Desenvolvimento e execução de usinas solares de grande porte, otimizando o consumo e gerando economia significativa.",
      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Projetos Elétricos de Grande Porte",
      desc: "Engenharia e instalação de sistemas elétricos completos para indústrias e grandes comércios.",
      img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Execução de Grandes Instalações",
      desc: "Montagens e manutenção de subestações com foco em segurança, durabilidade e conformidade técnica.",
      img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Laudos, Consultoria e Perícia Judicial",
      desc: "Especialistas para laudos, consultoria de eficiência e perícias judiciais no setor elétrico.",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const reasons = [
    "Experiência comprovada com mais de 17 anos em engenharia e energia.",
    "Integrador WEG exclusivo, garantindo soluções de alta performance.",
    "Qualidade e eficiência para projetos residenciais, comerciais e industriais.",
    "Suporte completo do orçamento à manutenção e pós-venda.",
  ];

  return (
    <div className="site">
      <style>{css}</style>

      <header className="topbar">
        <div className="container topbarInner">
          <img src="/logo.png" className="logo" alt="LR Soluções Elétricas" />

          <nav className="menu">
            <a href="#inicio">Início</a>
            <a href="#servicos">Serviços</a>
            <a href="#sobre">Sobre</a>
            <a href="#diferenciais">Diferenciais</a>
            <a href="#contato">Contato</a>
          </nav>

          <a className="topCta" href={whatsapp} target="_blank" rel="noreferrer">Fale conosco</a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="overlay" />
        <div className="container heroContent">
          <span className="tag">LR SOLUÇÕES ELÉTRICAS</span>
          <h1>Seu Integrador WEG para Projetos de Energia Solar e Elétrica em Alagoas</h1>
          <p>
            Mais de 17 anos de excelência e a maior estrutura do estado, garantindo qualidade,
            eficiência e economia para o seu negócio.
          </p>
          <div className="heroBtns">
            <a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">Fale com um especialista</a>
            <a className="btn light" href="#contato">Solicite seu orçamento</a>
          </div>
        </div>
      </section>

      <section className="contactStrip container">
        <article><strong>Atendimento</strong><span>WhatsApp: 82 99939-0130</span></article>
        <article><strong>E-mail</strong><span>engenharialrsolar@gmail.com</span></article>
        <article><strong>Localização</strong><span>AL-110, Arapiraca - AL</span></article>
      </section>

      <main className="lightSection">
        <section id="servicos" className="container section">
          <span className="sectionTag">SERVIÇOS DA EMPRESA</span>
          <div className="sectionHead">
            <h2>Soluções Elétricas e Solares de Alta Performance para o seu negócio</h2>
            <a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">Fale com um especialista</a>
          </div>

          <div className="cards">
            {services.map((service) => (
              <article key={service.title} className="card">
                <img src={service.img} alt={service.title} />
                <div className="cardBody">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <a href={whatsapp} target="_blank" rel="noreferrer">Solicitar orçamento</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="sobre" className="container section split">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80"
            alt="Profissional em obra"
          />
          <div>
            <span className="sectionTag">SOBRE</span>
            <h2>LR Soluções Elétricas: Excelência e inovação em energia</h2>
            <p>
              Com mais de 17 anos de história, atuamos com projetos de energia solar, subestações,
              laudos técnicos e instalações industriais, oferecendo soluções completas e personalizadas.
            </p>
            <a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">Fale Conosco</a>
          </div>
        </section>

        <section className="container values" id="diferenciais">
          <article><h3>Missão</h3><p>Entregar soluções com alta qualidade, segurança e performance.</p></article>
          <article><h3>Visão</h3><p>Ser referência em engenharia elétrica e energia solar em Alagoas.</p></article>
          <article><h3>Valores</h3><p>Confiabilidade, compromisso e foco no resultado do cliente.</p></article>
        </section>

        <section className="section why">
          <div className="whyLeft">
            <h2>Por que a LR Soluções Elétricas é a escolha certa para seu projeto?</h2>
            <ul>
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
          <img
            src="https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1200&q=80"
            alt="Parceria fechada"
          />
        </section>

        <section id="contato" className="container finalCta">
          <h2>Pronto para transformar a energia do seu negócio?</h2>
          <p>E-mail: engenharialrsolar@gmail.com • Suporte: (82) 99939-0130</p>
          <a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">Fale conosco agora via WhatsApp</a>
        </section>
      </main>

      <footer className="footer">
        <div className="container footerInner">
          <img src="/logo.png" alt="LR" />
          <div>
            <h4>Contato</h4>
            <p>engenharialrsolar@gmail.com</p>
            <p>(82) 9 9939-0130</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const css = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#101216;color:#fff}
a{text-decoration:none;color:inherit}
.container{max-width:1150px;margin:0 auto;padding:0 18px}
.topbar{background:#f3651e;position:sticky;top:0;z-index:30}
.topbarInner{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:14px}
.logo{height:44px;background:#fff;border-radius:999px;padding:2px 8px}
.menu{display:flex;gap:18px;font-size:14px;font-weight:600}
.topCta{background:#fff;color:#f3651e;padding:10px 14px;border-radius:8px;font-weight:700;font-size:13px}
.hero{position:relative;min-height:560px;background:url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat}
.overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,18,22,.92),rgba(16,18,22,.55) 55%,rgba(16,18,22,.3))}
.heroContent{position:relative;padding:90px 18px;max-width:700px}
.tag,.sectionTag{display:inline-block;background:#f3651e;color:#fff;padding:4px 10px;font-size:11px;font-weight:800;letter-spacing:.06em}
h1{font-size:62px;line-height:1.02;margin:18px 0 14px}
.hero p{color:#efefef;max-width:58ch}
.heroBtns{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.btn{padding:12px 16px;border-radius:7px;font-weight:700;font-size:13px;display:inline-flex;align-items:center;justify-content:center}
.btn.primary{background:#f3651e;color:#fff}.btn.light{background:#fff;color:#111}
.contactStrip{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:-36px;position:relative;z-index:2}
.contactStrip article{background:#f3651e;border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:6px}.contactStrip span{font-size:13px}
.contactStrip article:nth-child(2){background:#15171c}
.lightSection{background:#efefef;color:#111;padding:60px 0}
.section{padding:34px 0}.sectionHead{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.section h2{font-size:44px;max-width:760px;margin:14px 0}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.card{background:#f3651e;border-radius:10px;overflow:hidden;color:#fff}.card img{width:100%;height:150px;object-fit:cover}.cardBody{padding:14px}.card h3{margin:0 0 8px;font-size:24px}.card p{font-size:13px;line-height:1.5}.card a{display:inline-block;margin-top:8px;background:#fff;color:#f3651e;padding:8px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase}
.split{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}.split img{width:100%;border-radius:10px}.split p{line-height:1.6;color:#333}
.values{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:22px 18px 50px}.values article{background:#f3651e;color:#fff;border-radius:10px;padding:20px;text-align:center}.values h3{margin:0 0 8px;font-size:30px}.values p{margin:0;font-size:13px}
.why{display:grid;grid-template-columns:1fr 1fr;align-items:stretch;padding:0}.whyLeft{background:#22252c;color:#fff;padding:40px 22px}.whyLeft h2{font-size:44px;margin:0 0 14px}.whyLeft ul{margin:0;padding-left:18px;display:grid;gap:10px;line-height:1.5}.why img{width:100%;height:100%;object-fit:cover;min-height:460px}
.finalCta{text-align:center;padding:60px 18px 70px}.finalCta h2{font-size:48px;margin:0 0 8px}.finalCta p{color:#444;margin-bottom:20px}
.footer{background:#101216;color:#fff;padding:36px 0}.footerInner{display:flex;justify-content:space-between;gap:20px;align-items:center}.footer img{height:72px;background:#f3651e;padding:6px;border-radius:8px}
@media (max-width:1000px){h1{font-size:44px}.cards{grid-template-columns:1fr 1fr}.split,.why,.contactStrip,.values{grid-template-columns:1fr}.menu{display:none}}
`;
