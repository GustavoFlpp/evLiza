import { Check } from 'lucide-react';

export function JourneyProgress({ current }: { current: number }) {
  return (
    <ol className="journey-progress" aria-label="Sua jornada">
      {['Experiência', 'Feedback', 'Benefício', 'Assinatura'].map((label, i) => (
        <li
          key={label}
          className={i < current ? 'done' : i === current ? 'current' : ''}
          aria-current={i === current ? 'step' : undefined}
        >
          <span aria-hidden="true">{i < current ? <Check size={14} /> : i + 1}</span>
          {label}
          <span className="sr-only">{i < current ? ' concluída' : ''}</span>
        </li>
      ))}
    </ol>
  );
}
