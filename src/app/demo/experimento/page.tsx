import { Experiment } from '@/features/analytics/Experiment';
export default function Page() {
  return (
    <div className="container page">
      <h1>Como provaríamos se funciona?</h1>
      <Experiment />
    </div>
  );
}
