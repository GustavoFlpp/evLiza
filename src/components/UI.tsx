'use client';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { pilotDisclaimer } from '@/config/evProgramRules';
export function ButtonLink({
  href,
  children,
  secondary = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={'button ' + (secondary ? 'button-secondary ' : '') + className}>
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}
export function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={'badge ' + (dark ? 'badge-dark' : '')}>{children}</span>;
}
export function Back({
  href = '/carros',
  children = 'Voltar',
}: {
  href?: string;
  children?: ReactNode;
}) {
  return (
    <Link href={href} className="back-link">
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-intro">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function PilotNote() {
  return <p className="pilot-note">{pilotDisclaimer}</p>;
}
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar">
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
