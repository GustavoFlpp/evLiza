# PROJECT BRAIN

## 1. Produto
evLiza: protótipo independente Ruptura 2026, pronto para demonstração local.
Nome técnico/repositório: evliza. Storage anterior compatível até o próximo salvamento.
Interesse → locação paga → experiência → devolução → feedback → decisão → proposta → assinatura simulada.

## 2. Stack
Next.js 16 / React 19 / TypeScript / CSS Variables / Inter local / Lucide / Zod.
Vitest para domínio; Playwright com Chrome headless e servidor de produção na porta 3100.
Sem backend, login, API, pagamento, credenciais ou telemetria real.

## 3. Arquitetura
`src/config/evProgramRules.ts`: regras comerciais ilustrativas.
`src/config/economicsPilot.ts`: limites dos controles de sensibilidade simulados.
`src/features/experience/engine.ts`: funções puras, validação e transições.
`RentalInventoryService`: cidades, agências e grupos AVAILABLE/LIMITED/UNAVAILABLE.
`DemoProvider` + `demoStorage`: estado v2, validação Zod e coerência do domínio.
`src/features/analytics`: coorte fixa, economia, break-even, A/B test e ciclo do ativo.
`src/features/demo`: reset; aliases de demo abrem a jornada normal.
Navegação centralizada em `journeyNavigation.ts`, sem avanço automático paralelo.
Next dev usa `.next-dev`; build/start usam `.next` para isolar manifests.

## 4. Estado atual
Home, regras, cotação, reserva, retirada/devolução, feedback e conversão funcionais.
Benefício aplicado somente após aprovação simulada; definitivo com processo separado.
Pós-experiência em etapas; dúvidas explicadas antes de escolha explícita.
Encerrar dúvidas/não assinatura mantém cenário sem crédito/proposta.
Persistência, refresh e reset testados. Fontes/logo/ilustrações locais, desktop/mobile.
Rotas de troca e scripts temporários anteriores removidos; redirects neutros preservados.
README contém arquitetura, riscos, limitações, roadmap e roteiro de 60–90 segundos.

## 5. Regras
Experiência paga em capacidade disponível da operação de aluguel, por grupo/categoria.
Não garantir modelo específico, entrega imediata, prazo fixo ou permanência no alugado.
Seminovos somente após desmobilização; sem frota dedicada pressuposta.
Benefício = min(base elegível × taxa, teto); apenas RENTAL_BASE participa.
Janela após devolução, modelo EV elegível, uso único, aprovação e não cumulatividade.
Extras/multas/danos/energia/serviços nunca geram benefício. Sem dinheiro sacável.
Parâmetros atuais ilustrativos: 2–7 dias, 30 dias, 50%, teto R$ 500, 1 uso.
Economia pondera benefício por probabilidade de conversão e compara com controle.
Break-even é igualdade; superar controle exige taxa maior. Hipótese não validada.
Coorte fictícia separada do registro local; não afirma lucro ou melhoria real.

## 6. Segurança
Somente dados fictícios; nenhuma integração externa. Storage não é backend/auditoria.
JSON inválido, versão anterior e estados incoerentes voltam ao início.
Reset remove apenas chaves do programa. Storage bloqueado usa memória com aviso.
Envio autorizado para GitHub GustavoFlpp/evLiza; hospedagem pessoal na Vercel.
Sem alterações fora do projeto.

## 7. Quality gates
`npm run lint` inclui ESLint e `lint:context`.
`npm run typecheck`; `npm test`; `npm run build`; `npm run test:e2e`.
17 testes de domínio e 7 cenários E2E de jornada, retomada, mobile e dúvidas.
`npm run test:e2e:dev` valida no servidor de desenvolvimento da porta 3000.
Contexto: brain ≤300 linhas, instruções ≤200, template ≤180; JS/TS ≤350 úteis.
Ler apenas este brain e arquivos diretamente relevantes; expandir por evidência.

## 8. Riscos atuais
Inventário estático sem calendário/concorrência; aprovação e contratação simuladas.
Datas dependem do relógio do navegador. Não é PWA offline; servidor local necessário.
Economia requer custos comparáveis, contribuição validada e análise de canibalização.
Validação jurídica, fiscal, financeira, comercial e operacional pendente em produção.

## 9. Decisões fixas
Preservar tokens Localiza, Inter, raio 16px, escala 8px e hierarquia limpa.
Disponibilidade por grupo; veículo de assinatura segue processo próprio.
Sem APIs reais ou novas integrações neste protótipo; roadmap apenas documentado.

## 10. Próximo passo
Apresentar o conceito e desenhar um piloto autorizado para validar conversão incremental.
