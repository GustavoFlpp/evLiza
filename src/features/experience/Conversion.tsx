'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from './DemoProvider';
import {
  calculateCredit,
  conversionEligibility,
  requestProposal,
  simulateApproval,
} from './engine';
import { JourneyFallback } from './CustomerJourney';
import { ConversionBenefitCard } from './ConversionBenefitCard';
import { JourneyProgress } from '@/components/JourneyProgress';
import { evProgramRules as rules } from '@/config/evProgramRules';
import { vehicles, currency, getVehicle } from '@/data/vehicles';
import { CarIllustration } from '@/components/CarIllustration';
import { ButtonLink, PageIntro } from '@/components/UI';
import { DemoDisclaimer } from '@/components/DemoDisclaimer';

export function Conversion() {
  const { state, run } = useDemo();
  const router = useRouter();
  const [catalog, setCatalog] = useState(false);
  const [accepted, setAccepted] = useState(false);
  if (!['DECIDED', 'PROPOSAL_REQUESTED'].includes(state.status)) return <JourneyFallback />;
  const showCatalog = catalog || state.status === 'PROPOSAL_REQUESTED';
  const credit = calculateCredit(state.rental!.items);
  return (
    <div className="conversion-background">
      <div className="container page">
        <JourneyProgress current={showCatalog ? 3 : 2} />
        <div className="journey-panel" key={showCatalog ? 'catalog' : 'benefit'}>
          <PageIntro
            eyebrow={showCatalog ? 'SEU PRÓXIMO ELÉTRICO' : 'DA EXPERIÊNCIA AO PRÓXIMO PASSO'}
            title={
              showCatalog
                ? 'Escolha como quer continuar.'
                : 'Gostou de viver um elétrico? Vamos para o próximo passo.'
            }
            description={
              showCatalog
                ? 'Encontre uma referência para sua proposta de assinatura.'
                : 'Agora você pode transformar essa experiência em uma proposta de assinatura.'
            }
          />
          {!showCatalog ? (
            <ConversionBenefitCard
              onContinue={() => {
                setCatalog(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : state.status === 'PROPOSAL_REQUESTED' ? (
            <div className="proposal-moment card">
              <div className="recap-art">
                <CarIllustration color={getVehicle(state.proposal?.modelId)?.color} />
              </div>
              <div>
                <span className="badge">Proposta simulada solicitada</span>
                <h2>Seu próximo passo tem um nome.</h2>
                <h3>{getVehicle(state.proposal?.modelId)?.name}</h3>
                <p>Benefício potencial de {currency(credit)}. A aprovação não é garantida.</p>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  Entendi as regras ilustrativas e quero simular a aprovação
                </label>
                <div className="journey-action">
                  <button
                    className="button full"
                    disabled={!accepted}
                    onClick={() => {
                      if (run((s) => simulateApproval(s, true)))
                        router.push('/assinatura/aguardando');
                    }}
                  >
                    Simular assinatura aprovada
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="subscription-collection">
                {vehicles
                  .filter((v) => rules.eligibleSubscriptionModels.includes(v.id))
                  .map((v) => {
                    const blocked = conversionEligibility(state, v.id);
                    return (
                      <article className="subscription-card" key={v.id}>
                        <div className="subscription-art">
                          <span className="badge">evLiza</span>
                          <CarIllustration color={v.color} />
                          <small>Ilustração genérica · modelo de referência</small>
                        </div>
                        <div className="subscription-body">
                          <div className="eyebrow">100% ELÉTRICO · {v.category}</div>
                          <h2>{v.name}</h2>
                          <div className="subscription-specs">
                            <span>{rules.subscriptionMonths} meses</span>
                            <span>{rules.monthlyKmAllowance.toLocaleString('pt-BR')} km/mês</span>
                          </div>
                          <div className="subscription-price">
                            <small>Mensalidade simulada</small>
                            <div className="price">
                              {currency(v.monthlyPrice)}
                              <span>/mês</span>
                            </div>
                          </div>
                          <p className="applied-benefit">
                            Benefício potencial de {currency(blocked ? 0 : credit)} após aprovação.
                          </p>
                          <button
                            className="button full"
                            disabled={!!blocked}
                            onClick={() => {
                              if (run((s) => requestProposal(s, v.id)))
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Quero esta proposta
                          </button>
                          {blocked && <p role="alert">{blocked}</p>}
                        </div>
                      </article>
                    );
                  })}
              </div>
              <div className="journey-action">
                <button className="text-link" onClick={() => setCatalog(false)}>
                  Rever meu benefício
                </button>
              </div>
              <p className="microcopy">
                Modelos e valores simulados. Benefício condicionado à aprovação; não altera a
                mensalidade exibida. O veículo definitivo segue processo próprio e pode ser
                diferente do alugado.
              </p>
            </>
          )}
        </div>
        <DemoDisclaimer />
      </div>
    </div>
  );
}
export function Waiting() {
  const { state } = useDemo();
  const [understood, setUnderstood] = useState(false);
  if (state.status !== 'WAITING') return <JourneyFallback />;
  return (
    <div className="container page narrow">
      <JourneyProgress current={4} />
      <PageIntro
        eyebrow="PROCESSO NORMAL DE ASSINATURA · SIMULAÇÃO"
        title="Agora começa sua próxima etapa."
        description="O veículo definitivo segue o processo normal do Localiza Assinatura."
      />
      <div className="card proposal-moment">
        <div className="recap-art">
          <CarIllustration color={getVehicle(state.proposal?.modelId)?.color} />
        </div>
        <div>
          <h2>Benefício comercial simulado: {currency(state.proposal!.credit)}</h2>
          <p>
            O veículo definitivo segue o processo normal da assinatura, sem entrega imediata ou
            prazo fixo garantido. Soluções provisórias podem existir conforme regras e
            disponibilidade da operação.
          </p>
          <p>
            Condição a validar na implementação real. Não existe permanência garantida no carro
            alugado ou promessa de provisório específico.
          </p>
          <p className="microcopy">
            A experiência de aluguel foi devolvida. Nenhum veículo ou contrato foi contratado neste
            protótipo.
          </p>
          <div className="actions">
            <button className="button" onClick={() => setUnderstood(true)}>
              Entendi
            </button>
            <ButtonLink href="/demo/analytics" secondary>
              Ver painel interno
            </ButtonLink>
          </div>
          {understood && (
            <p role="status">Tudo claro. Sua jornada de demonstração está concluída.</p>
          )}
        </div>
      </div>
      <DemoDisclaimer />
    </div>
  );
}
