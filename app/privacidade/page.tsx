import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";
import { CONSENT_HASH } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a MENENDES trata os dados enviados por este site, com que finalidade, por quanto tempo e quais são os seus direitos.",
  alternates: { canonical: "/privacidade" },
};

const BLOCK = "mt-12";
const TITLE = "mono-label text-primary-soft";
const BODY = "mt-4 text-fg-soft";

export default function PrivacidadePage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="Política de"
        accent="Privacidade"
        body="Última atualização: 7 de agosto de 2026."
      />

      <Section>
        <div className="shell-narrow">
          <section>
            <h2 className={TITLE}>Controlador</h2>
            <p className={BODY}>
              {SITE.legalName}, inscrita no CNPJ sob o número {SITE.cnpj}, é a
              controladora dos dados tratados neste site. Contato para assuntos de
              privacidade:{" "}
              <a
                href={`mailto:${SITE.contact.email}`}
                className="text-primary-soft underline underline-offset-2"
              >
                {SITE.contact.email}
              </a>
              .
            </p>
          </section>

          <section className={BLOCK}>
            <h2 className={TITLE}>Dados tratados</h2>
            <p className={BODY}>
              Tratamos apenas o que você nos envia de forma deliberada pelo formulário
              de contato: nome, empresa, e-mail, telefone quando informado, tipo de
              desafio e a descrição do problema.
            </p>
            <p className={BODY}>
              A infraestrutura que entrega este site registra dados técnicos de
              navegação, como endereço IP e tipo de navegador, necessários para servir
              as páginas e para proteger o serviço contra abuso.
            </p>
          </section>

          <section className={BLOCK}>
            <h2 className={TITLE}>Finalidade e base legal</h2>
            <p className={BODY}>
              Os dados do formulário são usados exclusivamente para responder ao seu
              contato e conduzir tratativas comerciais, com fundamento no legítimo
              interesse e nos procedimentos preliminares de contrato previstos na Lei
              Geral de Proteção de Dados. Os dados técnicos são tratados para garantir
              a segurança e a disponibilidade do serviço.
            </p>
          </section>

          <section className={BLOCK}>
            <h2 className={TITLE}>Cookies e medição</h2>
            <p className={BODY}>
              Este site não utiliza cookies de publicidade, não faz perfilamento e não
              constrói perfil individual de quem navega.
            </p>
            <p className={BODY}>
              A única medição é o Cloudflare Web Analytics, que produz contagem agregada
              de visitas sem cookie e sem identificar o visitante. Ainda assim, ele só é
              carregado depois do seu aceite: enquanto você não decidir, nenhum script de
              medição entra na página. Recusar não limita nada, e nenhuma funcionalidade
              do site depende dessa escolha.
            </p>
            <p className={BODY}>
              Sua decisão fica guardada no seu próprio navegador e pode ser alterada a
              qualquer momento em{" "}
              <a
                href={`/privacidade${CONSENT_HASH}`}
                className="text-primary-soft underline underline-offset-2"
              >
                preferências de privacidade
              </a>
              . A revogação passa a valer na navegação seguinte. Se esta política mudar de
              forma relevante, o pedido de consentimento é refeito, em vez de herdarmos em
              silêncio uma decisão tomada sobre outro texto.
            </p>
            <p className={BODY}>
              Não usamos Google Analytics, Google Ads nem gerenciador de tags. Caso algum
              deles venha a ser adotado, o controle já existente passa a governá-lo e esta
              política será atualizada antes de qualquer carregamento.
            </p>
          </section>

          <section className={BLOCK}>
            <h2 className={TITLE}>Compartilhamento</h2>
            <p className={BODY}>
              Não vendemos nem cedemos dados. Eles transitam apenas pelos prestadores
              necessários para operar o site e entregar sua mensagem: o provedor de
              infraestrutura e proteção na borda, e o provedor de envio de e-mail. Ambos
              atuam como operadores, sob obrigação contratual de confidencialidade.
            </p>
          </section>

          <section className={BLOCK}>
            <h2 className={TITLE}>Retenção</h2>
            <p className={BODY}>
              Mensagens de contato são mantidas enquanto durar o atendimento e pelo
              prazo necessário ao cumprimento de obrigações legais. Registros técnicos
              seguem os prazos padrão do provedor de infraestrutura.
            </p>
          </section>

          <section className={BLOCK}>
            <h2 className={TITLE}>Seus direitos</h2>
            <p className={BODY}>
              Você pode solicitar confirmação de tratamento, acesso, correção,
              anonimização, portabilidade ou eliminação dos seus dados, além de revogar
              consentimento e se opor a tratamentos fundados em legítimo interesse.
              Basta escrever para{" "}
              <a
                href={`mailto:${SITE.contact.email}`}
                className="text-primary-soft underline underline-offset-2"
              >
                {SITE.contact.email}
              </a>
              . Respondemos dentro dos prazos previstos na legislação.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
