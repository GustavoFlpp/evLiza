import type { Vehicle } from '@/types';
/** Catálogo fictício; preços, autonomia e disponibilidade são ilustrativos. */
export const vehicles: Vehicle[] = [
  {
    id: 'dolphin',
    name: 'BYD Dolphin',
    category: 'Hatch compacto',
    powertrain: 'EV',
    rangeKm: 291,
    seats: 5,
    transmission: 'Automático',
    monthlyPrice: 2899,
    color: '#c7d6db',
    available: true,
  },
  {
    id: 'dolphin-mini',
    name: 'BYD Dolphin Mini',
    category: 'Hatch urbano',
    powertrain: 'EV',
    rangeKm: 280,
    seats: 4,
    transmission: 'Automático',
    monthlyPrice: 2299,
    color: '#e0e3dc',
    available: true,
  },
  {
    id: 'yuan',
    name: 'SUV Elétrico',
    category: 'SUV compacto · ilustrativo',
    powertrain: 'EV',
    rangeKm: 320,
    seats: 5,
    transmission: 'Automático',
    monthlyPrice: 3499,
    color: '#778f82',
    available: true,
  },
  {
    id: 'corolla',
    name: 'Toyota Corolla Hybrid',
    category: 'Sedã',
    powertrain: 'HYBRID',
    seats: 5,
    transmission: 'Automático',
    monthlyPrice: 3199,
    color: '#c9cbce',
    available: true,
  },
  {
    id: 'tcross',
    name: 'Volkswagen T-Cross',
    category: 'SUV compacto',
    powertrain: 'ICE',
    seats: 5,
    transmission: 'Automático',
    monthlyPrice: 2699,
    color: '#ded9cf',
    available: true,
  },
];
export function getVehicle(id: string | null | undefined) {
  return vehicles.find((v) => v.id === id);
}
export const powertrainLabels = { EV: '100% elétrico', HYBRID: 'Híbrido', ICE: 'Combustão' };
export const currency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
export const number = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
