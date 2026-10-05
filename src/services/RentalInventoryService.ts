import { evProgramRules as rules } from '@/config/evProgramRules';
import type { RentalInventory, RentalVehicleGroup } from '@/types';
export const rentalGroups: Record<string, RentalVehicleGroup> = {
  'EV Urbano': {
    groupId: 'urban',
    category: 'Urbano',
    referenceModels: ['BYD Dolphin Mini'],
    seats: 4,
    features: ['Automático', 'Recarga elétrica'],
  },
  'EV Compacto': {
    groupId: 'compact',
    category: 'Compacto',
    referenceModels: ['BYD Dolphin'],
    seats: 5,
    features: ['Automático', 'Recarga elétrica'],
  },
};
/** Disponibilidade inteiramente fictícia, sem previsão ou integração operacional. */
export const rentalInventory: RentalInventory[] = [
  {
    id: 'sp-compact',
    city: 'São Paulo',
    agency: 'Agência Centro · mock',
    group: 'EV Compacto',
    reference: 'BYD Dolphin',
    vehicleCount: 4,
    availabilityStatus: 'AVAILABLE',
    dailyPrice: 210,
    color: '#c7d6db',
  },
  {
    id: 'sp-urban',
    city: 'São Paulo',
    agency: 'Agência Centro · mock',
    group: 'EV Urbano',
    reference: 'BYD Dolphin Mini',
    vehicleCount: 1,
    availabilityStatus: 'LIMITED',
    dailyPrice: 170,
    color: '#e0e3dc',
  },
  {
    id: 'bh-compact',
    city: 'Belo Horizonte',
    agency: 'Agência Centro · mock',
    group: 'EV Compacto',
    reference: 'BYD Dolphin',
    vehicleCount: 2,
    availabilityStatus: 'AVAILABLE',
    dailyPrice: 210,
    color: '#c7d6db',
  },
  {
    id: 'ct-urban',
    city: 'Curitiba',
    agency: 'Agência Centro · mock',
    group: 'EV Urbano',
    reference: 'BYD Dolphin Mini',
    vehicleCount: 0,
    availabilityStatus: 'UNAVAILABLE',
    dailyPrice: 170,
    color: '#e0e3dc',
  },
];
export const RentalInventoryService = {
  list: (city: string) => rentalInventory.filter((i) => i.city === city),
  get: (id: string) => rentalInventory.find((i) => i.id === id),
  canReserve: (item: RentalInventory | undefined) =>
    !!item &&
    rules.experienceEnabled &&
    rules.eligibleCities.includes(item.city) &&
    rules.eligibleRentalGroups.includes(item.group) &&
    item.vehicleCount > 0 &&
    item.availabilityStatus !== 'UNAVAILABLE',
};
