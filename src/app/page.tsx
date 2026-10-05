import Link from 'next/link';
import { Zap, CalendarDays, ArrowRight } from 'lucide-react';
import { HeroScene } from '@/components/CarIllustration';
import { ButtonLink } from '@/components/UI';
import { ConceptBadge, DemoDisclaimer, IndependentNote } from '@/components/DemoDisclaimer';
import { HowSteps } from '@/components/HowSteps';
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <ConceptBadge />
            <div className="hero-overline">LOCALIZA ALUGUEL → EXPERIÊNCIA → ASSINATURA</div>
            <h1>
              Seu primeiro elétrico <span>começa pela experiência.</span>
            </h1>
            <p>
              Antes de assumir uma assinatura de longo prazo, viva a mobilidade elétrica na sua
              rotina com a Localiza.
            </p>
            <div className="actions">
              <ButtonLink href="/experiencia">Quero experimentar</ButtonLink>
              <ButtonLink href="/como-funciona" secondary>
                Entenda como funciona
              </ButtonLink>
            </div>
            <div className="hero-assurance">
              <CalendarDays size={19} />
              <span>Locação paga. Decisão com experiência.</span>
            </div>
            <IndependentNote />
          </div>
          <HeroScene />
        </div>
      </section>
      <div className="benefit-strip">
        <div className="container">
          <span>
            <Zap />
            Viva o elétrico na sua rotina
          </span>
          <span>
            <CalendarDays />
            Locação paga por grupo disponível
          </span>
          <span>
            <ArrowRight />
            Assine se fizer sentido
          </span>
        </div>
      </div>
      <section className="section container" id="como-funciona">
        <div className="section-heading">
          <div>
            <div className="eyebrow">CONHECER ANTES DE DECIDIR</div>
            <h2>
              Experimente. Viva o elétrico.
              <br />
              Se fizer sentido, continue com ele.
            </h2>
          </div>
          <p>
            Você não precisa assumir um contrato longo para descobrir como é viver com um elétrico.
          </p>
        </div>
        <HowSteps />
      </section>
      <section className="catalog-preview">
        <div className="container section">
          <ConceptBadge />
          <h2>
            Alugue para conhecer.
            <br />
            Assine quando tiver certeza.
          </h2>
          <div className="split-grid">
            <div className="card">
              <h3>Uma experiência de verdade</h3>
              <p>
                Experimente um veículo elétrico disponível na operação de aluguel. O modelo exato
                pode variar conforme o grupo e a agência.
              </p>
              <ButtonLink href="/experiencia">Consultar disponibilidade</ButtonLink>
            </div>
            <div className="card">
              <h3>Um próximo passo possível</h3>
              <p>
                Se contratar um elétrico elegível, parte da base da locação poderá gerar benefício
                comercial, condicionado às regras do piloto.
              </p>
              <Link className="text-link" href="/programa/regras">
                Conheça as regras <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <DemoDisclaimer />
        </div>
      </section>
      <section className="section container" id="beneficios">
        <div className="promise-panel">
          <div>
            <ConceptBadge />
            <h2>
              Da primeira experiência
              <br />
              ao seu elétrico por assinatura.
            </h2>
            <p>A locação encerra normalmente após a devolução. A decisão de seguir é sua.</p>
            <ButtonLink href="/experiencia">Começar minha experiência</ButtonLink>
          </div>
          <div>
            <h3>Clareza desde o início</h3>
            <p>Locação paga por categoria disponível.</p>
            <p>Benefício comercial com base elegível e limite.</p>
            <p>Processo normal de aprovação da assinatura.</p>
            <p>Sem contratação ou pagamento real neste protótipo.</p>
          </div>
        </div>
      </section>
      <section className="section container faq-section">
        <h2>Ficou com alguma dúvida?</h2>
        <div className="faq-list">
          {[
            [
              'A experiência é gratuita?',
              'É uma locação paga. Todos os valores deste protótipo são fictícios.',
            ],
            [
              'Receberei o mesmo carro na assinatura?',
              'O aluguel funciona por grupos disponíveis. O veículo definitivo segue o processo normal de assinatura.',
            ],
            [
              'E se eu decidir não assinar?',
              'A locação encerra normalmente, sem reembolso ou punição por não seguir.',
            ],
            [
              'Como funciona o benefício?',
              'Só a base elegível da locação entra no cálculo, com limite e prazo para seguir. Extras não geram benefício.',
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
