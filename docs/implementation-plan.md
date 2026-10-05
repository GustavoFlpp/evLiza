# Referências e implementação atual

Referências locais preservadas: `references/prints_localiza_assinatura.pdf`, tokens de design e logo SVG. A implementação mantém verde, espaços amplos, Inter local, cards/botões de 16px e escala de 8px.

Fluxo: consulta de capacidade mock por cidade/agência/grupo → cotação de locação paga → reserva → retirada → experiência → devolução → feedback → decisão → proposta de assinatura elegível → aprovação e benefício simulados. O veículo definitivo segue processo próprio.

Módulos: motor de domínio, configuração comercial central, serviço de inventário estático, provider e storage validado, analytics com economia interativa e break-even, experimento A/B e roteiro LinkedIn de 12 etapas.

Sem API, pagamento, login, contratos ou telemetria reais. Seminovos aparece somente após desmobilização. Os preços e indicadores são parâmetros de demonstração, sem condições oficiais.

Validação: ESLint + orçamento de contexto, TypeScript, Vitest, build e Playwright sobre produção. Evidências e limites em `docs/validation.md`; estado atual conciso em `ai/PROJECT_BRAIN.md`.
