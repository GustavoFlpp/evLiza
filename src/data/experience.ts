import type { RentalItem } from '@/types';
export const additionalItems: RentalItem[] = [
  { kind: 'PROTECTION', label: 'Proteção adicional ilustrativa', amount: 90 },
  { kind: 'EXTRA_FEE', label: 'Taxa ilustrativa', amount: 30 },
];
export const feedbackReasons = [
  'Recarga',
  'Autonomia',
  'Viagens',
  'Preço',
  'Wallbox',
  'Mudança de hábito',
  'Conforto/adaptação',
  'Experiência positiva',
  'Outro',
];
export const simulatedDistanceKm = 126;
export const guidance = [
  [
    'Primeira recarga',
    'Planeje os pontos de recarga e consulte as orientações do veículo entregue.',
  ],
  ['Autonomia', 'Observe como percurso, clima e uso influenciam sua rotina.'],
  ['Viagens', 'Planeje paradas e confirme a disponibilidade dos pontos antes de sair.'],
  [
    'Adaptação',
    'As condições operacionais seriam esclarecidas na agência. Este protótipo não oferece suporte real.',
  ],
];
