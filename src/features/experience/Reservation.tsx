'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { evProgramRules as rules, DAY_MS } from '@/config/evProgramRules';
import {
  RentalInventoryService as inventory,
  rentalGroups,
} from '@/services/RentalInventoryService';
import { additionalItems } from '@/data/experience';
import { currency } from '@/data/vehicles';
import { CarIllustration } from '@/components/CarIllustration';
import { PageIntro, ButtonLink } from '@/components/UI';
import { ConceptBadge, DemoDisclaimer } from '@/components/DemoDisclaimer';
import { JourneyFallback } from './CustomerJourney';
import { useDemo } from './DemoProvider';
import { reserve, startExperience, calculateCredit } from './engine';
export function Reservation() {
  const { state, run, ready } = useDemo();
  const router = useRouter();
  const [city, setCity] = useState(rules.eligibleCities[0]);
  const [inventoryId, setInventoryId] = useState('sp-compact');
  const [days, setDays] = useState(rules.defaultExperienceDays);
  const [date, setDate] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const pickup = date || today;
  const choices = inventory.list(city);
  const selected = inventory.get(inventoryId);
  const base = (selected?.dailyPrice || 0) * days;
  const items = [
    { kind: 'RENTAL_BASE' as const, label: 'Valor base elegível', amount: base },
    ...additionalItems,
  ];
  const total = items.reduce((a, i) => a + i.amount, 0);
  const end = new Date(Date.parse(pickup + 'T12:00:00Z') + days * DAY_MS);
  if (!ready)
    return (
      <div className="container page">
        <h1>Preparando sua experiência…</h1>
      </div>
    );
  if (state.status !== 'INTEREST') return <JourneyFallback />;
  return (
    <div className="container page">
      <ConceptBadge />
      <PageIntro
        eyebrow="01 · CONSULTAR DISPONIBILIDADE"
        title="Experimente um veículo elétrico disponível."
        description="Escolha sua rotina de locação. Modelos exibidos apenas como referência do protótipo."
      />
      <div className="booking-layout">
        <div>
          <div className="card booking-fields">
            <label>
              Cidade de retirada
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setInventoryId(inventory.list(e.target.value)[0]?.id || '');
                }}
              >
                {rules.eligibleCities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Agência
              <select
                value={selected?.agency || ''}
                onChange={(e) =>
                  setInventoryId(choices.find((i) => i.agency === e.target.value)?.id || '')
                }
              >
                {[...new Set(choices.map((i) => i.agency))].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <label>
              Data de retirada
              <input
                type="date"
                min={today}
                value={pickup}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Data de devolução · calculada pela duração
              <input type="date" value={end.toISOString().slice(0, 10)} readOnly />
            </label>
            <label>
              Duração · parâmetro ilustrativo
              <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                {Array.from(
                  { length: rules.maximumExperienceDays - rules.minimumExperienceDays + 1 },
                  (_, i) => i + rules.minimumExperienceDays,
                ).map((d) => (
                  <option key={d} value={d}>
                    {d} dias
                  </option>
                ))}
              </select>
            </label>
          </div>
          <h2 className="section-title">Grupo elétrico disponível</h2>
          <div className="inventory-grid">
            {choices.map((i) => (
              <article
                className={
                  'vehicle-card inventory-card ' + (inventoryId === i.id ? 'selected' : '')
                }
                key={i.id}
              >
                <div className="vehicle-art">
                  <span className="vehicle-tag">
                    {i.availabilityStatus === 'AVAILABLE'
                      ? 'Disponível'
                      : i.availabilityStatus === 'LIMITED'
                        ? 'Últimas unidades · simulação'
                        : 'Indisponível'}
                  </span>
                  <CarIllustration color={i.color} />
                </div>
                <div className="vehicle-card-body">
                  <h3>{i.group}</h3>
                  <p>Veículos similares a {i.reference}</p>
                  <p className="microcopy">Modelo sujeito à disponibilidade do grupo na agência.</p>
                  <strong>{currency(i.dailyPrice)}/dia · fictício</strong>
                  <p>{i.agency}</p>
                  <p>
                    {rentalGroups[i.group].seats} lugares ·{' '}
                    {rentalGroups[i.group].features.join(' · ')} · simulado
                  </p>
                  <button
                    className="button button-secondary full"
                    onClick={() => setInventoryId(i.id)}
                    disabled={!inventory.canReserve(i)}
                  >
                    {inventory.canReserve(i)
                      ? inventoryId === i.id
                        ? 'Grupo selecionado'
                        : 'Selecionar grupo'
                      : 'Indisponível'}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="subtle-box">
            O programa utiliza somente veículos disponíveis na operação de aluguel. Não pressupõe
            frota dedicada. Disponibilidade simulada.
          </p>
        </div>
        <aside className="card booking-summary">
          <div className="eyebrow">02 · RESUMO DA RESERVA</div>
          <h2>Sua experiência</h2>
          <dl className="summary-list">
            <dt>Grupo</dt>
            <dd>{selected?.group}</dd>
            <dt>Cidade/agência</dt>
            <dd>
              {selected?.city} · {selected?.agency}
            </dd>
            <dt>Retirada</dt>
            <dd>{pickup.split('-').reverse().join('/')}</dd>
            <dt>Devolução</dt>
            <dd>{end.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</dd>
            <dt>Duração</dt>
            <dd>{days} dias · ilustrativo</dd>
            {items.map((i) => (
              <div className="summary-row" key={i.kind}>
                <dt>
                  {i.label}
                  <small className={i.kind === 'RENTAL_BASE' ? 'eligibility yes' : 'eligibility'}>
                    {i.kind === 'RENTAL_BASE' ? 'GERA BENEFÍCIO' : 'NÃO GERA BENEFÍCIO'}
                  </small>
                </dt>
                <dd>{currency(i.amount)}</dd>
              </div>
            ))}
            <dt>Total fictício</dt>
            <dd className="price">{currency(total)}</dd>
          </dl>
          <div className="subtle-box">
            <strong>Esta experiência pode gerar benefício na sua futura assinatura.</strong>
            <p>
              Se contratar um elétrico elegível dentro da janela do programa, parte do valor base
              poderá se tornar benefício.
            </p>
            <strong>Até {currency(calculateCredit(items))} neste cenário</strong>
            <p className="microcopy">Estimativa ilustrativa, sujeita às regras e aprovação.</p>
          </div>
          <DemoDisclaimer />
          <button
            className="button full"
            disabled={!ready || !inventory.canReserve(selected)}
            onClick={() => {
              if (run((s) => reserve(s, inventoryId, pickup, days)))
                router.push('/experiencia/reserva');
            }}
          >
            Reservar experiência
          </button>
          <p className="microcopy">Reserva simulada · sem pagamento real.</p>
        </aside>
      </div>
    </div>
  );
}
export function ReservationConfirmed() {
  const { state, run, ready } = useDemo();
  const router = useRouter();
  if (!ready || state.status !== 'RESERVED') return <JourneyFallback />;
  return (
    <div className="container page narrow">
      <ConceptBadge />
      <PageIntro
        eyebrow="RESERVA SIMULADA"
        title={state.rental ? 'Experiência reservada.' : 'Escolha sua experiência.'}
        description="Locação paga, com valores fictícios. Nenhum pagamento foi realizado."
      />
      {state.rental ? (
        <div className="card">
          <h2>{state.rental.group}</h2>
          <p>
            {state.rental.city} · {state.rental.days} dias
          </p>
          <p>Retirada e início da experiência representados apenas para demonstração.</p>
          {state.status === 'RESERVED' ? (
            <button
              disabled={!ready}
              className="button"
              onClick={() => {
                if (run(startExperience)) router.push('/experiencia/ativa');
              }}
            >
              Simular retirada e iniciar
            </button>
          ) : (
            <ButtonLink href="/experiencia/ativa">Continuar jornada</ButtonLink>
          )}
        </div>
      ) : (
        <ButtonLink href="/experiencia">Consultar disponibilidade</ButtonLink>
      )}
      <DemoDisclaimer />
    </div>
  );
}
