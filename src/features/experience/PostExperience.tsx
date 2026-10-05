'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, HeartHandshake, HelpCircle, Route, Zap } from 'lucide-react';
import { useDemo } from './DemoProvider';
import { recordFeedback } from './engine';
import { JourneyFallback } from './CustomerJourney';
import { feedbackReasons } from '@/data/experience';
import { evProgramRules as rules } from '@/config/evProgramRules';
import { PageIntro } from '@/components/UI';
import { CarIllustration } from '@/components/CarIllustration';
import { DemoDisclaimer } from '@/components/DemoDisclaimer';
import { JourneyProgress } from '@/components/JourneyProgress';
import type { Feedback } from '@/types';

export const feelings = [
  {
    id: 'SUBSCRIBE',
    title: 'Quero continuar no elétrico',
    text: 'Essa experiência combinou comigo.',
    Icon: Zap,
  },
  {
    id: 'UNSURE',
    title: 'Gostei, mas ainda tenho dúvidas',
    text: 'Quero entender melhor antes de decidir.',
    Icon: HelpCircle,
  },
  {
    id: 'NO_SUBSCRIPTION',
    title: 'Não funcionou para minha rotina',
    text: 'Experimentar me ajudou a descobrir.',
    Icon: Route,
  },
] as const;
const answers = [
  [
    'Recarga',
    'Pense nos pontos perto de casa e do trabalho. Confira conectores, horários e disponibilidade antes de contar com eles.',
  ],
  [
    'Autonomia',
    'Compare seus percursos com a autonomia do modelo. Clima, velocidade e uso do ar-condicionado podem mudar o alcance.',
  ],
  [
    'Viagens',
    'Planeje paradas e alternativas de recarga ao longo do caminho. Confirme se os pontos estão disponíveis antes de sair.',
  ],
  [
    'Preço',
    'Compare a mensalidade com seu uso e as condições do plano. Os valores desta demonstração são simulados.',
  ],
  [
    'Wallbox',
    'A instalação depende do imóvel, da rede elétrica e das autorizações necessárias. Consulte um profissional para avaliar sua situação.',
  ],
];

export function ExperienceRecap({
  decision,
  reason,
}: {
  decision?: Feedback['decision'];
  reason?: string;
}) {
  const { state } = useDemo();
  return (
    <div className="experience-recap">
      <div className="recap-art">
        <CarIllustration />
        <span className="badge">
          <Check size={14} /> Experiência concluída
        </span>
      </div>
      <div>
        <div className="eyebrow">SUA EXPERIÊNCIA EV</div>
        <dl className="recap-facts">
          <div>
            <dt>VEÍCULO / GRUPO</dt>
            <dd>{state.rental?.group}</dd>
          </div>
          <div>
            <dt>PERÍODO</dt>
            <dd>{state.rental?.days} dias na sua rotina</dd>
          </div>
          <div>
            <dt>{decision ? 'SUA DECISÃO' : 'QUILOMETRAGEM SIMULADA'}</dt>
            <dd>
              {decision ? feelings.find((f) => f.id === decision)?.title : `${state.distanceKm} km`}
            </dd>
          </div>
          {reason && (
            <div>
              <dt>PRINCIPAL IMPRESSÃO</dt>
              <dd>{reason}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

export function PostExperience() {
  const { state, run } = useDemo();
  const router = useRouter();
  const [stage, setStage] = useState<string>('complete');
  const [decision, setDecision] = useState<Feedback['decision']>('SUBSCRIBE');
  const [reason, setReason] = useState('Experiência positiva');
  const [comment, setComment] = useState('');
  const [consultant, setConsultant] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
  }, [stage]);
  if (state.status !== 'RETURNED') return <JourneyFallback />;
  const finish = (choice = decision) => {
    if (run((s) => recordFeedback(s, choice, reason, comment)))
      router.push(choice === 'SUBSCRIBE' ? '/assinatura' : '/experiencia/concluida');
  };
  const next = (nextStage: string) => {
    setStage(nextStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="post-experience">
      <div className="container page post-container">
        <JourneyProgress current={1} />
        <div className="journey-panel" key={stage} ref={panel} tabIndex={-1}>
          {stage === 'complete' && (
            <>
              <PageIntro
                eyebrow="EXPERIÊNCIA CONCLUÍDA"
                title="Você viveu um elétrico."
                description="Agora queremos entender o que essa experiência significou para você."
              />
              <ExperienceRecap />
              <div className="journey-action">
                <p>Obrigado por experimentar antes de decidir.</p>
                <button className="button" onClick={() => next('feeling')}>
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </>
          )}
          {stage === 'feeling' && (
            <>
              <PageIntro
                eyebrow="01 · SUA IMPRESSÃO"
                title="Depois de viver um elétrico, como você se sente?"
                description="Não existe resposta certa. Existe o que faz sentido para você."
              />
              <div className="feeling-grid">
                {feelings.map(({ id, title, text, Icon }) => (
                  <button
                    className="feeling-card"
                    key={id}
                    onClick={() => {
                      setDecision(id);
                      setReason(id === 'SUBSCRIBE' ? 'Experiência positiva' : '');
                      next(id === 'SUBSCRIBE' ? 'summary' : id === 'UNSURE' ? 'doubts' : 'reason');
                    }}
                  >
                    <span className="step-icon">
                      <Icon size={28} />
                    </span>
                    <strong>{title}</strong>
                    <span>{text}</span>
                    <ArrowRight size={20} />
                  </button>
                ))}
              </div>
              <div className="journey-action">
                <button className="text-link" onClick={() => next('complete')}>
                  Voltar à experiência
                </button>
              </div>
            </>
          )}
          {stage === 'doubts' && (
            <>
              <PageIntro
                eyebrow="DECIDIR NO SEU TEMPO"
                title="É normal ainda ter dúvidas."
                description="Explore o que importa para sua rotina antes do próximo passo."
              />
              <div className="doubt-grid">
                {answers.map(([title, text]) => (
                  <details className="doubt-card" key={title}>
                    <summary>
                      <span>{title}</span>
                      <small>Quero entender melhor</small>
                    </summary>
                    <p>{text}</p>
                  </details>
                ))}
              </div>
              <div className="journey-action">
                <h2>Depois disso, o que você prefere?</h2>
                <div className="actions">
                  <button
                    className="button"
                    onClick={() => {
                      setDecision('SUBSCRIBE');
                      setReason('Experiência positiva');
                      next('reason');
                    }}
                  >
                    Continuar para assinatura
                  </button>
                  <button className="button button-secondary" onClick={() => setConsultant(true)}>
                    Falar com consultor
                  </button>
                  <button className="text-link" onClick={() => next('reason')}>
                    Encerrar experiência
                  </button>
                </div>
                {consultant && (
                  <p className="subtle-box" role="status">
                    Em um serviço real, este seria o contato com um consultor. Nesta demo, nenhum
                    atendimento é iniciado. Você pode explorar as dúvidas ou encerrar por aqui.
                  </p>
                )}
              </div>
            </>
          )}
          {stage === 'reason' && (
            <>
              <PageIntro
                eyebrow="02 · O QUE FEZ DIFERENÇA"
                title={
                  decision === 'NO_SUBSCRIPTION'
                    ? 'Tudo bem. Experimentar também é descobrir.'
                    : 'O que mais pesou na sua experiência?'
                }
                description={
                  decision === 'NO_SUBSCRIPTION'
                    ? 'O objetivo era permitir uma decisão com mais segurança. Obrigado por experimentar.'
                    : 'Escolha a principal impressão que ficou com você.'
                }
              />
              {decision === 'NO_SUBSCRIPTION' && <h2>O que mais pesou?</h2>}
              <div className="reason-grid" role="group" aria-label="Principal impressão">
                {feedbackReasons.map((r) => (
                  <button
                    key={r}
                    aria-pressed={reason === r}
                    className={'reason-chip ' + (reason === r ? 'is-selected' : '')}
                    onClick={() => setReason(r)}
                  >
                    {r === 'Conforto/adaptação' ? 'Conforto' : r}
                    {reason === r && <Check size={16} />}
                  </button>
                ))}
              </div>
              <label className="optional-comment">
                Quer contar mais alguma coisa? <small>Opcional</small>
                <textarea
                  rows={2}
                  value={comment}
                  maxLength={rules.commentMaxLength}
                  onChange={(e) => setComment(e.target.value)}
                />
              </label>
              <div className="journey-action">
                <button className="button" disabled={!reason} onClick={() => next('summary')}>
                  Continuar <ArrowRight size={18} />
                </button>
                <button className="text-link" onClick={() => next('feeling')}>
                  Rever minha escolha
                </button>
              </div>
            </>
          )}
          {stage === 'summary' && (
            <>
              <PageIntro
                eyebrow="03 · SUA ESCOLHA, COM EXPERIÊNCIA"
                title="Sua experiência EV."
                description="Você já deu o passo mais importante: viver antes de decidir."
              />
              <ExperienceRecap decision={decision} reason={reason} />
              <div className="recap-message">
                <HeartHandshake size={24} />
                <p>
                  {decision === 'SUBSCRIBE'
                    ? 'Você conheceu o elétrico na prática. Agora pode escolher o próximo passo com mais confiança.'
                    : 'Uma boa decisão é a que combina com sua rotina. Obrigado por dar uma chance ao novo.'}
                </p>
              </div>
              <div className="journey-action">
                <button className="button" onClick={() => finish()}>
                  {decision === 'SUBSCRIBE' ? 'Conhecer meu benefício' : 'Encerrar experiência'}{' '}
                  <ArrowRight size={18} />
                </button>
                <button className="text-link" onClick={() => next('reason')}>
                  Rever minha impressão
                </button>
              </div>
            </>
          )}
        </div>
        <DemoDisclaimer />
      </div>
    </div>
  );
}
