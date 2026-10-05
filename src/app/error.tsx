'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page error-page">
      <h1>Não foi possível abrir esta etapa.</h1>
      <p>Tente novamente. Você também pode retornar à sua assinatura.</p>
      <div className="actions">
        <button className="button" onClick={reset}>
          Tentar novamente
        </button>
        <Link className="button button-secondary" href="/minha-assinatura">
          Minha assinatura
        </Link>
      </div>
    </div>
  );
}
