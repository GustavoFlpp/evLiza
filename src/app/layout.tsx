import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/experience.css';
import '@/styles/refinement.css';
import { DemoProvider } from '@/features/experience/DemoProvider';
import { Header, Footer } from '@/components/Shell';
export const metadata: Metadata = {
  title: { default: 'evLiza | Localiza Assinatura', template: '%s | evLiza' },
  description:
    'Seu primeiro elétrico começa pela experiência. Locação paga antes da decisão de assinatura. Protótipo conceitual independente.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <DemoProvider>
          <Header />
          <main id="conteudo" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </DemoProvider>
      </body>
    </html>
  );
}
