import { pilotDisclaimer, independentDisclaimer } from '@/config/evProgramRules';
import { MockDataBadge } from './MockDataBadge';
export function DemoDisclaimer({ prominent = false }: { prominent?: boolean }) {
  return (
    <aside className={prominent ? 'simulation-banner' : 'pilot-note'}>
      <MockDataBadge /> {pilotDisclaimer}
    </aside>
  );
}
export function ConceptBadge({ fact = false }: { fact?: boolean }) {
  return <span className="badge">{fact ? 'FATO PÚBLICO' : 'CONCEITO PROPOSTO · evLiza'}</span>;
}
export function IndependentNote() {
  return <p className="microcopy">{independentDisclaimer}</p>;
}
