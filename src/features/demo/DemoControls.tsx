'use client';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/features/experience/DemoProvider';
import { PageIntro } from '@/components/UI';
import { DemoDisclaimer } from '@/components/DemoDisclaimer';
export function DemoReset() {
  const { reset, ready } = useDemo();
  const router = useRouter();
  return (
    <div className="container page narrow">
      <PageIntro
        eyebrow="CONTROLE DA DEMONSTRAÇÃO"
        title="Uma nova experiência começa aqui."
        description="Limpa reserva, feedback, proposta, benefício e roteiro local. Os mocks voltam ao estado inicial."
      />
      <button
        className="button"
        disabled={!ready}
        onClick={() => {
          reset();
          router.push('/');
        }}
      >
        Reiniciar demonstração
      </button>
      <DemoDisclaimer />
    </div>
  );
}
