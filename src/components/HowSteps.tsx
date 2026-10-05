import { CarFront, CalendarDays, HeartHandshake, ArrowRight } from 'lucide-react';
export function HowSteps() {
  const steps = [
    {
      title: 'Escolha experimentar',
      text: 'Conheça veículos/grupos elétricos elegíveis disponíveis para aluguel.',
      Icon: CarFront,
    },
    {
      title: 'Viva sua rotina',
      text: 'Faça uma locação paga e use o elétrico no seu dia a dia.',
      Icon: CalendarDays,
    },
    {
      title: 'Decida com experiência',
      text: 'Após a devolução, conte como foi sua adaptação.',
      Icon: HeartHandshake,
    },
    {
      title: 'Continue se fizer sentido',
      text: 'Ao contratar uma assinatura EV elegível, poderá receber o benefício definido pelo programa.',
      Icon: ArrowRight,
    },
  ];
  return (
    <>
      <div className="steps-grid four">
        {steps.map(({ title, text, Icon }, i) => (
          <article className="step-card" key={title}>
            <div className="step-top">
              <span className="step-icon">
                <Icon size={24} />
              </span>
              <span className="step-number">0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="section-bottom">
        <strong>
          Não é apenas um test-drive de alguns minutos. É experiência real antes da decisão.
        </strong>
      </div>
    </>
  );
}
