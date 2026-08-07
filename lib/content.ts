/**
 * Conteúdo editorial do site.
 *
 * Regras que valem para tudo aqui:
 *  - nenhum número, cliente, certificação ou resultado inventado;
 *  - o que não estiver comprovado vira PLACEHOLDER explícito;
 *  - sem travessões na copy;
 *  - segurança se comunica como preparação e adequação, nunca como certificação.
 */

export type Capability = {
  slug: string;
  title: string;
  claim: string;
  /** Detalhe revelado em hover, foco ou toque. No mobile fica sempre acessível. */
  detail: string;
  items: readonly string[];
  /**
   * Peso no bento grid. A soma das larguras precisa fechar múltiplo de 3, senão
   * sobra buraco na malha. Hoje: 2+1+1+2+1+2 = 9, ou seja, três linhas cheias.
   */
  span: "wide" | "normal";
};

export const CAPABILITIES: readonly Capability[] = [
  {
    slug: "cloud-platforms",
    title: "Cloud Platforms",
    claim: "Plataformas preparadas para crescer sem perder controle.",
    detail:
      "Desenhamos a fundação antes de escalar: rede, identidade, segregação de ambientes e infraestrutura descrita em código. O objetivo é que qualquer pessoa do time recrie o ambiente inteiro sem depender de conhecimento tribal.",
    items: [
      "AWS, Azure e GCP",
      "Kubernetes",
      "Containers",
      "Serverless",
      "Redes",
      "Identidade",
      "Infraestrutura como código",
      "Plataformas multi-cloud",
    ],
    span: "wide",
  },
  {
    slug: "reliability-engineering",
    title: "Reliability Engineering",
    claim: "Sistemas observáveis, resilientes e operáveis.",
    detail:
      "Disponibilidade não vem de esperança, vem de instrumentação. Colocamos o sistema em condição de ser observado, diagnosticado e recuperado, com processo de incidente que funciona às três da manhã.",
    items: [
      "SRE",
      "Observabilidade",
      "Monitoramento",
      "Gestão de incidentes",
      "Automação",
      "Disponibilidade",
      "Disaster recovery",
      "Capacidade e performance",
    ],
    span: "normal",
  },
  {
    slug: "software-architecture",
    title: "Software Architecture",
    claim: "Arquiteturas capazes de acompanhar a evolução do negócio.",
    detail:
      "A arquitetura certa é a que permite mudar de ideia depois. Separamos responsabilidades, definimos contratos e deixamos caminho aberto para multi-tenancy, mobile e integrações B2B sem reescrever a base.",
    items: [
      "APIs",
      "Modularização",
      "Eventos",
      "Filas",
      "Cache",
      "Multi-tenancy",
      "Integração",
      "Modernização",
      "Preparação para mobile e B2B",
    ],
    span: "normal",
  },
  {
    slug: "security-governance",
    title: "Security and Governance",
    claim: "Segurança incorporada à arquitetura e ao processo.",
    detail:
      "Segurança que depende de disciplina humana falha. Tratamos controle de acesso, segredos, criptografia e perímetro como parte da arquitetura, e preparamos a operação para auditoria e adequação regulatória.",
    items: [
      "IAM",
      "Secrets",
      "Criptografia",
      "Perímetro",
      "Governança de código",
      "DevSecOps",
      "LGPD",
      "Preparação para ISO 27001 e ISO 27701",
    ],
    span: "wide",
  },
  {
    slug: "finops",
    title: "FinOps",
    claim: "Escala com previsibilidade financeira.",
    detail:
      "Custo de nuvem é decisão de arquitetura, não linha de fatura. Trazemos visibilidade de custo por cliente e por transação para que a conversa sobre escala aconteça com número na mesa.",
    items: [
      "Análise de custos",
      "Custo por cliente",
      "Custo por transação",
      "Projeções",
      "Right sizing",
      "Otimização",
      "Alertas",
      "Governança de tags",
      "Decisões arquiteturais orientadas por custo",
    ],
    span: "normal",
  },
  {
    slug: "intelligent-systems",
    title: "Intelligent Systems",
    claim: "IA aplicada a produtos e operações reais.",
    detail:
      "IA entra onde resolve um problema medível, com limite de custo, avaliação de qualidade e caminho de fallback. O resto é demonstração.",
    items: [
      "Agentes",
      "Automação",
      "Sistemas assistidos por IA",
      "RAG",
      "Integração com produtos",
      "Ferramentas internas",
      "Operações inteligentes",
    ],
    span: "wide",
  },
] as const;

/* ── Modelo de atuação ───────────────────────────────────────────────────── */

export type Offering = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  includes: readonly string[];
};

export const OFFERINGS: readonly Offering[] = [
  {
    slug: "architecture-review",
    index: "01",
    title: "Architecture Review",
    summary: "Diagnóstico técnico, análise de riscos, arquitetura, custos e roadmap.",
    includes: [
      "Leitura da arquitetura atual e das decisões que a produziram",
      "Mapa de riscos por probabilidade e impacto",
      "Análise de custo de infraestrutura e dos vetores de crescimento",
      "Roadmap priorizado, com o que resolver agora e o que pode esperar",
    ],
  },
  {
    slug: "production-readiness",
    index: "02",
    title: "Production Readiness",
    summary: "Segurança, ambientes, CI/CD, observabilidade, backups e estabilização.",
    includes: [
      "Segregação de ambientes e controle de acesso",
      "Esteira de entrega com rollback previsível",
      "Observabilidade, alertas e resposta a incidente",
      "Backup, restauração testada e plano de recuperação",
    ],
  },
  {
    slug: "vibe-to-scale",
    index: "03",
    title: "Vibe to Scale",
    summary: "Modernização de frontend, API, dados e infraestrutura.",
    includes: [
      "Separação entre interface, regra de negócio e dados",
      "Autorização e isolamento entre clientes",
      "Banco, filas, cache e estratégias de escala",
      "Redução da dependência da ferramenta de geração original",
    ],
  },
  {
    slug: "architecture-partnership",
    index: "04",
    title: "Architecture Partnership",
    summary: "Acompanhamento contínuo, revisão arquitetural, FinOps, SRE, mentoria e evolução técnica.",
    includes: [
      "Revisão arquitetural recorrente",
      "Acompanhamento de custo e de confiabilidade",
      "Apoio às decisões técnicas do time",
      "Mentoria e transferência de conhecimento",
    ],
  },
] as const;

/* ── Vibe to Scale ───────────────────────────────────────────────────────── */

/** Estado de partida: aplicação gerada por IA. */
export const GENERATED_APP = {
  label: "AI GENERATED APP",
  traits: [
    "Frontend acoplado às regras",
    "Banco acessado diretamente",
    "Segurança incompleta",
    "Deploy sem governança",
    "Custos desconhecidos",
    "Ausência de observabilidade",
    "Dependência da plataforma original",
  ],
} as const;

/** Estado de chegada: plataforma de produção. */
export const PRODUCTION_PLATFORM = {
  label: "PRODUCTION PLATFORM",
  nodes: [
    "Frontend",
    "API",
    "Núcleo de negócio",
    "Autenticação e autorização",
    "Banco de dados",
    "Filas",
    "Integrações",
    "Cache",
    "Observabilidade",
    "CI/CD",
    "Segurança",
    "FinOps",
  ],
} as const;

export const VIBE_PROBLEMS: readonly string[] = [
  "Acoplamento",
  "Regras no frontend",
  "Falhas de autorização",
  "Ausência de isolamento entre clientes",
  "Banco exposto",
  "Falta de ambientes",
  "Ausência de testes",
  "Deploy sem rollback",
  "Custos imprevisíveis",
  "Falta de observabilidade",
  "Dificuldade de criar mobile",
  "Dependência excessiva da ferramenta de geração",
] as const;

export type Phase = {
  index: string;
  name: string;
  body: string;
};

export const VIBE_PHASES: readonly Phase[] = [
  {
    index: "01",
    name: "Discover",
    body: "Análise do código, banco, integrações, infraestrutura, segurança, custos e dependências.",
  },
  {
    index: "02",
    name: "Stabilize",
    body: "Correção dos riscos imediatos de acesso, dados, secrets, backups, versionamento e segurança.",
  },
  {
    index: "03",
    name: "Architect",
    body: "Separação de frontend, API, regras de negócio, banco e integrações.",
  },
  {
    index: "04",
    name: "Scale",
    body: "Cache, filas, processamento assíncrono, otimização de banco, rate limiting e estratégias de escala.",
  },
  {
    index: "05",
    name: "Optimize",
    body: "FinOps, custos por cliente, custos por operação, projeções e decisões de infraestrutura.",
  },
  {
    index: "06",
    name: "Enable",
    body: "Documentação, padrões, guardrails e orientação para que o fundador continue utilizando IA de maneira segura.",
  },
] as const;

/* ── Painel operacional da hero ──────────────────────────────────────────── */

export const OPERATIONAL_STATUS = [
  { key: "ARCHITECTURE", value: "READY" },
  { key: "RELIABILITY", value: "ACTIVE" },
  { key: "SECURITY", value: "ENFORCED" },
  { key: "AUTOMATION", value: "RUNNING" },
  { key: "COST CONTROL", value: "ENABLED" },
] as const;

/* ── Stack ───────────────────────────────────────────────────────────────── */

/** Tecnologias efetivamente usadas em projeto entregue, não catálogo de desejo. */
export const STACK: readonly string[] = [
  "AWS",
  "Azure",
  "Google Cloud",
  "Cloudflare",
  "Kubernetes",
  "Docker",
  "Terraform",
  "Pulumi",
  "Argo CD",
  "GitHub Actions",
  "PostgreSQL",
  "Redis",
  "RabbitMQ",
  "Kafka",
  "Datadog",
  "Grafana",
  "OpenTelemetry",
  "React",
  "Next.js",
  "Node",
  "Python",
] as const;

/* ── Trilha de rastreamento ──────────────────────────────────────────────── */

/**
 * Estágios da jornada de um software, do código à operação. Alimentam a trilha
 * lateral da home: é marcação visual da cadeia, não índice navegável.
 */
export const TRACE_STAGES = [
  { index: "01", name: "SOURCE", tech: ["Git", "Code review"] },
  { index: "02", name: "DEPENDENCIES", tech: ["npm", "pip", "SBOM"] },
  { index: "03", name: "BUILD", tech: ["Actions", "Docker"] },
  { index: "04", name: "DEPLOY", tech: ["Terraform", "Argo CD"] },
  { index: "05", name: "RUNTIME", tech: ["Kubernetes", "ECS"] },
  { index: "06", name: "DATA", tech: ["PostgreSQL", "Redis"] },
  { index: "07", name: "OBSERVE", tech: ["OpenTelemetry", "SLO"] },
] as const;

/* ── Projetos ────────────────────────────────────────────────────────────── */

export type Project = {
  slug: string;
  index: string;
  category: string;
  client: string;
  title: string;
  summary: string;
  /** Case aberto tem página própria; os demais abrem no painel expansível. */
  hasPage?: boolean;
  context: string;
  challenge: string;
  constraints: readonly string[];
  decisions: readonly string[];
  architecture: readonly string[];
  implementation: readonly string[];
  outcome: readonly string[];
  stack: readonly string[];
  learned: string;
  note?: string;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "lupewedding",
    index: "01",
    category: "Produtos digitais",
    client: "LupeWedding",
    title: "Um produto digital construído da visão de negócio à arquitetura",
    summary:
      "Produto próprio, concebido e construído de ponta a ponta. Serve como prova de capacidade de produto, não apenas de entrega técnica.",
    hasPage: true,
    context:
      "A LupeWedding foi concebida e construída utilizando a experiência da MENENDES em engenharia de software, arquitetura de sistemas, cloud, segurança, confiabilidade e operação. O projeto demonstra a capacidade de transformar uma ideia em um ecossistema digital preparado para atender diferentes jornadas, usuários e modelos de negócio.",
    challenge:
      "Atender jornadas distintas dentro do mesmo produto. Quem está organizando o próprio casamento e quem opera vários eventos como profissional têm necessidades, permissões e ritmos diferentes. Um único modelo de dados e de acesso precisa servir aos dois sem que um enxergue o contexto do outro.",
    constraints: [
      "Produto próprio, então custo de infraestrutura sai do mesmo bolso que a receita",
      "Dados de convidados e documentos exigem tratamento sob a LGPD",
      "Operação conduzida por uma equipe pequena, o que torna automação um requisito e não um luxo",
      "A base precisa comportar evolução para mobile e para uso B2B sem reescrita",
    ],
    decisions: [
      "Separar as experiências digitais da API e das regras de negócio, para que a interface possa mudar sem tocar no núcleo",
      "Tratar isolamento entre eventos e entre clientes como regra de dados, não como filtro de tela",
      "Modelar identidade e permissões antes das funcionalidades, porque perfil errado depois vira migração",
      "Publicar na borda para reduzir latência e custo fixo",
    ],
    architecture: [
      "Experiências digitais para casais, para assessorias e para a operação administrativa",
      "API com as regras de negócio centralizadas",
      "Identidade e permissões com separação clara de perfis",
      "Camada de dados e integrações",
      "Infraestrutura cloud com deploy automatizado",
      "Observabilidade e monitoramento de erros em produção",
    ],
    implementation: [
      "Automação de deploy, de forma que publicar deixe de ser um evento de risco",
      "Monitoramento de erros com rastreio até a origem",
      "Controles de segurança no perímetro e no acesso aos dados",
      "Acompanhamento de custo de infraestrutura desde o início",
    ],
    outcome: [
      "Produto em operação real, com as jornadas de casal e de assessoria funcionando sobre a mesma base",
      "Arquitetura preparada para evoluir em web, mobile e B2B sem reescrita",
      "Ciclo de publicação automatizado e reversível",
    ],
    stack: [
      "React",
      "Cloudflare",
      "PostgreSQL",
      "API REST",
      "CI/CD",
      "Observabilidade",
    ],
    learned:
      "A inteligência artificial acelerou partes da construção. Engenharia de software, arquitetura e experiência operacional garantiram que o produto pudesse evoluir.",
  },
  {
    slug: "frst-falconi",
    index: "02",
    category: "Plataformas cloud",
    client: "FRST Falconi",
    title: "Transformação cloud-native com Kubernetes e GitOps",
    summary:
      "Saída de uma infraestrutura baseada em máquinas virtuais para um ecossistema cloud-native, com entrega contínua governada por Git.",
    context:
      "Plataforma de aprendizagem corporativa que precisava de uma infraestrutura tecnológica capaz de acompanhar o próprio ritmo de evolução do produto.",
    challenge:
      "Migrar de máquinas virtuais na AWS para um ecossistema cloud-native, lidando com a complexidade de uma arquitetura de microsserviços e garantindo a segurança dos dados.",
    constraints: [
      "Arquitetura de microsserviços com repositórios separados para API e microfrontends",
      "Necessidade de segregar ambientes e dados por domínio",
      "Segurança e governança de acesso como requisito, não como etapa posterior",
    ],
    decisions: [
      "Tratar o cluster como infraestrutura como código, para que o ambiente seja recriável",
      "Adotar GitOps, colocando o Git como fonte única da verdade do que está em produção",
      "Manter arquitetura híbrida, com cada carga no runtime que lhe serve melhor",
      "Segregar contas por domínio em vez de separar apenas por ambiente",
    ],
    architecture: [
      "Amazon EKS provisionado com eksctl e Terraform",
      "Argo CD para entrega contínua em modelo GitOps",
      "Arquitetura híbrida equilibrando cargas em EKS e Amazon ECS",
      "Estrutura multi-conta segregando Dados, AppTools, Produção e Desenvolvimento",
      "Camadas de segurança com AWS WAF e AWS SSO",
    ],
    implementation: [
      "Pipelines de CI/CD no GitHub Actions, granulares por repositório",
      "Elasticsearch para monitoramento e observabilidade de ponta a ponta",
      "Controle de acesso centralizado via SSO",
    ],
    outcome: [
      "Frequência de deploy acelerada, com menor risco de erro manual",
      "Escalabilidade dinâmica e resiliência pela arquitetura Kubernetes",
      "Confiabilidade operacional maior pela automação GitOps",
      "Segurança e governança pela segregação de contas e controle de acessos",
    ],
    stack: [
      "Amazon EKS",
      "Argo CD",
      "Terraform",
      "GitHub Actions",
      "Elasticsearch",
      "Amazon ECS",
      "AWS WAF",
      "AWS SSO",
    ],
    learned:
      "GitOps só entrega o que promete quando a infraestrutura já é código. A ordem importa: primeiro o ambiente vira reproduzível, depois o Git vira fonte da verdade.",
  },
  {
    slug: "magie",
    index: "03",
    category: "Engenharia de confiabilidade",
    client: "Magie",
    title: "Escalabilidade e agilidade para uma operação financeira",
    summary:
      "Saída de uma instância única com Docker Compose para uma arquitetura elástica, com infraestrutura recriável por código.",
    context:
      "Fintech que oferece uma experiência bancária completa dentro do WhatsApp, em fase de expansão acelerada.",
    challenge:
      "A infraestrutura rodava em uma única instância na AWS, utilizando Docker Compose. O modelo não entregava a escalabilidade, a resiliência e a agilidade de desenvolvimento exigidas pela operação.",
    constraints: [
      "Setor financeiro, com exigência de continuidade de serviço",
      "Crescimento de base de usuários e de volume transacional em curso",
      "Migração sem interromper a operação existente",
    ],
    decisions: [
      "Migrar para containers gerenciados em vez de manter orquestração manual",
      "Descrever toda a infraestrutura em código, de forma que o ambiente inteiro seja recriável",
      "Introduzir processamento assíncrono para desacoplar o que não precisa de resposta imediata",
      "Colocar observabilidade antes da escala, não depois",
    ],
    architecture: [
      "APIs conteinerizadas em Amazon ECS",
      "Application Load Balancers protegidos por AWS WAF",
      "Amazon MSK e RabbitMQ para processamento assíncrono",
      "Infraestrutura descrita com Pulumi",
    ],
    implementation: [
      "Esteira de CI/CD no GitHub Actions cobrindo build, teste e deploy",
      "Observabilidade com Datadog",
      "Infraestrutura recriável em aproximadamente 30 minutos",
    ],
    outcome: [
      "Escalabilidade dinâmica para acompanhar o crescimento da operação",
      "Maior confiabilidade e continuidade do serviço",
      "Ciclos de desenvolvimento acelerados pela entrega automatizada",
      "Menos esforço operacional graças à automação da infraestrutura",
    ],
    stack: [
      "Amazon ECS",
      "Pulumi",
      "GitHub Actions",
      "AWS WAF",
      "Amazon MSK",
      "RabbitMQ",
      "Datadog",
    ],
    learned:
      "Infraestrutura como código deixa de ser preferência e vira seguro assim que existe volume transacional. Recriar o ambiente em trinta minutos é a diferença entre incidente e catástrofe.",
    note: "Projeto conduzido sob a liderança técnica de Felipe Menendes, fundador da MENENDES.",
  },
  {
    slug: "runflow",
    index: "04",
    category: "Dados e governança",
    client: "Runflow",
    title: "Documentação e validação técnica junto à AWS",
    summary:
      "Organização, documentação e evidenciação de uma arquitetura existente para habilitar a empresa em programas avançados da AWS.",
    context:
      "Empresa de automação inteligente que precisava participar de programas avançados da AWS, o que exigia documentar a arquitetura existente e conduzir a submissão conforme requisitos formais.",
    challenge:
      "Traduzir práticas de engenharia que já existiam para a linguagem, o formato e o nível de evidência que o programa exige, sem alterar o ambiente em produção.",
    constraints: [
      "Nenhuma mudança no ambiente do cliente",
      "Requisitos formais definidos por terceiro, sem espaço para interpretação própria",
      "Evidência técnica precisa ser verificável, não declaratória",
    ],
    decisions: [
      "Selecionar as cargas de trabalho que melhor representam a prática da empresa",
      "Gerar evidência a partir do próprio ambiente, via CLI, em vez de descrever de memória",
      "Padronizar terminologia antes de escrever, para que a documentação fosse consistente",
    ],
    architecture: [
      "Documentação detalhada da arquitetura existente",
      "Diagramas e políticas IAM organizados como artefato de submissão",
      "Evidências geradas via AWS CLI",
    ],
    implementation: [
      "Estruturação do material técnico e padronização de terminologia",
      "Consolidação das informações exigidas e formatação para submissão oficial",
      "Condução da comunicação técnica com a AWS até a conclusão",
    ],
    outcome: [
      "Documentação técnica completa e verificável",
      "Processo de inscrição conduzido de forma estruturada",
      "Aderência às boas práticas da AWS demonstrada",
      "Mais visibilidade dentro do ecossistema AWS",
    ],
    stack: ["AWS", "AWS CLI", "IAM"],
    learned:
      "Boa engenharia que não está documentada não conta. Grande parte do trabalho de conformidade é tornar visível o que a equipe já fazia certo.",
    note: "O trabalho não alterou o ambiente da Runflow. Organizou, documentou e evidenciou práticas que já existiam.",
  },
] as const;

/** Categorias editoriais da página de projetos. */
export const PROJECT_CATEGORIES = [
  "Produtos digitais",
  "Plataformas cloud",
  "Engenharia de confiabilidade",
  "Dados e governança",
  "Sistemas inteligentes",
] as const;

/**
 * Trabalhos anteriores da equipe. Ficam como lista discreta: são entregas
 * reais, mas de natureza diferente dos cases de plataforma acima e não devem
 * competir com eles em destaque.
 */
export const PRIOR_WORK: readonly string[] = [
  "Instacarro",
  "Instituto Janeth Arcain",
  "GeneID",
  "Unitech",
  "Vivalog",
  "Infrawork",
  "DGP",
  "Gertec Metálica",
  "OMB Marketing",
  "Atelier Julyana Garcia",
  "PSR",
] as const;

export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((project) => project.slug === slug);
