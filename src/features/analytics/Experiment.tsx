import { ConceptBadge } from '@/components/DemoDisclaimer';
import { abTestScenario } from '@/data/pilotMetrics';
export function Experiment() {
  return (
    <section className="card">
      <ConceptBadge />
      <h2>Como provaríamos se funciona?</h2>
      <span className="badge">HIPÓTESE NÃO VALIDADA.</span>
      <div className="split-grid">
        <div className="subtle-box">
          <h3>Controle</h3>
          <p>{abTestScenario.control}.</p>
        </div>
        <div className="subtle-box">
          <h3>Tratamento</h3>
          <p>{abTestScenario.treatment}.</p>
        </div>
      </div>
      <p>
        <strong>Métrica primária:</strong> conversão incremental para assinatura EV.
      </p>
      <p>
        Distribuição aleatória entre grupos comparáveis; tamanho de amostra e janela definidos antes
        do piloto. Medir intenção de tratamento, controle de sazonalidade e disponibilidade, com
        intervalo de confiança.
      </p>
      <div className="experiment-metrics">
        {[
          'Interesse → experiência',
          'Experiência concluída',
          'Experiência → proposta',
          'Proposta → assinatura',
          'Experiência → assinatura',
          'EV → ICE',
          'Receita de aluguel',
          'Benefício por conversão',
          'Custo por assinatura incremental',
          'Utilização da frota',
          'Satisfação',
          'Motivos de desistência',
          'Canibalização',
        ].map((m) => (
          <div className="subtle-box" key={m}>
            {m}
          </div>
        ))}
      </div>
      <p className="microcopy">
        EV → ICE mede escolha posterior de motorização. Nenhum resultado real disponível.
        Canibalização: locações/assinaturas que ocorreriam sem o programa.
      </p>
    </section>
  );
}
