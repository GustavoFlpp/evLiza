# Validação do evLiza

Ambiente: Windows, Node.js 20.20.2, Next.js 16.3.8, React 19, Vitest 4 e Playwright com Chrome headless. Sem commit ou push.

## Quality gates

- `npm run lint`: ESLint sem erros/avisos, incluindo `lint:context`.
- `npm run typecheck`: aprovado.
- `npm test`: 17 testes aprovados.
- `npm run build`: build de produção aprovado; páginas pré-renderizadas e rotas dinâmicas compiladas.
- `npm run test:e2e`: 7 cenários aprovados sobre servidor de produção na porta 3100.

Os comandos Node inicialmente encontraram EPERM no sandbox ao resolver o diretório do usuário; foram executados com o mecanismo de permissões do ambiente. Não houve alteração de credenciais ou configurações pessoais. Artefatos antigos de rotas foram limpos dentro do projeto antes de regenerar o build.

## Domínio

Disponibilidade, indisponibilidade, grupo limitado, reserva/datas/duração, dupla reserva, cálculo monetário, exclusão de todos os extras, teto, janela inclusiva, uso prévio, modelo inelegível e não cumulatividade. Transições exigem retirada/devolução/feedback. Proposta não aplica crédito antes de aprovação. SIM/TALVEZ/NÃO possuem resultados coerentes.

## Persistência

Round-trip de cada estágio; etapa de gravação; JSON inválido; versão anterior; combinação incoerente de feedback/proposta; reset restrito às chaves da demo. Storage bloqueado tem fallback em memória no provider.

## Analytics

Coorte monotônica e motivos consistentes; hipótese não validada. Valor esperado e custos independentes do registro local. Break-even confronta controle, verifica igualdade e impossibilidade dentro de 0–100%.

## Navegador

1. Jornada completa: locação → devolução → feedback → proposta → aprovação; refresh mantém crédito e comentário no analytics. Slider altera resultado e break-even aparece.
2. Grupo indisponível bloqueia reserva; não conversão encerra sem benefício; reset permite recomeçar.
3. Jornada linear em 1920×1080 pelos botões reais: home, reserva, retirada, devolução, feedback, benefício, proposta e aprovação. Retomada respeita o estado e os recursos externos continuam bloqueados.
4. Desktop 1440×1000 e mobile 390×844: home, regras, consulta, analytics, LinkedIn, reset e guardas; navegação pelo menu; ausência de overflow horizontal.

5. Dúvidas: explicações expansíveis, consultor explicitamente simulado e escolha de continuar antes da proposta.
6. Encerramento de dúvidas: decisão UNSURE persiste sem proposta ou benefício.
7. Acesso direto a etapas fora de ordem retorna à consulta, sem 404 nem criação automática de reserva.

Refino: espaçamento em escala de 8px, hero responsivo, fundos por momento, decisões em cards, resumo EV e benefício dedicado. Animações respeitam movimento reduzido; screenshots finalizam animações para mostrar o estado estável. Disclaimers e valores simulados permanecem visíveis.

Screenshots atuais: `artifacts/screenshots/home-desktop.png`, `home-mobile.png`, `analytics-desktop.png`, `linkedin-desktop.png`. Imagens não constituem resultados reais de negócio.

## Limites

Sem mensuração real de satisfação, utilização, receita, conversão ou margem. Inventário não realiza bloqueio de estoque. Nenhuma integração de produção, validação comercial/legal ou significância estatística foi executada. Funcionar sem internet significa usar assets/mocks locais com o servidor instalado em execução, e não suporte PWA offline.

## Correção da jornada local

Roteiro paralelo removido; aliases de demo abrem a mesma jornada. Continuidade usa destinos centralizados por estado. Validação adicional com `npm run test:e2e:dev` no Next dev da porta 3000. Desenvolvimento e produção usam caches separados, `.next-dev` e `.next`. Um validator antigo truncado em `.next/dev` foi identificado; esse cache legado fica excluído do typecheck. Após atualizar o projeto, reinicie o servidor com Ctrl+C e npm run dev.
