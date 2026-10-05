'use client';
import { useDemo } from '@/features/experience/DemoProvider';
import {
  pilotMetrics as metrics,
  calculateEconomics,
  economicsDefaults,
} from '@/data/pilotMetrics';
import { currency } from '@/data/vehicles';
import { PageIntro, ButtonLink } from '@/components/UI';
import { Economics } from './Economics';
import { Experiment } from './Experiment';
import { ConceptBadge, DemoDisclaimer } from '@/components/DemoDisclaimer';
export function Analytics() {
  const { state } = useDemo();
  const kpis = [
    ['Interessados', metrics.interested],
    ['Experiências reservadas', metrics.reserved],
    ['Experiências concluídas', metrics.completed],
    ['Propostas solicitadas', metrics.proposals],
    ['Assinaturas convertidas', metrics.subscriptions],
    ['Participantes', metrics.participants],
    ['Receita de experiências', currency(metrics.rentalRevenue)],
    [
      'Taxa experiência → proposta',
      ((metrics.proposals / metrics.completed) * 100).toFixed(1) + '%',
    ],
    [
      'Taxa experiência → assinatura',
      ((metrics.subscriptions / metrics.completed) * 100).toFixed(1) + '%',
    ],
    ['Motivos de não conversão', metrics.reasons.reduce((a, r) => a + r.count, 0) + ' respostas'],
    ['Crédito médio', currency(metrics.averageCredit)],
    ['Custo incremental', currency(metrics.incrementalCost)],
    ['Valor incremental estimado', currency(calculateEconomics(economicsDefaults).total)],
    ['Utilização da frota participante', metrics.fleetUtilization + '%'],
  ];
  const funnel = [
    ['Interessados', metrics.interested],
    ['Reservaram experiência', metrics.reserved],
    ['Concluíram', metrics.completed],
    ['Registraram feedback', metrics.feedback],
    ['Solicitaram proposta', metrics.proposals],
    ['Assinaram EV', metrics.subscriptions],
  ] as const;
  return (
    <div className="container page executive-dashboard">
      <div className="actions">
        <ButtonLink href="/experiencia" secondary>
          Continuar jornada
        </ButtonLink>
        <ButtonLink href="/demo/reset" secondary>
          Reiniciar
        </ButtonLink>
      </div>
      <PageIntro
        eyebrow="VISÃO INTERNA · PILOTO CONCEITUAL"
        title="Da experiência à decisão de escalar."
        description="Uma locação paga pode se tornar um canal de aquisição. Este painel demonstra como testar a hipótese."
      />
      <div className="simulation-banner">
        <strong>DADOS 100% SIMULADOS — DEMONSTRAÇÃO DE COMO O PROGRAMA SERIA MEDIDO.</strong>
        <p>
          Coorte fictícia fixa; não representa dados da Localiza. Taxas têm como denominador
          experiências concluídas.
        </p>
      </div>
      {[
        ['Jornada do cliente', kpis.slice(0, 6)],
        ['Resultados do negócio', kpis.slice(6)],
      ].map(([title, values]) => (
        <section className="metrics-section" key={title as string}>
          <div className="eyebrow">
            {title === 'Jornada do cliente' ? 'JORNADA DO CLIENTE' : 'RESULTADOS DO NEGÓCIO'}
          </div>
          <h2>
            {title === 'Jornada do cliente'
              ? 'Da curiosidade à escolha.'
              : 'O que o piloto precisa demonstrar.'}
          </h2>
          <div className="metric-grid">
            {(values as typeof kpis).map(([label, value]) => (
              <article className="card" key={label}>
                <div className="metric-label">{label}</div>
                <div className="metric-value">{value}</div>
                <small>Dado simulado</small>
              </article>
            ))}
          </div>
        </section>
      ))}
      <div className="split-grid">
        <section className="card">
          <h2>Funil do programa</h2>
          <p className="microcopy">Coorte simulada · {metrics.interested} interessados</p>
          {funnel.map(([label, count]) => (
            <div className="chart-row" key={label}>
              <div>
                <span>{label}</span>
                <strong>{count}</strong>
              </div>
              <div className="bar-track">
                <div style={{ width: (count / metrics.interested) * 100 + '%' }} />
              </div>
            </div>
          ))}
        </section>
        <section className="card">
          <h2>Motivos de não conversão</h2>
          <p className="microcopy">
            {metrics.completed - metrics.subscriptions} concluintes sem assinatura · motivos
            simulados
          </p>
          {metrics.reasons.map((r) => (
            <div className="chart-row" key={r.label}>
              <div>
                <span>{r.label}</span>
                <strong>{r.count}</strong>
              </div>
              <div className="bar-track">
                <div
                  style={{
                    width: (r.count / (metrics.completed - metrics.subscriptions)) * 100 + '%',
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
      <section className="card local-record">
        <h2>Jornada local deste navegador</h2>
        <p>Registro separado da coorte simulada, sem agregação fictícia.</p>
        <dl className="summary-list">
          <dt>Estado</dt>
          <dd>{state.status}</dd>
          <dt>Grupo</dt>
          <dd>{state.rental?.group || 'Nenhuma reserva'}</dd>
          <dt>Decisão</dt>
          <dd>{state.feedback?.decision || 'Pendente'}</dd>
          <dt>Motivo</dt>
          <dd>{state.feedback?.reason || 'Ainda não registrado'}</dd>
          <dt>Comentário</dt>
          <dd>{state.feedback?.comment || 'Sem comentário'}</dd>
          <dt>Benefício aplicado simulado</dt>
          <dd>{currency(state.proposal?.credit || 0)}</dd>
        </dl>
      </section>
      <div className="economics-section">
        <div className="eyebrow">UNIT ECONOMICS · HIPÓTESE</div>
        <Economics />
      </div>
      <Experiment />
      <section className="card">
        <ConceptBadge />
        <h2>Ciclo do veículo</h2>
        <p className="microcopy">Modelo operacional proposto · não é política oficial.</p>
        <div className="asset-cycle">
          {[
            'Aquisição',
            'Localiza Aluguel',
            'Locações normais',
            'evLiza quando elegível',
            'Locações normais',
            'Desmobilização',
            'Localiza Seminovos',
          ].map((s, i) => (
            <div key={i}>
              <span>{s}</span>
              {i < 6 && <b aria-hidden="true">↓</b>}
            </div>
          ))}
        </div>
        <p>
          O evLiza não exige conceitualmente uma segunda frota. Ele adiciona uma finalidade
          comercial potencial a ativos participantes da operação de aluguel.
        </p>
      </section>
      <DemoDisclaimer />
    </div>
  );
}
