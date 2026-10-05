import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  eligibleAmount,
  calculateCredit,
  reserve,
  startExperience,
  finishExperience,
  recordFeedback,
  conversionEligibility,
  conversionBenefit,
  requestProposal,
  simulateApproval,
} from '@/features/experience/engine';
import {
  decodeState,
  loadDemo,
  saveDemo,
  resetDemo,
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  type StorageAdapter,
} from '@/services/demoStorage';
import { RentalInventoryService as inventory } from '@/services/RentalInventoryService';
import {
  calculateEconomics,
  economicsDefaults,
  pilotMetrics,
  abTestScenario,
} from '@/data/pilotMetrics';
import { evProgramRules as rules, DAY_MS } from '@/config/evProgramRules';
import type { RentalItem } from '@/types';
const now = new Date('2026-10-05T12:00:00Z');
const reserved = () => reserve(createInitialState(), 'sp-compact', '2026-10-05', 3, now);
const returned = () => finishExperience(startExperience(reserved()), now);
const decided = () =>
  recordFeedback(returned(), 'SUBSCRIBE', 'Experiência positiva', ' Ótimo ', now);
function storage(): StorageAdapter {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}
describe('Frota e locação paga', () => {
  it('lista cidades, disponibilidade e capacidade limitada', () => {
    expect(inventory.list('São Paulo')).toHaveLength(2);
    expect(inventory.canReserve(inventory.get('sp-compact'))).toBe(true);
    expect(inventory.canReserve(inventory.get('sp-urban'))).toBe(true);
    expect(inventory.canReserve(inventory.get('ct-urban'))).toBe(false);
    expect(inventory.canReserve(undefined)).toBe(false);
    expect(inventory.list('Cidade inexistente')).toEqual([]);
  });
  it('cota, reserva por grupo e calcula datas', () => {
    const s = reserved();
    expect(s.status).toBe('RESERVED');
    expect(s.rental?.endDate).toBe('2026-10-08');
    expect(eligibleAmount(s.rental!.items)).toBe(630);
    expect(s.rental!.items.reduce((n, i) => n + i.amount, 0)).toBe(750);
  });
  it('bloqueia indisponibilidade, data inválida, duração e dupla reserva', () => {
    expect(() => reserve(createInitialState(), 'ct-urban', '2026-10-05', 3, now)).toThrow(
      /disponibilidade/,
    );
    for (const date of ['2026-10-04', '2026-02-30', 'invalid', '2026-10-05T12:00:00Z'])
      expect(() => reserve(createInitialState(), 'sp-compact', date, 3, now)).toThrow();
    for (const days of [0, 1, 8, 2.5])
      expect(() => reserve(createInitialState(), 'sp-compact', '2026-10-05', days, now)).toThrow();
    expect(() => reserve(reserved(), 'sp-urban', '2026-10-05', 3, now)).toThrow();
  });
});
describe('Base e benefício comercial', () => {
  it('soma exclusivamente a base elegível', () => {
    const kinds: RentalItem['kind'][] = [
      'PROTECTION',
      'TOLL',
      'PARKING',
      'FINE',
      'DAMAGE',
      'EXTRA_HOUR',
      'EXTRA_FEE',
      'ENERGY',
      'FUEL',
      'EXTRA_SERVICE',
      'OTHER',
    ];
    const items: RentalItem[] = [
      { kind: 'RENTAL_BASE', label: 'Base', amount: 100.1 },
      { kind: 'RENTAL_BASE', label: 'Base 2', amount: 200.2 },
      ...kinds.map((kind) => ({ kind, label: kind, amount: 1000 })),
    ];
    expect(eligibleAmount(items)).toBe(300.3);
    expect(calculateCredit(items)).toBe(150.15);
    expect(calculateCredit(kinds.map((kind) => ({ kind, label: kind, amount: 1000 })))).toBe(0);
  });
  it('aplica taxa, teto e arredondamento monetário', () => {
    expect(calculateCredit([{ kind: 'RENTAL_BASE', label: 'Base', amount: 10000 }])).toBe(
      rules.maximumConversionCredit,
    );
    expect(calculateCredit([])).toBe(0);
    expect(() => calculateCredit([], 2)).toThrow();
    expect(() => eligibleAmount([{ kind: 'OTHER', label: 'Inválido', amount: -1 }])).toThrow();
    expect(() => calculateCredit([], 0.5, NaN)).toThrow();
  });
  it('zera fora da janela, no limite de uso e sem decisão positiva', () => {
    const s = decided();
    expect(conversionBenefit(s, 'dolphin', now).conversionCredit).toBe(315);
    expect(
      conversionBenefit(s, 'dolphin', new Date(now.getTime() + rules.conversionWindowDays * DAY_MS))
        .conversionCredit,
    ).toBe(315);
    expect(
      conversionBenefit(
        s,
        'dolphin',
        new Date(now.getTime() + rules.conversionWindowDays * DAY_MS + 1),
      ).conversionCredit,
    ).toBe(0);
    expect(conversionBenefit({ ...s, benefitsUsed: 1 }, 'dolphin', now).conversionCredit).toBe(0);
    expect(conversionBenefit(returned(), 'dolphin', now).conversionCredit).toBe(0);
    expect(conversionEligibility(s, 'dolphin', now, true)).toMatch(/cumulativos/);
    expect(conversionEligibility(s, 'corolla', now)).toMatch(/elegível/);
  });
});
describe('Máquina de estados', () => {
  it('exige retirada antes da devolução e devolução antes do feedback', () => {
    expect(() => finishExperience(reserved(), now)).toThrow();
    expect(() =>
      recordFeedback(startExperience(reserved()), 'SUBSCRIBE', 'Recarga', '', now),
    ).toThrow();
    expect(returned().rental?.returnedAt).toBe(now.toISOString());
    expect(() => recordFeedback(returned(), 'SUBSCRIBE', 'Inválido', '', now)).toThrow();
    expect(decided().feedback?.comment).toBe('Ótimo');
  });
  it('proposta depende de aprovação e usa benefício uma vez', () => {
    const p = requestProposal(decided(), 'dolphin', now);
    expect(p.proposal?.credit).toBe(0);
    expect(() => simulateApproval(p, false, now)).toThrow(/aprovação/);
    const approved = simulateApproval(p, true, now);
    expect(approved.status).toBe('WAITING');
    expect(approved.proposal?.credit).toBe(315);
    expect(approved.benefitsUsed).toBe(1);
    expect(() => simulateApproval(approved, true, now)).toThrow();
    expect(() => requestProposal(returned(), 'dolphin', now)).toThrow();
  });
  it.each(['NO_SUBSCRIPTION', 'UNSURE'] as const)(
    'registra %s sem proposta ou crédito',
    (decision) => {
      const s = recordFeedback(returned(), decision, 'Recarga', 'Sem ponto de recarga', now);
      expect(s.status).toBe('CLOSED');
      expect(s.feedback?.decision).toBe(decision);
      expect(s.proposal).toBeNull();
      expect(conversionBenefit(s, 'dolphin', now).conversionCredit).toBe(0);
      expect(() => requestProposal(s, 'dolphin', now)).toThrow();
    },
  );
});
describe('Persistência e reset', () => {
  it('restaura todos os estados e o roteiro no refresh', () => {
    const states = [
      createInitialState(),
      reserved(),
      startExperience(reserved()),
      returned(),
      decided(),
      requestProposal(decided(), 'dolphin', now),
      simulateApproval(requestProposal(decided(), 'dolphin', now), true, now),
      recordFeedback(returned(), 'UNSURE', 'Recarga', '', now),
    ];
    for (const s of states) {
      const adapter = storage();
      const expected = { ...s, demoStep: 5 };
      saveDemo(adapter, expected);
      expect(loadDemo(adapter).state).toEqual(expected);
      expect(loadDemo(adapter).recovered).toBe(false);
    }
  });
  it('recupera JSON inválido, versão antiga e estado inconsistente', () => {
    for (const raw of [
      'broken',
      JSON.stringify({ version: 1 }),
      JSON.stringify({ ...reserved(), status: 'WAITING' }),
      JSON.stringify({ ...decided(), feedback: { ...decided().feedback, decision: 'UNSURE' } }),
    ]) {
      const adapter = storage();
      adapter.setItem(STORAGE_KEY, raw);
      expect(loadDemo(adapter).recovered).toBe(true);
      expect(loadDemo(adapter).state).toEqual(createInitialState());
    }
    expect(() =>
      decodeState(JSON.stringify({ ...reserved(), rental: { ...reserved().rental, days: 7 } })),
    ).toThrow();
  });
  it('reset apaga somente chaves da demo e restaura mocks', () => {
    const adapter = storage();
    saveDemo(adapter, decided());
    adapter.setItem('unrelated', 'preserve');
    adapter.setItem('localiza.evliza.demo.v1', 'old');
    expect(resetDemo(adapter)).toEqual(createInitialState());
    expect(adapter.getItem(STORAGE_KEY)).toBeNull();
    expect(adapter.getItem('localiza.evliza.demo.v1')).toBeNull();
    expect(adapter.getItem('unrelated')).toBe('preserve');
    expect(inventory.canReserve(inventory.get('sp-compact'))).toBe(true);
  });
});
describe('Analytics e viabilidade conceitual', () => {
  it('mantém coorte consistente e hipótese não validada', () => {
    const m = pilotMetrics;
    expect(m.interested).toBeGreaterThanOrEqual(m.reserved);
    expect(m.reserved).toBeGreaterThanOrEqual(m.completed);
    expect(m.completed).toBeGreaterThanOrEqual(m.feedback);
    expect(m.feedback).toBeGreaterThanOrEqual(m.proposals);
    expect(m.proposals).toBeGreaterThanOrEqual(m.subscriptions);
    expect(m.reasons.reduce((a, r) => a + r.count, 0)).toBe(m.completed - m.subscriptions);
    expect(m.reasons.reduce((a, r) => a + r.count, 0) + m.subscriptions).toBeLessThanOrEqual(
      m.feedback,
    );
    expect(abTestScenario.validated).toBe(false);
  });
  it('calcula valor esperado, custos, controle e break-even', () => {
    const r = calculateEconomics(economicsDefaults);
    expect(r.perParticipant).toBeCloseTo(458.7);
    expect(r.total).toBeCloseTo(45870);
    expect(r.delta).toBeCloseTo(25870);
    expect(r.breakEvenRate).toBeCloseTo((200 / 2085) * 100);
    expect(
      calculateEconomics({ ...economicsDefaults, conversionRate: r.breakEvenRate! }).delta,
    ).toBeCloseTo(0);
    expect(calculateEconomics({ ...economicsDefaults, contribution: 0 }).breakEvenRate).toBeNull();
    expect(calculateEconomics({ ...economicsDefaults, controlValue: 0 }).breakEvenRate).toBe(0);
    expect(
      calculateEconomics({ ...economicsDefaults, contribution: 316 }).breakEvenRate,
    ).toBeNull();
    expect(() => calculateEconomics({ ...economicsDefaults, conversionRate: 101 })).toThrow();
  });
});

describe('evLiza: continuidade das jornadas anteriores', () => {
  it('retoma uma jornada anterior e salva as próximas ações com o novo nome', () => {
    const adapter = storage();
    const before = startExperience(reserved());
    adapter.setItem(LEGACY_STORAGE_KEY, JSON.stringify(before));
    expect(loadDemo(adapter)).toEqual({ state: before, recovered: false });
    const after = finishExperience(before, now);
    saveDemo(adapter, after);
    expect(adapter.getItem(LEGACY_STORAGE_KEY)).toBeNull();
    expect(loadDemo(adapter).state).toEqual(after);
  });
  it('reiniciar remove as chaves de ambas as marcas e preserva outras aplicações', () => {
    const adapter = storage();
    adapter.setItem(LEGACY_STORAGE_KEY, JSON.stringify(reserved()));
    saveDemo(adapter, returned());
    adapter.setItem(LEGACY_STORAGE_KEY, JSON.stringify(reserved()));
    adapter.setItem('outra-aplicacao', 'preservar');
    resetDemo(adapter);
    expect(adapter.getItem(STORAGE_KEY)).toBeNull();
    expect(adapter.getItem(LEGACY_STORAGE_KEY)).toBeNull();
    expect(adapter.getItem('outra-aplicacao')).toBe('preservar');
  });
});
