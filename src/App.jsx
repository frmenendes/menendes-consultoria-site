import { useCallback, useEffect, useState } from "react";
import { Icon, Reveal, SectionHead, Wordmark, Monogram, Counter } from "./components";
import { applyRouteSeo } from "./seo";
import {
  SITE, whatsappLink, SERVICES, VALUES, MISSION, VISION, STACK, CASES, PORTFOLIO,
} from "./data";

// ───────────────────────── Router mínimo ─────────────────────────
const normalize = (p) => (p !== "/" ? p.replace(/\/+$/, "") || "/" : "/");

function useRoute() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = useCallback((to) => {
    const next = normalize(to);
    if (next === normalize(window.location.pathname)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    applyRouteSeo(path);
  }, [path]);
  return [path, navigate];
}

// Link interno que preserva o comportamento nativo (nova aba, ctrl+clique).
function Link({ to, navigate, children, className, ...rest }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

const NAV = [
  { to: "/sobre", label: "Sobre nós" },
  { to: "/servicos", label: "O que fazemos" },
  { to: "/portfolio", label: "Portfólio" },
  { to: "/cases", label: "Cases" },
  { to: "/contato", label: "Contato" },
];

// ───────────────────────── Chrome ─────────────────────────
function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (to) => { setOpen(false); navigate(to); };

  return (
    <header className={`site-header${solid ? " solid" : ""}`}>
      <div className="wrap header-inner">
        <Link to="/" navigate={navigate} className="brand" aria-label={`${SITE.brand} — início`}>
          <Wordmark />
        </Link>

        <nav className="nav-desktop" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              navigate={navigate}
              className={path === item.to || path.startsWith(`${item.to}/`) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-cta">
          <a className="btn btn-primary btn-sm" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            Falar com a gente
          </a>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <Icon.x size={22} /> : <Icon.menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {NAV.map((item) => (
            <button key={item.to} onClick={() => go(item.to)}>{item.label}</button>
          ))}
          <a className="btn btn-primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            Falar com a gente
          </a>
        </div>
      )}
    </header>
  );
}

function Footer({ navigate }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Wordmark light size={20} />
          <p className="footer-about">
            Consultoria em tecnologia, cloud e dados. Da arquitetura à operação em produção.
          </p>
          <p className="footer-legal">
            {SITE.legalName}<br />
            CNPJ {SITE.cnpj}
          </p>
        </div>

        <div>
          <h4>Soluções</h4>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to="/servicos" navigate={navigate}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Empresa</h4>
          <ul>
            <li><Link to="/sobre" navigate={navigate}>Sobre nós</Link></li>
            <li><Link to="/portfolio" navigate={navigate}>Portfólio</Link></li>
            <li><Link to="/cases" navigate={navigate}>Cases</Link></li>
            <li><Link to="/contato" navigate={navigate}>Contato</Link></li>
            <li><Link to="/privacidade" navigate={navigate}>Política de Privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contato</h4>
          <ul>
            <li><a href={`tel:${SITE.phone.replace(/\D/g, "")}`}>{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li>{SITE.city}</li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>{year} © {SITE.brand}</span>
        <span>Publicado na borda da Cloudflare</span>
      </div>
    </footer>
  );
}

// ───────────────────────── Blocos reutilizáveis ─────────────────────────
function CTASection({ navigate }) {
  return (
    <section className="section cta-band">
      <div className="wrap cta-inner">
        <Reveal>
          <span className="eyebrow">Próximo passo</span>
          <h2>
            Vamos olhar sua operação <em>de perto</em>?
          </h2>
          <p>
            Uma conversa de 30 minutos costuma bastar para mapear onde está o gargalo —
            arquitetura, custo de nuvem, entrega ou dado. Sem compromisso e sem proposta genérica.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Falar no WhatsApp <Icon.arrow size={17} />
            </a>
            <Link className="btn btn-ghost-light" to="/contato" navigate={navigate}>
              Ver todos os contatos
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  const Ico = Icon[service.icon] || Icon.spark;
  return (
    <Reveal className="card service-card" delay={index * 60}>
      <span className="card-icon"><Ico size={22} /></span>
      <h3>{service.title}</h3>
      <p>{service.body}</p>
      <ul className="tick-list">
        {service.bullets.map((b) => (
          <li key={b}><Icon.check size={15} /> {b}</li>
        ))}
      </ul>
    </Reveal>
  );
}

function CaseCard({ item, navigate, index }) {
  return (
    <Reveal className="card case-card" delay={index * 80}>
      <span className="case-tag">{item.tag}</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="metric-row">
        {item.metrics.map((m) => (
          <div key={m.label} className="metric">
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <Link className="link-arrow" to={`/cases/${item.slug}`} navigate={navigate}>
        Ler o case <Icon.arrow size={16} />
      </Link>
    </Reveal>
  );
}

// ───────────────────────── Páginas ─────────────────────────
function Home({ navigate }) {
  return (
    <>
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap hero-inner">
          <Reveal>
            <span className="eyebrow">Consultoria em tecnologia · desde a arquitetura</span>
            <h1>
              A transformação digital da sua empresa começa <em>agora</em>.
            </h1>
            <p className="lede">
              Em um mundo em constante evolução, as empresas que sabem como se adaptar e inovar
              têm mais chances de sucesso. Cuidamos da nuvem, dos dados e da entrega — para que
              seu time cuide do produto.
            </p>
            <div className="btn-row">
              <a className="btn btn-primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Começar um projeto <Icon.arrow size={17} />
              </a>
              <Link className="btn btn-ghost-light" to="/cases" navigate={navigate}>
                Ver cases
              </Link>
            </div>
          </Reveal>

          <Reveal className="hero-stats" delay={180}>
            <div><strong><Counter to={16} suffix="+" /></strong><span>projetos entregues</span></div>
            <div><strong><Counter to={6} /></strong><span>frentes de atuação</span></div>
            <div><strong>AWS</strong><span>arquiteturas validadas</span></div>
            <div><strong>24/7</strong><span>operação monitorada</span></div>
          </Reveal>
        </div>
      </section>

      <section className="section stack-band">
        <div className="wrap">
          <p className="stack-label">Trabalhamos com as plataformas que sustentam sua operação</p>
          <div className="stack-marquee">
            {STACK.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      <section className="section" id="servicos">
        <div className="wrap">
          <SectionHead
            eyebrow="O que fazemos"
            title="Seis frentes, uma"
            accent="entrega só"
            sub="Da consultoria de arquitetura ao produto rodando em produção — normalmente com o mesmo time do início ao fim."
          />
          <div className="grid-3">
            {SERVICES.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <SectionHead
            eyebrow="Cases"
            title="Resultado com"
            accent="nome e sobrenome"
            sub="Três operações reais: uma consultoria corporativa, uma fintech e uma empresa de automação inteligente."
          />
          <div className="grid-3">
            {CASES.map((c, i) => <CaseCard key={c.slug} item={c} navigate={navigate} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal>
            <SectionHead
              eyebrow="Produto próprio"
              title="Criamos a"
              accent="Lupe Wedding"
              sub="Não é só consultoria: operamos um microSaaS nosso, do zero à produção."
            />
            <p>
              A Lupe Wedding é uma plataforma completa de planejamento e operação de casamentos —
              site do casal, RSVP, convidados, checklist, orçamento, documentos e colaboração com
              assessorias. Arquitetura multi-tenant, publicação na borda da Cloudflare e uma
              operação real com usuários todos os dias.
            </p>
            <p>
              É o mesmo rigor que aplicamos nos projetos de cliente — só que aqui a conta de
              nuvem, o suporte e o roadmap são nossos. Saber o que dói do outro lado muda a
              consultoria que entregamos.
            </p>
            <div className="btn-row">
              <a className="btn btn-outline" href="https://lupewedding.com.br" target="_blank" rel="noopener noreferrer">
                Conhecer a Lupe <Icon.arrowUpRight size={17} />
              </a>
              <Link className="btn btn-ghost" to="/portfolio" navigate={navigate}>
                Ver portfólio completo
              </Link>
            </div>
          </Reveal>

          <Reveal className="product-panel" delay={120}>
            <div className="panel-head">
              <Monogram size={26} />
              <span>lupewedding.com.br</span>
            </div>
            <ul className="panel-list">
              <li><Icon.check size={16} /> Multi-tenant com isolamento por evento</li>
              <li><Icon.check size={16} /> Site do casal, RSVP e gestão de convidados</li>
              <li><Icon.check size={16} /> Checklist, orçamento e documentos</li>
              <li><Icon.check size={16} /> Painel profissional para assessorias</li>
              <li><Icon.check size={16} /> Observabilidade e monitoramento de erros</li>
              <li><Icon.check size={16} /> Deploy contínuo na Cloudflare</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}

function Sobre({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="Sobre nós"
        title="Tecnologia como meio,"
        accent="resultado como fim"
        sub={`${SITE.legalName} — CNPJ ${SITE.cnpj}`}
      />

      <section className="section">
        <div className="wrap narrow">
          <Reveal>
            <p className="lede">
              Somos especialistas em análise de dados, desenvolvimento de sites, infraestrutura
              cloud e sistemas sob medida. Extraímos insights valiosos a partir de dados e
              trabalhamos com os principais players do mercado para entregar soluções confiáveis
              e escaláveis.
            </p>
            <p>
              A Menendes nasce da prática: anos conduzindo migrações de nuvem, desenhando esteiras
              de entrega e operando plataformas em produção. Não vendemos uma metodologia
              engessada — entramos no problema, medimos, decidimos com o time e ficamos até a
              solução sustentar sozinha.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap grid-2">
          <Reveal className="card statement">
            <span className="eyebrow">Missão</span>
            <p>{MISSION}</p>
          </Reveal>
          <Reveal className="card statement" delay={80}>
            <span className="eyebrow">Visão</span>
            <p>{VISION}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Valores"
            title="Seis pilares que"
            accent="guiam a atuação"
            sub="Acreditamos na tecnologia como meio para gerar valor real, com ética, excelência e parcerias que impulsionam resultados."
          />
          <div className="grid-3">
            {VALUES.map((v, i) => (
              <Reveal className="card value-card" key={v.title} delay={i * 60}>
                <span className="value-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <SectionHead eyebrow="Stack" title="As ferramentas que" accent="colocamos em produção" center />
          <div className="chip-grid">
            {STACK.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}

function Servicos({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="O que fazemos"
        title="Consultoria, nuvem, dados"
        accent="e produto"
        sub="Seis frentes que se combinam conforme o problema — nunca um pacote fechado."
      />
      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {SERVICES.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <SectionHead
            eyebrow="Como trabalhamos"
            title="Quatro etapas,"
            accent="sem surpresa no meio"
            center
          />
          <div className="grid-4">
            {[
              { n: "01", t: "Diagnóstico", d: "Entendemos o negócio, medimos o ambiente atual e mapeamos riscos e custos reais." },
              { n: "02", t: "Desenho", d: "Arquitetura de referência, escopo e prioridades acordadas por escrito antes de qualquer execução." },
              { n: "03", t: "Execução", d: "Implementação em ciclos curtos, com infraestrutura como código e entregas verificáveis." },
              { n: "04", t: "Operação", d: "Monitoramento, transferência de conhecimento e documentação para o time seguir sozinho." },
            ].map((s, i) => (
              <Reveal className="card step-card" key={s.n} delay={i * 70}>
                <span className="step-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}

function Portfolio({ navigate }) {
  const featured = PORTFOLIO.filter((p) => p.featured);
  const rest = PORTFOLIO.filter((p) => !p.featured);
  return (
    <>
      <PageHero
        eyebrow="Portfólio"
        title="Projetos entregues,"
        accent="no ar"
        sub="Saúde, logística, indústria, terceiro setor, marketplaces e produtos próprios."
      />
      <section className="section">
        <div className="wrap">
          {featured.map((p) => (
            <Reveal className="card featured-card" key={p.name}>
              <div>
                <span className="case-tag">{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.body}</p>
                {p.url && (
                  <a className="link-arrow" href={p.url} target="_blank" rel="noopener noreferrer">
                    Visitar o site <Icon.arrowUpRight size={16} />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
          <div className="grid-3 portfolio-grid">
            {rest.map((p, i) => (
              <Reveal className="card portfolio-card" key={p.name} delay={(i % 3) * 60}>
                <span className="case-tag">{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection navigate={navigate} />
    </>
  );
}

function CasesList({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="Cases"
        title="O que mudou"
        accent="de fato"
        sub="Desafio, solução e resultado — com a arquitetura aberta."
      />
      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {CASES.map((c, i) => <CaseCard key={c.slug} item={c} navigate={navigate} index={i} />)}
          </div>
        </div>
      </section>
      <CTASection navigate={navigate} />
    </>
  );
}

function CaseDetail({ item, navigate }) {
  return (
    <>
      <section className="page-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap">
          <Reveal>
            <Link className="back-link" to="/cases" navigate={navigate}>← Todos os cases</Link>
            <span className="eyebrow">{item.tag}</span>
            <h1>{item.title}</h1>
            <p className="lede">{item.summary}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="metric-row metric-row-lg">
            {item.metrics.map((m) => (
              <div key={m.label} className="metric">
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap narrow article">
          <Reveal>
            <h2>O desafio</h2>
            <p>{item.challenge}</p>
          </Reveal>

          <Reveal>
            <h2>A solução</h2>
            <ul className="tick-list lg">
              {item.solution.map((s) => (
                <li key={s}><Icon.check size={16} /> {s}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2>Tecnologias</h2>
            <div className="chip-grid left">
              {item.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
            </div>
          </Reveal>

          <Reveal>
            <h2>Resultados</h2>
            <ul className="tick-list lg">
              {item.results.map((r) => (
                <li key={r}><Icon.check size={16} /> {r}</li>
              ))}
            </ul>
          </Reveal>

          {item.note && (
            <Reveal className="note"><Icon.spark size={18} /><p>{item.note}</p></Reveal>
          )}
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}

function Contato() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Conte o problema."
        accent="A gente responde."
        sub="Resposta em até um dia útil — normalmente bem antes."
      />
      <section className="section">
        <div className="wrap grid-3">
          <Reveal className="card contact-card">
            <span className="card-icon"><Icon.chat size={22} /></span>
            <h3>WhatsApp</h3>
            <p>O caminho mais rápido. Mande o contexto e agendamos uma conversa.</p>
            <a className="link-arrow" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              {SITE.phoneDisplay} <Icon.arrowUpRight size={16} />
            </a>
          </Reveal>
          <Reveal className="card contact-card" delay={70}>
            <span className="card-icon"><Icon.mail size={22} /></span>
            <h3>E-mail</h3>
            <p>Para propostas, documentação técnica e assuntos contratuais.</p>
            <a className="link-arrow" href={`mailto:${SITE.email}`}>
              {SITE.email} <Icon.arrowUpRight size={16} />
            </a>
          </Reveal>
          <Reveal className="card contact-card" delay={140}>
            <span className="card-icon"><Icon.pin size={22} /></span>
            <h3>Empresa</h3>
            <p>{SITE.legalName}<br />CNPJ {SITE.cnpj}</p>
            <span className="link-arrow static">{SITE.city}</span>
          </Reveal>
        </div>
      </section>
      <section className="section section-alt">
        <div className="wrap narrow center-block">
          <Reveal>
            <SectionHead
              eyebrow="Redes"
              title="Também estamos"
              accent="por aqui"
              center
            />
            <div className="btn-row center">
              <a className="btn btn-outline" href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="btn btn-outline" href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="btn btn-outline" href={SITE.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Privacidade() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Política de" accent="Privacidade" sub="Última atualização: fevereiro de 2026." />
      <section className="section">
        <div className="wrap narrow article">
          <h2>Quem é o controlador</h2>
          <p>
            {SITE.legalName}, inscrita no CNPJ sob o nº {SITE.cnpj}, é a controladora dos dados
            tratados neste site. Contato: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>

          <h2>Quais dados tratamos</h2>
          <ul className="tick-list lg">
            <li><Icon.check size={16} /> Dados de contato que você nos envia voluntariamente por e-mail ou WhatsApp (nome, telefone, e-mail e o conteúdo da mensagem).</li>
            <li><Icon.check size={16} /> Dados técnicos de navegação necessários à entrega e à segurança das páginas, como endereço IP e tipo de navegador, registrados pela infraestrutura de borda.</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Este site não utiliza cookies de publicidade nem de rastreamento de terceiros. Caso
            venhamos a adotar ferramentas de medição, esta política será atualizada e o
            consentimento será solicitado antes de qualquer carregamento.
          </p>

          <h2>Finalidade e base legal</h2>
          <p>
            Os dados de contato são usados exclusivamente para responder à sua solicitação e
            conduzir tratativas comerciais, com base no legítimo interesse e nos procedimentos
            preliminares de contrato. Os dados técnicos são tratados para garantir a segurança e
            a disponibilidade do serviço.
          </p>

          <h2>Compartilhamento</h2>
          <p>
            Não vendemos dados. Compartilhamos apenas com prestadores de infraestrutura
            necessários à operação do site (hospedagem e proteção na borda), sob obrigação
            contratual de confidencialidade.
          </p>

          <h2>Retenção</h2>
          <p>
            Mensagens de contato são mantidas pelo tempo necessário ao atendimento e às
            obrigações legais aplicáveis. Registros técnicos seguem os prazos padrão do provedor
            de infraestrutura.
          </p>

          <h2>Seus direitos</h2>
          <p>
            Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção,
            anonimização, portabilidade ou eliminação dos seus dados, além de revogar
            consentimento. Basta escrever para <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}

function NotFound({ navigate }) {
  return (
    <section className="page-hero tall">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap">
        <span className="eyebrow">Erro 404</span>
        <h1>Essa página <em>não existe</em>.</h1>
        <p className="lede">O link pode ter mudado de lugar. Vamos voltar ao começo?</p>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/" navigate={navigate}>Ir para a home</Link>
          <Link className="btn btn-ghost-light" to="/cases" navigate={navigate}>Ver cases</Link>
        </div>
      </div>
    </section>
  );
}

function PageHero({ eyebrow, title, accent, sub }) {
  return (
    <section className="page-hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title} {accent && <em>{accent}</em>}</h1>
          {sub && <p className="lede">{sub}</p>}
        </Reveal>
      </div>
    </section>
  );
}

// ───────────────────────── App ─────────────────────────
export default function App() {
  const [path, navigate] = useRoute();

  let page;
  if (path === "/") page = <Home navigate={navigate} />;
  else if (path === "/sobre") page = <Sobre navigate={navigate} />;
  else if (path === "/servicos") page = <Servicos navigate={navigate} />;
  else if (path === "/portfolio") page = <Portfolio navigate={navigate} />;
  else if (path === "/cases") page = <CasesList navigate={navigate} />;
  else if (path === "/contato") page = <Contato />;
  else if (path === "/privacidade") page = <Privacidade />;
  else if (path.startsWith("/cases/")) {
    const item = CASES.find((c) => c.slug === path.slice("/cases/".length));
    page = item ? <CaseDetail item={item} navigate={navigate} /> : <NotFound navigate={navigate} />;
  } else page = <NotFound navigate={navigate} />;

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header path={path} navigate={navigate} />
      <main id="conteudo">{page}</main>
      <Footer navigate={navigate} />
      <a
        className="wa-float"
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <Icon.chat size={24} />
      </a>
    </>
  );
}
