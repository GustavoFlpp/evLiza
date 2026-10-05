'use client';
import { PostExperience } from './PostExperience';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from './DemoProvider';
import { journeyDestinations } from './journeyNavigation';
import { finishExperience } from './engine';
import { guidance } from '@/data/experience';
import { DAY_MS } from '@/config/evProgramRules';
import { RentalInventoryService as inventory } from '@/services/RentalInventoryService';
import { vehicles, currency } from '@/data/vehicles';
import { CarIllustration } from '@/components/CarIllustration';
import { PageIntro, ButtonLink } from '@/components/UI';
import { ConceptBadge, DemoDisclaimer } from '@/components/DemoDisclaimer';
export function JourneyFallback() {
  const { state, ready } = useDemo();
  const router = useRouter();
  const destination = journeyDestinations[state.status];
  useEffect(() => {
    if (ready) router.replace(destination);
  }, [ready, destination, router]);
  return (
    <div className="container page narrow">
      <PageIntro
        eyebrow="SUA EXPERIÊNCIA"
        title={ready ? 'Continue de onde parou.' : 'Preparando sua jornada…'}
        description="Sua próxima etapa está pronta. Continue no seu tempo."
      />
      {ready && <ButtonLink href={destination}>Próxima etapa da jornada</ButtonLink>}
      <DemoDisclaimer />
    </div>
  );
}
export function ActiveExperience() {
  const { state, run } = useDemo();
  const router = useRouter();
  const [clock] = useState(() => Date.now());
  if (state.status !== 'ACTIVE' || !state.rental) return <JourneyFallback />;
  const r = state.rental;
  const remaining = Math.max(
    0,
    Math.min(r.days, Math.ceil((Date.parse(r.endDate) - clock) / DAY_MS)),
  );
  return (
    <div className="container page">
      <ConceptBadge />
      <PageIntro
        eyebrow="03 · EXPERIÊNCIA ATIVA"
        title="Você está vivendo sua experiência elétrica."
        description="Um elétrico na sua rotina, antes da decisão de assinatura."
      />
      <div className="split-grid">
        <div className="card">
          <CarIllustration color={inventory.get(r.inventoryId)?.color} />
          <h2>{r.group}</h2>
          <p>
            Veículo de referência: {inventory.get(r.inventoryId)?.reference}. Modelo específico
            sujeito à disponibilidade.
          </p>
          <p>
            {r.city} · {r.agency}
          </p>
        </div>
        <div className="card">
          <span className="badge">Locação ativa · simulação</span>
          <h2>Seus próximos caminhos.</h2>
          <dl className="summary-list">
            <dt>Período reservado</dt>
            <dd>
              {r.startDate.split('-').reverse().join('/')} a{' '}
              {r.endDate.split('-').reverse().join('/')}
            </dd>
            <dt>Dias restantes</dt>
            <dd>{remaining}</dd>
            <dt>Quilometragem simulada</dt>
            <dd>{state.distanceKm} km</dd>
          </dl>
          <p className="microcopy">Dado simulado para demonstração. Sem telemetria real.</p>
          <p>Finalização antecipada nesta demonstração para apresentar a devolução e a decisão.</p>
          <button
            className="button"
            onClick={() => {
              if (run((s) => finishExperience(s))) router.push('/experiencia/feedback');
            }}
          >
            Finalizar experiência e simular devolução
          </button>
        </div>
      </div>
      <div className="tips-grid">
        {guidance.map(([title, text]) => (
          <details className="card" key={title}>
            <summary>{title}</summary>
            <p>{text}</p>
          </details>
        ))}
      </div>
      <DemoDisclaimer />
    </div>
  );
}
export function FeedbackPage() {
  return <PostExperience />;
}
export function CompletedExperience() {
  const { state } = useDemo();
  const [alternatives, setAlternatives] = useState(false);
  const [closed, setClosed] = useState(false);
  if (state.status !== 'CLOSED') return <JourneyFallback />;
  return (
    <div className="container page narrow">
      <ConceptBadge />
      <PageIntro
        eyebrow="EXPERIÊNCIA CONCLUÍDA"
        title="Obrigado por experimentar."
        description="Você experimentou e fez uma escolha com mais segurança. Isso também é seguir em frente."
      />
      <div className="card">
        <h2>Experiência concluída.</h2>
        <p>Sua escolha foi registrada. A locação foi encerrada normalmente.</p>
        <p className="subtle-box">Principal impressão: {state.feedback?.reason}</p>
        <p className="microcopy">
          Nenhum benefício aplicado e nenhuma proposta solicitada. Sem reembolso automático.
        </p>
        <div className="actions">
          <button className="button" onClick={() => setAlternatives(true)}>
            Conhecer outras opções
          </button>
          <button className="button button-secondary" onClick={() => setClosed(true)}>
            Encerrar
          </button>
        </div>
      </div>
      {closed && (
        <p className="subtle-box" role="status">
          Sua experiência está encerrada. Obrigado por experimentar.
        </p>
      )}
      {alternatives && (
        <section className="card">
          <div className="eyebrow">OUTROS CAMINHOS</div>
          <h2>Encontre o que combina com você.</h2>
          <p>Referências fora do programa evLiza. Nenhuma proposta é solicitada aqui.</p>
          <div className="split-grid">
            {vehicles
              .filter((v) => v.powertrain !== 'EV')
              .map((v) => (
                <article key={v.id}>
                  <CarIllustration color={v.color} />
                  <h3>{v.name}</h3>
                  <p>
                    {v.powertrain === 'HYBRID' ? 'Híbrido' : 'Combustão'} · mensalidade simulada de{' '}
                    {currency(v.monthlyPrice)}
                  </p>
                </article>
              ))}
          </div>
        </section>
      )}
      <DemoDisclaimer />
    </div>
  );
}
