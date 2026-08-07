// Menendes Consulting — fonte única de conteúdo do site institucional.
// Portfólio e cases herdados da operação Datarock, reescritos sob a marca.

export const SITE = {
  brand: "Menendes Consulting",
  legalName: "Menendes Consultoria em TI Ltda.",
  cnpj: "67.659.396/0001-54",
  // ATENÇÃO: domínio canônico do site. Trocar aqui reflete em canonical,
  // og:url, sitemap.xml e no redirect www -> apex do worker.
  url: "https://menendesconsulting.com.br",
  phone: "+55 11 93427-1420",
  phoneDisplay: "(11) 93427-1420",
  whatsapp: "5511934271420",
  email: "contato@menendesconsulting.com.br",
  city: "São Paulo, SP — Brasil",
  social: {
    linkedin: "https://www.linkedin.com/company/menendes-consulting",
    instagram: "https://www.instagram.com/menendesconsulting",
    github: "https://github.com/frmenendes",
  },
};

export const whatsappLink = (msg = "Olá! Vim pelo site da Menendes Consulting e quero falar sobre um projeto.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

// ───────── O que fazemos ─────────
export const SERVICES = [
  {
    slug: "consultoria",
    icon: "compass",
    title: "Consultoria",
    short: "Diagnóstico, arquitetura e direção técnica.",
    body:
      "Apoio especializado no desenho, na evolução e na gestão da sua operação técnica — da arquitetura de referência à priorização do roadmap. Entramos onde o time precisa de decisão embasada, não de mais uma camada de processo.",
    bullets: [
      "Diagnóstico de arquitetura e de custos",
      "Revisão AWS Well-Architected",
      "Direção técnica e apoio a decisões de stack",
      "Governança de contas, acessos e ambientes",
    ],
  },
  {
    slug: "dados",
    icon: "chart",
    title: "Serviço de dados",
    short: "Coleta, modelagem e leitura estratégica.",
    body:
      "Coleta e análise de dados para transformar operação em insight. Pipelines, modelagem e painéis que respondem perguntas de negócio — não dashboards bonitos que ninguém abre.",
    bullets: [
      "Pipelines de ingestão e transformação",
      "Modelagem analítica e data warehouse",
      "Dashboards e indicadores operacionais",
      "Observabilidade de produto e de negócio",
    ],
  },
  {
    slug: "cloud",
    icon: "cloud",
    title: "Infraestrutura Cloud",
    short: "Migração e arquiteturas escaláveis.",
    body:
      "Migração de servidores e desenho de ambientes elásticos em AWS, Google Cloud e Cloudflare. Infraestrutura que cresce com a demanda e que qualquer pessoa do time consegue recriar do zero.",
    bullets: [
      "Migração de VMs para containers e Kubernetes",
      "Infraestrutura como código (Terraform, Pulumi)",
      "Multi-conta, redes, WAF e SSO",
      "Otimização de custo em nuvem (FinOps)",
    ],
  },
  {
    slug: "sites",
    icon: "globe",
    title: "Desenvolvimento de Sites",
    short: "Presença digital rápida e bem indexada.",
    body:
      "Sites institucionais, catálogos e landing pages com performance, SEO técnico e integração de contato. Construídos para carregar rápido na borda e para serem encontrados.",
    bullets: [
      "Sites responsivos e acessíveis",
      "SEO técnico, Core Web Vitals e dados estruturados",
      "Publicação na borda (Cloudflare)",
      "Integração com WhatsApp, CRM e analytics",
    ],
  },
  {
    slug: "apps",
    icon: "layers",
    title: "Desenvolvimento de apps",
    short: "Plataformas, painéis e microSaaS.",
    body:
      "Soluções web sob medida: painéis administrativos, portais de cliente e produtos microSaaS completos — do primeiro protótipo à operação com usuários pagantes.",
    bullets: [
      "Aplicações web e painéis administrativos",
      "APIs, integrações e automações",
      "Produtos microSaaS multi-tenant",
      "Autenticação, permissões e trilhas de auditoria",
    ],
  },
  {
    slug: "devops",
    icon: "infinity",
    title: "DevOps",
    short: "Entrega contínua com segurança.",
    body:
      "Infraestrutura automatizada com esteiras de CI/CD, GitOps e observabilidade. Deploy deixa de ser evento de risco e passa a ser rotina.",
    bullets: [
      "Pipelines CI/CD (GitHub Actions)",
      "GitOps com Argo CD",
      "Monitoramento, logs e alertas",
      "Ambientes segregados e rollback seguro",
    ],
  },
];

// ───────── Pilares (Sobre) ─────────
export const VALUES = [
  { title: "Inovação", body: "Busca constante por novas tecnologias — e critério para saber quando elas valem a pena." },
  { title: "Transparência", body: "Atuação com clareza e ética: escopo, custo e risco ditos por inteiro, antes." },
  { title: "Qualidade", body: "Entregas eficientes e seguras, com o mesmo cuidado no que aparece e no que sustenta." },
  { title: "Comprometimento", body: "Foco em resultado. O projeto termina quando funciona em produção, não quando o código sobe." },
  { title: "Foco no Cliente", body: "Soluções personalizadas para o problema real do negócio, não para o catálogo do fornecedor." },
  { title: "Colaboração", body: "Valorização de parcerias — com o time do cliente, com fornecedores e com a comunidade técnica." },
];

export const MISSION =
  "Oferecer soluções digitais inteligentes e personalizadas que impulsionem negócios por meio de tecnologia, inovação e dados estratégicos.";

export const VISION =
  "Ser referência em consultoria tecnológica e transformação digital, reconhecida pela excelência em desenvolvimento, cloud computing e inovação orientada por dados.";

// ───────── Stack ─────────
export const STACK = [
  "AWS", "Google Cloud", "Cloudflare", "Kubernetes", "Docker",
  "Terraform", "Pulumi", "Argo CD", "GitHub Actions", "Grafana",
  "Datadog", "Redis", "PostgreSQL", "React",
];

// ───────── Cases ─────────
export const CASES = [
  {
    slug: "frst-falconi-cloud-native",
    client: "FRST Falconi",
    tag: "Cloud-native · Kubernetes · GitOps",
    title:
      "Transformação cloud-native para a FRST Falconi: Kubernetes, GitOps com Argo CD e DevOps de alta performance",
    summary:
      "Modernização da infraestrutura de uma plataforma de desenvolvimento organizacional: saída de VMs para um ecossistema cloud-native em Amazon EKS, com entrega contínua governada por Git.",
    metrics: [
      { value: "EKS", label: "Kubernetes gerenciado com IaC" },
      { value: "GitOps", label: "Git como fonte da verdade" },
      { value: "4", label: "contas AWS segregadas" },
    ],
    challenge:
      "A FRST Falconi precisava sair de uma infraestrutura baseada em máquinas virtuais na AWS para um ecossistema cloud-native moderno e escalável. A organização buscava uma infraestrutura tecnológica que espelhasse sua própria inovação, lidando com a complexidade de uma arquitetura de microsserviços e garantindo a segurança dos dados.",
    solution: [
      "Amazon EKS provisionado com eksctl e Terraform, tratando o cluster Kubernetes como infraestrutura como código.",
      "GitHub Actions com pipelines de CI/CD granulares, separados por repositório de API e de microfrontends.",
      "Argo CD para entrega contínua em modelo GitOps, com o Git como fonte única da verdade.",
      "Arquitetura híbrida equilibrando cargas em EKS e Amazon ECS conforme o perfil de cada serviço.",
      "Elasticsearch para monitoramento e observabilidade de ponta a ponta.",
      "Estrutura multi-conta na AWS, segregando Dados, AppTools, Produção e Desenvolvimento.",
      "Camadas de segurança com AWS WAF e AWS SSO.",
    ],
    stack: ["Amazon EKS", "Argo CD", "Terraform", "GitHub Actions", "Elasticsearch", "Amazon ECS", "AWS WAF", "AWS SSO"],
    results: [
      "Frequência de deploy acelerada, com mais segurança e menor risco de erro manual.",
      "Escalabilidade dinâmica e resiliência pela arquitetura Kubernetes.",
      "Ciclo de desenvolvimento encurtado pelas esteiras automatizadas de CI/CD.",
      "Confiabilidade operacional maior pela automação GitOps.",
      "Segurança e governança robustas via segregação de contas e controle de acessos.",
    ],
  },
  {
    slug: "magie-escalabilidade",
    client: "Magie",
    tag: "Fintech · ECS · IaC",
    title:
      "Menendes impulsiona a Magie ao futuro: escalabilidade e agilidade para o primeiro banco via WhatsApp",
    summary:
      "Saída de uma instância única com Docker Compose para uma arquitetura elástica em Amazon ECS, com infraestrutura recriável por código e entrega contínua automatizada.",
    metrics: [
      { value: "~30 min", label: "para recriar toda a infraestrutura" },
      { value: "1 → N", label: "de instância única a ECS elástico" },
      { value: "CI/CD", label: "build, teste e deploy automatizados" },
    ],
    challenge:
      "A Magie, fintech que oferece uma experiência bancária completa dentro do WhatsApp, operava sua infraestrutura em uma única instância na AWS, utilizando Docker Compose. O modelo não entregava a escalabilidade, a resiliência e a agilidade de desenvolvimento exigidas por uma expansão acelerada no setor financeiro.",
    solution: [
      "Migração das APIs conteinerizadas de Docker Compose para o Amazon ECS gerenciado.",
      "Esteira de CI/CD no GitHub Actions cobrindo build, teste e deploy.",
      "Application Load Balancers protegidos por AWS WAF.",
      "Infraestrutura como código com Pulumi — todo o ambiente recriável em aproximadamente 30 minutos.",
      "Amazon MSK e RabbitMQ para processamento assíncrono e filas de mensagens.",
      "Observabilidade completa com Datadog.",
    ],
    stack: ["Amazon ECS", "GitHub Actions", "AWS WAF", "Pulumi", "Amazon MSK", "RabbitMQ", "Datadog", "AWS Well-Architected"],
    results: [
      "Escalabilidade dinâmica para acompanhar o crescimento da base de usuários e do volume transacional.",
      "Maior confiabilidade e continuidade do serviço.",
      "Ciclos de desenvolvimento acelerados pela entrega automatizada.",
      "Segurança em múltiplas camadas.",
      "Menos esforço operacional graças à automação da infraestrutura.",
    ],
    note:
      "Projeto conduzido sob a liderança do consultor Felipe Menendes.",
  },
  {
    slug: "runflow-aws",
    client: "Runflow",
    tag: "AWS · Documentação técnica",
    title:
      "A jornada de documentação e validação técnica com a AWS: Runflow e Menendes",
    summary:
      "Organização, documentação e evidenciação da arquitetura existente para habilitar a Runflow em programas avançados da AWS — sem alterar uma linha do ambiente.",
    metrics: [
      { value: "3", label: "fases: organizar, preparar, submeter" },
      { value: "0", label: "mudanças no ambiente do cliente" },
      { value: "AWS", label: "programa avançado habilitado" },
    ],
    challenge:
      "A Runflow, empresa de automação inteligente, precisava participar de programas avançados da AWS. Isso exigia documentar a arquitetura existente, organizar evidências, padronizar informações técnicas e conduzir a submissão conforme os requisitos formais do programa.",
    solution: [
      "Organização técnica: estruturação do material AWS, documentação detalhada da arquitetura, geração de evidências via CLI, diagramas, políticas IAM e padronização de terminologia.",
      "Preparação dos artefatos: seleção das cargas de trabalho adequadas à validação, consolidação das informações técnicas exigidas, revisão dos requisitos do programa e formatação para submissão oficial.",
      "Acompanhamento completo: condução da comunicação técnica com a AWS, ajustes rápidos a partir das recomendações e acompanhamento de todas as etapas até a conclusão.",
    ],
    stack: ["AWS", "AWS CLI", "IAM", "Kubernetes", "Argo CD"],
    results: [
      "Documentação técnica completa, precisa e clara.",
      "Processo de inscrição conduzido de forma estruturada e profissional.",
      "Aderência às boas práticas da AWS demonstrada com sucesso.",
      "Relação com o time fortalecida e caminho aberto para próximos avanços.",
      "Mais visibilidade e reconhecimento dentro do ecossistema AWS.",
    ],
    note:
      "O trabalho não alterou o ambiente da Runflow — apenas organizou, documentou e evidenciou práticas que já existiam, de forma clara e objetiva.",
  },
];

// ───────── Portfólio ─────────
export const PORTFOLIO = [
  {
    name: "Lupe Wedding",
    category: "Produto próprio · microSaaS",
    featured: true,
    url: "https://lupewedding.com.br",
    body:
      "Plataforma completa de planejamento e operação de casamentos, criada e mantida pela Menendes: site do casal, RSVP, convidados, checklist, orçamento, documentos e colaboração com assessorias. Produto multi-tenant do zero à produção, publicado na borda da Cloudflare.",
  },
  {
    name: "FRST Falconi",
    category: "Plataforma corporativa",
    body:
      "Plataforma de aprendizagem corporativa com trilhas personalizadas, dashboards em tempo real e integração com WhatsApp para desenvolvimento de times.",
  },
  {
    name: "Blog FRST Falconi",
    category: "Conteúdo · SEO",
    body:
      "Espaço de conteúdo com design responsivo, otimização para SEO e integração com CMS para gestão dos artigos.",
  },
  {
    name: "Instacarro",
    category: "Marketplace",
    body:
      "Plataforma de venda de veículos com feed de notícias, manuais, filtros de busca avançados e interface limpa para melhorar a experiência do usuário.",
  },
  {
    name: "Instituto Janeth Arcain",
    category: "Terceiro setor",
    body:
      "Site de engajamento destacando metodologia, projetos, oportunidades de patrocínio e atendimento por WhatsApp para iniciativas de esporte social.",
  },
  {
    name: "GeneID",
    category: "Saúde",
    body:
      "Site de clínica de genética com diagnósticos, terapia ABA, agendamento online e presencial e integração com WhatsApp em cobertura nacional.",
  },
  {
    name: "Dr. Pedro Castro",
    category: "Saúde",
    body:
      "Site acolhedor para geneticista especialista em autismo, com metodologia de avaliação, blog e agendamento de consultas por WhatsApp.",
  },
  {
    name: "Unitech",
    category: "TI B2B",
    body:
      "Site corporativo de TI com foco em soluções de datacenter para o setor público, catálogo de serviços, notícias e atendimento por WhatsApp.",
  },
  {
    name: "Vivalog",
    category: "Logística",
    body:
      "Plataforma de logística com entrega e coleta no mesmo dia, integração com marketplaces (Mercado Livre, Shopee), formulário de cotação e contato por WhatsApp.",
  },
  {
    name: "Infrawork",
    category: "Engenharia",
    body:
      "Site corporativo de engenharia e construção apresentando obras rápidas, manutenção predial, projetos sob medida, cases e contato por WhatsApp.",
  },
  {
    name: "DGP",
    category: "Automação industrial",
    body:
      "Plataforma de automação industrial destacando serviços sob medida, projetos de referência, formulário de contato e integração com WhatsApp.",
  },
  {
    name: "Gertec Metálica",
    category: "Indústria",
    body:
      "Site de especialista em serralheria (guarda-corpos, corrimãos, móveis metalizados) com catálogo de produtos, portfólio de obras e navegação intuitiva.",
  },
  {
    name: "PSR",
    category: "Catálogo",
    body:
      "Site catálogo de suprimentos para impressão — bobinas, etiquetas, ribbons e tags — com seção de notícias e contato por WhatsApp.",
  },
  {
    name: "Atelier Julyana Garcia",
    category: "Nupcial",
    body:
      "Site elegante de atelier nupcial com destaque para o Bridal Day, checklist interativo, perfil da especialista, formulário de agendamento e WhatsApp.",
  },
  {
    name: "OMB Marketing",
    category: "Agência",
    body:
      "Site de agência de marketing digital com identidade moderna, apresentação de serviços, cases de sucesso e navegação otimizada.",
  },
  {
    name: "Desentupidora Sergipana",
    category: "Serviços",
    body:
      "Site totalmente responsivo de serviços hidráulicos, com atendimento 24 horas, ofertas residenciais e comerciais, agendamento online e WhatsApp.",
  },
  {
    name: "Paróquia São José",
    category: "Institucional",
    body:
      "Site responsivo e acolhedor com horários de missas e sacramentos, seções pastorais, conteúdo multimídia e contato integrado por WhatsApp.",
  },
];
