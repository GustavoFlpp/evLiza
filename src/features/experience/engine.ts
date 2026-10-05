import { evProgramRules as rules, DAY_MS } from '@/config/evProgramRules';
import { RentalInventoryService as inventory } from '@/services/RentalInventoryService';
import { additionalItems, feedbackReasons, simulatedDistanceKm } from '@/data/experience';
import { getVehicle } from '@/data/vehicles';
import type { DemoState, Feedback, RentalItem } from '@/types';
export function createInitialState(): DemoState {
  return {
    version: 2,
    status: 'INTEREST',
    rental: null,
    feedback: null,
    proposal: null,
    benefitsUsed: 0,
    distanceKm: 0,
    demoStep: 0,
  };
}
export function eligibleAmount(items: RentalItem[]) {
  if (items.some((i) => !Number.isFinite(i.amount) || i.amount < 0))
    throw new Error('Valor inválido');
  return (
    Math.round(
      items.filter((i) => i.kind === 'RENTAL_BASE').reduce((a, i) => a + i.amount, 0) * 100,
    ) / 100
  );
}
export function calculateCredit(
  items: RentalItem[],
  rate = rules.creditRate,
  cap = rules.maximumConversionCredit,
) {
  if (!Number.isFinite(rate) || rate < 0 || rate > 1 || !Number.isFinite(cap) || cap < 0)
    throw new Error('Parâmetro inválido');
  return Math.round(Math.min(eligibleAmount(items) * rate, cap) * 100) / 100;
}
export function reserve(
  state: DemoState,
  inventoryId: string,
  startDate: string,
  days: number,
  now = new Date(),
): DemoState {
  if (state.status !== 'INTEREST') throw new Error('Reinicie para uma nova experiência');
  const item = inventory.get(inventoryId);
  if (!inventory.canReserve(item)) throw new Error('Sem disponibilidade para este grupo');
  if (
    !Number.isInteger(days) ||
    days < rules.minimumExperienceDays ||
    days > rules.maximumExperienceDays
  )
    throw new Error('Duração fora dos parâmetros do piloto');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !Number.isFinite(Date.parse(startDate)) ||
    new Date(startDate).toISOString().slice(0, 10) !== startDate ||
    startDate < now.toISOString().slice(0, 10)
  )
    throw new Error('Escolha uma data válida a partir de hoje');
  return {
    ...state,
    status: 'RESERVED',
    rental: {
      inventoryId,
      city: item!.city,
      agency: item!.agency,
      group: item!.group,
      startDate,
      endDate: new Date(Date.parse(startDate) + days * DAY_MS).toISOString().slice(0, 10),
      days,
      items: [
        { kind: 'RENTAL_BASE', label: 'Valor base elegível', amount: item!.dailyPrice * days },
        ...additionalItems.map((i) => ({ ...i })),
      ],
      returnedAt: null,
    },
  };
}
export function startExperience(s: DemoState): DemoState {
  if (s.status !== 'RESERVED' || !s.rental) throw new Error('Reserve primeiro');
  return { ...s, status: 'ACTIVE', distanceKm: simulatedDistanceKm };
}
export function finishExperience(s: DemoState, now = new Date()): DemoState {
  if (s.status !== 'ACTIVE' || !s.rental) throw new Error('Experiência não está ativa');
  return { ...s, status: 'RETURNED', rental: { ...s.rental, returnedAt: now.toISOString() } };
}
export function recordFeedback(
  s: DemoState,
  decision: Feedback['decision'],
  reason: string,
  comment: string,
  now = new Date(),
): DemoState {
  if (s.status !== 'RETURNED') throw new Error('Finalize e devolva antes do feedback');
  if (
    !['SUBSCRIBE', 'UNSURE', 'NO_SUBSCRIPTION'].includes(decision) ||
    !feedbackReasons.includes(reason)
  )
    throw new Error('Escolha decisão e motivo');
  if (comment.length > rules.commentMaxLength) throw new Error('Comentário muito longo');
  return {
    ...s,
    status: decision === 'SUBSCRIBE' ? 'DECIDED' : 'CLOSED',
    feedback: { decision, reason, comment: comment.trim(), recordedAt: now.toISOString() },
  };
}
export function conversionEligibility(
  s: DemoState,
  modelId: string,
  now = new Date(),
  hasOtherBenefit = false,
) {
  if (
    !s.rental?.returnedAt ||
    (rules.experienceFeedbackRequired && s.feedback?.decision !== 'SUBSCRIBE')
  )
    return 'Conclua a experiência e escolha assinatura';
  const elapsed = now.getTime() - Date.parse(s.rental.returnedAt);
  if (elapsed < 0 || elapsed > rules.conversionWindowDays * DAY_MS)
    return 'Janela de conversão encerrada';
  if (
    !rules.experienceEnabled ||
    !rules.eligibleCities.includes(s.rental.city) ||
    !rules.eligibleRentalGroups.includes(s.rental.group)
  )
    return 'Experiência fora dos critérios do programa';
  const model = getVehicle(modelId);
  if (
    !rules.eligibleSubscriptionModels.includes(modelId) ||
    !model?.available ||
    model.powertrain !== 'EV'
  )
    return 'Modelo não elegível';
  if (s.benefitsUsed >= rules.maximumBenefitsPerCustomer) return 'Limite de benefícios atingido';
  if (hasOtherBenefit && !rules.allowBenefitStacking) return 'Benefícios não cumulativos';
  return null;
}
export function requestProposal(s: DemoState, modelId: string, now = new Date()): DemoState {
  if (s.status !== 'DECIDED') throw new Error('Decisão necessária');
  const reason = conversionEligibility(s, modelId, now);
  if (reason) throw new Error(reason);
  return {
    ...s,
    status: 'PROPOSAL_REQUESTED',
    proposal: { modelId, requestedAt: now.toISOString(), approval: 'PENDING', credit: 0 },
  };
}
export function simulateApproval(s: DemoState, approved: boolean, now = new Date()): DemoState {
  if (s.status !== 'PROPOSAL_REQUESTED' || !s.proposal)
    throw new Error('Solicite uma proposta primeiro');
  if (rules.requireSubscriptionApproval && !approved)
    throw new Error('Assinatura depende de aprovação; benefício não aplicado');
  const reason = conversionEligibility(s, s.proposal.modelId, now);
  if (reason) throw new Error(reason);
  return {
    ...s,
    status: 'WAITING',
    benefitsUsed: s.benefitsUsed + 1,
    proposal: { ...s.proposal, approval: 'APPROVED', credit: calculateCredit(s.rental!.items) },
  };
}
export function conversionBenefit(s: DemoState, modelId: string, now = new Date()) {
  const base = eligibleAmount(s.rental?.items || []);
  const reason = conversionEligibility(s, modelId, now);
  return {
    eligibleAmount: base,
    calculatedCredit: base * rules.creditRate,
    conversionCredit: reason ? 0 : calculateCredit(s.rental!.items),
    reason,
  };
}
