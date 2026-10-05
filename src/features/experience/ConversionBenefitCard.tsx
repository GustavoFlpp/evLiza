import { ArrowRight, Check, Gift } from 'lucide-react';
import { useDemo } from './DemoProvider';
import { eligibleAmount, calculateCredit, conversionEligibility } from './engine';
import { evProgramRules as rules, DAY_MS } from '@/config/evProgramRules';
import { currency } from '@/data/vehicles';
import { MockDataBadge } from '@/components/MockDataBadge';

export function ConversionBenefitCard({ onContinue }: { onContinue: () => void }) {
  const { state } = useDemo();
  const rental = state.rental!;
  const base = eligibleAmount(rental.items);
  const blocked = conversionEligibility(state, rules.eligibleSubscriptionModels[0]);
  const credit = blocked ? 0 : calculateCredit(rental.items);
  const deadline = new Date(Date.parse(rental.returnedAt!) + rules.conversionWindowDays * DAY_MS);
  return (
    <section className="benefit-moment" aria-label="Seu benefício evLiza">
      <div className="benefit-story">
        <span className="benefit-icon">
          <Gift size={32} />
        </span>
        <div className="eyebrow">SEU BENEFÍCIO evLiza</div>
        <h2>O que você viveu pode acompanhar seu próximo passo.</h2>
        <p>Parte do valor elegível da sua experiência pode virar benefício na sua assinatura.</p>
        <div className="benefit-path">
          <span>
            <Check size={16} /> Experiência concluída
          </span>
          <ArrowRight size={16} />
          <span>Benefício potencial</span>
          <ArrowRight size={16} />
          <span>Assinatura</span>
        </div>
      </div>
      <div className="benefit-reward">
        <MockDataBadge />
        <p>Benefício potencial na assinatura</p>
        <strong className="reward-value">{currency(credit)}</strong>
        <span className="badge">
          {blocked ? 'Condição indisponível' : 'Disponível para solicitar · sujeito à aprovação'}
        </span>
        <dl className="summary-list">
          <dt>Valor elegível da experiência</dt>
          <dd>{currency(base)}</dd>
          <dt>Janela após a devolução</dt>
          <dd>{rules.conversionWindowDays} dias</dd>
          <dt>Utilizar até · simulado</dt>
          <dd>{deadline.toLocaleDateString('pt-BR')}</dd>
        </dl>
        {blocked ? (
          <p role="alert">{blocked}</p>
        ) : (
          <button className="button full" onClick={onContinue}>
            Usar meu benefício <ArrowRight size={18} />
          </button>
        )}
        <details className="benefit-calculation">
          <summary>Ver como é calculado</summary>
          <p>
            {currency(base)} × {rules.creditRate * 100}%, limitado a{' '}
            {currency(rules.maximumConversionCredit)}. Apenas a base da locação participa. Extras,
            energia, proteção, multas, danos, serviços e taxas não entram. Uso único, não
            cumulativo, em modelo elegível e após aprovação. Não é dinheiro sacável.
          </p>
        </details>
        <small>Valores simulados. O benefício só é aplicado após aprovação.</small>
      </div>
    </section>
  );
}
