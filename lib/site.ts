/**
 * Constantes da marca e da navegação.
 * Fonte única: nenhum componente escreve nome, URL ou contato à mão.
 */

export const SITE = {
  name: "MENENDES",
  legalName: "Menendes Consultoria em TI Ltda.",
  /** Só aparece no rodapé e na política de privacidade, nunca em destaque. */
  cnpj: "67.659.396/0001-54",
  url: "https://menendes.com.br",
  locale: "pt-BR",
  tagline: "Tecnologia para empresas que não podem parar.",
  description:
    "Arquitetura de software, cloud, SRE, segurança, FinOps e sistemas inteligentes. Da decisão estratégica à execução técnica.",
  contact: {
    /** PLACEHOLDER: confirmar o endereço definitivo antes de publicar. */
    email: "contato@menendes.com.br",
    whatsapp: "5511934271420",
    whatsappDisplay: "(11) 93427-1420",
    city: "São Paulo, SP",
  },
  social: {
    /** PLACEHOLDER: confirmar as URLs reais dos perfis da MENENDES. */
    linkedin: "https://www.linkedin.com/company/menendes",
    github: "https://github.com/frmenendes",
  },
} as const;

export const whatsappUrl = (
  message = "Olá. Vim pelo site da MENENDES e quero discutir um desafio técnico.",
) => `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export type NavItem = { href: string; label: string };

export const NAV: readonly NavItem[] = [
  { href: "/servicos", label: "Expertise" },
  { href: "/vibe-to-scale", label: "Vibe to Scale" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/insights", label: "Insights" },
  { href: "/contato", label: "Contato" },
] as const;

export const PRIMARY_CTA = { href: "/contato", label: "Fale conosco" } as const;
