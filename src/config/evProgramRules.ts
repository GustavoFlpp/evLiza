/** PARÂMETROS ILUSTRATIVOS DO PILOTO; nunca condições oficiais. */
export const evProgramRules = {
  experienceEnabled: true,
  eligibleCities: ['São Paulo', 'Belo Horizonte', 'Curitiba'],
  eligibleRentalGroups: ['EV Urbano', 'EV Compacto'],
  eligibleSubscriptionModels: ['dolphin', 'dolphin-mini', 'yuan'],
  minimumExperienceDays: 2,
  maximumExperienceDays: 7,
  defaultExperienceDays: 3,
  conversionWindowDays: 30,
  creditRate: 0.5,
  maximumConversionCredit: 500,
  maximumBenefitsPerCustomer: 1,
  requireSubscriptionApproval: true,
  allowBenefitStacking: false,
  pilotMode: true,
  experienceFeedbackRequired: true,
  subscriptionMonths: 36,
  monthlyKmAllowance: 1000,
  commentMaxLength: 240,
};
export const DAY_MS = 86_400_000;
export const pilotDisclaimer =
  'Valores e condições ilustrativos para demonstração. As regras comerciais dependeriam de validação financeira, jurídica e operacional.';
export const independentDisclaimer =
  'Protótipo conceitual independente. Não representa produto, oferta ou política oficial da Localiza.';
