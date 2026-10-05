import type { UnitEconomicsScenario } from '@/types';
/** Limites de sensibilidade simulados, sem números comerciais oficiais. */
export const economicsControls: {
  key: keyof UnitEconomicsScenario;
  label: string;
  min: number;
  max: number;
  step: number;
  percent?: boolean;
}[] = [
  { key: 'conversionRate', label: 'Taxa de conversão', min: 0, max: 100, step: 1, percent: true },
  { key: 'credit', label: 'Crédito por conversão', min: 0, max: 1000, step: 25 },
  {
    key: 'operatingCost',
    label: 'Custo operacional por participante',
    min: 0,
    max: 500,
    step: 10,
  },
  {
    key: 'opportunityCost',
    label: 'Custo de oportunidade por participante',
    min: 0,
    max: 500,
    step: 10,
  },
  {
    key: 'contribution',
    label: 'Contribuição esperada da assinatura',
    min: 0,
    max: 6000,
    step: 100,
  },
  { key: 'participants', label: 'Quantidade de participantes', min: 10, max: 1000, step: 10 },
  { key: 'rentalMargin', label: 'Margem simulada da locação', min: 0, max: 600, step: 10 },
  {
    key: 'utilizationImpact',
    label: 'Custo incremental de uso do ativo',
    min: 0,
    max: 500,
    step: 10,
  },
  {
    key: 'controlValue',
    label: 'Valor do cenário controle por participante',
    min: 0,
    max: 1000,
    step: 10,
  },
];
