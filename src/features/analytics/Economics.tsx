'use client';
import { useState } from 'react';
import { economicsDefaults, calculateEconomics } from '@/data/pilotMetrics';
import { economicsControls as controls } from '@/config/economicsPilot';
import { currency } from '@/data/vehicles';
export function Economics() {
  const [p, setP] = useState({ ...economicsDefaults });
  const result = calculateEconomics(p);
  return (
    <section className="card economics">
      <div className="eyebrow">DADOS SIMULADOS — APENAS PARA DEMONSTRAÇÃO DO MODELO</div>
      <h2>Economia do programa</h2>
      <p>
        Margem da locação + (probabilidade de conversão × contribuição esperada da assinatura) −
        crédito de conversão esperado − custos incrementais − custo de oportunidade − impacto
        incremental de utilização.
      </p>
      <p className="microcopy">
        Crédito esperado = probabilidade de conversão × crédito por conversão. Não assumimos margem
        oficial.
      </p>
      <div className="split-grid">
        <div className="slider-grid">
          {controls.map((c) => (
            <label key={c.key}>
              {c.label}
              <strong>
                {c.percent
                  ? p[c.key] + '%'
                  : c.key === 'participants'
                    ? p[c.key]
                    : currency(p[c.key])}
              </strong>
              <input
                aria-label={c.label}
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={p[c.key]}
                onChange={(e) => setP({ ...p, [c.key]: Number(e.target.value) })}
              />
            </label>
          ))}
        </div>
        <div className="economic-result">
          <span className="badge">HIPÓTESE AINDA NÃO VALIDADA</span>
          <p>Valor incremental estimado por participante</p>
          <div className="price" data-testid="economics-per-person">
            {currency(result.perParticipant)}
          </div>
          <p data-testid="break-even">
            Break-even de conversão:{' '}
            <strong>
              {result.breakEvenRate === null
                ? 'Inviável dentro de 0–100% nestas premissas'
                : result.breakEvenRate.toFixed(2) +
                  '% (igualdade com controle; superar exige taxa maior)'}
            </strong>
          </p>
          <p>Total do cenário: {currency(result.total)}</p>
          <p>
            Diferença contra controle:{' '}
            <strong data-testid="economics-delta">{currency(result.delta)}</strong>
          </p>
          <div className="subtle-box">
            <strong>
              {result.delta > 0
                ? 'Cenário simulado supera o controle'
                : 'Cenário simulado não supera o controle'}
            </strong>
            <p>Só escalar se o valor incremental do programa superar o cenário controle.</p>
          </div>
          <p className="microcopy">
            Sensibilidade ilustrativa. Este resultado não demonstra lucratividade real.
          </p>
          <button
            className="button button-secondary"
            onClick={() => setP({ ...economicsDefaults })}
          >
            Restaurar parâmetros
          </button>
        </div>
      </div>
    </section>
  );
}
