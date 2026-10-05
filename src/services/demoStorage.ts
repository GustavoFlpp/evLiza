import { z } from 'zod';
import { createInitialState, eligibleAmount, calculateCredit } from '@/features/experience/engine';
import { RentalInventoryService } from './RentalInventoryService';
import { getVehicle } from '@/data/vehicles';
import { evProgramRules as rules } from '@/config/evProgramRules';
import { feedbackReasons } from '@/data/experience';
import type { DemoState } from '@/types';
export const STORAGE_KEY = 'localiza.evliza.demo.v2';
// Compatibility with journeys saved before the product was renamed.
export const LEGACY_STORAGE_KEY = 'localiza.ev-sem-medo.demo.v2';
const schema = z.object({
  version: z.literal(2),
  status: z.enum([
    'INTEREST',
    'RESERVED',
    'ACTIVE',
    'RETURNED',
    'DECIDED',
    'PROPOSAL_REQUESTED',
    'WAITING',
    'CLOSED',
  ]),
  distanceKm: z.number().nonnegative(),
  benefitsUsed: z.number().int().nonnegative(),
  demoStep: z.number().int().min(0).max(11).default(0),
  rental: z
    .object({
      inventoryId: z.string(),
      city: z.string(),
      agency: z.string(),
      group: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      days: z.number().int().positive(),
      returnedAt: z.string().datetime().nullable(),
      items: z.array(
        z.object({
          kind: z.enum([
            'RENTAL_BASE',
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
          ]),
          label: z.string(),
          amount: z.number().nonnegative(),
        }),
      ),
    })
    .nullable(),
  feedback: z
    .object({
      decision: z.enum(['SUBSCRIBE', 'UNSURE', 'NO_SUBSCRIPTION']),
      reason: z.string(),
      comment: z.string().max(rules.commentMaxLength),
      recordedAt: z.string().datetime(),
    })
    .nullable(),
  proposal: z
    .object({
      modelId: z.string(),
      requestedAt: z.string().datetime(),
      approval: z.enum(['PENDING', 'APPROVED']),
      credit: z.number().nonnegative(),
    })
    .nullable(),
});
export function decodeState(raw: string): DemoState {
  const s: DemoState = schema.parse(JSON.parse(raw));
  const r = s.rental;
  if (s.status === 'INTEREST' && (r || s.feedback || s.proposal || s.benefitsUsed))
    throw new Error('Estado inicial inválido');
  if (s.status !== 'INTEREST' && !r) throw new Error('Locação ausente');
  if (r) {
    const item = RentalInventoryService.get(r.inventoryId);
    if (
      !item ||
      r.city !== item.city ||
      r.group !== item.group ||
      r.agency !== item.agency ||
      r.days < rules.minimumExperienceDays ||
      r.days > rules.maximumExperienceDays ||
      Date.parse(r.endDate) - Date.parse(r.startDate) !== r.days * 86400000 ||
      eligibleAmount(r.items) !== item.dailyPrice * r.days
    )
      throw new Error('Locação inconsistente');
    if (
      ['RETURNED', 'DECIDED', 'PROPOSAL_REQUESTED', 'WAITING', 'CLOSED'].includes(s.status) !==
      !!r.returnedAt
    )
      throw new Error('Devolução inconsistente');
  }
  if (['DECIDED', 'PROPOSAL_REQUESTED', 'WAITING', 'CLOSED'].includes(s.status) !== !!s.feedback)
    throw new Error('Feedback inconsistente');
  if (
    s.feedback &&
    (!feedbackReasons.includes(s.feedback.reason) ||
      (s.status === 'CLOSED') !== (s.feedback.decision !== 'SUBSCRIBE'))
  )
    throw new Error('Decisão inválida');
  if (['PROPOSAL_REQUESTED', 'WAITING'].includes(s.status) !== !!s.proposal)
    throw new Error('Proposta inconsistente');
  if (
    s.proposal &&
    (!rules.eligibleSubscriptionModels.includes(s.proposal.modelId) ||
      !getVehicle(s.proposal.modelId))
  )
    throw new Error('Modelo inválido');
  if (
    s.status === 'PROPOSAL_REQUESTED' &&
    (s.proposal!.approval !== 'PENDING' || s.proposal!.credit !== 0 || s.benefitsUsed)
  )
    throw new Error('Proposta inválida');
  if (
    s.status === 'WAITING' &&
    (s.proposal!.approval !== 'APPROVED' ||
      s.proposal!.credit !== calculateCredit(r!.items) ||
      s.benefitsUsed !== 1)
  )
    throw new Error('Benefício inválido');
  if (s.status !== 'WAITING' && s.benefitsUsed) throw new Error('Uso prematuro');
  return s;
}
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export function loadDemo(storage: StorageAdapter) {
  const raw = storage.getItem(STORAGE_KEY) ?? storage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return { state: createInitialState(), recovered: false };
  try {
    return { state: decodeState(raw), recovered: false };
  } catch {
    storage.removeItem(STORAGE_KEY);
    storage.removeItem(LEGACY_STORAGE_KEY);
    return { state: createInitialState(), recovered: true };
  }
}
export function saveDemo(storage: StorageAdapter, s: DemoState) {
  storage.setItem(STORAGE_KEY, JSON.stringify(s));
  storage.removeItem(LEGACY_STORAGE_KEY);
}
export function resetDemo(storage: StorageAdapter) {
  storage.removeItem(STORAGE_KEY);
  storage.removeItem(LEGACY_STORAGE_KEY);
  storage.removeItem('localiza.evliza.demo.v1');
  storage.removeItem('localiza.ev-sem-medo.demo.v1');
  return createInitialState();
}
