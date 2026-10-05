import { ButtonLink } from '@/components/UI';
export default function NotFound() {
  return (
    <div className="container page error-page">
      <h1>Esse caminho não foi encontrado.</h1>
      <p>Você pode voltar ao início ou encontrar seu primeiro elétrico.</p>
      <div className="actions">
        <ButtonLink href="/">Voltar ao início</ButtonLink>
        <ButtonLink href="/carros" secondary>
          Ver elétricos
        </ButtonLink>
      </div>
    </div>
  );
}
