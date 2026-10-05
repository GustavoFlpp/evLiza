/** DADOS 100% SIMULADOS. Coorte fictícia separada da jornada local. */
import type { PilotMetrics, UnitEconomicsScenario, ABTestScenario } from '@/types';
export const pilotMetrics: PilotMetrics = {
  participants: 100,
  interested: 220,
  reserved: 100,
  completed: 88,
  feedback: 88,
  proposals: 36,
  subscriptions: 22,
  rentalRevenue: 63000,
  averageCredit: 315,
  incrementalCost: 8000,
  fleetUtilization: 68,
  reasons: [
    { label: 'Recarga', count: 24 },
    { label: 'Autonomia', count: 18 },
    { label: 'Rotina', count: 14 },
    { label: 'Custo percebido', count: 10 },
  ],
};
export const economicsDefaults: UnitEconomicsScenario = {
  conversionRate: 22,
  credit: 315,
  operatingCost: 80,
  opportunityCost: 60,
  contribution: 2400,
  participants: 100,
  rentalMargin: 180,
  utilizationImpact: 40,
  controlValue: 200,
};
export const abTestScenario: ABTestScenario = {
  control: 'Jornada comercial atual',
  treatment: 'Jornada comercial atual + oferta evLiza',
  primaryMetric: 'Conversão incremental para assinatura EV',
  validated: false,
};
export function calculateEconomics(p: UnitEconomicsScenario) {
  if (
    Object.values(p).some((v) => !Number.isFinite(v) || v < 0) ||
    p.conversionRate > 100 ||
    !Number.isInteger(p.participants)
  )
    throw new Error('Premissas inválidas');
  const netContribution = p.contribution - p.credit;
  const required =
    p.controlValue - p.rentalMargin + p.operatingCost + p.opportunityCost + p.utilizationImpact;
  const threshold =
    netContribution > 0 ? Math.max(0, (required / netContribution) * 100) : required < 0 ? 0 : null;
  const breakEvenRate = threshold !== null && threshold <= 100 ? threshold : null;
  const expectedSubscription = (p.conversionRate / 100) * p.contribution;
  const expectedCredit = (p.conversionRate / 100) * p.credit;
  const perParticipant =
    p.rentalMargin +
    expectedSubscription -
    expectedCredit -
    p.operatingCost -
    p.opportunityCost -
    p.utilizationImpact;
  return {
    breakEvenRate,
    perParticipant,
    total: perParticipant * p.participants,
    expectedCredit,
    delta: (perParticipant - p.controlValue) * p.participants,
  };
}
