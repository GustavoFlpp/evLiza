import { ConceptBadge, DemoDisclaimer } from '@/components/DemoDisclaimer';
import { PageIntro, ButtonLink } from '@/components/UI';
import { evProgramRules as rules } from '@/config/evProgramRules';
import { currency } from '@/data/vehicles';
export default function Page() {
  const terms = [
    'A experiência é uma locação paga.',
    'Está sujeita à disponibilidade na agência.',
    'A reserva pode ocorrer por grupo/categoria.',
    'O modelo exato pode variar; imagens e nomes são referências do protótipo.',
    'O benefício na assinatura não é dinheiro sacável.',
    'Somente a base elegível da locação entra no cálculo.',
    'Multas, danos, energia/combustível adicional, proteção, pedágio, estacionamento, hora extra, taxas, serviços extras e outros adicionais não geram benefício.',
    `Prazo ilustrativo para seguir com a assinatura: ${rules.conversionWindowDays} dias após a devolução.`,
    `Taxa ilustrativa: ${rules.creditRate * 100}% da base; limite de ${currency(rules.maximumConversionCredit)} e ${rules.maximumBenefitsPerCustomer} benefício(s) por cliente.`,
    'A aprovação da assinatura continua sujeita às regras normais.',
    'Não existe garantia de aprovação.',
    'Condições podem variar durante o piloto.',
    rules.allowBenefitStacking
      ? 'Acúmulo de benefícios habilitado neste cenário ilustrativo.'
      : 'Benefícios não cumulativos neste cenário ilustrativo.',
    `Duração ilustrativa: ${rules.minimumExperienceDays} a ${rules.maximumExperienceDays} dias; cidades: ${rules.eligibleCities.join(', ')}.`,
    'Se você não seguir com a assinatura, a locação encerra normalmente, sem reembolso.',
  ];
  return (
    <div className="container page narrow">
      <ConceptBadge />
      <PageIntro eyebrow="TRANSPARÊNCIA DO CONCEITO" title="Regras claras, desde o início." />
      <div className="card">
        <ol className="terms-list">
          {terms.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <p>
          <strong>
            Regras ilustrativas. Uma implementação real exigiria validação jurídica, financeira,
            fiscal e operacional.
          </strong>
        </p>
      </div>
      <DemoDisclaimer />
      <ButtonLink href="/experiencia">Consultar disponibilidade</ButtonLink>
    </div>
  );
}
