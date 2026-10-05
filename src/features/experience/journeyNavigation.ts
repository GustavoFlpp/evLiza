import type { DemoState } from '@/types';
export const journeyDestinations: Record<DemoState['status'], string> = {
  INTEREST: '/experiencia',
  RESERVED: '/experiencia/reserva',
  ACTIVE: '/experiencia/ativa',
  RETURNED: '/experiencia/feedback',
  DECIDED: '/assinatura',
  PROPOSAL_REQUESTED: '/assinatura',
  WAITING: '/assinatura/aguardando',
  CLOSED: '/experiencia/concluida',
};
