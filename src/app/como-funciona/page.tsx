import { HowSteps } from '@/components/HowSteps';
import { ConceptBadge, DemoDisclaimer } from '@/components/DemoDisclaimer';
import { ButtonLink, PageIntro } from '@/components/UI';
export default function Page() {
  return (
    <div className="container page">
      <ConceptBadge />
      <PageIntro
        eyebrow="CONHECER evLiza"
        title="Alugue para conhecer. Assine quando tiver certeza."
        description="Uma locação paga antes da decisão de contrato longo."
      />
      <HowSteps />
      <div className="actions">
        <ButtonLink href="/experiencia">Consultar disponibilidade</ButtonLink>
        <ButtonLink href="/programa/regras" secondary>
          Regras do conceito
        </ButtonLink>
      </div>
      <DemoDisclaimer />
    </div>
  );
}
