'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, UserRound, RotateCcw, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useDemo } from '@/features/experience/DemoProvider';
import { journeyDestinations } from '@/features/experience/journeyNavigation';
import { Modal } from './UI';
import { independentDisclaimer } from '@/config/evProgramRules';
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, reset, notice, error, clearError } = useDemo();
  const [menu, setMenu] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const links = [
    ['Experiência', '/experiencia'],
    ['Como funciona', '/como-funciona'],
    ['Regras', '/programa/regras'],
    ['Visão do programa', '/demo/analytics'],
  ];
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className="demo-ribbon">
        <div className="container">
          <span>
            <span className="live-dot" />
            Protótipo de hackathon{' '}
            <span className="ribbon-extra">· condições e dados simulados</span>
          </span>
          <button onClick={() => setResetOpen(true)}>
            <RotateCcw size={12} />
            Reiniciar demonstração
          </button>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="Localiza Assinatura — início">
            <Image src="/logo.svg" width={173} height={48} alt="Localiza Assinatura" priority />
          </Link>
          <nav className={menu ? 'nav-links open' : 'nav-links'} aria-label="Navegação principal">
            {links.map(([label, href]) => (
              <Link
                className={pathname === href ? 'active' : ''}
                key={href}
                href={href}
                onClick={() => setMenu(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/experiencia" className="button button-small quote-button">
              Quero experimentar
              <ArrowUpRight size={16} />
            </Link>
            <Link
              className="avatar"
              href={journeyDestinations[state.status]}
              aria-label="Minha experiência"
            >
              <UserRound size={20} />
            </Link>
            <button
              className="icon-button menu-toggle"
              aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {notice && (
        <div role="status" className="container notice">
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="container error-banner">
          <span>{error}</span>
          <button className="icon-button" onClick={clearError} aria-label="Fechar mensagem">
            <X size={16} />
          </button>
        </div>
      )}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reiniciar demonstração?">
        <p>
          A locação, o feedback e a proposta desta demonstração serão apagados. Os dados fictícios
          do painel serão mantidos.
        </p>
        <div className="actions">
          <button
            className="button"
            onClick={() => {
              reset();
              setResetOpen(false);
              router.push('/');
            }}
          >
            Reiniciar e ir ao início
            <RotateCcw size={18} />
          </button>
          <button className="button button-secondary" onClick={() => setResetOpen(false)}>
            Continuar demonstração
          </button>
        </div>
      </Modal>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Image
              src="/logo.svg"
              alt="Localiza Assinatura"
              width={173}
              height={48}
              className="footer-logo"
            />
            <p>
              Novos caminhos.
              <br />
              <strong>A tranquilidade de sempre.</strong>
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/experiencia">Experiência paga</Link>
            <Link href="/como-funciona">Como funciona</Link>
            <Link href="/programa/regras">Regras do conceito</Link>
          </div>
          <div>
            <h3>Sua experiência</h3>
            <Link href="/experiencia">Minha experiência</Link>
            <Link href="/demo/customer">Continuar minha jornada</Link>
            <Link href="/demo/reset">Reiniciar demonstração</Link>
          </div>
          <div className="footer-promise">
            <ShieldCheck size={26} />
            <p>
              Experimente a mobilidade elétrica.
              <br />
              Sua mobilidade continua com a Localiza.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{independentDisclaimer}</span>
          <span>Sem contratação ou pagamento real.</span>
        </div>
      </div>
    </footer>
  );
}
