export interface Vehicle {
  id: string;
  name: string;
  category: string;
  powertrain: 'EV' | 'HYBRID' | 'ICE';
  rangeKm?: number;
  seats: number;
  transmission: string;
  monthlyPrice: number;
  color: string;
  available: boolean;
}
export type JourneyStatus =
  | 'INTEREST'
  | 'RESERVED'
  | 'ACTIVE'
  | 'RETURNED'
  | 'DECIDED'
  | 'PROPOSAL_REQUESTED'
  | 'WAITING'
  | 'CLOSED';
export type ExpenseKind =
  | 'RENTAL_BASE'
  | 'PROTECTION'
  | 'TOLL'
  | 'PARKING'
  | 'FINE'
  | 'DAMAGE'
  | 'EXTRA_HOUR'
  | 'EXTRA_FEE'
  | 'ENERGY'
  | 'FUEL'
  | 'EXTRA_SERVICE'
  | 'OTHER';
export interface RentalItem {
  kind: ExpenseKind;
  label: string;
  amount: number;
}
export interface RentalInventory {
  id: string;
  agency: string;
  city: string;
  group: string;
  reference: string;
  vehicleCount: number;
  availabilityStatus: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  dailyPrice: number;
  color: string;
}
export interface Rental {
  inventoryId: string;
  city: string;
  agency: string;
  group: string;
  startDate: string;
  endDate: string;
  days: number;
  items: RentalItem[];
  returnedAt: string | null;
}
export interface Feedback {
  decision: 'SUBSCRIBE' | 'UNSURE' | 'NO_SUBSCRIPTION';
  reason: string;
  comment: string;
  recordedAt: string;
}
export interface Proposal {
  modelId: string;
  requestedAt: string;
  approval: 'PENDING' | 'APPROVED';
  credit: number;
}
export interface DemoState {
  version: 2;
  status: JourneyStatus;
  rental: Rental | null;
  feedback: Feedback | null;
  proposal: Proposal | null;
  benefitsUsed: number;
  distanceKm: number;
  demoStep: number;
}
export interface Customer {
  id: string;
  name: string;
  benefitsUsed: number;
}
export interface RentalLocation {
  locationId: string;
  city: string;
  agency: string;
}
export interface RentalVehicleGroup {
  groupId: string;
  category: string;
  referenceModels: string[];
  seats: number;
  features: string[];
}
export type RentalAvailability = RentalInventory;
export type RentalChargeItem = RentalItem;
export type ExperienceFeedback = Feedback;
export type SubscriptionProposal = Proposal;
export type EVExperienceStatus = JourneyStatus;
export type EVExperience = Rental;
export interface RentalQuote {
  inventoryId: string;
  days: number;
  items: RentalChargeItem[];
  total: number;
}
export interface ConversionBenefit {
  eligibleAmount: number;
  calculatedCredit: number;
  conversionCredit: number;
  reason: string | null;
}
export interface ConversionOffer {
  modelId: string;
  expiresAt: string;
  benefit: ConversionBenefit;
}
export interface UnitEconomicsScenario {
  conversionRate: number;
  credit: number;
  operatingCost: number;
  opportunityCost: number;
  contribution: number;
  participants: number;
  rentalMargin: number;
  utilizationImpact: number;
  controlValue: number;
}
export interface PilotMetrics {
  participants: number;
  interested: number;
  reserved: number;
  completed: number;
  feedback: number;
  proposals: number;
  subscriptions: number;
  rentalRevenue: number;
  averageCredit: number;
  incrementalCost: number;
  fleetUtilization: number;
  reasons: { label: string; count: number }[];
}
export interface ABTestScenario {
  control: string;
  treatment: string;
  primaryMetric: string;
  validated: false;
}
