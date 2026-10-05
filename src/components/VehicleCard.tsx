import { ShieldCheck, Zap, Gauge, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import type { Vehicle } from '@/types';
import { currency, powertrainLabels } from '@/data/vehicles';
import { CarIllustration } from './CarIllustration';
export function VehicleCard({
  vehicle,
  onSelect,
  currentPrice,
}: {
  vehicle: Vehicle;
  onSelect?: () => void;
  currentPrice?: number;
}) {
  const ev = vehicle.powertrain === 'EV';
  const difference = currentPrice === undefined ? 0 : vehicle.monthlyPrice - currentPrice;
  return (
    <article className="vehicle-card">
      <div className="vehicle-art">
        <span className={'vehicle-tag ' + (!ev ? 'fallback-tag' : '')}>
          <Zap size={13} />
          {ev ? 'evLiza' : powertrainLabels[vehicle.powertrain]}
        </span>
        <CarIllustration color={vehicle.color} compact={vehicle.id === 'dolphin-mini'} />
        <small>Ilustração genérica</small>
      </div>
      <div className="vehicle-card-body">
        <div className="vehicle-category">{vehicle.category}</div>
        <h3>{vehicle.name}</h3>
        <div className="vehicle-spec">
          {ev ? (
            <>
              <Zap size={15} />
              100% elétrico<span>·</span>
              <Gauge size={15} />
              {vehicle.rangeKm} km*
            </>
          ) : (
            <>
              <Check size={15} />
              Disponibilidade simulada no piloto
            </>
          )}
        </div>
        <div className="vehicle-divider" />
        <div className="price-label">Mensalidade simulada</div>
        <div className="price">
          {currency(vehicle.monthlyPrice)}
          <span>/mês</span>
        </div>
        {currentPrice !== undefined ? (
          <p className={'price-difference ' + (difference < 0 ? 'saving' : '')}>
            {currency(Math.abs(difference))} {difference < 0 ? 'a menos' : 'a mais'} por mês · valor
            recalculado
          </p>
        ) : (
          <p className="included">
            <ShieldCheck size={16} />
            Referência de assinatura · ilustrativa
          </p>
        )}
        {onSelect ? (
          <button className="button full" onClick={onSelect}>
            Selecionar veículo
            <ArrowRight size={17} />
          </button>
        ) : (
          <Link className="button button-secondary full" href="/assinatura">
            Ver detalhes
            <ArrowRight size={17} />
          </Link>
        )}
      </div>
    </article>
  );
}
